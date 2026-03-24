import { pollinationsProvider } from "./providers/pollinationsProvider";

export async function aiGenerator(prompt, providerOrOptions ={}) {
  if (!prompt) {
    throw new Error("Prompt cannot be empty");
  }
  const options = typeof providerOrOptions === 'string' 
    ? { provider: providerOrOptions } 
    : providerOrOptions;
  const provider = options.provider || "pollinations";

  if (provider === "pollinations") {
    return pollinationsProvider(prompt, options);
  }
//   const provider = getProvider(providerName);
//   const result = await provider.generate(prompt);

//   return {
//     imageUrl: result.url || result.imageUrl,
//     provider: providerName,
//     timestamp: new Date().toISOString()
//   };
}