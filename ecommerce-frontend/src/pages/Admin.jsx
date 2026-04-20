import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import {
  getAllOrders,
  getOrderStatusHistory,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "../services/orderService";
import {
  createCategory,
  deleteCategory as deleteCategoryService,
  getCategories,
} from "../services/categoryService";
import {
  createProduct,
  deleteProduct as deleteProductService,
  getProducts,
  updateProduct,
} from "../services/productService";
import AdminCategoriesPanel from "../components/admin/AdminCategoriesPanel";
import AdminProductsPanel from "../components/admin/AdminProductsPanel";
import AdminOrdersPanel from "../components/admin/AdminOrdersPanel";
import AdminCouponsPanel from "../components/admin/AdminCouponsPanel";
import AdminReviewsPanel from "../components/admin/AdminReviewsPanel";
import {
  createAdminCoupon,
  getAdminCoupons,
  toggleAdminCouponActive,
} from "../services/couponService";
import {
  deleteAdminReview,
  getAdminProductReviews,
  toggleAdminReviewVisibility,
} from "../services/productReviewService";
import AppToast from "../components/ui/AppToast";

export default function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusHistories, setStatusHistories] = useState({});
  const [loadingHistoryOrderId, setLoadingHistoryOrderId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [paymentUpdates, setPaymentUpdates] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    imageUrl: "",
    shortDescription: "",
    unit: "Adet",
    lowStockThreshold: "5",
    badge: "",
    isFeatured: false,
    categoryId: "",
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "rate",
    value: "",
    minTotal: "",
    usageLimit: "",
    perUserLimit: "1",
    expireAt: "",
  });

  const statusLabelMap = {
    Pending: "Beklemede",
    Preparing: "Hazırlanıyor",
    Shipped: "Kargoda",
    Delivered: "Teslim Edildi",
    Cancelled: "İptal",
  };

  const statusColorMap = {
    Pending: "bg-amber-50 text-amber-700",
    Preparing: "bg-blue-50 text-blue-700",
    Shipped: "bg-purple-50 text-purple-700",
    Delivered: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  const showMessage = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 2500);
  };

  const loadData = useCallback(async () => {
    try {
      const productsData = await getProducts({ page: 1, pageSize: 1000 });
      const items = productsData.items || (Array.isArray(productsData) ? productsData : []);
      setProducts([...items].reverse());

      const categoriesData = await getCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      const allOrders = await getAllOrders();
      const normalizedOrders = Array.isArray(allOrders) ? allOrders : [];
      setOrders(normalizedOrders);
      setStatusUpdates(
        normalizedOrders.reduce((acc, order) => {
          acc[order.orderId] = order.status || "Pending";
          return acc;
        }, {})
      );
      setPaymentUpdates(
        normalizedOrders.reduce((acc, order) => {
          acc[order.orderId] = order.paymentStatus || "Pending";
          return acc;
        }, {})
      );

      const couponData = await getAdminCoupons();
      setCoupons(Array.isArray(couponData) ? couponData : []);

      const reviewData = await getAdminProductReviews();
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
      showMessage("Admin verileri yüklenemedi.", "error");
    }
  }, []);

  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.role !== "Admin") {
      navigate("/");
      return;
    }
    loadData();
  }, [loadData, navigate]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!form.imageUrl || !form.name || !form.categoryId) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      await createProduct({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl,
        shortDescription: form.shortDescription,
        unit: form.unit,
        lowStockThreshold: Number(form.lowStockThreshold || 5),
        badge: form.badge,
        isFeatured: Boolean(form.isFeatured),
        categoryId: Number(form.categoryId),
      });
      showMessage("Ürün başarıyla eklendi!");
      setForm({
        name: "",
        price: "",
        stock: "",
        imageUrl: "",
        shortDescription: "",
        unit: "Adet",
        lowStockThreshold: "5",
        badge: "",
        isFeatured: false,
        categoryId: "",
      });
      await loadData();
    } catch {
      showMessage("Ürün eklenemedi.", "error");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;

    try {
      await createCategory({ name: newCategoryName });
      showMessage("Kategori eklendi!");
      setNewCategoryName("");
      await loadData();
    } catch {
      showMessage("Kategori eklenemedi.", "error");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğine emin misin?")) return;
    try {
      await deleteCategoryService(id);
      await loadData();
    } catch {
      showMessage("Kategori silinemedi.", "error");
    }
  };

  const updateStock = async (product) => {
    const newStock = prompt(`${product.name} için yeni stok miktarı:`, product.stock);
    if (newStock === null || newStock === "") return;

    try {
      await updateProduct(product.id, { ...product, stock: Number(newStock) });
      showMessage("Stok güncellendi.");
      await loadData();
    } catch {
      showMessage("Stok güncellenemedi.", "error");
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await updateProduct(product.id, {
        ...product,
        isFeatured: !product.isFeatured,
      });
      showMessage(
        !product.isFeatured
          ? `${product.name} öne çıkanlara eklendi.`
          : `${product.name} öne çıkanlardan çıkarıldı.`
      );
      await loadData();
    } catch {
      showMessage("Öne çıkan durumu güncellenemedi.", "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    try {
      await deleteProductService(id);
      await loadData();
    } catch {
      showMessage("Ürün silinemedi.", "error");
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "Belirsiz";
  };

  const handleStatusChange = (orderId, status) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleSaveStatus = async (orderId) => {
    const nextStatus = statusUpdates[orderId];
    if (!nextStatus) return;

    try {
      setOrderLoading(true);
      await updateOrderStatus(orderId, nextStatus);
      showMessage(`Sipariş #${orderId} durumu güncellendi.`);
      await loadData();
    } catch (error) {
      const apiMessage = error?.response?.data;
      const detailedMessage =
        typeof apiMessage === "string"
          ? apiMessage
          : apiMessage?.message || apiMessage?.Message;
      showMessage(
        detailedMessage || "Sipariş durumu güncellenemedi.",
        "error"
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePaymentChange = (orderId, paymentStatus) => {
    setPaymentUpdates((prev) => ({ ...prev, [orderId]: paymentStatus }));
  };

  const handleSavePaymentStatus = async (orderId) => {
    const nextPaymentStatus = paymentUpdates[orderId];
    if (!nextPaymentStatus) return;

    try {
      setOrderLoading(true);
      await updateOrderPaymentStatus(orderId, nextPaymentStatus);
      showMessage(`Sipariş #${orderId} ödeme durumu güncellendi.`);
      await loadData();
    } catch (error) {
      const apiMessage = error?.response?.data;
      const detailedMessage =
        typeof apiMessage === "string"
          ? apiMessage
          : apiMessage?.message || apiMessage?.Message;
      showMessage(detailedMessage || "Ödeme durumu güncellenemedi.", "error");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleLoadHistory = async (orderId) => {
    try {
      setLoadingHistoryOrderId(orderId);
      const logs = await getOrderStatusHistory(orderId);
      setStatusHistories((prev) => ({
        ...prev,
        [orderId]: Array.isArray(logs) ? logs : [],
      }));
    } catch {
      showMessage("Siparis gecmisi yuklenemedi.", "error");
    } finally {
      setLoadingHistoryOrderId(null);
    }
  };

  const handleCouponFormChange = (field, value) => {
    setCouponForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.type) {
      showMessage("Kupon kodu ve tipi zorunlu.");
      return;
    }

    try {
      await createAdminCoupon({
        code: couponForm.code,
        type: couponForm.type,
        value: Number(couponForm.value || 0),
        minTotal: Number(couponForm.minTotal || 0),
        usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : null,
        perUserLimit: Number(couponForm.perUserLimit || 1),
        expireAt: couponForm.expireAt
          ? new Date(`${couponForm.expireAt}T23:59:59`).toISOString()
          : null,
      });
      showMessage("Kupon oluşturuldu.");
      setCouponForm({
        code: "",
        type: "rate",
        value: "",
        minTotal: "",
        usageLimit: "",
        perUserLimit: "1",
        expireAt: "",
      });
      await loadData();
    } catch (error) {
      showMessage(error?.response?.data?.message || "Kupon oluşturulamadı.", "error");
    }
  };

  const handleToggleCoupon = async (couponId) => {
    try {
      await toggleAdminCouponActive(couponId);
      await loadData();
      showMessage("Kupon durumu güncellendi.");
    } catch (error) {
      showMessage(error?.response?.data?.message || "Kupon durumu güncellenemedi.", "error");
    }
  };

  const handleToggleReviewVisibility = async (reviewId) => {
    try {
      await toggleAdminReviewVisibility(reviewId);
      await loadData();
      showMessage("Yorum görünürlüğü güncellendi.");
    } catch (error) {
      showMessage(error?.response?.data?.message || "Yorum güncellenemedi.", "error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bu yorumu silmek istediğine emin misin?")) return;
    try {
      await deleteAdminReview(reviewId);
      await loadData();
      showMessage("Yorum silindi.");
    } catch (error) {
      showMessage(error?.response?.data?.message || "Yorum silinemedi.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] md:flex">
      <AdminCategoriesPanel
        categories={categories}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={setNewCategoryName}
        onAddCategory={handleAddCategory}
        onDeleteCategory={deleteCategory}
      />

      <main className="flex-1 space-y-6 overflow-x-hidden p-6">
        <AdminProductsPanel
          form={form}
          categories={categories}
          products={products}
          getCategoryName={getCategoryName}
          onFormChange={handleFormChange}
          onAddProduct={addProduct}
          onUpdateStock={updateStock}
          onToggleFeatured={toggleFeatured}
          onDeleteProduct={deleteProduct}
        />

        <AdminOrdersPanel
          orders={orders}
          statusHistories={statusHistories}
          loadingHistoryOrderId={loadingHistoryOrderId}
          statusUpdates={statusUpdates}
          paymentUpdates={paymentUpdates}
          orderLoading={orderLoading}
          statusLabelMap={statusLabelMap}
          statusColorMap={statusColorMap}
          onStatusChange={handleStatusChange}
          onSaveStatus={handleSaveStatus}
          onPaymentChange={handlePaymentChange}
          onSavePaymentStatus={handleSavePaymentStatus}
          onLoadHistory={handleLoadHistory}
        />

        <AdminCouponsPanel
          coupons={coupons}
          couponForm={couponForm}
          onCouponFormChange={handleCouponFormChange}
          onCreateCoupon={handleCreateCoupon}
          onToggleCouponActive={handleToggleCoupon}
        />

        <AdminReviewsPanel
          reviews={reviews}
          onToggleVisibility={handleToggleReviewVisibility}
          onDeleteReview={handleDeleteReview}
        />
      </main>

      <AppToast message={toast.message} type={toast.type} />
    </div>
  );
}
