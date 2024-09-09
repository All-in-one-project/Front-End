import styles from './DisabledCourse.module.css';
import React, { useState, useEffect } from 'react';
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

const Course = () => {
  const [selectedYear, setSelectedYear] = useState("2024학년도");
  const [courses, setCourses] = useState(null); // courses 상태를 null로 초기화
  const [selectedSubNav, setSelectedSubNav] = useState('수강 신청 내역');
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
  }, []); // 의존성 배열을 빈 배열로 설정하여 페이지 로드시 한 번만 실행

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '학생 정보 확인') {
      navigate('/disabled/mypage');
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // 학년도에 따른 하드코딩된 수업 데이터
  const getCourseData = () => {
    if (selectedYear === "2024학년도") {
      return {
        spring: {
          major: ["데이터 베이스 설계", "컴퓨터 네트워크", "데이터 베이스 관리", "소프트웨어 공학"],
          nonMajor: ["조직속의 심리학"],
        },
        summer: {
          major: [],
          nonMajor: [],
        },
        fall: {
          major: [],
          nonMajor: [],
        },
        winter: {
          major: [],
          nonMajor: [],
        },
      };
    }
    // 다른 년도의 데이터를 추가하고 싶다면 여기에 작성
    return {
      spring: {
        major: [],
        nonMajor: [],
      },
      summer: {
        major: [],
        nonMajor: [],
      },
      fall: {
        major: [],
        nonMajor: [],
      },
      winter: {
        major: [],
        nonMajor: [],
      },
    };
  };

  const handleQuery = () => {
    const data = getCourseData(); // 선택된 학년도에 따른 데이터를 가져옴
    setCourses(data); // courses 상태를 업데이트하여 화면에 표시

    // 조회 결과에 대한 음성 안내 제공
    if (data && data.spring.major.length > 0 || data.spring.nonMajor.length > 0) {
      const springCourses = `전공: ${data.spring.major.join(", ") || "없음"}, 전공 외: ${data.spring.nonMajor.join(", ") || "없음"}`;
      speak(`${selectedYear} 봄학기 수강 내역. ${springCourses}`);
    }
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

        {/* 컨테이너 */}
        <div className={styles.container}>
          <div className={styles.dropdown}>
            <div className={styles.yearLabel}>
              <label htmlFor="year-select" className={styles.yearLabel}>학년도 선택</label>
            </div>
            <select id="year-select" value={selectedYear} onChange={handleYearChange}>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={2010 + i} value={`${2010 + i}학년도`}>
                  {2010 + i}학년도
                </option>
              ))}
            </select>
            <button onClick={handleQuery}>조회</button> {/* 조회 버튼 클릭 시 handleQuery 호출 */}
          </div>

          {/* 조건부 렌더링: courses가 null이 아닐 때만 렌더링 */}
          {courses && (
            <>
              <div className={styles.semester}>
                <h2>{selectedYear} 봄학기 수강 내역</h2>
                <div className={styles.courses}>
                  <div className={styles.major}>
                    <h3>전공</h3>
                    <ul>
                      {courses.spring.major.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.nonMajor}>
                    <h3>전공 외</h3>
                    <ul>
                      {courses.spring.nonMajor.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={styles.semester}>
                <h2>{selectedYear} 여름 계절학기 수강 내역</h2>
                <div className={styles.courses}>
                  <div className={styles.major}>
                    <h3>전공</h3>
                    <ul>
                      {courses.summer.major.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.nonMajor}>
                    <h3>전공 외</h3>
                    <ul>
                      {courses.summer.nonMajor.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={styles.semester}>
                <h2>{selectedYear} 가을학기 수강 내역</h2>
                <div className={styles.courses}>
                  <div className={styles.major}>
                    <h3>전공</h3>
                    <ul>
                      {courses.fall.major.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.nonMajor}>
                    <h3>전공 외</h3>
                    <ul>
                      {courses.fall.nonMajor.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={styles.semester}>
                <h2>{selectedYear} 겨울 계절학기 수강 내역</h2>
                <div className={styles.courses}>
                  <div className={styles.major}>
                    <h3>전공</h3>
                    <ul>
                      {courses.winter.major.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.nonMajor}>
                    <h3>전공 외</h3>
                    <ul>
                      {courses.winter.nonMajor.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
