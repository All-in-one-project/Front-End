import styles from './DisabledMypage.module.css';
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { useNavigate } from 'react-router-dom';

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

const Mypage = () => {
  const [overallGPA, setOverallGPA] = useState(null);
  const [majorGPA, setMajorGPA] = useState(null);
  const [selectedSubNav, setSelectedSubNav] = useState('학생 정보 확인');
  const navigate = useNavigate();
  const { speak, stop } = useSpeechSynthesis();

  const handleMouseOver = (text) => {
    speak(text);
  };

  useEffect(() => {
    // 페이지 로드 시 초기 안내 음성 제공
    speak(
      '로그아웃과 동시에 비장애인 화면으로 화면이 초기화됩니다. ' +
      '로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. ' +
      '시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며, ' +
      '시각장애인 사용자에게도 편리한 화면을 제공합니다.'
    );
  }, [speak]); // 의존성 배열에 speak 추가

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '학생 정보 확인') {
      navigate('/disabled/notice');
    } else if (subNav === '수강 신청 내역') {
      navigate('/disabled/course');
    }
  };

  const handleAccessibilityClick = () => {
    navigate('/disabled'); 
  };

  const handleLoginClick = () => {
    navigate('/disabled/notice2');
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
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <div className={styles.navbar1}>
            <button 
              onClick={() => handleNavClick('/disabled/notice2')} 
              onMouseOver={() => handleMouseOver('공지사항')}
            >
              공지사항
            </button>
            <button 
              onClick={() => handleNavClick('/disabled/inquiry2')} 
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
              className={styles.application} 
              onClick={() => handleNavClick('/disabled/mypage')} 
              onMouseOver={() => handleMouseOver('마이페이지')}
            >
              마이페이지
            </button>
          </div>
        </div>

        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '학생 정보 확인' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('학생 정보 확인')}
            onMouseOver={() => handleMouseOver('학생 정보 확인')}
          >
            학생 정보 확인
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '수강 신청 내역' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('수강 신청 내역')}
            onMouseOver={() => handleMouseOver('수강 신청 내역')}
          >
            수강 신청 내역
          </button>
        </div>
        
        <div className={styles.container}>
          <div className={styles.section} onMouseOver={() => handleMouseOver('재학 상태. 재학 중 (현재 2학기 수강 중). 졸업까지 총 6학기 남아 있습니다.')}>
            <div className={styles.header}>재학 상태</div>
            <div className={styles.content}>
              <div className={styles.status}>
                <span className={styles.boldText}>재학 중</span> (현재 2학기 수강 중)
              </div>
              <div className={styles.remaining}>
                졸업까지 총 <span className={styles.boldText}>6학기</span> 남아 있습니다.
              </div>
            </div>
          </div>
          <div className={styles.section} onMouseOver={() => handleMouseOver(`학점 평점. 전체 학점 평점 ${overallGPA} / 4.5. 전공 학점 평점 ${majorGPA} / 4.5.`)}>
            <div className={styles.header}>학점 평점</div>
            <div className={styles.content}>
              <div className={styles.grade}>
                전체 학점 평점 <span className={styles.score}>{overallGPA} / 4.5</span>
              </div>
              <div className={styles.grade}>
                전공 학점 평점 <span className={styles.score}>{majorGPA} / 4.5</span>
              </div>
            </div>
          </div>
          <div className={styles.section} onMouseOver={() => handleMouseOver('학부 졸업 요건 충족 여부. 졸업 요건 미충족 상태입니다. 학부별 졸업 요건 확인하기.')}>
            <div className={styles.header}>학부 졸업 요건 충족 여부</div>
            <div className={styles.content}>
              <div className={styles.status}>
                졸업 요건 <span className={styles['status-highlight']}>미충족</span> 상태입니다.
              </div>
              <div className={styles.link}>
                <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                  학부별 졸업 요건 확인하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
