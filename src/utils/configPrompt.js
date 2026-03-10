export function configPrompt(config) {
  return `Generate a ${config.size_category.toLowerCase()} ${config.occasion.toLowerCase()} cake with ${config.flavor} tier(s),  frosting, ${config.style.toLowerCase()} style, and a color theme. Budget range: ${config.budget.toLowerCase()}.`;
}
