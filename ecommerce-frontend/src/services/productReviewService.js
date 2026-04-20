import api from "./api";

export const getProductReviews = async (productId) => {
  const res = await api.get(`/products/${productId}/reviews`);
  return res.data?.data || [];
};

export const createProductReview = async (productId, data) => {
  const res = await api.post(`/products/${productId}/reviews`, data);
  return res.data?.data;
};

export const updateProductReview = async (productId, reviewId, data) => {
  const res = await api.put(`/products/${productId}/reviews/${reviewId}`, data);
  return res.data?.data;
};

export const deleteProductReview = async (productId, reviewId) => {
  const res = await api.delete(`/products/${productId}/reviews/${reviewId}`);
  return res.data?.data;
};

export const markReviewHelpful = async (productId, reviewId) => {
  const res = await api.post(`/products/${productId}/reviews/${reviewId}/helpful`);
  return res.data?.data;
};

export const getReviewSummaries = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) return [];
  const ids = productIds.filter(Boolean).join(",");
  const res = await api.get(`/reviews/summaries?productIds=${ids}`);
  return res.data?.data || [];
};

export const getAdminProductReviews = async () => {
  const res = await api.get("/admin/reviews");
  return res.data?.data || [];
};

export const toggleAdminReviewVisibility = async (reviewId) => {
  const res = await api.patch(`/admin/reviews/${reviewId}/toggle-visibility`);
  return res.data?.data;
};

export const deleteAdminReview = async (reviewId) => {
  const res = await api.delete(`/admin/reviews/${reviewId}`);
  return res.data?.data;
};
