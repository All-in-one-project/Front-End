import React from 'react';
import './App.css';
import Login from './component/Login';

function App() {
  return (
     <div className="App">
      <div className="login-container">
        <span className="close-btn"></span> 
        <h2>한국대학교 수강신청</h2>
        <Login/>
        <div className="separator"></div> 
        <div className="forgot-password"> 
            <a href="#">아이디 / 비밀번호 찾기</a>
        </div>
        </div>
     </div>
 );
}

export default App;
