export function createOrder({ cakeConfig, selectedCake, source = "recommendation" }) {
  const now = new Date();

  return {
    id: `ORD-${now.getTime()}`,
    createdAt: now.toISOString(),
    cakeConfig,
    selectedCake,
    source,
    status: "Pending"
  };
}