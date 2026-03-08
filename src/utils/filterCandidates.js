export function filterCandidates(config, catalog) {
  return catalog.filter((cake) => {
    if (!cake.available || !cake.supportedByShop) return false;

    if (config.occasion && cake.occasion !== config.occasion) return false;
    if (config.size && cake.size !== config.size) return false;
    if (config.frosting && cake.frosting !== config.frosting) return false;

    return true;
  });
}