import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../App.css';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // useHistory 훅을 사용하여 페이지 이동을 제어

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault(); 

    if (id === 'test' && password === 'password') {
      // 로그인 성공 시 홈 페이지로 이동
      history.push('/home');
    } else {
      // 로그인 실패 시 에러 메시지 표시
      setError('다시 입력하세요');
    }
  };

  const handleClose = () => {
    history.goBack(); // 이전 페이지로 이동, x동그라미 클릭시
  };

  return (
    <div className="login-container"> {/* login-container 클래스를 적용 */}
      <span className="close-btn" onClick={handleClose}></span> {/* close-btn 클릭 시 handleClose 호출 , x동그라미*/}
      <h2>한국대학교 수강신청</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input 
            id="id" 
            type="text" 
            value={id} 
            onChange={handleIdChange} 
            placeholder="아이디/학번 입력" 
            required 
            className="login-input" // input 스타일 적용을 위해 className 추가
          />
        </div>
        <div>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="비밀번호 입력" 
            required 
            className="login-input" 
          />
        </div>
        {error && <div className="error-message">{error}</div>} {/* 에러 메시지 표시 */}
        <button type="submit" className="login-button">로그인</button> 
      </form>
       <div className="separator"></div> 
       <div className="forgot-password"> 
         <a href="#">아이디 / 비밀번호 찾기</a>
       </div>
     </div>
  );
}

export default Login;
