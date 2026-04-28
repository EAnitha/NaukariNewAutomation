import path from 'path';
import {test, expect} from '@playwright/test';
import data from '../testfiles/testdata.json';

test('verify naukri', async ({ browser }) => {
  test.skip(!!process.env.CI, 'Naukri blocks GitHub Actions environment');

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',
  });
  const page = await context.newPage();

  await page.goto('https://www.naukri.com/', { waitUntil: 'networkidle' });

  const blockedCount = await page.locator('//h1[text()="Access Denied"]').count();
  if (blockedCount) {
    test.skip('Naukri access denied from this environment');
  }

  const loginLink = page.locator('//a[text()="Login"]');
  await expect(loginLink).toBeVisible({ timeout: 30000 });
  await loginLink.click();

  const loginDialog = page.locator('//div[text()="Login"]');
  await expect(loginDialog).toBeVisible({ timeout: 30000 });

  await page.fill("//input[@placeholder='Enter your active Email ID / Username']", data.email);
  await page.fill("//input[@placeholder='Enter your password']", data.password);
  await page.click("//button[text()='Login']");

  const profileWrapper = page.locator('.view-profile-wrapper');
  await expect(profileWrapper).toBeVisible({ timeout: 60000 });
  await profileWrapper.click();

  const resumePath = path.resolve('datafiles/AnithaE_QA_Enigineer.docx');
  await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 60000 });
  await page.setInputFiles('input[type="file"]', resumePath);

  await page.locator('img.nI-gNb-icon-img').click();
  await page.locator("//a[@title='Logout']").click();

  await context.close();
});
