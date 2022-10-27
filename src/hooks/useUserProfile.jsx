import { useEffect, useState } from "react";
import userApi from "../api/userApi";

export default function useProductDetail() {
  const [user, setUser] = useState({});
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // setLoading(true);
        const { data } = await userApi.getUser();
        setUser(data.data);
      } catch (error) {
        console.log("Failed to fetch user", error.message);
      }
      // setLoading(false);
    })();
  }, []);
  return { user };
}
