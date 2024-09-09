import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DisabledNotice.module.css';

const data = [
  { 번호: 1, 제목: '한국대학교 수강신청 웹 사이트 이용 수칙', 날짜: '2024.7.03', 링크: '#' },
  { 번호: 2, 제목: '과목 조회 주의사항', 날짜: '2024.02.01', 링크: '#' },
  { 번호: 3, 제목: '예비 / 일반 수강 신청 공지사항', 날짜: '2024.01.30', 링크: '#' },
  { 번호: 4, 제목: '학년별 수강 신청 기간 및 정정 기간 공지사항', 날짜: '2024.1.27', 링크: '#' },
  { 번호: 5, 제목: '2024년도 1학기 개설 과목 강의계획서 업데이트 안내', 날짜: '2024.01.025', 링크: '#' },
];

const NoticeItem = ({ 제목 }) => (
  <a href="#" className={styles.noticeItem}>
    {제목}
  </a>
);

const DisabledNotice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('전체 공지사항');
  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage); 
  const displayData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel(); // 페이지 이동 시 음성 중지
    };

    const handlePageLoad = () => {
      const msg = new SpeechSynthesisUtterance(
        "로그아웃과 동시에 비장애인 화면으로 화면이 초기화됩니다. 로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. 시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며 시각장애인 사용자에게도 편리한 화면을 제공합니다."
      );
      window.speechSynthesis.speak(msg);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    handlePageLoad();

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.speechSynthesis.cancel(); // 컴포넌트 언마운트 시 음성 중지
    };
  }, []); // useEffect를 빈 배열 의존성으로 설정하여, 페이지 로드시 한 번만 실행

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '전체 공지사항') {
      navigate('/disabled/notice');
    } else if (subNav === 'FAQ') {
      navigate('/disabled/faq');
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAccessibilityClick = () => {
    navigate('/initial'); 
  };

  const handleLoginClick = () => {
    navigate('/disabled');
  };

  const handleMouseOver = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className={styles.body}>
      <div className={styles.leftBar}>
        <div className={styles.title}>
          <h3>한국대학교
            <div>수강신청</div>
          </h3>
        </div>

        <div 
          className={styles.loginBox} 
          onClick={handleLoginClick}
          onMouseOver={() => handleMouseOver('선택 화면으로 돌아가기')}
        >
          <div>선택 화면으로</div>
          <h4>돌아가기</h4>
        </div>

        <div className={styles.accessibilityInfoBox} onClick={handleAccessibilityClick}>
          <div className={styles.accessibilityInfoText}>
            <h2>로그아웃하기</h2>
            <div className={styles.Line}>
              <p className={styles.infoTextLine1}>로그아웃과 동시에 비장애인 화면으로 화면이 초기화됩니다 </p>
              <p className={styles.infoTextLine1}>로그인하지 않은 경우 공지사항과 </p>
              <p className={styles.infoTextLine2}>과목조회만 이용 가능한 점 양해 바랍니다</p>
              <p className={styles.infoTextLine1}>시각장애인 배려용 화면에서는</p>
              <p className={styles.infoTextLine2}>모든 화면과 기능을 음성으로 제공하며 </p>
              <p className={styles.infoTextLine1}>시각장애인 사용자에게도 편리한 화면을 제공합니다. </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <div className={styles.navbar1}>
          <button 
            className={styles.application} 
            onClick={() => handleNavClick('/disabled/notice')} 
            onMouseOver={() => handleMouseOver('공지사항')}
          >
            공지사항
          </button>
          <button 
            onClick={() => handleNavClick('/disabled/inquiry')} 
            onMouseOver={() => handleMouseOver('과목조회')}
          >
            과목조회
          </button>
          </div>

          <div className={styles.navbar2}>
          <button 
            onClick={() => handleNavClick('/disabled/reserve')} 
            onMouseOver={() => handleMouseOver('수강신청')}
          >
            수강신청
          </button>
          <button 
            onClick={() => handleNavClick('/disabled/mypage')} 
            onMouseOver={() => handleMouseOver('마이페이지')}
          >
            마이페이지
          </button>
          </div>
        </div>

        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '전체 공지사항' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('전체 공지사항')}
            onMouseOver={() => handleMouseOver('전체 공지사항')}
          >
            전체 공지사항
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === 'FAQ' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('FAQ')}
            onMouseOver={() => handleMouseOver('FAQ')}
          >
            FAQ
          </button>
        </div>

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
                <td>
                  <a 
                    href={item.링크}
                    onMouseOver={() => handleMouseOver(item.제목)}
                  >
                    {item.제목}
                  </a>
                </td>
                <td>{item.날짜}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <React.Fragment key={index + 1}>
              <button
                onClick={() => handlePageClick(index + 1)}
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

      </div>
    </div>
  );
};

export default DisabledNotice;
