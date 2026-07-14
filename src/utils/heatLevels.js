// Resolve the heat-level variations to show for an item (product or bundle).
// - Standalone product: its own `variations` (each { heat_level, is_available }).
// - Bundle: variations live on the hot sub-products in `product_details`. A single
//   heat level is applied to the whole bundle, so for a multi-hot bundle a level is
//   available only if EVERY hot sub-product offers it and none marks it unavailable.
export const getHeatVariations = (item) => {
  if (!item) return [];

  const isBundle = Array.isArray(item.product_details) && item.product_details.length > 0;
  if (!isBundle) {
    return Array.isArray(item.variations) ? item.variations : [];
  }

  const hotSubs = item.product_details.filter(
    (p) => p.is_hot && Array.isArray(p.variations) && p.variations.length > 0
  );
  if (hotSubs.length === 0) return [];
  if (hotSubs.length === 1) return hotSubs[0].variations;

  // Multiple hot sub-products share one bundle heat level.
  // Build the ordered union of heat levels from the first sub-product, then mark a
  // level available only if all hot sub-products have it available.
  const ordered = [];
  const seen = new Set();
  hotSubs.forEach((sub) => {
    sub.variations.forEach((v) => {
      const key = v.heat_level?.toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        ordered.push({ key, heat_level: v.heat_level });
      }
    });
  });

  return ordered.map(({ key, heat_level }) => {
    const availableEverywhere = hotSubs.every((sub) => {
      const match = sub.variations.find((v) => v.heat_level?.toLowerCase() === key);
      return match && match.is_available !== false;
    });
    return { heat_level, is_available: availableEverywhere };
  });
};
