import { useEffect, useState } from "react";
import commonApi from "../api/commonApi";

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    commonApi("categories/", "GET")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #ddd",
      padding: "10px 20px",
      display: "flex",
      gap: "20px",
      overflowX: "auto"
    }}>
      {categories.map(cat => (
        <span
          key={cat.id}
          style={{
            cursor: "pointer",
            fontWeight: "500",
            whiteSpace: "nowrap"
          }}
        >
          {cat.name}
        </span>
      ))}
    </div>
  );
};

export default CategoryBar;
