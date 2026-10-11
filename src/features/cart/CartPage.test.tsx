import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CartPage from "./CartPage";
import cartReducer from "./cartSlice";

// Helper function để bọc CartPage trong Redux Provider với state giả lập
const renderCartPage = (cartState: { items: any[] }) => {
  const testStore = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: cartState,
    },
  });

  return render(
    <Provider store={testStore}>
      <CartPage />
    </Provider>
  );
};

describe("CartPage - Integration Tests cho giao diện giỏ hàng", () => {
  test("7. Hiển thị thông báo giỏ hàng trống và tổng tiền bằng 0 khi chưa có sản phẩm", () => {
    // 1. Arrange: Chuẩn bị state giỏ hàng rỗng
    const emptyCartState = { items: [] };

    // 2. Act: Render component CartPage vào DOM ảo
    renderCartPage(emptyCartState);

    // 3. Assert: Kiểm tra các nội dung hiển thị trên màn hình
    expect(screen.getByText("Giỏ hàng")).toBeInTheDocument();
    expect(screen.getByText("Tổng số lượng: 0 sản phẩm")).toBeInTheDocument();
    expect(screen.getByText("Tổng tiền: 0$")).toBeInTheDocument();
    expect(screen.getByText("Giỏ hàng trống.")).toBeInTheDocument();
  });

  test("8. Hiển thị danh sách sản phẩm và tính đúng tổng số lượng, tổng tiền", () => {
    // 1. Arrange: Giả lập giỏ hàng có 2 loại sản phẩm
    const cartStateWithItems = {
      items: [
        { id: 1, title: "Điện thoại iPhone 15", price: 1000, quantity: 2 },
        { id: 2, title: "Chuột không dây Logitech", price: 50, quantity: 1 },
      ],
    };

    // 2. Act: Render component
    renderCartPage(cartStateWithItems);

    // 3. Assert:
    // Kiểm tra tên sản phẩm xuất hiện
    expect(screen.getByText("Điện thoại iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Chuột không dây Logitech")).toBeInTheDocument();

    // Kiểm tra thông tin giá và số lượng
    expect(screen.getByText("Giá: 1000$")).toBeInTheDocument();
    expect(screen.getByText("Số lượng: 2")).toBeInTheDocument();
    expect(screen.getByText("Giá: 50$")).toBeInTheDocument();
    expect(screen.getByText("Số lượng: 1")).toBeInTheDocument();

    // Tổng số lượng: 2 + 1 = 3 sản phẩm
    expect(screen.getByText("Tổng số lượng: 3 sản phẩm")).toBeInTheDocument();

    // Tổng tiền: 2050$
    expect(screen.getByText("Tổng tiền: 2050$")).toBeInTheDocument();

    // Dòng thông báo giỏ hàng trống không được xuất hiện
    expect(screen.queryByText("Giỏ hàng trống.")).not.toBeInTheDocument();
  });

  test("9. Hiển thị đúng khi giỏ hàng có 1 sản phẩm số lượng lớn", () => {
    const singleItemState = {
      items: [{ id: 10, title: "Bàn phím cơ AKKO", price: 80, quantity: 5 }],
    };

    renderCartPage(singleItemState);

    expect(screen.getByText("Bàn phím cơ AKKO")).toBeInTheDocument();
    expect(screen.getByText("Tổng số lượng: 5 sản phẩm")).toBeInTheDocument();
    expect(screen.getByText("Tổng tiền: 400$")).toBeInTheDocument();
  });
});
