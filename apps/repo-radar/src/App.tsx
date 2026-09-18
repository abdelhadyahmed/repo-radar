import { Routes, Route, Navigate } from "react-router";
import SearchPage from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";
import { AppLayout } from "./pages/layout/AppLayout";

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
