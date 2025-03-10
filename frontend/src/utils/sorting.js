export function compareStringAsc(a, b, field) {
  return (a[field] || "").localeCompare(b[field] || "");
}
export function compareStringDesc(a, b, field) {
  return (b[field] || "").localeCompare(a[field] || "");
}
export function compareNumberAsc(a, b, field) {
  return (a[field] ?? 0) - (b[field] ?? 0);
}
export function compareNumberDesc(a, b, field) {
  return (b[field] ?? 0) - (a[field] ?? 0);
}
export function compareDateAsc(a, b, field) {
  return new Date(a[field]) - new Date(b[field]);
}
export function compareDateDesc(a, b, field) {
  return new Date(b[field]) - new Date(a[field]);
}

// 정렬 로직 (기존 코드)
export function sortByMode(products, mode) {
  if (!mode) return products; // 정렬 모드가 없으면 원본 반환

  const sorted = [...products];
  sorted.sort((a, b) => {
    switch (mode) {
      case "createdDesc":
        return compareDateDesc(a, b, "createdAt");
      case "createdAsc":
        return compareDateAsc(a, b, "createdAt");
      case "updatedDesc":
        return compareDateDesc(a, b, "updatedAt");
      case "updatedAsc":
        return compareDateAsc(a, b, "updatedAt");
      case "expirationDesc":
        return compareDateDesc(a, b, "expirationDate");
      case "expirationAsc":
        return compareDateAsc(a, b, "expirationDate");
      case "quantityDesc":
        return compareNumberDesc(a, b, "quantity");
      case "quantityAsc":
        return compareNumberAsc(a, b, "quantity");
      case "brandAsc":
        return compareStringAsc(a, b, "brand");
      case "brandDesc":
        return compareStringDesc(a, b, "brand");
      case "categoryAsc":
        return compareStringAsc(a, b, "category");
      case "categoryDesc":
        return compareStringDesc(a, b, "category");
      case "productAsc":
        return compareStringAsc(a, b, "product");
      case "productDesc":
        return compareStringDesc(a, b, "product");
      case "locationAsc":
        return compareStringAsc(a, b, "location");
      case "locationDesc":
        return compareStringDesc(a, b, "location");
      default:
        return products;
    }
  });

  return sorted;
}
