//  Generate pages to iterate over number of items
export const generatePageNumbers = (numberPages) =>
  Array.from({ length: numberPages + 1 }, (_, i) =>
    i <= 1 ? 0 : 1 + (i - 1) * 50,
  ).splice(1);
