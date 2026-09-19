import './App.css'
import ProductsPage from './features/products/ProductsPage'
import CartPage from './features/cart/CartPage'

function App() {

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
      <div style={{ flex: 1 }}>
        <ProductsPage></ProductsPage>
      </div>
      <div style={{ flex: 1 }}>
        <CartPage></CartPage>
      </div>
    </div>
  )
}

export default App
