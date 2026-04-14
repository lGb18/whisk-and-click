import { cakeCatalog } from "../data/cakeCatalog"; // Add this import!

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
      alt: "AI-generated custom concept",
      fallbackLabel: "No fallback image available",
    };
  }

  if (order.reference_source === "recommendation" && order.cake_reference_id) {
    const matchedCake = cakeCatalog.find(c => c.cake_id === order.cake_reference_id);
    if (matchedCake && matchedCake.image) {
      return {
        hasImage: true,
        imageUrl: matchedCake.image,
        alt: `Bakery Catalog: ${matchedCake.title || matchedCake.flavor}`,
        fallbackLabel: "Catalog image missing",
      };
    }
  }

  return {
    hasImage: false,
    imageUrl: "",
    alt: "Bakery reference",
    fallbackLabel:
      order.reference_source === "recommendation"
        ? "Bakery reference image no longer available"
        : "No reference available",
  };
}