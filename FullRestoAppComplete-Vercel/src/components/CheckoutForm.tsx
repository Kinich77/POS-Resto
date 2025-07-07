import { useState } from "react";

export function CheckoutForm({ cart, onDone }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pesanan atas nama " + name + " berhasil!
Total: Rp " +
      cart.reduce((s, i) => s + i.price, 0).toLocaleString());
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-semibold mb-2">Form Pemesanan</h3>
      <input required placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)}
        className="block w-full mb-2 p-2 border rounded" />
      <textarea placeholder="Catatan (opsional)" value={note} onChange={(e) => setNote(e.target.value)}
        className="block w-full mb-2 p-2 border rounded" />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        Kirim Pesanan
      </button>
    </form>
  );
}
