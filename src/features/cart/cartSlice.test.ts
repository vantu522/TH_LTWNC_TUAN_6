import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "./cartSlice";

describe("cartSlice - Unit Tests cho Reducer giỏ hàng", () => {
  const initialState = {
    items: [],
  };

  const sampleProduct = {
    id: 1,
    title: "iPhone 15",
    price: 999,
  };

  test("1. Trả về initial state khi truyền state ban đầu là undefined và action không xác định", () => {
    const nextState = cartReducer(undefined, { type: "@@INIT" });
    expect(nextState).toEqual({ items: [] });
  });

  test("2. addToCart - Thêm sản phẩm mới vào giỏ hàng trống với số lượng mặc định là 1", () => {
    const nextState = cartReducer(initialState, addToCart(sampleProduct));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual({
      id: 1,
      title: "iPhone 15",
      price: 999,
      quantity: 1,
    });
  });

  test("3. addToCart - Tăng quantity lên nếu sản phẩm đã tồn tại trong giỏ hàng", () => {
    const stateWithOneItem = {
      items: [
        {
          id: 1,
          title: "iPhone 15",
          price: 999,
          quantity: 1,
        },
      ],
    };

    const nextState = cartReducer(stateWithOneItem, addToCart(sampleProduct));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(2);
  });

  test("4. removeFromCart - Xóa sản phẩm ra khỏi giỏ hàng theo id", () => {
    const stateWithItems = {
      items: [
        { id: 1, title: "iPhone 15", price: 999, quantity: 1 },
        { id: 2, title: "Tai nghe AirPods", price: 199, quantity: 2 },
      ],
    };

    // Xóa sản phẩm có id = 1
    const nextState = cartReducer(stateWithItems, removeFromCart(1));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe(2);
  });

  test("5. updateQuantity - Cập nhật đúng số lượng cho sản phẩm có trong giỏ hàng", () => {
    const stateWithItem = {
      items: [{ id: 1, title: "iPhone 15", price: 999, quantity: 1 }],
    };

    const nextState = cartReducer(
      stateWithItem,
      updateQuantity({ id: 1, quantity: 5 })
    );

    expect(nextState.items[0].quantity).toBe(5);
  });

  test("6. updateQuantity - Không gây lỗi và giữ nguyên state nếu cập nhật sản phẩm không tồn tại", () => {
    const stateWithItem = {
      items: [{ id: 1, title: "iPhone 15", price: 999, quantity: 1 }],
    };

    const nextState = cartReducer(
      stateWithItem,
      updateQuantity({ id: 999, quantity: 10 })
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(1);
  });
});
