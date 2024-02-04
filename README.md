# Infinite Craft Generator

This project utilizes Puppeteer to automate the generation of combinations in Neal Agarwal's "Infinite Craft" game on [neal.fun](https://neal.fun/infinite-craft/). The goal is to explore and discover unique combinations by making API requests to the game.

## Features

- **Random Combination Requests:** The project ensures that consecutive API requests have different parameters, preventing repeated combinations in the same order.

- **Shuffled Combinations:** Newly discovered combinations trigger a shuffle in the combinations array to introduce randomness.

- **Persistence:** The state of the application, including discovered combinations and recipes, is saved to a JSON file (`state.json`) after each API request.

- **Unique Items Tracking:** The project tracks unique items and recipes, providing insights into the diversity of discovered elements.

## Getting Started

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/dax911/neal.git
    cd neal
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Run the Script:**

    ```bash
    npm start
    ```

4. **View Results:**

    - Explore the generated combinations, unique items, and recipes in the console output.

## Configuration

Adjust the script parameters, such as the target URL (`targetUrl`) and delay between requests, in the `runPuppeteer` function.

```typescript
// Replace 'https://neal.fun/infinite-craft/' with the target URL
const targetUrl = 'https://neal.fun/infinite-craft/';
runPuppeteer(targetUrl).then((result) => console.log(result));
```
## Dependencies
Puppeteer: Used for browser automation.
File System (fs) and Path: Used for file operations.
TypeScript: The project is written in TypeScript.

## License
This project is licensed under the MIT License.

