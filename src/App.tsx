import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home/HomeController';
import NewProject from './pages/NewProject/NewProjectController';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* MainLayout을 부모 Route로 설정 */}
        <Route element={<MainLayout />}>
          {/* Outlet 자리에 들어갈 자식 페이지들 */}
          <Route path="/" element={<Home />} />
          <Route path="/new-project" element={<NewProject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}