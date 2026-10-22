import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandingPage } from "@/pages/LandingPage";
import { AboutPage } from "@/pages/AboutPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ContactPage } from "@/pages/ContactPage";
import { NewsPage } from "@/pages/NewsPage";
import { NewsDetailPage } from "@/pages/NewsDetailPage";
import { AdminNewsPage } from "@/pages/AdminNewsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { PostMaterialPage } from "@/pages/PostMaterialPage";
import { MyPostsPage } from "@/pages/MyPostsPage";
import { MaterialDetailPage } from "@/pages/MaterialDetailPage";
import { AiAdvisorPage } from "@/pages/AiAdvisorPage";
import { ChatPage } from "@/pages/ChatPage";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
  // Các trang công khai phong cách Landing (Home Three & Solox style)
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  // Module Tin Tức & Quản Trị Bài Viết
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/news/:id",
    element: <NewsDetailPage />,
  },
  {
    path: "/admin/news",
    element: <AdminNewsPage />,
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

