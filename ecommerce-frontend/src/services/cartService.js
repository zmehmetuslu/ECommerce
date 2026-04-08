import api from "./api";

export const getCart = async () => {
  const res = await api.get("/Cart");
  return res.data;
};

export const addToCart = async (data) => {
  const res = await api.post("/Cart/add", data);
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/Cart/remove/${productId}`);
  return res.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const res = await api.put(`/Cart/update-quantity/${productId}`, {
    quantity,
  });
  return res.data;
};