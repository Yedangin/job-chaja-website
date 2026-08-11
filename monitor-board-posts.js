const { chromium } = require("playwright");

(async () => {
  console.log("🌐 /board/posts 페이지 실시간 모니터링 시작...\n");

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  let testCount = 0;
  const maxTests = 12; // 1분간 5초 간격으로 테스트

  const checkPage = async () => {
    testCount++;
    const timestamp = new Date().toLocaleTimeString('ko-KR');

    try {
      console.log(`\n[${timestamp}] Test #${testCount}/${maxTests}`);

      await page.goto("http://localhost:3000/board/posts", {
        waitUntil: "networkidle",
        timeout: 10000
      });

      // 페이지 컨텐츠 확인
      const text = await page.innerText("body");
      const linkCount = await page.locator("a").count();

      // 게시글 제목 확인
      const hasTitle = text.includes("최저임금") || text.includes("근로계약서");
      const hasError = text.includes("게시글이 없습니다");
      const has404 = text.includes("404");

      if (hasError || has404) {
        console.log("❌ 페이지 에러: 게시글 없음");
      } else if (linkCount > 0 && hasTitle) {
        console.log(`✅ 페이지 정상: ${linkCount}개 게시글 로드됨`);
        console.log(`   샘플: ${text.substring(0, 100).split('\n')[1]}`);
      } else if (linkCount > 0) {
        console.log(`⚠️ 페이지 로드됨: ${linkCount}개 링크, 데이터 확인 중`);
      } else {
        console.log("⏳ 페이지 로딩 중...");
      }

      if (testCount < maxTests) {
        setTimeout(checkPage, 5000);
      } else {
        console.log("\n\n✅ 모니터링 완료");
        await browser.close();
        process.exit(0);
      }
    } catch (err) {
      console.log(`❌ 에러: ${err.message}`);

      if (testCount < maxTests) {
        setTimeout(checkPage, 5000);
      } else {
        await browser.close();
        process.exit(1);
      }
    }
  };

  await checkPage();
})();
