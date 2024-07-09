import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './component/Login/Login.jsx';
import Reserve from './component/ReserveFold/Reserve.jsx';
import Application from './component/ApplicationFold/Application.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/> {/*exact는 "/" 이게 정확히 일치할 경우에만 출력됩니다.*/}
        <Route path='' element={<Reserve />}/>
         <Route path='/application' element={<Application />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
