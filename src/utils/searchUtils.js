import { CATEGORIES, PRODUCTS, STORES } from "./catalogData";

/**
 * Calculates Damerau-Levenshtein edit distance (insertions, deletions, substitutions, transpositions).
 */
export function levenshteinDistance(a, b) {
  const str1 = a.toLowerCase();
  const str2 = b.toLowerCase();
  const matrix = Array.from({ length: str1.length + 1 }, () =>
    new Array(str2.length + 1).fill(0)
  );

  for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost  // substitution
      );

      // Transposition check
      if (
        i > 1 &&
        j > 1 &&
        str1[i - 1] === str2[j - 2] &&
        str1[i - 2] === str2[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }
    }
  }

  return matrix[str1.length][str2.length];
}

/**
 * Helper to strip common English plurals/suffixes for stemming.
 */
function stemWord(w) {
  let word = w.toLowerCase().trim();
  if (word.length > 4) {
    if (word.endsWith("ies")) return word.slice(0, -3) + "y";
    if (word.endsWith("es")) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  }
  return word;
}

/**
 * Calculates similarity score (0.0 to 1.0) with strong typo tolerance.
 */
export function calculateWordSimilarity(target, query) {
  const t = target.toLowerCase().trim();
  const q = query.toLowerCase().trim();

  if (!t || !q) return 0;
  if (t === q) return 1.0;
  if (t.startsWith(q) || q.startsWith(t)) return 0.95;
  if (t.includes(q) || q.includes(t)) return 0.85;

  const stemT = stemWord(t);
  const stemQ = stemWord(q);
  if (stemT === stemQ) return 0.95;
  if (stemT.includes(stemQ) || stemQ.includes(stemT)) return 0.85;

  const maxLen = Math.max(t.length, q.length);
  const distance = levenshteinDistance(t, q);
  const maxAllowedDistance = q.length <= 3 ? 1 : q.length <= 6 ? 2 : 3;

  if (distance <= maxAllowedDistance) {
    const rawScore = 1 - distance / maxLen;
    return Math.max(0.45, rawScore);
  }

  const stemDistance = levenshteinDistance(stemT, stemQ);
  if (stemDistance <= maxAllowedDistance) {
    const rawScore = 1 - stemDistance / Math.max(stemT.length, stemQ.length);
    return Math.max(0.4, rawScore);
  }

  return 0;
}

/**
 * Checks if query matches any token in target text or list with fuzzy tolerance.
 */
export function fuzzyScore(targetText, targetArray, query) {
  const qClean = query.toLowerCase().trim();
  if (!qClean) return 0;

  const words = qClean.split(/\s+/);
  let totalScore = 0;

  const pool = [
    targetText,
    ...(targetArray || [])
  ].filter(Boolean).map(s => s.toLowerCase());

  for (const qWord of words) {
    let maxWordScore = 0;
    for (const item of pool) {
      const itemTokens = item.split(/\s+/);
      for (const token of itemTokens) {
        const sim = calculateWordSimilarity(token, qWord);
        if (sim > maxWordScore) maxWordScore = sim;
      }
      const phraseSim = calculateWordSimilarity(item, qWord);
      if (phraseSim > maxWordScore) maxWordScore = phraseSim;
    }
    totalScore += maxWordScore;
  }

  return totalScore / words.length;
}

/**
 * Universal Catalog Search method
 */
export function searchCatalog(queryStr) {
  const query = (queryStr || "").trim().toLowerCase();
  if (!query) {
    return {
      categories: CATEGORIES,
      products: PRODUCTS,
      stores: STORES,
      topCategoryMatch: null,
      topProductMatch: PRODUCTS[0] || null,
      didYouMean: null,
      query: ""
    };
  }

  // 1. Score Categories
  const scoredCategories = CATEGORIES.map((cat) => {
    let score = 0;
    const catName = cat.name.toLowerCase();
    const catSub = (cat.sub || "").toLowerCase();

    if (catName === query) score += 120;
    else if (catName.startsWith(query)) score += 90;
    else if (catName.includes(query)) score += 70;
    else if (catSub.includes(query)) score += 40;

    if (cat.aliases) {
      for (const alias of cat.aliases) {
        const al = alias.toLowerCase();
        if (al === query) score += 110;
        else if (al.startsWith(query)) score += 85;
        else if (al.includes(query)) score += 65;
        else {
          const sim = calculateWordSimilarity(al, query);
          if (sim >= 0.45) score += Math.round(sim * 75);
        }
      }
    }

    const fuzzy = fuzzyScore(cat.name, cat.aliases, query);
    if (fuzzy >= 0.4) score += Math.round(fuzzy * 60);

    return { ...cat, score };
  })
    .filter((c) => c.score > 25)
    .sort((a, b) => b.score - a.score);

  // 2. Score Products
  const scoredProducts = PRODUCTS.map((prod) => {
    let score = 0;
    const pName = prod.name.toLowerCase();
    const tags = prod.tags || [];
    const keywords = prod.keywords || [];

    if (pName === query) score += 250;
    else if (pName.includes(query)) score += 160;

    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower === query) score += 220;
      else if (kwLower.includes(query) || query.includes(kwLower)) score += 150;
      else {
        const kwSim = calculateWordSimilarity(kwLower, query);
        if (kwSim >= 0.4) score += Math.round(kwSim * 140);
      }
    }

    const pNameTokens = pName.split(/\s+/);
    for (const token of pNameTokens) {
      const tokenSim = calculateWordSimilarity(token, query);
      if (tokenSim >= 0.45) score += Math.round(tokenSim * 120);
    }

    for (const tag of tags) {
      const tagSim = calculateWordSimilarity(tag, query);
      if (tagSim >= 0.5) score += Math.round(tagSim * 80);
    }

    return { ...prod, score };
  })
    .filter((p) => p.score >= 35)
    .sort((a, b) => b.score - a.score);

  // 3. Score Stores
  const scoredStores = STORES.map((store) => {
    let score = 0;
    const sName = store.name.toLowerCase();
    const sCat = store.category.toLowerCase();

    if (sName.includes(query)) score += 80;
    else if (sCat.includes(query)) score += 50;

    const fScore = fuzzyScore(store.name, [store.category], query);
    if (fScore >= 0.45) score += Math.round(fScore * 50);

    return { ...store, score };
  })
    .filter((s) => s.score > 20)
    .sort((a, b) => b.score - a.score);

  const topCategoryMatch = scoredCategories.length > 0 ? scoredCategories[0] : null;
  const topProductMatch = scoredProducts.length > 0 ? scoredProducts[0] : null;

  let didYouMean = null;
  if (topProductMatch && topProductMatch.score >= 50 && !topProductMatch.name.toLowerCase().includes(query)) {
    const words = topProductMatch.name.split(" ");
    const cleanWord = words.find(w => w.length > 3 && !["Fresh", "Ripe", "Local", "Crispy", "Pack", "Pure"].includes(w)) || words[0];
    didYouMean = cleanWord;
  } else if (topCategoryMatch && topCategoryMatch.score >= 40 && !topCategoryMatch.name.toLowerCase().includes(query)) {
    didYouMean = topCategoryMatch.name;
  }

  return {
    categories: scoredCategories,
    products: scoredProducts,
    stores: scoredStores,
    topCategoryMatch,
    topProductMatch,
    didYouMean,
    query
  };
}

/**
 * Finds similar / related products for a search result
 */
export function getSimilarProducts(primaryProducts, queryStr = "") {
  if (!primaryProducts || primaryProducts.length === 0) {
    if (queryStr) {
      return PRODUCTS.slice(0, 6);
    }
    return [];
  }

  const primaryIds = new Set(primaryProducts.map((p) => p.id));
  const matchedCatKeys = new Set(primaryProducts.map((p) => p.categoryKey));

  const similar = PRODUCTS.filter(
    (p) => !primaryIds.has(p.id) && matchedCatKeys.has(p.categoryKey)
  );

  if (similar.length > 0) return similar.slice(0, 6);
  return PRODUCTS.filter((p) => !primaryIds.has(p.id)).slice(0, 6);
}

/**
 * Filter & Sort products list based on active options
 */
export function filterAndSortProducts(productList, filters = {}) {
  let list = [...productList];

  const {
    searchQuery = "",
    category = "all",
    priceRange = "all",
    minRating = 0,
    store = "all",
    sortBy = "Popularity"
  } = filters;

  let searchScoreMap = new Map();

  if (searchQuery.trim()) {
    const searchRes = searchCatalog(searchQuery);

    searchRes.products.forEach((p) => {
      searchScoreMap.set(p.id, p.score);
    });

    if (searchRes.products.length > 0) {
      const matchedIds = new Set(searchRes.products.map((p) => p.id));
      list = list.filter((p) => matchedIds.has(p.id));
    } else {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    }
  }

  if (category && category !== "all") {
    list = list.filter((p) => p.categoryKey === category);
  }

  if (priceRange && priceRange !== "all") {
    if (priceRange === "under-100") list = list.filter((p) => p.price < 100);
    else if (priceRange === "100-300") list = list.filter((p) => p.price >= 100 && p.price <= 300);
    else if (priceRange === "300-500") list = list.filter((p) => p.price >= 300 && p.price <= 500);
    else if (priceRange === "above-500") list = list.filter((p) => p.price > 500);
  }

  if (minRating > 0) {
    list = list.filter((p) => parseFloat(p.rating) >= minRating);
  }

  if (store && store !== "all") {
    list = list.filter((p) => p.store === store);
  }

  if (searchQuery.trim() && sortBy === "Popularity") {
    list.sort((a, b) => {
      const scoreA = searchScoreMap.get(a.id) || 0;
      const scoreB = searchScoreMap.get(b.id) || 0;
      return scoreB - scoreA;
    });
  } else if (sortBy === "Price: Low to High") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === "Price: High to Low") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy === "Rating") {
    list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (sortBy === "Discount") {
    list.sort((a, b) => {
      const discA = ((a.mrp - a.price) / a.mrp);
      const discB = ((b.mrp - b.price) / b.mrp);
      return discB - discA;
    });
  }

  return list;
}
