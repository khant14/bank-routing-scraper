const puppeteer = require('puppeteer');

async function getBankRouting(link) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  let bankRouting = await page.evaluate(() => {
    let results = [];
    let items = document.querySelectorAll('table > tbody > tr > th > a');
    items.forEach((item) => {
      results.push(item.href);
    });
    return results;
  });

  await browser.close();
  return bankRouting;
}

exports.getBankRouting = getBankRouting;
