import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandingPage } from "@/pages/LandingPage";
import { NewsPage } from "@/pages/NewsPage";
import { NewsDetailPage } from "@/pages/NewsDetailPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { PostMaterialPage } from "@/pages/PostMaterialPage";
import { MyPostsPage } from "@/pages/MyPostsPage";
import { MaterialDetailPage } from "@/pages/MaterialDetailPage";
import { AiAdvisorPage } from "@/pages/AiAdvisorPage";
import { ChatPage } from "@/pages/ChatPage";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
  // Trang Landing Page Chính thức (Home Three Style)
  {
    path: "/",
    element: <LandingPage />,
  },
  // Module Tin Tức & Cẩm Nang
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/news/:id",
    element: <NewsDetailPage />,
  },
  // Khu vực Bảng điều khiển & Nghiệp vụ nền tảng
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "materials",
        element: <HomePage />,
      },
      {
        path: "map-radar",
        element: <DashboardPage />,
      },
      {
        path: "post",
        element: <PostMaterialPage />,
      },
      {
        path: "my-posts",
        element: <MyPostsPage />,
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

