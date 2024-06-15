// LoginForm.jsx
import React, { useState } from 'react';
import '../App.css'; // CSS 파일을 import합니다. 파일 경로는 실제 프로젝트 구조에 따라 다를 수 있습니다.

function LoginForm() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // 페이지 새로고침 방지
    // 로그인 처리 코드...
    console.log('Login attempt:', { id, password });
  };

  return (
    <div className="App"> {/* App 클래스를 div로 감싸서 스타일 적용 */}
      <form onSubmit={handleLogin} className="login-form">
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
            className="login-input" // 동일하게 input 스타일 적용
          />
        </div>
        <button type="submit" className="login-button">로그인</button> {/* 버튼 스타일 적용을 위해 className 추가 */}
      </form>
    </div>
  );
}

export default LoginForm;
