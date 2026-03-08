export function configPrompt(config) {
  return `Generate a ${config.size.toLowerCase()} ${config.occasion.toLowerCase()} cake with ${config.tiers} tier(s), ${config.frosting.toLowerCase()} frosting, ${config.style.toLowerCase()} style, and a ${config.colorTheme.toLowerCase()} color theme. Budget range: ${config.budget.toLowerCase()}.`;
}