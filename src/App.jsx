import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ApiBuilder from "./pages/ApiBuilder/ApiBuilder";
import Collections from "./pages/Collections/Collections";
import Environments from "./pages/Environments/Environments"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<ApiBuilder />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/environment" element={<Environments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;