export function createOrder({
  userId,
  cakeConfig,
  selectedCake,
  selectedFallback,
  customizationDraft,
  checkoutDraft,
  
}) {
  const hasSelectedCake = !!selectedCake;
  const hasSelectedFallback =
  !!selectedFallback && Object.keys(selectedFallback).length > 0;
  function sanitizeFallbackImageUrl(url) {
    if (!url) return null;

    try {
      const parsed = new URL(url);
      parsed.searchParams.delete("key");
      return parsed.toString();
    } catch {
      return null;
    }
  }
  return {
    user_id: userId,
    reference_source: hasSelectedCake ? "recommendation" : "fallback_ai",
    cake_reference_id: hasSelectedCake ? selectedCake.cake_id : null,
    fallback_prompt: !hasSelectedCake && hasSelectedFallback ? selectedFallback.prompt || null : null,
    fallback_image_url: !hasSelectedCake && hasSelectedFallback ? sanitizeFallbackImageUrl(selectedFallback.imageUrl) || null : null,
    cake_config: cakeConfig || {},
    customization: customizationDraft || {},
    checkout_details: checkoutDraft || {},
  };
}