import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './component/Login/Login.jsx';
import Reserve from './component/ReserveFold/Reserve.jsx';
import Inquiry from './component/InquiryFold/Inquiry.jsx'
import Schedule from './component/ScheduleFold/Schedule.jsx'
import Notice from './component/NoticeFold/Notice.jsx'
import LeftBar from './component/SideBarFold/LeftBar.jsx'
import FAQList from './component/NoticeFold/FAQList.jsx'

function App() {
  // 환경 변수 사용 구간
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    // 서버 환경에서 실행되는 코드
    console.log('Running in production mode on the server');
  } else {
    // 브라우저 환경에서 실행되는 코드
    console.log('Running in the browser');
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/> 
        <Route path='' element={<Reserve />}/>
        <Route path='/inquiry' element={<Inquiry />}/>
        <Route path='/schedule' element={<Schedule />}/>
        <Route path='/notice' element={<Notice />}/>
        <Route path='/leftbar' element={<LeftBar />}/>
        <Route path='/faq' element={<FAQList/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
