import api from "./api";

export const validateCoupon = async ({ code, subTotal, shippingFee }) => {
  const res = await api.post("/Coupon/validate", {
    code,
    subTotal: Number(subTotal || 0),
    shippingFee: Number(shippingFee || 0),
  });
  return res.data?.data;
};

export const getAdminCoupons = async () => {
  const res = await api.get("/Coupon/admin");
  return res.data?.data || [];
};

export const createAdminCoupon = async (data) => {
  const res = await api.post("/Coupon/admin", data);
  return res.data?.data;
};

export const toggleAdminCouponActive = async (couponId) => {
  const res = await api.patch(`/Coupon/admin/${couponId}/toggle-active`);
  return res.data?.data;
};
