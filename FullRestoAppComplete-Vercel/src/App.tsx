import { useEffect, useState } from "react";
import api from "./services/api";
import { MenuItem } from "./components/MenuItem";
import { Cart } from "./components/Cart";
import { CheckoutForm } from "./components/CheckoutForm";
import { AdminLogin } from "./components/AdminLogin";

function App() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.get("/api/menu").then((res) => setMenus(res.data));
  }, []);

  const addToCart = (item) => setCart([...cart, item]);
  const resetCart = () => setCart([]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">RestoOrder</h1>

      {!isAdmin ? (
        <AdminLogin onLogin={() => setIsAdmin(true)} />
      ) : (
        <div className="bg-yellow-100 p-2 mb-4 text-sm text-center rounded">
          Login sebagai Admin berhasil ✅
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {menus.map((item) => (
          <MenuItem key={item.id} item={item} onAdd={() => addToCart(item)} />
        ))}
      </div>

      <Cart cart={cart} onCheckout={() => setShowCheckout(true)} />

      {showCheckout && <CheckoutForm cart={cart} onDone={resetCart} />}
    </div>
  );
}

export default App;
