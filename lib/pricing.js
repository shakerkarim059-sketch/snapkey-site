export const BASE_PRINT_OPTIONS = {
  "13x18": {
    label: "13x18 cm",
    basePrice: 490,
    gelato: {
      none: {
        uid: "flat_130x180-mm-5r_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 409,
      },
      black: {
        uid: "framed_poster_mounted_130x180-mm-5x7-inch_black_wood_w12xt22-mm_plexiglass_130x180-mm-5r_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 1456,
      },
      white: {
        uid: "framed_poster_mounted_130x180-mm-5x7-inch_white_wood_w12xt22-mm_plexiglass_130x180-mm-5r_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 1456,
      },
    },
  },

  "15x20": {
    label: "15x20 cm",
    basePrice: 590,
    gelato: {
      none: {
        uid: "flat_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 419,
      },
      black: {
        uid: "framed_poster_mounted_150x200-mm-6x8-inch_black_wood_w12xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 1468,
      },
      white: {
        uid: "framed_poster_mounted_150x200-mm-6x8-inch_white_wood_w12xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 1468,
      },
    },
  },

  "20x25": {
    label: "20x25 cm",
    basePrice: 690,
    gelato: {
      none: {
        uid: "flat_200x250-mm-8x10-inch_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 449,
      },
      black: {
        uid: "framed_poster_mounted_200x250-mm-8x10-inch_black_wood_w12xt22-mm_plexiglass_200x250-mm-8x10-inch_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 1600,
      },
      white: {
        uid: "framed_poster_mounted_200x250-mm-8x10-inch_white_wood_w12xt22-mm_plexiglass_200x250-mm-8x10-inch_170-gsm-65lb-coated-silk_4-0_ver",
        cost: 1600,
      },
    },
  },
};

export const FRAME_OPTIONS = {
  none: {
    label: "Kein Rahmen",
    price: 0,
  },
  black: {
    label: "Schwarzer Rahmen",
    price: 1500,
  },
  white: {
    label: "Weißer Rahmen",
    price: 1500,
  },
};

export const SIZE_OPTIONS = [
  { value: "13x18", label: "13x18 cm" },
  { value: "15x20", label: "15x20 cm" },
  { value: "20x25", label: "20x25 cm" },
];

export function getBasePrintOption(size) {
  return BASE_PRINT_OPTIONS[size] ?? null;
}

export function getFrameOption(frame) {
  return FRAME_OPTIONS[frame] ?? null;
}

export function getProductPrice(size, frame) {
  const baseOption = getBasePrintOption(size);
  const frameOption = getFrameOption(frame);

  if (!baseOption || !frameOption) {
    return null;
  }

  return baseOption.basePrice + frameOption.price;
}

export function getGelatoUid(size, frame) {
  const baseOption = getBasePrintOption(size);

  if (!baseOption) {
    return null;
  }

  return baseOption.gelato?.[frame]?.uid ?? null;
}

export function getGelatoCost(size, frame) {
  const baseOption = getBasePrintOption(size);

  if (!baseOption) {
    return null;
  }

  return baseOption.gelato?.[frame]?.cost ?? null;
}

export function calculateTotalPrice(size, frame, itemCount) {
  const unitPrice = getProductPrice(size, frame);

  if (unitPrice === null) {
    return null;
  }

  return unitPrice * itemCount;
}

export function formatEuroFromCent(amountInCent) {
  return (amountInCent / 100).toFixed(2);
}
