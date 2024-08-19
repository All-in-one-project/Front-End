import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Initial.module.css';
import Schedule from '../ScheduleFold/Schedule.jsx';

const data = [
  { 번호: 1, 제목: '한국대학교 수강신청 웹 사이트 이용 수칙', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 2, 제목: '과목 조회 주의사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 3, 제목: '예비 / 일반 수강 신청 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 4, 제목: '학년별 수강 신청 기간 및 정정 기간 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 5, 제목: '2024년도 1학기 개설 과목 강의계획서 업데이트 안내', 날짜: '2024.00.00', 링크: '#' },
];

const Initial = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('전체 공지사항'); // 초기 상태 설정
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const totalPages = 5; // 페이지네이션
  const displayData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNavClick = (path) => {
    // 팝업 메시지 설정 및 팝업 표시
    setPopupMessage('로그인을 먼저 해주세요');
    setShowPopup(true);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    // 팝업 메시지 설정 및 팝업 표시
    if (subNav === '전체 공지사항' || subNav === 'FAQ') {
      setPopupMessage('로그인을 먼저 해주세요');
      setShowPopup(true);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAccessibilityClick = () => {
    navigate('/disabled'); // 시각장애인 배려용 화면으로 이동
  };

  const handleLoginClick=()=>{
    navigate('/login');
  }

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.body}>
      <div className={styles.leftBar}>
        <div className={styles.title}>
          <h3>한국대학교
            <div>수강신청</div>
          </h3>
        </div>

       <div className={styles.loginBox} onClick={handleLoginClick}>
          <div onClick={handleLoginClick}>로그인하기</div>
        </div>

        <div className={styles.accessibilityInfoBox} onClick={handleAccessibilityClick}>
            <div className={styles.accessibilityInfoText}>
                <h2>시각장애인</h2>
                <h3>배려용 화면 변경 </h3>
                <div className={styles.Line}>
                    <p className={styles.infoTextLine1}>이 네모칸을 클릭하면</p>
                    <p className={styles.infoTextLine2}>시각장애인 배려용 화면으로 넘어갑니다.</p>
                    <p className={styles.infoTextLine1}>시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며</p>
                    <p className={styles.infoTextLine2}>시각장애인 사용자에게도 편리한 화면을 제공합니다.</p>
                </div>
            </div>
        </div>

        
      </div>

      <div className={styles.mainContent}>
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <button className={styles.application} onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button onClick={() => handleNavClick('/')}>수강신청</button>
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

      {/* 팝업 */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <span className={styles.closeButton} onClick={closePopup}>×</span>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Initial;
