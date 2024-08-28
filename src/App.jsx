import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './component/Login/Login.jsx';
import Reserve from './component/ReserveFold/Reserve.jsx';
import Inquiry from './component/InquiryFold/Inquiry.jsx';
import Schedule from './component/ScheduleFold/Schedule.jsx';
import Notice from './component/NoticeFold/Notice.jsx';
import LeftBar from './component/SideBarFold/LeftBar.jsx';
import FAQ from './component/NoticeFold/FAQ.jsx';
import Mypage from './component/MypageFold/Mypage.jsx';
import Course from './component/MypageFold/Course.jsx';
import Initial from './component/InitialFold/Initial.jsx';
import Disabled from './component/DisabledFold/Disabled.jsx';
import DisabledInquiry2 from './component/DisabledFold/DisabledInquiry2.jsx';
import DisabledFaq2 from './component/DisabledFold/DisabledFaq2.jsx';
import DisabledNotice2 from './component/DisabledFold/DisabledNotice2.jsx';
import ReserveWating from './component/ReserveFold/ReserveWating.jsx';
import ReserveDelete from './component/ReserveFold/ReserveDelete.jsx';
import ReserveClassInputAgain from './component/ReserveFold/ReserveClassInputAgain.jsx';

function App() {
  const apiUrl = 'http://43.202.223.188:8080';

  // 환경 변수 사용 구간
  if (apiUrl) {
    // 환경 변수가 설정된 경우
    console.log('API URL:', apiUrl);
  } else {
    // 환경 변수가 설정되지 않은 경우
    console.warn('API URL이 설정되지 않았습니다.');
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Navigate to='/initial' />} /> {/* 기본 경로에서 /initial로 리다이렉트 */}
        <Route path='/reserve' element={<Reserve />} /> {/* /reserve 경로에 Reserve 컴포넌트 */}
        <Route path='/reserveWating' element={<ReserveWating />} /> 
        <Route path='/reserveDelete' element={<ReserveDelete />} /> 
        <Route path='/reserveClassInputAgain' element={<ReserveClassInputAgain />} /> 
        <Route path='/inquiry' element={<Inquiry />} />
        <Route path='/schedule' element={<Schedule />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/leftbar' element={<LeftBar />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/course' element={<Course />} />
        <Route path='/initial' element={<Initial />} />
        <Route path='/disabled' element={<Disabled />} />
        <Route path='/disabled/faq2' element={<DisabledFaq2 />} />
        <Route path='/disabled/inquiry2' element={<DisabledInquiry2 />} />
        <Route path='/disabled/notice2' element={<DisabledNotice2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
