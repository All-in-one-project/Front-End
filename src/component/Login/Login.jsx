import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login_css.css';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  const checkServerStatus = async () => {
    try {
      const response = await axios.get('http://43.202.223.188/health'); // 서버 상태 확인용 엔드포인트
      if (response.status === 200) {
        setServerStatus('서버 연결 정상');
      } else {
        setServerStatus('서버 연결 문제 발생');
      }
    } catch (error) {
      setServerStatus('서버에 연결할 수 없습니다.');
    }
  };

  checkServerStatus();
}, []);



const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://43.202.223.188/login', {
        username: id,
        password: password,
      });

      if (response.status === 200 && response.data.accessToken) {
        // 서버로부터 받은 정보를 로컬 스토리지에 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // JWT 토큰을 Axios 기본 헤더에 추가
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        // 원하는 페이지로 리다이렉트
        const redirectTo = location.state?.from?.pathname || '/notice';
        navigate(redirectTo);
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
