

export async function pollinationsProvider(prompt, options = {}) {
  if (!prompt) {
    throw new Error("A prompt is required for Pollinations image generation.");
  }

  const {
    model = "zimage",
    width = 640,
    height = 360  ,
    seed,
    enhance,
    nologo = true,
    duration = 1,
    safe,
    key = import.meta.env.VITE_POLLINATIONS_KEY,
  } = options;

  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams();

  if (model) params.set("model", model);
  if (width) params.set("width", String(width));
  if (height) params.set("height", String(height));
  if (duration) params.set("duration", String(duration));
  if (seed !== undefined && seed !== null) params.set("seed", String(seed));
  if (enhance !== undefined) params.set("enhance", String(enhance));
  if (nologo !== undefined) params.set("nologo", String(nologo));
  if (safe !== undefined) params.set("safe", String(safe));


  if (key) params.set("key", key);

  const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;

  return {
    provider: "pollinations",
    status: "success",
    prompt,
    imageUrl,
    model,
    width,
    height,
    raw: {
      endpoint: imageUrl,
    },
  };
}