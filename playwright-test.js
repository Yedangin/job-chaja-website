const { chromium } = require("playwright");

(async () => {
  console.log("🌐 PlayWright 테스트 시작...\n");
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. 메인 페이지
  console.log("1️⃣ 메인 페이지 접근...");
  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 10000 });
  console.log("   ✅ 로드됨");

  // 2. /board/posts 접근
  console.log("\n2️⃣ /board/posts 접근...");
  await page.goto("http://localhost:3000/board/posts", { waitUntil: "load", timeout: 10000 });
  const postsUrl = page.url();
  const postsHtml = await page.content();
  const posts404 = postsHtml.includes("404");
  const postsHasContent = postsHtml.includes("posts") && !posts404;
  console.log(`   URL: ${postsUrl}`);
  console.log(`   404: ${posts404}`);
  console.log(`   게시글 목록: ${postsHasContent}`);

  // 3. /board/posts1 접근
  console.log("\n3️⃣ /board/posts1 접근...");
  await page.goto("http://localhost:3000/board/posts1", { waitUntil: "load", timeout: 10000 });
  const posts1Url = page.url();
  const posts1Html = await page.content();
  const posts1404 = posts1Html.includes("404");
  const posts1HasContent = posts1Html.includes("외국인") || posts1Html.includes("ARC");
  console.log(`   URL: ${posts1Url}`);
  console.log(`   404: ${posts1404}`);
  console.log(`   게시글 내용: ${posts1HasContent}`);

  // 4. 최종 결과
  console.log("\n📊 최종 결과:");
  console.log(`   ✅ 메인 페이지: 정상`);
  console.log(`   ${postsHasContent ? "✅" : "❌"} /board/posts: ${postsHasContent ? "정상" : "실패"}`);
  console.log(`   ${posts1HasContent && !posts1404 ? "✅" : "❌"} /board/posts1: ${posts1HasContent && !posts1404 ? "정상" : "실패"}`);

  await browser.close();
})();
