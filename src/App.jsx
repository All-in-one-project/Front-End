import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './component/Login/Login.jsx';
import Reserve from './component/ReserveFold/Reserve.jsx';
import Inquiry from './component/InquiryFold/Inquiry.jsx';
import Schedule from './component/ScheduleFold/Schedule.jsx';
import Notice from './component/NoticeFold/Notice.jsx';
import NoticeDetail from './component/NoticeFold/NoticeDetail.jsx';
import LeftBar from './component/SideBarFold/LeftBar.jsx';
import FAQ from './component/NoticeFold/FAQ.jsx';
import Mypage from './component/MypageFold/Mypage.jsx';
import Course from './component/MypageFold/Course.jsx';
import Initial from './component/InitialFold/Initial.jsx';
import Disabled from './component/DisabledFold/Disabled.jsx';
import Disabled2 from './component/DisabledFold/Disabled2.jsx';
import DisabledInquiry2 from './component/DisabledFold/DisabledInquiry2.jsx';
import DisabledFaq2 from './component/DisabledNoticeFold/DisabledFaq2.jsx';
import DisabledNotice2 from './component/DisabledNoticeFold/DisabledNotice2.jsx';
import DisabledMypage from './component/DisabledFold/DisabledMypage.jsx';
import DisabledReserve from './component/DisabledFold/DisabledReserve.jsx';
import DisabledCourse from './component/DisabledFold/DisabledCourse.jsx';
import DisabledInquiry from './component/DisabledFold/DisabledInquiry.jsx';
import DisabledNotice from './component/DisabledNoticeFold/DisabledNotice.jsx';
import DisabledFaq from './component/DisabledNoticeFold/DisabledFaq.jsx';
import ReserveWating from './component/ReserveFold/ReserveWating.jsx';
import ReserveDelete from './component/ReserveFold/ReserveDelete.jsx';
import ReserveClassInputAgain from './component/ReserveFold/ReserveClassInputAgain.jsx';
import { UserProvider } from './component/UserContext.jsx'; 
import PrivateRoute from './component/PrivateRoute.jsx';
import ProtectedPage from './component/ProtectedPage.jsx';


function App() {
  const apiUrl = 'http://43.202.223.188';

  // 환경 변수 사용 구간
  if (apiUrl) {
    // 환경 변수가 설정된 경우
    console.log('API URL:', apiUrl);
  } else {
    // 환경 변수가 설정되지 않은 경우
    console.warn('API URL이 설정되지 않았습니다.');
  }

  return (
     <UserProvider>
    <BrowserRouter>
       <Routes>
          {/* 초기 화면을 Initial로 설정 */}
          <Route path='/' element={<Initial />} />
          
          {/* 로그인 여부와 상관없이 접근 가능한 페이지 */}
          <Route path='/login' element={<Login />} />
          <Route path='/initial' element={<Initial />} />
          <Route path='/reserve' element={<Reserve />} />
          <Route path='/reserveWating' element={<ReserveWating />} />
          <Route path='/reserveDelete' element={<ReserveDelete />} />
          <Route path='/reserveClassInputAgain' element={<ReserveClassInputAgain />} />
          <Route path='/inquiry' element={<Inquiry />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/notice' element={<Notice />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path='/leftbar' element={<LeftBar />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/mypage' element={<Mypage />} />
          <Route path='/course' element={<Course />} />

          {/* 로그인하지 않은 사용자 접근 페이지 */}
          <Route 
            path='/disabled/notice2' 
            element={
              <ProtectedPage redirectTo='/disabled/notice'>
                <DisabledNotice2 />
              </ProtectedPage>
            } 
          />
          <Route 
            path='/disabled/faq2' 
            element={
              <ProtectedPage redirectTo='/disabled/faq'>
                <DisabledFaq2 />
              </ProtectedPage>
            } 
          />
          <Route 
            path='/disabled/inquiry2' 
            element={
              <ProtectedPage redirectTo='/disabled/inquiry'>
                <DisabledInquiry2 />
              </ProtectedPage>
            } 
          />
          <Route 
            path='/disabled' 
            element={
              <ProtectedPage redirectTo='/disabled2'>
                <Disabled />
              </ProtectedPage>
            } 
          />

          {/* 로그인 여부와 상관없이 접근 가능하지만, 특정 조건에서 리다이렉트되는 페이지 */}
          <Route path='/disabled' element={<Disabled />} />
          <Route path='/disabled2' element={<Disabled2 />} />
          <Route path='/disabled/faq' element={<DisabledFaq />} />
          <Route path='/disabled/inquiry' element={<DisabledInquiry />} />
          <Route path='/disabled/notice' element={<DisabledNotice />} />
          <Route path='/disabled/mypage' element={<DisabledMypage />} />
          <Route path='/disabled/course' element={<DisabledCourse />} />
          <Route path='/disabled/reserve' element={<DisabledReserve />} />
        </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;
