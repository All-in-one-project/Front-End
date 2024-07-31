import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login_css.css';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://43.202.223.188/login', {
        student_number: id,
        password: password,
      });

      if (response.status === 200 && response.data.student_id) {
        localStorage.setItem('token', response.data.token);
        navigate('/'); 
      } else {
        setError('다시 입력하세요');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || '로그인 중 오류가 발생했습니다.');
      } else {
        setError('서버에 연결할 수 없습니다.');
      }
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <span className="close-btn" onClick={handleClose}></span>
        <h2>한국대학교 수강신청</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(event) => setId(event.target.value)}
              placeholder="아이디/학번 입력"
              required
              className="login-input"
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
              required
              className="login-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">로그인</button>
        </form>
        <div className="separator"></div>
        <div className="forgot-password">
          <a href="#">아이디 / 비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
