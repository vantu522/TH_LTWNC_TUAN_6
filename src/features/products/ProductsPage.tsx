import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { addToCart } from "../cart/cartSlice";
import { useGetProductsQuery } from "../../services/productsApi";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { data: products = [], isLoading: loading, error } = useGetProductsQuery();

  return (
  <div>
    <h1>Products</h1>

    {loading && <p>Đang tải...</p>}

    {error && <p>Có lỗi xảy ra khi tải sản phẩm</p>}

   {products.map((product) => (
  <div key={product.id}>
    <h3>{product.title}</h3>
    <p>{product.price}$</p>

    <button onClick={() => dispatch(addToCart(product))}>
      Thêm vào giỏ
    </button>
  </div>
))}
  </div>
);
};

export default ProductsPage;
