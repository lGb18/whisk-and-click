export function normalizeImageUrl(value) {
  if (!value) return "";

  const trimmed = String(value).trim();
  if (!trimmed) return "";

  return trimmed;
}

export function getOrderReferencePreview(order) {
  if (!order) {
    return {
      hasImage: false,
      imageUrl: "",
      alt: "No order reference",
      fallbackLabel: "No reference available",
    };
  }

  const fallbackImageUrl = normalizeImageUrl(order.fallback_image_url);

  if (order.reference_source === "fallback_ai" && fallbackImageUrl) {
    return {
      hasImage: true,
      imageUrl: fallbackImageUrl,
      alt: "AI-generated cake reference",
      fallbackLabel: "No fallback image available",
    };
  }

  // Recommendation path image support can be plugged in later
  return {
    hasImage: false,
    imageUrl: "",
    alt: "Bakery reference",
    fallbackLabel:
      order.reference_source === "recommendation"
        ? "Bakery reference image not available yet"
        : "No reference available",
  };
}