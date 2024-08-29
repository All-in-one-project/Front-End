/*공지사항*/

import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notice.module.css';
import LeftBar from '../SideBarFold/LeftBar.jsx';
import Schedule from '../ScheduleFold/Schedule.jsx';
import { UserContext } from '../UserContext';
import axios from 'axios';

const data = [
  { 번호: 1, 제목: '한국대학교 수강신청 웹 사이트 이용 수칙', 날짜: '2024.07.029', 링크: '#' },
  { 번호: 2, 제목: '과목 조회 주의사항', 날짜: '2024.01.03', 링크: '#' },
  { 번호: 3, 제목: '예비 / 일반 수강 신청 공지사항', 날짜: '2024.01.02', 링크: '#' },
  { 번호: 4, 제목: '학년별 수강 신청 기간 및 정정 기간 공지사항', 날짜: '2023.12.19', 링크: '#' },
  { 번호: 5, 제목: '2024년도 1학기 개설 과목 강의계획서 업데이트 안내', 날짜: '2023.11.01', 링크: '#' },
];

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
 const [selectedSubNav, setSelectedSubNav] = useState('전체 공지사항'); // 초기 상태 설정
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const itemsPerPage = 5;
  const totalPages = 5;/*페이지네이션*/
  const displayData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    /* 로그아웃 API */
    /* 일단은 로그아웃 누르면 원래 화면 path:'' 인 곳에 이동함 */
  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken'); // 'accessToken'으로 수정
    
    if (!token) {
      console.error('토큰이 존재하지 않습니다.');
      navigate('/initial'); // 토큰이 없으면 바로 초기 화면으로 이동
      return;
    }

    try {
      // 로그아웃 요청을 서버에 보냄
      const response = await axios.post('https://43.202.223.188:8080/api/logout', { token });
      
      if (response.status === 200) {
        console.log(response.data.message); // "Logout successful"

        // 로컬 스토리지에서 사용자 정보와 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');

        // UserContext의 user 상태 초기화
        setUser(null);

        navigate('/initial'); // 로그아웃 후 초기 화면으로 이동
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

  const handlePageClick = (pageNumber) => {
  setCurrentPage(pageNumber);
};


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
              <tr key={item.번호}>
                <td>{item.번호}</td>
                <td><a href={item.링크}>{item.제목}</a></td>
                <td>{item.날짜}</td>
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
