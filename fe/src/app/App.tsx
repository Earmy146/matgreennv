import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { router } from "./router";
import { useSiteConfigStore } from "@/stores/site-config.store";

export default function App() {
  useEffect(() => {
    useSiteConfigStore.getState().fetchConfig();
  }, []);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
