export async function createGelatoOrder(order, items) {
  const apiKey = process.env.GELATO_API_KEY;

  const gelatoItems = items.map((item) => ({
    productUid: "HIER_SPÄTER_MAPPING", // kommt später aus DB
    files: [
      {
        type: "default",
        url: item.photo_url, // kommt später sauber
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
