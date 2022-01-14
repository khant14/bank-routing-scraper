const { getBanks } = require('./getBanks');
const { getBankRouting } = require('./getBankRouting');
const { getBankDetails } = require('./getBankDetails');

(async () => {
  let bankUrls = await getBanks();
  bankUrls = bankUrls.flat();

  let routingUrls = [];
  for(let i = 0; i < bankUrls.length; i++) {
    let routing = await getBankRouting(bankUrls[i]);
    routingUrls.push(routing);
  }

  routingUrls = routingUrls.flat();
  for(let i = 0; i < routingUrls.length; i++) {
    await getBankDetails(routingUrls[i]);
  }
})();
