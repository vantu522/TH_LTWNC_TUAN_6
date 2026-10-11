import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductsPage from "./ProductsPage";
import cartReducer from "../cart/cartSlice";
import * as productsApiModule from "../../services/productsApi";

// Giả lập (Mock) module productsApi để kiểm soát phản hồi của API
jest.mock("../../services/productsApi", () => ({
  __esModule: true,
  ...jest.requireActual("../../services/productsApi"),
  useGetProductsQuery: jest.fn(),
}));

describe("ProductsPage - Async & Integration Tests với Mock API", () => {
  let store: any;
  const mockedUseGetProductsQuery = productsApiModule.useGetProductsQuery as jest.Mock;

  beforeEach(() => {
    // Tạo Redux Store độc lập cho mỗi test case
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
    jest.clearAllMocks();
  });

  test("10. Hiển thị trạng thái đang tải (Loading) khi API đang lấy dữ liệu", () => {
    // 1. Arrange: Mock API đang ở trạng thái loading
    mockedUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    // 2. Act: Render component
    render(
      <Provider store={store}>
        <ProductsPage />
      </Provider>
    );

    // 3. Assert: Kiểm tra thông báo "Đang tải..." xuất hiện
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  test("11. [Bất đồng bộ - Mock API] Nhận dữ liệu bất đồng bộ từ Mock API và hiển thị danh sách sản phẩm", async () => {
    // 1. Arrange: Chuẩn bị dữ liệu mẫu giả lập trả về từ API
    const mockProducts = [
      { id: 101, title: "Laptop Asus ROG", price: 1500 },
      { id: 102, title: "Bàn phím cơ DareU", price: 45 },
    ];

    // Giả lập API trả về sau một khoảng thời gian bất đồng bộ
    mockedUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: undefined,
    });

    // 2. Act: Render component
    render(
      <Provider store={store}>
        <ProductsPage />
      </Provider>
    );

    // 3. Assert: Dùng waitFor/findByText để chờ dữ liệu render bất đồng bộ
    await waitFor(() => {
      expect(screen.getByText("Laptop Asus ROG")).toBeInTheDocument();
      expect(screen.getByText("1500$")).toBeInTheDocument();
      expect(screen.getByText("Bàn phím cơ DareU")).toBeInTheDocument();
      expect(screen.getByText("45$")).toBeInTheDocument();
    });

    // Kiểm tra có đủ 2 nút "Thêm vào giỏ"
    const addButtons = screen.getAllByRole("button", { name: "Thêm vào giỏ" });
    expect(addButtons).toHaveLength(2);
  });

  test("12. [Tích hợp Redux] Người dùng bấm nút 'Thêm vào giỏ' sẽ dispatch action thêm vào Redux store", async () => {
    const mockProducts = [
      { id: 201, title: "Tai nghe AirPods Pro", price: 250 },
    ];

    mockedUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: undefined,
    });

    render(
      <Provider store={store}>
        <ProductsPage />
      </Provider>
    );

    // Tìm nút "Thêm vào giỏ" và bấm click
    const addButton = screen.getByRole("button", { name: "Thêm vào giỏ" });
    fireEvent.click(addButton);

    // Kiểm tra state của Redux store đã được cập nhật thành công
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0]).toEqual({
      id: 201,
      title: "Tai nghe AirPods Pro",
      price: 250,
      quantity: 1,
    });
  });

  test("13. Hiển thị thông báo lỗi khi Mock API trả về thất bại (Error)", () => {
    // 1. Arrange: Mock API trả về lỗi
    mockedUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 500, message: "Lỗi kết nối máy chủ" },
    });

    // 2. Act: Render component
    render(
      <Provider store={store}>
        <ProductsPage />
      </Provider>
    );

    // 3. Assert: Kiểm tra dòng thông báo lỗi
    expect(
      screen.getByText("Có lỗi xảy ra khi tải sản phẩm")
    ).toBeInTheDocument();
    expect(screen.queryByText("Đang tải...")).not.toBeInTheDocument();
  });
});
