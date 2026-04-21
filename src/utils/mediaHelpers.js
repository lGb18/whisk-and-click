export function normalizeImageUrl(value) {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  return trimmed;
}

export function getOrderReferencePreview(order, blueprints = []) {
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
    // Search the live Supabase blueprints instead of the old static catalog
    const matchedCake = blueprints.find(c => c.id === order.cake_reference_id);
    
    if (matchedCake && matchedCake.image_url) {
      return {
        hasImage: true,
        imageUrl: matchedCake.image_url, // Fixed to use Supabase schema
        alt: `Bakeshop Catalog: ${matchedCake.name || "Signature Cake"}`, // Fixed to use 'name'
        fallbackLabel: "Catalog image missing",
      };
    }
  }

  return {
    hasImage: false,
    imageUrl: "",
    alt: "Bakeshop reference",
    fallbackLabel:
      order.reference_source === "recommendation"
        ? "Bakeshop reference image no longer available"
        : "No reference available",
  };
}