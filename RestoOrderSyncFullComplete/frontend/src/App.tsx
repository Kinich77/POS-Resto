import { useEffect, useState } from "react";
import api from "./services/api";
import { MenuItem } from "./components/MenuItem";

function App() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get("/menu").then((res) => {
      setMenus(res.data);
    });
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {menus.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
}

export default App;
