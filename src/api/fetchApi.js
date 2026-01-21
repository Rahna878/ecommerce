import commonApi from "./commonApi";

// Fetch all products
export const getProducts = async () => {
  try {
    const res = await commonApi.get("products/"); // make sure your Django endpoint matches
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};
