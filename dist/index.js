"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runPuppeteer(url) {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer_1.default.launch({ headless: false }); // Launch with a visible browser
    const page = await browser.newPage();
    console.log('Navigating to the target URL...');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const stateFilePath = path_1.default.join(__dirname, 'state.json');
    let appState = {
        combinations: ['fire', 'water', 'wind'],
        resultArray: [],
        uniqueItems: [],
        recipes: {},
    };
    // Load the previous state if the state file exists
    if (fs_1.default.existsSync(stateFilePath)) {
        const stateFileContent = fs_1.default.readFileSync(stateFilePath, 'utf-8');
        appState = JSON.parse(stateFileContent);
    }
    try {
        while (appState.uniqueItems.length < 1000) {
            for (let i = 0; i < appState.combinations.length - 1; i++) {
                for (let j = i + 1; j < appState.combinations.length; j++) {
                    const firstElement = appState.combinations[i];
                    const secondElement = appState.combinations[j];
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
                    // Check if the result is unique and not already in the resultArray
                    if (!appState.resultArray.some((item) => item.result === apiResponse.result)) {
                        appState.resultArray.push({
                            result: apiResponse.result,
                            emoji: apiResponse.emoji,
                            isNew: apiResponse.isNew,
                        });
                        // Check if the result is unique and not already in the uniqueItems array
                        if (!appState.uniqueItems.includes(apiResponse.result)) {
                            appState.uniqueItems.push(apiResponse.result);
                        }
                        // Add new result words to the combinations array only once
                        if (!appState.combinations.includes(apiResponse.result)) {
                            appState.combinations.push(apiResponse.result);
                        }
                        // Create a new JSON object to store the recipes
                        appState.recipes[`${firstElement} + ${secondElement}`] = {
                            result: apiResponse.result,
                            emoji: apiResponse.emoji,
                            isNew: apiResponse.isNew,
                        };
                        // Write the current state to the file after every request
                        fs_1.default.writeFileSync(stateFilePath, JSON.stringify(appState, null, 2));
                        console.log(`State saved to: ${stateFilePath}`);
                    }
                    if (appState.uniqueItems.length >= 1000) {
                        break; // Exit the loop if the uniqueItems array reaches 1000 items
                    }
                    // Introduce a delay to avoid rate limiting (adjust as needed)
                    const randomDelay = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
                    console.log(`Waiting for ${randomDelay} milliseconds...`);
                    await page.waitForTimeout(randomDelay);
                }
                if (appState.uniqueItems.length >= 1000) {
                    break; // Exit the loop if the uniqueItems array reaches 1000 items
                }
            }
        }
        console.log('API Responses:', appState.resultArray);
        console.log('Unique Items:', appState.uniqueItems);
        console.log('Recipes:', appState.recipes);
        console.log('Closing Puppeteer...');
        await browser.close();
        return 'Puppeteer run completed successfully!';
    }
    catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            // Check if it's a SyntaxError (JSON parsing error)
            if (error.name === 'SyntaxError') {
                console.log('HTML Response:', await page.content());
            }
        }
        console.log('Closing Puppeteer...');
        await browser.close();
        return 'Puppeteer run encountered an error!';
    }
}
// Replace 'https://neal.fun/infinite-craft/' with the target URL
const targetUrl = 'https://neal.fun/infinite-craft/';
runPuppeteer(targetUrl).then((result) => console.log(result));
