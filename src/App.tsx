import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/HomeController';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Intro from './pages/Intro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 (렌딩 페이지) */}
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
      </Routes>
    </BrowserRouter>
  );
}