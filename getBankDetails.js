const puppeteer = require('puppeteer');
const fs = require('fs');
const { Transform } = require('stream');

async function getBankDetails(link) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  let bankDetail = await page.evaluate(() => {
    let result = {};
    let routingNum = document.querySelector('div.rtn-info > p > span.new');
    result['routingNumber'] = routingNum.innerHTML;

    let info = document.querySelectorAll('table > tbody > tr');
    info.forEach((item) => {
      let header = item.querySelector('th').innerHTML;
      let data = item.querySelector('td').innerHTML;

      if (header === 'Change Date') {
        data = item.querySelector('td > time').innerHTML;
      } else if (header === 'Record Type Code') {
        data = item.querySelector('td').innerHTML.split('<span')[0];
      } else if (header === 'Servicing FRB Number') {
        data = item.querySelector('td > a').innerHTML;
      }

      result[header] = data;
    });

    return result;
  });

  await writeToFile(bankDetail);
  await browser.close();
}

async function writeToFile(bankDetail) {
  let detailString = await transformBankDetail(bankDetail);
  fs.writeFileSync('./bankInfo.csv', detailString, { flag: 'a+' }, err => {});
}

async function transformBankDetail(bankDetail) {
  let detailString = [];

  for (const [key, value] of Object.entries(bankDetail)) {
    if (key === 'Name') {
      let val = value.split('<p class');
      detailString.push(val[0]);
    } else if (key === 'State') {
      let val = value.split('<span');
      detailString.push(val[0]);
    } else {
      detailString.push(value);
    }
  }

  return detailString.join(', ');
}

exports.getBankDetails = getBankDetails;
