import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { router } from "./router";
import { useSiteConfigStore } from "@/stores/site-config.store";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/services/api";

export default function App() {
  useEffect(() => {
    useSiteConfigStore.getState().fetchConfig();

    const { token, setAuth } = useAuthStore.getState();
    if (token) {
      authApi
        .me()
        .then((res) => {
          const latestToken = useAuthStore.getState().token;
          if (res?.data && latestToken === token) {
            setAuth(res.data, latestToken);
          }
        })
        .catch(() => {
          // Nếu 401 thì interceptor trong lib/api.ts đã xử lý dọn phiên cũ
        });
    }
  }, []);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
