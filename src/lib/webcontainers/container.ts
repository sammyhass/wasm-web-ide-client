export const getContainer = async () => {
  if (container) return container;
  container = await WebContainer.boot();

  return container;
};
