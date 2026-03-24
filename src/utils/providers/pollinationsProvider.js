export async function pollinationsProvider(prompt, options = {}) {
  const response = await fetch("/api/pollinations-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      ...options,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Pollinations generation failed.");
  }

  return data;
}