import path from 'path';
import {test, expect} from "@playwright/test"
import data from "../datafiles/testdata.json"


test ('verify naukri',async ({page})=>{

await page.goto('https://www.naukri.com/')

await page.locator("//a[normalize-space(text())='Login']").click()

//await page.setInputFiles('input[type="file"]', 'e2e/MANJUNATH R.docx')

await page.waitForSelector('//div[text()="Login"]', { state: 'visible', timeout: 100000 });
await expect(page.locator('//div[text()="Login"]')).toBeVisible();

await page.locator("//input[@placeholder='Enter your active Email ID / Username']").fill(data.email)
await page.locator("//input[@placeholder='Enter your password']").fill(data.password)
//await page.locator("//input[@placeholder='Enter your password']").fill('Password')
await page.locator("//button[text()='Login']").click()
//await page.waitForLoadState('networkidle')

// ensure profile area is visible and click it
//await page.waitForSelector('//div[@class="view-profile-wrapper"]//a[1]', { state: 'visible',timeout: 600000  })
await page.locator('.view-profile-wrapper').click()

// wait for the file input to be attached and upload using a resolved path
const resumePath = path.resolve('datafiles/AnithaE_QA_Enigineer.docx')
await page.waitForSelector('input[type="file"]', { state: 'attached' })
await page.setInputFiles('input[type="file"]', resumePath)
//await page.locator('//input[@Class="dummyUpload typ-14Bold"]').setInputFiles('tests/uploadfiles/MANJUNATH R.docx')

await  page.locator('img.nI-gNb-icon-img').click()
await page.locator("//a[@title='Logout']").click()
await page.close()

})
