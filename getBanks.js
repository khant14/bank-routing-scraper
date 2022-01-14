const puppeteer = require('puppeteer');

async function getBanks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://rtn.one/banks');
  let pages = await page.evaluate(() => {
    let results = [];
    let items = document.querySelectorAll('ul.menu-h > li > a');
    items.forEach((item) => {
      results.push(item.href);
    });
    return results;
  });

  let banks = [];
  for(let i = 0; i < pages.length; i++) {
    const bankName = await getBankNames(pages[i]);
    banks.push(bankName);
  }

  await browser.close();

  return banks;
}

async function getBankNames(pageLink) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageLink);
  let banks = await page.evaluate(() => {
    let results = [];
    let items = document.querySelectorAll('ul.banks > li > a');
    items.forEach((item) => {
      results.push(item.href);
    });
    return results;
  });

  await browser.close();
  return banks;
}

exports.getBanks = getBanks;
