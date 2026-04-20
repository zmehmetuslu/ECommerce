import { fireEvent, render, screen } from "@testing-library/react";
import AdminProductsPanel from "./AdminProductsPanel";

describe("AdminProductsPanel", () => {
  it("handles product form changes and submit", () => {
    const onFormChange = vi.fn();
    const onAddProduct = vi.fn((e) => e.preventDefault());
    const onUpdateStock = vi.fn();
    const onDeleteProduct = vi.fn();

    render(
      <AdminProductsPanel
        form={{
          name: "",
          price: "",
          stock: "",
          imageUrl: "",
          categoryId: "",
        }}
        categories={[{ id: 1, name: "Tohum" }]}
        products={[]}
        getCategoryName={() => "Tohum"}
        onFormChange={onFormChange}
        onAddProduct={onAddProduct}
        onUpdateStock={onUpdateStock}
        onDeleteProduct={onDeleteProduct}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Ürün Adı"), {
      target: { value: "Deneme Ürün" },
    });
    expect(onFormChange).toHaveBeenCalledWith("name", "Deneme Ürün");

    fireEvent.change(screen.getByPlaceholderText("Fiyat"), {
      target: { value: "99" },
    });
    expect(onFormChange).toHaveBeenCalledWith("price", "99");

    fireEvent.change(screen.getByDisplayValue("Kategori Seçin"), {
      target: { value: "1" },
    });
    expect(onFormChange).toHaveBeenCalledWith("categoryId", "1");

    fireEvent.click(screen.getByRole("button", { name: "KAYDET" }));
    expect(onAddProduct).toHaveBeenCalled();
  });
});
