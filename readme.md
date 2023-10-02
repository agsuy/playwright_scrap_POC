# Playwright Web Scraper

Just a web scraper built with Playwright, designed to scrape product data from any e-commerce webpage.

PoC implemented for mercadolibre.

The script is written in ES6 module syntax and utilizes a `.env` file for environment variables and a `config.json` file for configuration settings.
It could be easily modified to support any other website.

## 🏃 Usage

Once you've installed the dependencies and configured the project, run the script with:

```sh
node ml.mjs
```

## 🚀 Getting Started

### 1. Prerequisites

- NVM
- Yarn

### 2. Installation

Clone the repository:

```sh
git clone <repository-url>
cd <repository-directory>
```

#### Setup:

First setup ENV

```sh
nvm use
```

Now install dependencies

```sh
yarn
```

### 3. 🌍 Environment Variables

Environment variables can either be set in a `.env` file or provided at runtime by prefixing the command to run the script. Here is how you can set environment variables in both ways:

#### Using .env file

Create a `.env` file (or modify the provided one) in the root of this repository and set the environment variables like this:

```env
DOMAIN=example.com
PAGES=<number-of-pages>
ML_ITEM=<search-item>
BASEPATH=<base-path>
```

#### Using Command Prefix

You can also provide environment variables directly when running the script:

```sh
PAGES=5 ML_ITEM=pantalones node ml.mjs
```

### 4. Config File

Adjust the config.json file located in the root of the project directory according to your needs.

Structure is as follows:

```json
{
  "launchOptions": {},
  "contextOptions": {},
  "outFile": "output.csv",
  "ticker": "<ticker>"
}
```

## 📂 Output

The script will generate a CSV file specified in the `config.json` (`outFile`). This file will contain the scraped data including the name, price, and link of each product.

## 🛠️ Built With

- [Playwright](https://playwright.dev/)
- [Node.js](https://nodejs.org/)
- [NVM](https://github.com/nvm-sh/nvm)

## ⚙️ Script Overview

### Importing Modules

- `chromium` from `playwright` to control browser actions.
- `appendFileSync`, `readFileSync` from `fs` for file operations.
- `dotenv` for loading environment variables.
- `path` and `fileURLToPath` to resolve file paths.
- `getSearchPath`, `genPagesML` from local module `ml_aux.mjs`.

### Configuring the Script

- The script reads environment variables from a `.env` file and configuration from a `config.json` file.
- `launchOptions` and `contextOptions` are set according to `config.json`.

### Main Execution

- The script launches a browser and creates a new context.
- It iterates through generated URLs and opens a new page for each.
- It scrapes product data and writes it to the specified CSV file.
- Finally, it closes the browser context after completing the scraping.

## 📜 License

This project is licensed under MIT License.
