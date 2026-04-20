import { fireEvent, render, screen } from "@testing-library/react";
import AdminOrdersPanel from "./AdminOrdersPanel";

describe("AdminOrdersPanel", () => {
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

  it("triggers status change and save callbacks", () => {
    const onStatusChange = vi.fn();
    const onSaveStatus = vi.fn();

    render(
      <AdminOrdersPanel
        orders={[
          {
            orderId: 42,
            username: "mehmet",
            orderDate: "2026-04-20T10:00:00.000Z",
            status: "Pending",
            totalPrice: 1500,
          },
        ]}
        statusUpdates={{ 42: "Pending" }}
        orderLoading={false}
        statusLabelMap={statusLabelMap}
        statusColorMap={statusColorMap}
        onStatusChange={onStatusChange}
        onSaveStatus={onSaveStatus}
      />
    );

    const select = screen.getByDisplayValue("Beklemede");
    fireEvent.change(select, { target: { value: "Shipped" } });
    expect(onStatusChange).toHaveBeenCalledWith(42, "Shipped");

    fireEvent.click(screen.getByRole("button", { name: "Durumu Kaydet" }));
    expect(onSaveStatus).toHaveBeenCalledWith(42);
  });
});
