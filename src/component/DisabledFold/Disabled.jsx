import React, { useEffect } from 'react';
import styles from './Disabled.module.css';
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

const Disabled = () => {
  const navigate = useNavigate();
  const { speak, stop } = useSpeechSynthesis();

  useEffect(() => {
    // 기본 음성 메시지 제공
    speak(
      "해당 칸을 클릭 시 로그인 화면이 생성되며 수강 신청, 마이페이지를 이용할 수 있게 됩니다. 로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. 시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공합니다."
    );

    // 페이지 이동 시 음성 중단
    const handleBeforeUnload = () => {
      stop();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stop(); // 컴포넌트 언마운트 시 음성 중단
    };
  }, [speak, stop]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleAccessibilityClick = () => {
    navigate('/initial'); // 비시각장애인 배려용 화면으로 이동
  };

  const handleClick = () => {
    navigate('/login');
  };

  const handleMouseEnter = (text) => {
    speak(text); // 해당 버튼 음성 제공
  };

  const handlePopupOpen = () => {
    speak("로그인 이용 후 가능합니다");
  };

  return (
    <div className={styles.body}>
      <div className={styles.leftBar}>
        <div className={styles.title}>
          <h3>한국대학교
            <div>수강신청</div>
          </h3>
        </div>

        <div className={styles.loginBox}>
          <div>
            <span className={styles.disabled} onClick={handleAccessibilityClick}>비장애인 화면으로</span>
            <span>돌아가기</span>
          </div>
        </div>

        <div className={styles.accessibilityInfoBox} onClick={handleClick}>
          <div className={styles.accessibilityInfoText}>
            <h2>로그인하기</h2>
            <div className={styles.Line}>
              <p className={styles.infoTextLine1}>해당 칸을 클릭 시 로그인 화면이 생성되며</p>
              <p className={styles.infoTextLine2}>수강 신청 / 마이페이지를 이용할 수 있게 됩니다</p>
              <p className={styles.infoTextLine1}>로그인하지 않은 경우</p>
              <p className={styles.infoTextLine2}>공지사항과 과목조회만 이용 가능한 점 양해 바랍니다.</p>
              <p className={styles.infoTextLine1}>시각장애인 배려용 화면에서는</p>
              <p className={styles.infoTextLine2}>모든 화면과 기능을 음성으로 제공합니다</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <div className={styles.row}>
            <button
              onClick={() => handleNavClick('/notice')}
              onMouseEnter={() => handleMouseEnter("공지사항")}
            >
              공지사항
            </button>
            <button
              onClick={() => handleNavClick('/inquiry')}
              onMouseEnter={() => handleMouseEnter("과목조회")}
            >
              과목조회
            </button>
          </div>
          <div className={styles.row}>
            <button
              onClick={handlePopupOpen}
              onMouseEnter={() => handleMouseEnter("수강신청")}
            >
              수강신청
            </button>
            <button
              onClick={handlePopupOpen}
              onMouseEnter={() => handleMouseEnter("마이페이지")}
            >
              마이페이지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disabled;
