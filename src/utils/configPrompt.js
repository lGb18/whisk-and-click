
export function configPrompt(config) {
  return `Generate a ${config.size_category.toLowerCase()} ${config.occasion.toLowerCase()} cake with ${config.flavor}, ${config.style.toLowerCase()} style. Budget range: ${config.budget.toLowerCase()}. Professional food photography, soft lighting, on a table`;
  
}
