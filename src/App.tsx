import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home/HomeController';
import NewProject from './pages/NewProject/NewProjectController';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Intro from './pages/Intro';
import TestFileSelect from "./pages/TestFileSelect/TestFileSelectController";
import TEDashboard from './pages/TEDashBoard/TEDashBoardController';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* 1. Public Routes (레이아웃 미적용: 렌딩, 로그인) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* 2. Protected Routes (MainLayout 적용: 홈, 인트로, 새 프로젝트) */}
        <Route element={<MainLayout />}>
          {/* Outlet 자리에 들어갈 자식 페이지들 */}
          <Route path="/home" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/new-project" element={<NewProject />} />
          {/* [추가] 테스트 파일 선택 페이지 라우트 */}
          <Route path="/test-file-select" element={<TestFileSelect />} />
          <Route path="/test-dashboard" element={<TEDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
