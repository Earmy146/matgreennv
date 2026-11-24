import React, { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { MaterialDetailPage } from "@/pages/MaterialDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Lazy-load secondary, editor-heavy & admin pages to shrink initial JS bundle
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const NewsPage = lazy(() => import("@/pages/NewsPage").then((m) => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() => import("@/pages/NewsDetailPage").then((m) => ({ default: m.NewsDetailPage })));
const PostMaterialPage = lazy(() => import("@/pages/PostMaterialPage").then((m) => ({ default: m.PostMaterialPage })));
const EditMaterialPage = lazy(() => import("@/pages/EditMaterialPage").then((m) => ({ default: m.EditMaterialPage })));
const MyPostsPage = lazy(() => import("@/pages/MyPostsPage").then((m) => ({ default: m.MyPostsPage })));
const MaterialRequestsPage = lazy(() => import("@/pages/MaterialRequestsPage").then((m) => ({ default: m.MaterialRequestsPage })));
const SavedMaterialsPage = lazy(() => import("@/pages/SavedMaterialsPage").then((m) => ({ default: m.SavedMaterialsPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const PublicProfilePage = lazy(() => import("@/pages/PublicProfilePage").then((m) => ({ default: m.PublicProfilePage })));
const AiAdvisorPage = lazy(() => import("@/pages/AiAdvisorPage").then((m) => ({ default: m.AiAdvisorPage })));
const ChatPage = lazy(() => import("@/pages/ChatPage").then((m) => ({ default: m.ChatPage })));
const AdminHubPage = lazy(() => import("@/pages/AdminHubPage").then((m) => ({ default: m.AdminHubPage })));
const AdminModerationPage = lazy(() => import("@/pages/AdminModerationPage").then((m) => ({ default: m.AdminModerationPage })));
const AdminNewsPage = lazy(() => import("@/pages/AdminNewsPage").then((m) => ({ default: m.AdminNewsPage })));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage })));

const PageLoader = () => (
  <div className="min-h-[45vh] flex items-center justify-center gap-2 text-emerald-700 text-xs font-semibold">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span>Đang tải...</span>
  </div>
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

const RootLayout = () => (
  <SmoothScrollProvider>
    <Outlet />
  </SmoothScrollProvider>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: withSuspense(<AboutPage />) },
      { path: "/services", element: withSuspense(<ServicesPage />) },
      { path: "/contact", element: withSuspense(<ContactPage />) },
      { path: "/news", element: withSuspense(<NewsPage />) },
      { path: "/news/:id", element: withSuspense(<NewsDetailPage />) },

      // Admin Portal Hub
      {
        path: "/admin",
        element: (
          <ProtectedRoute requiredRole="moderator">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: withSuspense(<AdminHubPage />) },
          { path: "moderation", element: withSuspense(<AdminModerationPage />) },
          {
            path: "news",
            element: (
              <ProtectedRoute requiredRole="admin">
                {withSuspense(<AdminNewsPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute requiredRole="admin">
                {withSuspense(<AdminSettingsPage />)}
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Main App Shell
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "materials", element: <HomePage /> },
          { path: "map-radar", element: <DashboardPage /> },
          {
            path: "post",
            element: (
              <ProtectedRoute>
                {withSuspense(<PostMaterialPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: "my-posts",
            element: (
              <ProtectedRoute>
                {withSuspense(<MyPostsPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: "materials/:id/edit",
            element: (
              <ProtectedRoute>
                {withSuspense(<EditMaterialPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: "requests",
            element: (
              <ProtectedRoute>
                {withSuspense(<MaterialRequestsPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: "saved",
            element: (
              <ProtectedRoute>
                {withSuspense(<SavedMaterialsPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                {withSuspense(<ProfilePage />)}
              </ProtectedRoute>
            ),
          },
          { path: "materials/:id", element: <MaterialDetailPage /> },
          { path: "users/:id", element: withSuspense(<PublicProfilePage />) },
          { path: "ai-advisor", element: withSuspense(<AiAdvisorPage />) },
          {
            path: "chat",
            element: (
              <ProtectedRoute>
                {withSuspense(<ChatPage />)}
              </ProtectedRoute>
            ),
          },
          { path: "login", element: <LoginPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
