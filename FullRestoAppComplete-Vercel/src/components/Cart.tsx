export function Cart({ cart, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="mt-8 p-4 border-t">
      <h2 className="text-2xl font-semibold mb-2">Keranjang</h2>
      {cart.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        <>
          <ul className="list-disc ml-4">
            {cart.map((item, idx) => (
              <li key={idx}>{item.name} - Rp {item.price.toLocaleString()}</li>
            ))}
          </ul>
          <p className="mt-2 font-bold text-green-700">Total: Rp {total.toLocaleString()}</p>
          <button onClick={onCheckout} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
