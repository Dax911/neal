"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function runPuppeteer(url) {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer_1.default.launch({ headless: false }); // Launch with a visible browser
    const page = await browser.newPage();
    console.log('Navigating to the target URL...');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const combinations = ['fire', 'water', 'wind']; // Initial elements
    const resultArray = []; // Specify the type using the ApiResponse interface
    const recipesFilePath = path.join(__dirname, 'recipes.json');
    let recipes = {};
    // Check if the recipes file exists
    if (fs.existsSync(recipesFilePath)) {
        // Read the existing recipes from the file
        const fileContent = fs.readFileSync(recipesFilePath, 'utf-8');
        recipes = JSON.parse(fileContent);
    }
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
                    const responseData = await response.json(); // Specify the type using the ApiResponse interface
                    console.log('API Response Data:', responseData);
                    return responseData;
                }, apiUrl);
                // Check if the result is unique and not already in the resultArray
                if (!resultArray.some((item) => item.result === apiResponse.result)) {
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
                    // Write the updated recipes back to the file
                    fs.writeFileSync(recipesFilePath, JSON.stringify(recipes, null, 2));
                    console.log(`Recipes appended to: ${recipesFilePath}`);
                }
                if (resultArray.length >= 1000) {
                    break; // Exit the loop if the resultArray reaches 1000 items
                }
                // Introduce a delay to avoid rate limiting (adjust as needed)
                await page.waitForTimeout(200);
            }
            if (resultArray.length >= 1000) {
                break; // Exit the loop if the resultArray reaches 1000 items
            }
        }
    }
    console.log('API Responses:', resultArray);
    console.log('Recipes:', recipes);
    console.log('Closing Puppeteer...');
    await browser.close();
    return 'Puppeteer run completed successfully!';
}
// Replace 'https://neal.fun/infinite-craft/' with the target URL
const targetUrl = 'https://neal.fun/infinite-craft/';
runPuppeteer(targetUrl).then((result) => console.log(result));
