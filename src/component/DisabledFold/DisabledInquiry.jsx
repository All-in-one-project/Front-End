import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DisabledInquiry.module.css';

const useSpeechSynthesis = () => {
  const speak = (text) => {
    window.speechSynthesis.cancel(); // 현재 음성을 중단
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR'; // 한국어 설정
    utterance.rate = 1.5; // 발음 속도
    utterance.pitch = 1; // 음성 피치
    utterance.volume = 1; // 음성 볼륨

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel(); // 음성을 중단
  };

  return { speak, stop };
};

const data = [
  { 번호: 1, 제목: '한국대학교 수강신청 웹 사이트 이용 수칙', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 2, 제목: '과목 조회 주의사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 3, 제목: '예비 / 일반 수강 신청 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 4, 제목: '학년별 수강 신청 기간 및 정정 기간 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 5, 제목: '2024년도 1학기 개설 과목 강의계획서 업데이트 안내', 날짜: '2024.00.00', 링크: '#' },
];

const NoticeItem = ({ 제목 }) => (
  <a href="#" className={styles.noticeItem}>
    {제목}
  </a>
);

const DisabledInquiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('전체 공지사항');
  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 5;
    const { speak, stop } = useSpeechSynthesis();

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
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '전체 공지사항') {
      navigate('/disablednotice');
    } else if (subNav === 'FAQ') {
      navigate('/disabledfaq');
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAccessibilityClick = () => {
    navigate('/initial'); 
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleMouseOver = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };
      // 음성 제공 함수 추가
  const handleLongBoxMouseOver = () => {
    speak("해당 페이지는 과목 조회 페이지입니다. 예비 수강신청 및 일반 수강신청을 희망하는 학생은 위 [수강신청] 카테고리를 이용해 주시기 바랍니다.");
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
            onClick={() => handleNavClick('/notice')} 
            onMouseOver={() => handleMouseOver('공지사항')}
          >
            공지사항
          </button>
          <button 
            onClick={() => handleNavClick('/inquiry')} 
            onMouseOver={() => handleMouseOver('과목조회')}
          >
            과목조회
          </button>
          </div>

          <div className={styles.navbar2}>
          <button 
            onClick={() => handleNavClick('/reserve')} 
            onMouseOver={() => handleMouseOver('수강신청')}
          >
            수강신청
          </button>
          <button 
            onClick={() => handleNavClick('/mypage')} 
            onMouseOver={() => handleMouseOver('마이페이지')}
          >
            마이페이지
          </button>
          </div>
        </div>

     
        <div className={styles['sub-navbar']}>
          <div 
            className={styles['long-box']}
            onMouseOver={handleLongBoxMouseOver}
          >
            <div>해당 페이지는 과목 조회 페이지입니다.</div>
            예비 수강신청 및 일반 수강신청을 희망하는 학생은 위 <span className={styles['bold']}>[수강신청]</span> 카테고리를 이용해 주시기 바랍니다.
          </div>
        </div>

      

      </div>
    </div>
  );
};

export default DisabledInquiry;
