const puppeteer = require('puppeteer');

async function runPuppeteer(url) {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ headless: false }); // Launch with a visible browser
  const page = await browser.newPage();

  console.log('Navigating to the target URL...');
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const combinations = ['fire', 'water', 'wind']; // Add more elements as needed
  const resultArray = [];

  for (let i = 0; i < combinations.length - 1; i++) {
    for (let j = i + 1; j < combinations.length; j++) {
      const firstElement = combinations[i];
      const secondElement = combinations[j];

      console.log(`Making API request for pair: ${firstElement} and ${secondElement}...`);

      // Make API requests with the pair of elements
      const apiUrl = `https://neal.fun/api/infinite-craft/pair?first=${firstElement}&second=${secondElement}`;
      const apiResponse = await page.evaluate(async (url) => {
        const response = await fetch(url, {
          method: 'GET',
        });

        const responseData = await response.json();
        console.log('API Response Data:', responseData);

        return responseData;
      }, apiUrl);

      // Add the API response to the result array
      resultArray.push(apiResponse);
    }
  }

  console.log('API Responses:', resultArray);

  console.log('Closing Puppeteer...');
  await browser.close();

  return 'Puppeteer run completed successfully!';
}

// Replace 'https://neal.fun/infinite-craft/' with the target URL
const targetUrl = 'https://neal.fun/infinite-craft/';
runPuppeteer(targetUrl).then((result) => console.log(result));
