// filter the catalog using hard constraints

export function filterCandidates(config, cakeCatalog) {

  const normalize = (value) => String(value ?? "").trim().toLowerCase();
  return cakeCatalog.filter((cake) => {


  if (config.occasion && normalize(cake.occasion) !== normalize(config.occasion)) return false;
  if (config.size_category && normalize(cake.size_category) !== normalize(config.size_category)) return false;
  if (config.budget && normalize(cake.budget) !== normalize(config.budget)) return false;
  
    return true;
  });
}