const imageCache = new Map<string, string>();

const getCacheKey = (id: string | number, type: "thumbnail" | "poster") =>
  `${type}:${id}`;

export const fetchImage = async (
  ids: (string | number)[],
  type: "thumbnail" | "poster" = "thumbnail"
): Promise<string[]> => {
  try {
    const results: string[] = [];
    const newIds: (string | number)[] = [];
    const cacheKeyToIndex = new Map<string, number>();

    ids.forEach((id, index) => {
      const cacheKey = getCacheKey(id, type);
      const cachedUrl = imageCache.get(cacheKey);

      if (cachedUrl) {
        results[index] = cachedUrl;
      } else {
        newIds.push(id);
        cacheKeyToIndex.set(cacheKey, index);
      }
    });

    if (newIds.length > 0) {
      const newResults = await Promise.all(
        newIds.map((id) =>
          fetch(`/api/${type}/${id}`).then((res) => res.json())
        )
      ).then((res) => res.map(({ url }) => url));

      newIds.forEach((id, i) => {
        const cacheKey = getCacheKey(id, type);
        const url = newResults[i];
        const originalIndex = cacheKeyToIndex.get(cacheKey)!;

        imageCache.set(cacheKey, url);
        results[originalIndex] = url;
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching ids:", error);
    throw error;
  }
};
