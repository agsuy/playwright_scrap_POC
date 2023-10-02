import { generatePageNumbers } from "./helpers.mjs";

export const getSearchPath = (item, basePath) => {
  const template = basePath.replace("ITEM", item);
  return template;
};

export const genPagesML = (pages, domain, basePath) => {
  console.log("Scrapping", pages, "pages");
  const baseMod = generatePageNumbers(pages).map(
    (page) => domain + basePath.replace(/\d+/, page),
  );
  return baseMod;
};
