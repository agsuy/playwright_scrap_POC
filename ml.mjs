import { chromium } from "playwright";
import { appendFileSync, readFileSync } from "fs";
import * as dotenv from "dotenv"; //  Load .env file
import * as path from "path"; //  To read config file
import { fileURLToPath } from "url"; // To read config file
import { getSearchPath, genPagesML } from "./modules/ml_aux.mjs"; //  Import aux ML functions

//  Read env variables
dotenv.config();

//  Parse config file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawConfig = readFileSync(path.resolve(__dirname, "config.json"), "utf8"); //  must be on the same folder as the script
const config = JSON.parse(rawConfig);

//  Set options from config.json
const launchOptions = config.launchOptions;
const contextOptions = config.contextOptions;
const outCSVFile = config.outFile;
const ticker = config.ticker;

//  Load .env variables
const domain = process.env.DOMAIN;
const numPages = Number(process.env.PAGES);
const searchItem = process.env.ML_ITEM;
const basePath = process.env.BASEPATH;

//  Build URLs
const searchPath = getSearchPath(searchItem, basePath);
const urls = genPagesML(numPages, domain, searchPath);

//  Main function
(async () => {
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext(contextOptions);
  //  Loop through pages
  for await (const ur of urls) {
    const page = await context.newPage();

    //  Avoid loading images and POST requests
    await page.route("**/*", async (route) => {
      route.request().resourceType() === "image" ||
      route.request().method() === "POST"
        ? route.abort()
        : route.continue();
    });
    await page.goto(ur);
    /* Hacky way to stop site anti-scrapping measures 
    =====**MIGHT NOT WORK**===== */
    while ((await page.url()) != ur) {
      console.log("Anti-scrapping measures triggered, reloading...");
      await page.goto(ur);
    }
    const MLProductsData = await page.$$eval("ol > li", (products) => {
      const data = [];
      products
        .filter(
          (item) =>
            !item.querySelector("a").href.includes("click1.mercadolibre"),
        ) //  Filter sponsored products, might not work in Brazil
        .forEach((product) => {
          const name = product.querySelector("a").title; // Products that contain commas in their name are better addressed on the CSV file
          const price = product.querySelector(
            "span.andes-money-amount__fraction",
          ).innerText;
          const link = product.querySelector("a").href.split("&")[0]; //  Remove tracking info from links
          data.push({ name, price, link });
        });
      return data;
    });
    // Data to CSV file + adds ticker
    const csvLines = MLProductsData.map(
      ({ name, price, link }) => `${name},${price} ${ticker},${link}`,
    ).join("\n");
    appendFileSync(outCSVFile, `${csvLines}\n`);
    //  Close page context
    await page.close();
  }
  //  Need to clear browser
  await browser.close();
})();
