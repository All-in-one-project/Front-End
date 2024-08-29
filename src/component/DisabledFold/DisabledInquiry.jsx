import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DisabledInquiry.module.css';
import axios from 'axios';

// 음성 합성 기능을 위한 커스텀 훅
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

const DisabledInquiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('전체 공지사항');
  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 5;
  const { speak, stop } = useSpeechSynthesis();
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [selectedGridContainer, setSelectedGridContainer] = useState('');
  const [selectedDepartmentContainer, setSelectedDepartmentContainer] = useState('');
  const [selectedYearContainer, setSelectedYearContainer] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [lecturePlan, setLecturePlan] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const apiUrl = "http://43.202.223.188:8080"; // 하드코딩된 URL

  // 대학 정보 가져오기
  useEffect(() => {
    axios.get(`${apiUrl}/api/college`)
      .then(response => {
        setColleges(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the colleges!', error);
      });
  }, []);

  // 학과 정보 가져오기
  const fetchDepartments = (collegeId) => {
    axios.get(`${apiUrl}/api/departments/${collegeId}`)
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
      });
  };

  // 과목 정보 가져오기
  const fetchSubjects = (departmentId) => {
    axios.get(`${apiUrl}/api/subjects/${departmentId}`)
      .then(response => {
        setLectures(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the subjects!', error);
      });
  };

    const filterLecturesByGrade = (grades) => {
    const filtered = lectures.filter(lecture => grades.includes(lecture.targetGrade));
    setFilteredLectures(filtered);
  };

  // 대학 선택 시 학과 가져오기
  useEffect(() => {
    if (selectedGridContainer) {
      fetchDepartments(selectedGridContainer);
    }
  }, [selectedGridContainer]);

  // 학과 선택 시 과목 가져오기
  useEffect(() => {
    if (selectedDepartmentContainer) {
      fetchSubjects(selectedDepartmentContainer);
    }
  }, [selectedDepartmentContainer]);

  // 로그아웃 처리
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('토큰이 존재하지 않습니다.');
      navigate('/'); // 토큰이 없으면 바로 로그인 페이지로
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/logout`, { token });
      
      if (response.status === 200) {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        navigate('/'); // 로그아웃 후 메인 페이지나 로그인 페이지로 이동
      } else {
        console.error('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('서버와의 통신에 실패했습니다:', error);
    }
  };

  // 대학 선택 처리
  const handleGridContainerClick = (collegeId) => {
    if (selectedGridContainer === collegeId) {
      setSelectedGridContainer('');
      setSelectedDepartmentContainer('');
      setDepartments([]);
      setLectures([]);
      setFilteredLectures([]);
    } else {
      if (selectedGridContainer) {
        setPopupMessage(
          <div>
            해당 항목은 복수 선택이 불가능합니다!
            <br />
            <span style={{ fontWeight: 'normal' }}>
              (단과대 및 학과/학부 복수 선택 불가능)
            </span>
          </div>
        );
        togglePopup('error');
      } else {
        setSelectedGridContainer(collegeId);
        setSelectedDepartmentContainer('');
        setDepartments([]);
        setLectures([]);
        setFilteredLectures([]);
        fetchDepartments(collegeId);
      }
    }
  };

  // 학과 선택 처리
  const handleDepartmentContainerClick = (departmentId) => {
    if (selectedDepartmentContainer === departmentId) {
      setSelectedDepartmentContainer('');
      setLectures([]);
      setFilteredLectures([]);
    } else {
      if (selectedDepartmentContainer) {
        setPopupMessage(
          <div>
            해당 항목은 복수 선택이 불가능합니다!
            <br />
            <span style={{ fontWeight: 'normal' }}>
              (단과대 및 학과/학부 복수 선택 불가능)
            </span>
          </div>
        );
        togglePopup('error');
      } else {
        setSelectedDepartmentContainer(departmentId);
        setSelectedYearContainer([]);
        setLectures([]);
        setFilteredLectures([]);
        fetchSubjects(departmentId);
      }
    }
  };

  // 학년 선택 처리
  const handleYearContainerClick = (year) => {
    if (selectedYearContainer.includes(year)) {
      setSelectedYearContainer(selectedYearContainer.filter(item => item !== year));
    } else if (selectedYearContainer.length < 4) {
      setSelectedYearContainer([...selectedYearContainer, year]);
    } else {
      alert('학년은 4개까지 선택할 수 있습니다.');
    }
    filterLecturesByGrade([year]);
  };

  // 팝업 토글
  const togglePopup = (type) => {
    setPopupType(type);
    setIsPopupVisible(!isPopupVisible);
  };

  // 페이지 로드 시 음성 안내
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel(); // 페이지 이동 시 음성 중지
    };

    const handlePageLoad = () => {
      speak("로그아웃과 동시에 비장애인 화면으로 화면이 초기화됩니다. 로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. 시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며 시각장애인 사용자에게도 편리한 화면을 제공합니다.");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    handlePageLoad();

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.speechSynthesis.cancel(); // 컴포넌트 언마운트 시 음성 중지
    };
  }, [location.pathname]);

  // 네비게이션 클릭 처리
  const handleNavClick = (path) => {
    navigate(path);
  };

  // 서브 네비게이션 클릭 처리
  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '전체 공지사항') {
      navigate('/disablednotice');
    } else if (subNav === 'FAQ') {
      navigate('/disabledfaq');
    }
  };

  // 페이지 클릭 처리
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 접근성 정보 클릭 처리
  const handleAccessibilityClick = () => {
    navigate('/disabled'); 
  };

  // 로그인 클릭 처리
  const handleLoginClick = () => {
    navigate('/login');
  };

  // 마우스 오버 시 음성 안내 제공
  const handleMouseOver = (text) => {
    speak(text);
  };

  // 긴 박스 마우스 오버 시 음성 안내 제공
  const handleLongBoxMouseOver = () => {
    speak("해당 페이지는 과목 조회 페이지입니다. 예비 수강신청 및 일반 수강신청을 희망하는 학생은 위 [수강신청] 카테고리를 이용해 주시기 바랍니다.");
  };

  // 메인 강의 아이템 컴포넌트
  const MainLectureItem = ({ lecture }) => (
    <div className={styles['lecture-box']}>
      <div className={styles['top-row']}>
        <div>{lecture.id}</div>
        <div className={styles['category']}>{lecture.subjectDivision}</div>
      </div>
      <div className={styles['name']}>
        {lecture.subjectName} {lecture.hoursPerWeek}
      </div>
      <div className={styles['buttons']}>
        <button className={styles['plan']} >강의 계획서</button>
      </div>
    </div>
  );

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
              onClick={() => handleNavClick('/disabled/notice')} 
              onMouseOver={() => handleMouseOver('공지사항')}
            >
              공지사항
            </button>
            <button 
              className={styles.application} 
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

        <div className={styles['sub-navbar']}>
          <div 
            className={styles['long-box']}
            onMouseOver={handleLongBoxMouseOver}
          >
            <div>해당 페이지는 과목 조회 페이지입니다.</div>
            예비 수강신청 및 일반 수강신청을 희망하는 학생은 위 <span className={styles['bold']}>[수강신청]</span> 카테고리를 이용해 주시기 바랍니다.
          </div>
        </div>

        <div className={styles['section']}>
          <div className={styles['section-title1']}>단과대 선택</div>
          <div className={styles['grid-container']}>
            {colleges.map((college) => (
              <div
                key={college.id}
                onClick={() => handleGridContainerClick(college.id)}
                style={{
                  backgroundColor: selectedGridContainer === college.id ? '#637ABF' : 'white',
                  color: selectedGridContainer === college.id ? 'white' : 'rgb(104, 108, 109)',
                }}
              >
                {college.collegeName}
              </div>
            ))}
          </div>
        </div>

        <div className={styles['section']}>
          <div className={styles['section-title2']}>학부 및 학과 선택</div>
          <div className={styles['department-container']}>
            {departments.map((department) => (
              <div
                key={department.id}
                onClick={() => handleDepartmentContainerClick(department.id)}
                style={{
                  backgroundColor: selectedDepartmentContainer === department.id ? '#637ABF' : 'white',
                  color: selectedDepartmentContainer === department.id ? 'white' : 'rgb(104, 108, 109)',
                }}
              >
                {department.departmentName}
              </div>
            ))}
          </div>
        </div>

        <div className={styles['section']}>
          <div className={styles['section-title']}>학년 선택</div>
          <div className={styles['year-container']}>
            {['1학년', '2학년', '3학년', '4학년'].map((year) => (
              <div
                key={year}
                onClick={() => handleYearContainerClick(year)}
                style={{
                  backgroundColor: selectedYearContainer.includes(year) ? '#637ABF' : 'white',
                  color: selectedYearContainer.includes(year) ? 'white' : 'rgb(104, 108, 109)',
                }}
              >
                {year}
              </div>
            ))}
          </div>
        </div>

        <div><div style={{ width: '700px', height: '0.5px', backgroundColor: 'gray', marginTop: '4px' }} /></div>
        <div className={styles['section']}>
          <div className={styles['lecture-container']}>
            {filteredLectures.map((lecture, index) => (
              <MainLectureItem key={index} lecture={lecture} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisabledInquiry;
