import api from "./api";

export const getWishlist = async () => {
  const res = await api.get("/Wishlist");
  return res.data?.data || [];
};

export const getWishlistProductIds = async () => {
  const items = await getWishlist();
  return items.map((item) => Number(item.productId));
};

export const addToWishlist = async (productId) => {
  const res = await api.post(`/Wishlist/${Number(productId)}`);
  return res.data?.data;
};

export const removeFromWishlist = async (productId) => {
  const res = await api.delete(`/Wishlist/${Number(productId)}`);
  return res.data?.data;
};
