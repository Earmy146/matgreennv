import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { PostMaterialPage } from "@/pages/PostMaterialPage";
import { MaterialDetailPage } from "@/pages/MaterialDetailPage";
import { AiAdvisorPage } from "@/pages/AiAdvisorPage";
import { ChatPage } from "@/pages/ChatPage";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "post",
        element: <PostMaterialPage />,
      },
      {
        path: "materials/:id",
        element: <MaterialDetailPage />,
      },
      {
        path: "ai-advisor",
        element: <AiAdvisorPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
