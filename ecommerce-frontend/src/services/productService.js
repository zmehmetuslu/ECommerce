import api from "./api";

export const getProducts = async ({
  page = 1,
  pageSize = 8,
  search = "",
  categoryId = "",
  minPrice = "",
  maxPrice = "",
  sort = "",
} = {}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("pageSize", pageSize);

  if (search) params.append("search", search);
  if (categoryId) params.append("categoryId", categoryId);
  if (minPrice !== "") params.append("minPrice", minPrice);
  if (maxPrice !== "") params.append("maxPrice", maxPrice);
  if (sort) params.append("sort", sort);

  const res = await api.get(`/Products?${params.toString()}`);
  return res.data;
};



export const getProductById = async (id) => {
  const res = await api.get(`/Products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/Products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/Products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/Products/${id}`);
  return res.data;
};

