export function filterCandidates(config, catalog) {
  console.log(catalog)
  return catalog.filter((cake) => {
    // if (!cake.available || !cake.supportedByShop) return false;

    if (config.occasion && cake.occasion !== config.occasion) return false;
    if (config.size_category && cake.size_category !== config.size_category) return false;
    // if (config.frosting && cake.frosting !== config.frosting) return false;
    
    return true;
  });
}