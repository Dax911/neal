const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runPuppeteer(url) {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ headless: false }); // Launch with a visible browser
  const page = await browser.newPage();

  console.log('Navigating to the target URL...');
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const combinations = ['fire', 'water', 'wind']; // Initial elements
  const resultArray = [];
  const recipes = {};

  while (resultArray.length < 1000) {
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

        // Add new result words to the combinations array only once
        if (!combinations.includes(apiResponse.result)) {
          combinations.push(apiResponse.result);
        }

        // Create a new JSON object to store the recipes
        recipes[`${firstElement} + ${secondElement}`] = {
          result: apiResponse.result,
          emoji: apiResponse.emoji,
          isNew: apiResponse.isNew,
        };

        if (resultArray.length >= 100) {
          break; // Exit the loop if the resultArray reaches 100 items
        }

        // Introduce a delay to avoid rate limiting (adjust as needed)
        await page.waitForTimeout(200);
      }
      if (resultArray.length >= 100) {
        break; // Exit the loop if the resultArray reaches 100 items
      }
    }
  }

  console.log('API Responses:', resultArray);
  console.log('Recipes:', recipes);

  // Generate a timestamp for the file name
  const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0];

  // Create the file path
  const filePath = path.join(__dirname, `recipes_${timestamp}.json`);

  // Write the recipes to the file
  fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));

  console.log(`Recipes saved to: ${filePath}`);

  console.log('Closing Puppeteer...');
  await browser.close();

  return 'Puppeteer run completed successfully!';
}

// Replace 'https://neal.fun/infinite-craft/' with the target URL
const targetUrl = 'https://neal.fun/infinite-craft/';
runPuppeteer(targetUrl).then((result) => console.log(result));
