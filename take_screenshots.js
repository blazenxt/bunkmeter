import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set mobile viewport (iPhone 14 / Pixel dimensions)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Dashboard screenshot
  await page.screenshot({ path: '/home/user/mobile_dashboard.png' });
  console.log('Saved mobile_dashboard.png');

  // 2. Timetable tab screenshot
  const timetableBtn = await page.$('button:nth-child(2)');
  if (timetableBtn) {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const scheduleBtn = buttons.find(b => b.textContent.includes('Schedule'));
      if (scheduleBtn) scheduleBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: '/home/user/mobile_schedule.png' });
    console.log('Saved mobile_schedule.png');
  }

  // 3. GPA tab screenshot
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const gpaBtn = buttons.find(b => b.textContent.includes('GPA'));
    if (gpaBtn) gpaBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/home/user/mobile_gpa.png' });
  console.log('Saved mobile_gpa.png');

  await browser.close();
})();
