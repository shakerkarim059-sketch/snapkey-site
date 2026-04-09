import { getGelatoUid } from "./pricing";

export async function createGelatoOrder(order, items) {
  const apiKey = process.env.GELATO_API_KEY;

  const gelatoItems = items.map((item, index) => {
    const gelatoUid = getGelatoUid(item.print_option, item.frame_option);

    if (!gelatoUid) {
      throw new Error(
        `Keine Gelato UID für Größe "${item.print_option}" und Rahmen "${item.frame_option}" gefunden.`
      );
    }

    return {
      itemReferenceId: String(item.id || index + 1),
      productUid: gelatoUid,
      files: [
        {
          type: "default",
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${item.photo_path}`,
        },
      ],
      quantity: 1,
    };
  });

  const batchId = `batch-${Date.now()}`;

  const payload = {
    orderType: "order",
    orderReferenceId: batchId,
    customerReferenceId: batchId,
    currency: "EUR",
    items: gelatoItems,
    shippingAddress: {
      firstName: process.env.BATCH_SHIP_NAME || "Snapkey",
      lastName: "",
      addressLine1: process.env.BATCH_SHIP_STREET || "",
      city: process.env.BATCH_SHIP_CITY || "",
      postCode: process.env.BATCH_SHIP_POSTCODE || "",
      country: process.env.BATCH_SHIP_COUNTRY || "DE",
      email: process.env.BATCH_SHIP_EMAIL || "",
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
    console.error("Gelato Fehler:", data);
    throw new Error(JSON.stringify(data));
  }

  return data;
}
