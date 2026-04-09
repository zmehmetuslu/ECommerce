import api from "./api";

export const getCart = async () => {
  const res = await api.get("/Cart");
  return res.data;
};

export const addToCart = async (productId, quantity) => {
  // 🔥 KRİTİK: Backend AddToCartDto tam olarak bu isimleri (PascalCase) bekliyor
  const response = await api.post("/Cart/add", {
    ProductId: Number(productId),
    Quantity: Number(quantity || 1)
  });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/Cart/remove/${productId}`);
  return res.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const res = await api.put(`/Cart/update-quantity/${productId}`, {
    Quantity: Number(quantity),
  });
  return res.data;
};