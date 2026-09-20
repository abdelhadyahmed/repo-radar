import { Routes, Route, Navigate } from "react-router";
import { AppLayout } from "./pages/layout/AppLayout";
import { lazy } from "react";

const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const SearchPage = lazy(() => import("./pages/SearchPage"))

function App() {

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
