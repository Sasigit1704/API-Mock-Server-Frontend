import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ApiBuilder from "./pages/ApiBuilder/ApiBuilder";
import ApiTester from "./pages/ApiTester/ApiTester";
import Collections from "./pages/Collections/Collections";
import Environments from "./pages/Environments/Environments";
import Scenarios from "./pages/Scenarios/Scenarios";
import RequestHistory from "./pages/RequestHistory/RequestHistory";
import OpenApi from "./pages/OpenApi/OpenApiImport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<ApiBuilder />} />
          <Route path="/api-tester" element={<ApiTester />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/environment" element={<Environments />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/history" element={<RequestHistory />} />
          <Route path="/openapi" element={<OpenApi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;