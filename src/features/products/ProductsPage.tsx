import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getProducts } from "./productsSlice";
import { addToCart } from "../cart/cartSlice";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
const {products, loading, error} = useAppSelector((state)=> state.products)

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
  <div>
    <h1>Products</h1>

    {loading && <p>Đang tải...</p>}

    {error && <p>{error}</p>}

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
