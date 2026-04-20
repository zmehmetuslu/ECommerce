import { fireEvent, render, screen } from "@testing-library/react";
import AdminCategoriesPanel from "./AdminCategoriesPanel";

describe("AdminCategoriesPanel", () => {
  it("handles add and delete category actions", () => {
    const onNewCategoryNameChange = vi.fn();
    const onAddCategory = vi.fn((e) => e.preventDefault());
    const onDeleteCategory = vi.fn();

    render(
      <AdminCategoriesPanel
        categories={[
          { id: 1, name: "Tohum" },
          { id: 2, name: "Gubre" },
        ]}
        newCategoryName=""
        onNewCategoryNameChange={onNewCategoryNameChange}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Yeni..."), {
      target: { value: "Ekipman" },
    });
    expect(onNewCategoryNameChange).toHaveBeenCalledWith("Ekipman");

    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onAddCategory).toHaveBeenCalled();

    const deleteButtons = screen.getAllByRole("button", { name: "x" });
    fireEvent.click(deleteButtons[0]);
    expect(onDeleteCategory).toHaveBeenCalledWith(1);
  });
});
