import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get("/api/menu").then((res) => {
      setMenus(res.data);
    }).catch((err) => console.error("Fetch gagal:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {menus.map((item, index) => (
        <div key={index} className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <p>{item.description}</p>
          <p>Rp {item.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
