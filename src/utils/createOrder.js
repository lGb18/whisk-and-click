export function createOrder({
  cakeConfig,
  selectedCake,
  customizationDraft,
  checkoutDraft,
  source = "checkout",
 
}) {
  const now = new Date();
  const customer = {
    fullName: checkoutDraft?.fullName ?? "",
    contactNumber: checkoutDraft?.contactNumber ?? "",
  };

  const fulfillment = {
    type: checkoutDraft?.fulfillmentType ?? "pickup",
    address:
      (checkoutDraft?.fulfillmentType ?? "pickup") === "delivery"
        ? {
            addressLine1: checkoutDraft?.addressLine1 ?? "",
            addressLine2: checkoutDraft?.addressLine2 ?? "",
            city: checkoutDraft?.city ?? "",
            region: checkoutDraft?.region ?? "",
            postalCode: checkoutDraft?.postalCode ?? "",
          }
        : null,
  };
  const payment = {
    method: checkoutDraft?.paymentMethod ?? "credit_card",
    reference: checkoutDraft?.paymentReference ?? "",
  };
  const {
    cakeMessage = "",
    specialInstructions = "",
    sizeAdjustment= "",
    topperPreference= "",
    colorTheme = "",
    ...otherCustomizationFields
  } = customizationDraft || {};
  alert("Order Submitted");
  
  return {
    // Metadata
    id: `ORD-${now.getTime()}`,
    createdAt: now.toISOString(),
    status: "Pending",
    source,
    selectedCake,
    cakeConfig,
    customization: {
      colorTheme,
      topperPreference,
      sizeAdjustment,
      cakeMessage,
      specialInstructions,
      ...otherCustomizationFields,
    },
    checkout: {
      customer,
      fulfillment,
      payment,
    },
    
  };
}