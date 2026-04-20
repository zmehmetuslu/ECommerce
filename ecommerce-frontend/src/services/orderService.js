import api from "./api";

export const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const getOrders = async () => {
  const res = await api.get("/Order");
  return res.data?.data;
};

export const getAllOrders = async () => {
  const res = await api.get("/Order/all");
  return res.data?.data;
};

export const createOrder = async ({
  couponCode = "",
  paymentMethod = "Kapida Odeme",
  mockPaymentOutcome = "success",
} = {}) => {
  const res = await api.post("/Order/create", {
    couponCode: couponCode || null,
    paymentMethod,
    mockPaymentOutcome,
  });
  return res.data?.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/Order/${orderId}/status`, { status });
  return res.data?.data;
};

export const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
  const res = await api.put(`/Order/${orderId}/payment-status`, { paymentStatus });
  return res.data?.data;
};

export const getOrderStatusHistory = async (orderId) => {
  const res = await api.get(`/Order/${orderId}/status-history`);
  return res.data?.data;
};