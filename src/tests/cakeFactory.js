import { questions } from "../data/questions.js";

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getOptions = (key) => {
    const q = q.questions.find( q = q.key = key);
    return q ? q.questions: [];
 
};
export const createCake = (overrides = {}) => {
  return {
    cake_id: `cake_${Math.random().toString(36).substring(2, 9)}`,
    occasion: getRandom(getOptions('occasion')),
    flavor: getRandom(getOptions('flavor')),
    style: getRandom(getOptions('style')),
    budget: getRandom(getOptions('budget')),
    size_category: getRandom(getOptions('size_category')),
    tags: [],
    is_available: true,
    ...overrides 
  };
};

export const createCatalog = (count, overrides = {}) => {
  return Array.from({ length: count }, () => createCake(overrides));
};
