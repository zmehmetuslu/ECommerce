import api from "./api";

export const loginUser = async (data) => {
  const res = await api.post("/Auth/login", data);
  return res.data?.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/Auth/register", data);
  return res.data?.data;
};