import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DisabledFaq.module.css';

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

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles['faq-item']}>
      <div className={styles['faq-question']} onClick={toggleOpen}>
        {question}
        <span className={`${styles['faq-icon']} ${isOpen ? styles['open'] : ''}`}></span>
      </div>
      {isOpen && <div className={styles['faq-answer']}>{answer}</div>}
    </div>
  );
};

const FAQList = () => {
  const faqs = [
    { question: 'Q. 예비 수강 신청 기간에 신청을 못했어요', answer: 'A. 예비 수강 신청 기간에 신청을 못했을 경우, 일반 수강 신청 기간을 이용하여 신청할 수 있습니다.' },
    { question: 'Q. 부전공 졸업 학점 이수 내역은 어떻게 확인하나요', answer: 'A. 부전공 졸업 학점 이수 내역은 학교 포털 사이트에서 확인할 수 있습니다.' },
    { question: 'Q. 수강 신청 내역을 실수로 삭제했어요', answer: 'A. 수강 신청 내역을 실수로 삭제한 경우, 수강 신청 페이지 [장바구니 내역]을 통해 다시 신청할 수 있습니다.' },
    { question: 'Q. 수강 신청 기간인데 수강 신청이 불가해요', answer: 'A. 학우분들께서는 해당 신청일이 본인 학년 수강 신청일과 동일한지 확인 후 수강 신청 바랍니다.' },
    { question: 'Q. 수강 신청 기능을 이용할 수 없어요', answer: 'A. 본교에서는 해당일이 수강 신청 기간과 다른 경우, 학우분들의 혼선을 방지하기 위해 수강 신청 페이지 접근을 제한하고 있습니다. (예비 수강 신청, 일반 수강 신청 모두 동일) 한국대학교 학우분들에게 많은 양해 부탁드립니다.' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles['faq-list']}>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

const DisabledFaq = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('FAQ');
  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage); 
  const displayData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const { speak, stop } = useSpeechSynthesis();

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel(); // 페이지 이동 시 음성 중지
    };

    const handlePageLoad = () => {
      // 음성 제공 함수
      const provideVoice = () => {
        const msg = new SpeechSynthesisUtterance(
          "로그아웃과 동시에 비장애인 화면으로 화면이 초기화됩니다. 로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. 시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며 시각장애인 사용자에게도 편리한 화면을 제공합니다."
        );
        window.speechSynthesis.speak(msg);
      };

      if (window.localStorage.getItem('visitedDisabledFaq') === null) {
        provideVoice();
        window.localStorage.setItem('visitedDisabledFaq', 'true');
      }
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
      navigate('/disabled/notice');
    } else if (subNav === 'FAQ') {
      navigate('/disabled/faq');
    }
  };

  const handleReturnToPreviousScreen = () => {
  speak("선택 화면으로 돌아가기");
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
            onMouseOver={handleReturnToPreviousScreen}
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

        <FAQList />
      </div>
    </div>
  );
};

export default DisabledFaq;
