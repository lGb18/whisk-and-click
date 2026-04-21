export function configPrompt(config) {
  // 1. Translate Form Factor
  let formStr = "a standard round cake";
  if (config.form_factor <= 3) formStr = "a small bento box cake or cupcake layout";
  if (config.form_factor >= 8) formStr = "a grand multi-tier or custom sculpted novelty cake";

  // 2. Translate Complexity
  let complexStr = "with standard piped decorations";
  if (config.complexity <= 3) complexStr = "with a highly minimalist, smooth, elegant finish";
  if (config.complexity >= 8) complexStr = "with highly intricate 3D fondant sculptures and elaborate decorations";

  // 3. Translate Aesthetic/Vibe
  let aestheticStr = "for a classic celebration";
  if (config.aesthetic <= 3) aestheticStr = "for a formal, elegant, and romantic event like a wedding";
  if (config.aesthetic >= 8) aestheticStr = "with a loud, playful, kid-friendly pop-culture theme";

  // 4. Handle Color
  const colorStr = config.primary_color && config.primary_color !== "Any" 
    ? `The primary color palette must be ${config.primary_color}.` 
    : "";

  return `A professional, high-quality bakery photo of ${formStr}, ${complexStr}, ${aestheticStr}. ${colorStr} The cake should look delicious, perfectly lit, and placed on a clean bakery display stand. Trending on Pinterest.`;
}