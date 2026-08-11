const { chromium } = require("playwright");

(async () => {
  console.log("🌐 Detailed PlayWright 테스트 시작...\n");

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 콘솔 에러 캡쳐
  page.on("console", (msg) => console.log("🔹 브라우저 콘솔:", msg.text()));
  page.on("error", (err) => console.log("❌ 에러:", err));

  // 1. /board/posts 접근
  console.log("1️⃣ /board/posts 접근...");
  await page.goto("http://localhost:3000/board/posts", { waitUntil: "networkidle", timeout: 15000 });

  const content = await page.content();
  console.log("\n📄 HTML 컨텐츠 (처음 1000자):");
  console.log(content.substring(0, 1000));

  console.log("\n🔍 페이지에 포함된 텍스트:");
  const text = await page.innerText("body");
  console.log(text.substring(0, 500));

  // 2. 페이지의 모든 링크 확인
  console.log("\n🔗 페이지의 모든 링크:");
  const links = await page.locator("a").count();
  console.log(`총 링크 개수: ${links}`);

  // 3. API 요청 모니터링
  console.log("\n📡 API 요청 모니터링 (3초)...");
  const responses = [];
  page.on("response", (resp) => {
    if (resp.url().includes("info-board")) {
      responses.push({
        url: resp.url(),
        status: resp.status(),
        body: resp.text().then(t => t.substring(0, 200))
      });
    }
  });

  await page.waitForTimeout(3000);

  for (const resp of responses) {
    console.log(`URL: ${resp.url}, Status: ${resp.status}`);
    console.log(`Body: ${await resp.body}`);
  }

  await browser.close();
})();
