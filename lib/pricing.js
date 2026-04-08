export const PRINT_PRICES = {
  "10x15-portrait": 300,
  "15x10-landscape": 300,
  "20x30-portrait": 1200,
  "30x20-landscape": 1200,
  "30x40-portrait": 1900,
  "40x30-landscape": 1900,
};

export const FRAME_PRICES = {
  none: 0,
  black: 1500,
  white: 1500,
  wood: 1800,
};

export function getPrintPrice(printOption) {
  return PRINT_PRICES[printOption] ?? null;
}

export function getFramePrice(frameOption) {
  return FRAME_PRICES[frameOption] ?? null;
}

export function calculateUnitPrice(printOption, frameOption) {
  const printPrice = getPrintPrice(printOption);
  const framePrice = getFramePrice(frameOption);

  if (printPrice === null || framePrice === null) {
    return null;
  }

  return printPrice + framePrice;
}

export function calculateTotalPrice(printOption, frameOption, itemCount) {
  const unitPrice = calculateUnitPrice(printOption, frameOption);

  if (unitPrice === null) {
    return null;
  }

  return unitPrice * itemCount;
}
