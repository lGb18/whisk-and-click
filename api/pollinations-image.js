export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (req.method === "GET") {
  return res.status(200).json({ ok: true });
    }
  try {
    const {
      prompt,
      model = "zimage",
      width = 640,
      height = 360,
      seed,
      enhance,
      duration = 1,
      nologo = true,
      safe,
    } = req.body || {};

    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const key = process.env.SECRET_POLLINATIONS_KEY;
    console.log("KEY EXISTS:", !!process.env.SECRET_POLLINATIONS_KEY);
    if (!key) {
      return res.status(500).json({ error: "Missing Pollinations secret key." });
    }

    const encodedPrompt = encodeURIComponent(String(prompt).trim());
    const params = new URLSearchParams();

    if (model) params.set("model", model);
    if (width) params.set("width", String(width));
    if (height) params.set("height", String(height));
    if (duration) params.set("duration", String(duration));
    if (seed !== undefined && seed !== null) params.set("seed", String(seed));
    if (enhance !== undefined) params.set("enhance", String(enhance));
    if (nologo !== undefined) params.set("nologo", String(nologo));
    if (safe !== undefined) params.set("safe", String(safe));
    params.set("key", key);

    const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;

    return res.status(200).json({
      provider: "pollinations",
      status: "success",
      prompt,
      imageUrl,
      model,
      width,
      height,
    });
  } catch (error) {
    console.error("Pollinations handler error:", error);
    return res.status(500).json({
      error: "Failed to generate image.",
    });
  }
}