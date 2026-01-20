import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/HomeController';
import NewProject from './pages/NewProject/NewProjectController';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />
        
        {/* 새 프로젝트 생성 화면 */}
        <Route path="/new-project" element={<NewProject />} />
      </Routes>
    </BrowserRouter>
  );
}