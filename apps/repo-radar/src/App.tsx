import { Routes, Route, Navigate } from "react-router";
import { AppLayout } from "@repo-radar/ui";
import SearchPAge from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";

function App() {

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="search" element={<SearchPAge />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
