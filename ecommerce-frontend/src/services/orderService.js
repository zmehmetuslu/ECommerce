import api from "./api";

export const getOrders = async () => {
  const res = await api.get("/Order");
  return res.data;
};

export const createOrder = async () => {
  const res = await api.post("/Order/create");
  return res.data;
};