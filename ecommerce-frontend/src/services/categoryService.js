import api from "./api";

export const getCategories = async () => {
  const res = await api.get("/Categories");
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await api.get(`/Categories/${id}`);
  return res.data;
};

export const createCategory = async (data) => {
  const res = await api.post("/Categories", data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/Categories/${id}`);
  return res.data;
};

export const getProductsByCategory = async (id) => {
  const res = await api.get(`/Categories/${id}/products`);
  return res.data;
};