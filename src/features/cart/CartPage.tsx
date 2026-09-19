import { useAppSelector } from "../../app/hooks";

function CartPage() {
    const items = useAppSelector((state) => state.cart.items);
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
            <h1>Giỏ hàng</h1>
            <h3 style={{ color: 'blue' }}>Tổng số lượng: {totalQuantity} sản phẩm</h3>
            <h3 style={{ color: 'red' }}>Tổng tiền: {totalPrice}$</h3>

            {items.length === 0 && <p>Giỏ hàng trống.</p>}

            {items.map((item) => (
                <div key={item.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h3>{item.title}</h3>
                    <p>Giá: {item.price}$</p>
                    <p>Số lượng: {item.quantity}</p>
                </div>
            ))}
        </div>
    );
}

export default CartPage;