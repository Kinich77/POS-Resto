export function MenuItem({ item, onAdd }) {
  return (
    <div className="border rounded p-4 shadow">
      <h3 className="text-xl font-bold">{item.name}</h3>
      <p className="text-gray-700">{item.description}</p>
      <p className="text-green-600 font-semibold mb-2">Rp {item.price.toLocaleString()}</p>
      <button onClick={onAdd} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        Tambah ke Keranjang
      </button>
    </div>
  );
}
