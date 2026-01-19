import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/HomeController';
import Landing from './pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 (렌딩 페이지) */}
        <Route path="/" element={<Landing />} />
        {/*홈 페이지 */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}