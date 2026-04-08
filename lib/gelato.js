export async function createGelatoOrder(order, items) {
  const apiKey = process.env.GELATO_API_KEY;

  const gelatoItems = items.map((item) => ({
function getProductUid(printOption) {
  switch (printOption) {
    case "10x15-portrait":
    case "15x10-landscape":
      return "flat_130x180-mm-5r_170-gsm-65lb-coated-silk_4-0_ver";

    case "20x30-portrait":
    case "30x20-landscape":
      return "flat_a4_200-gsm-80lb-coated-silk_4-0_ver"; // musst du im Gelato finden!

    default:
      throw new Error("Format nicht unterstützt");
  }
}
    files: [
      {
        type: "default",
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${item.photo_path}`,
      },
    ],
    quantity: 1,
  }));

  const payload = {
    orderType: "order",
    orderReferenceId: String(order.id),
    customerReferenceId: String(order.id),
    items: gelatoItems,
    shippingAddress: {
      firstName: order.customer_name,
      lastName: "",
      addressLine1: order.street,
      city: order.city,
      postCode: order.postal_code,
      country: "DE",
      email: order.customer_email,
    },
  };

  const response = await fetch("https://order.gelatoapis.com/v4/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
