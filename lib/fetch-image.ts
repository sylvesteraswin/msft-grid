export const fetchImage = async (
  ids: (string | number)[],
  type: "thumbnail" | "poster" = "thumbnail"
): Promise<string[]> => {
  try {
    return await Promise.all(
      ids.map((id) => fetch(`/api/${type}/${id}`).then((res) => res.json()))
    ).then((res) => res.map(({ url }) => url));
  } catch (error) {
    console.error("Error fetching ids:", error);
    throw error;
  }
};
