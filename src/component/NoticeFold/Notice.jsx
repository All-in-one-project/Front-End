import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notice.module.css';
import LeftBar from '../SideBarFold/LeftBar.jsx';
import Schedule from '../ScheduleFold/Schedule.jsx';
import { UserContext } from '../UserContext';
import axios from 'axios';

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('전체 공지사항'); // 초기 상태 설정
  const [notices, setNotices] = useState([]); // 서버에서 받은 공지사항 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const itemsPerPage = 5; // 한 페이지에 표시할 공지사항 수

  // 공지사항을 서버에서 받아오는 함수
  useEffect(() => {
   // 예시: localStorage에서 토큰을 가져와서 Authorization 헤더에 포함
    const token = localStorage.getItem('accessToken'); // 토큰을 저장한 위치에 따라 변경

    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://43.202.223.188:8080/notice', {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰 추가
          },
        });

        if (response.status === 200) {
          setNotices(response.data); // 받은 데이터 저장
          setLoading(false); // 로딩 완료
        } else {
          console.error('Failed to fetch notices');
          setLoading(false);
        }
      } catch (error) {
        console.error('공지사항을 불러오는 중 오류가 발생했습니다:', error);
        setLoading(false);
      }
    };
     fetchNotices();

  }, []);

  const totalPages = Math.ceil(notices.length / itemsPerPage); // 총 페이지 수 계산
  const displayData = notices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // 현재 페이지에 해당하는 데이터

  /* 로그아웃 API */
  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken'); // 'accessToken'으로 수정

    if (!token) {
      console.error('토큰이 존재하지 않습니다.');
      navigate('/initial'); // 토큰이 없으면 바로 초기 화면으로 이동
      return;
    }

    try {
      const response = await axios.post('https://43.202.223.188:8080/api/logout', { token });
      if (response.status === 200) {
        console.log(response.data.message); // "Logout successful"
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/initial');
      } else {
        console.error('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('서버와의 통신에 실패했습니다:', error);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '전체 공지사항') {
      navigate('/notice');
    } else if (subNav === 'FAQ') {
      navigate('/faq');
    }
  };

  const handleNoticeClick = (id) => {
    navigate(`/notice/${id}`); // id에 따라 상세 페이지로 이동
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시
  }

  return (
    <div className={styles.body}>
      <LeftBar />
      <div className={styles.mainContent}>
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <button className={styles.application} onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button onClick={() => handleNavClick('/reserve')}>수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>

        {/* 하위 네비게이션 바 */}
        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '전체 공지사항' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('전체 공지사항')}
          >
            전체 공지사항
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === 'FAQ' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('FAQ')}
          >
            FAQ
          </button>
        </div>

        {/* 공지사항 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <button
                    className={styles.linkButton}
                    onClick={() => handleNoticeClick(item.id)}
                  >
                    {item.title}
                  </button>
                </td>
                <td>{new Date(item.noticeTime).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <React.Fragment key={index + 1}>
              <button
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? styles.active : ''}
              >
                {index + 1}
              </button>
              {index + 1 < totalPages && (
                <span className={styles.separator}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <Schedule />
      </div>
    </div>
  );
};

export default Notice;
