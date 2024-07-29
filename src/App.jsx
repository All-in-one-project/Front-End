import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './component/Login/Login.jsx';
import Reserve from './component/ReserveFold/Reserve.jsx';
import Inquiry from './component/InquiryFold/Inquiry.jsx'
import Schedule from './component/ScheduleFold/Schedule.jsx'
import Notice from './component/NoticeFold/Notice.jsx'
import LeftBar from './component/SideBarFold/LeftBar.jsx'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/> {/*exact는 "/" 이게 정확히 일치할 경우에만 출력됩니다.*/}
        <Route path='' element={<Reserve />}/>
         <Route path='/inquiry' element={<Inquiry />}/>
         <Route path='/schedule' element={<Schedule />}/>
         <Route path='/notice' element={<Notice />}/>
         <Route path='/leftbar' element={<LeftBar />}/>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
