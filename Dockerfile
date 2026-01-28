# Step 1: Base image
FROM node:20-alpine AS builder
WORKDIR /app

# Step 2: Install dependencies
COPY package*.json ./
RUN npm install

# Step 3: Build the application
COPY . .
# Build process မှာ environment variable လိုအပ်ရင် ဒီမှာထည့်ပါ
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Step 4: Runner image
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
