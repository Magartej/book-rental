const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") {
    return "";
  }
  return "https://book-store-backend-iota-sandy.vercel.app";
};

export default getBaseUrl;
