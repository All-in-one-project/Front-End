import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DisabledInquiry.module.css';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

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

const DisabledInquiry2 = () => {
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
  const [selectedYearContainer, setSelectedYearContainer] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [lecturePlan, setLecturePlan] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const apiUrl = "http://43.202.223.188:8080"; // 하드코딩된 URL

  useEffect(() => {
    axios.get(`${apiUrl}/api/college`)
      .then(response => {
        setColleges(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the colleges!', error);
      });
  }, []);

  const fetchDepartments = (collegeId) => {
    axios.get(`${apiUrl}/api/departments/${collegeId}`)
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
      });
  };

  const fetchSubjects = (departmentId) => {
    axios.get(`${apiUrl}/api/subjects/${departmentId}`)
      .then(response => {
        setLectures(response.data);
        setFilteredLectures(response.data); // 전체 과목을 초기화
      })
      .catch(error => {
        console.error('There was an error fetching the subjects!', error);
      });
  };

  useEffect(() => {
    if (selectedGridContainer) {
      fetchDepartments(selectedGridContainer);
    }
  }, [selectedGridContainer]);

  useEffect(() => {
    if (selectedDepartmentContainer) {
      fetchSubjects(selectedDepartmentContainer);
    }
  }, [selectedDepartmentContainer]);

  const handleGridContainerClick = (collegeId) => {
    if (selectedGridContainer === collegeId) {
      setSelectedGridContainer('');
      setSelectedDepartmentContainer('');
      setDepartments([]);
      setLectures([]);
      setFilteredLectures([]);
    } else {
      setSelectedGridContainer(collegeId);
      setSelectedDepartmentContainer('');
      setDepartments([]);
      setLectures([]);
      setFilteredLectures([]);
      fetchDepartments(collegeId);
    }
  };

  const handleDepartmentContainerClick = (departmentId) => {
    if (selectedDepartmentContainer === departmentId) {
      setSelectedDepartmentContainer('');
      setLectures([]);
      setFilteredLectures([]);
    } else {
      setSelectedDepartmentContainer(departmentId);
      setSelectedYearContainer('');
      setLectures([]);
      setFilteredLectures([]);
      fetchSubjects(departmentId);
    }
  };

  const handleYearContainerClick = (year) => {
    if (selectedYearContainer === year) {
      setSelectedYearContainer('');
      setFilteredLectures([]); // 선택이 해제되면 필터된 강의 목록을 비웁니다.
    } else {
      setSelectedYearContainer(year);

      const filtered = lectures.filter(lecture => lecture.targetGrade === year);
      setFilteredLectures(filtered); // 해당 학년의 강의만 필터링하여 설정합니다.
    }
  };

  const togglePopup = (type) => {
    setPopupType(type);
    setIsPopupVisible(!isPopupVisible);
  };

  const renderErrorCloseButton = () => (
    <button className={styles.closeBtnmultiple} onClick={() => togglePopup('')}>
      확인 및 다시 선택하기
    </button>
  );

  const renderCloseButton = () => {
    switch (popupType) {
      case 'totalInfo':
        return (
          <button className={styles['close-btn-totalInfo']} onClick={() => togglePopup('')}>
            ✖
          </button>
        );
      case 'moreLectures':
        return (
          <button className={styles['close-btn-moreLectures']} onClick={() => togglePopup('')}>
            ✖
          </button>
        );
      default:
        return (
          <button className={styles['close-btn']} onClick={() => togglePopup('')}>
            X
          </button>
        );
    }
  };

  const fetchLecturePlan = (subjectName) => {
    const lecture = lectures.find(lecture => lecture.subjectName === subjectName);
    
    if (lecture) {
      setLecturePlan(lecture.lectureDescription);
      togglePopup('lecturePlan');
    } else {
      console.error('강의 계획서를 찾을 수 없습니다.');
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    axios.get(`${apiUrl}/subjects/search`, {
      params: { subjectName: searchTerm }
    })
    .then(response => {
      setSearchResults(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the search results!', error);
    });
  };

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
        <button className={styles['plan']} onClick={() => fetchLecturePlan(lecture.id)}>강의 계획서</button>
      </div>
    </div>
  );

  const LectureItem = ({ lecture }) => (
    <div className={styles['lecture-item']}>
      <span className={styles['lecture-name']}>
        {lecture.subjectName} {lecture.hoursPerWeek}
      </span>
      <button className={styles['info-btn']} onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
    </div>
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel(); // 페이지 이동 시 음성 중지
    };

    const handlePageLoad = () => {
      const msg = new SpeechSynthesisUtterance(
        "해당 칸을 클릭 시 로그인 화면이 생성되며 수강 신청 마이페이지를 이용할 수 있게 됩니다. 로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. 시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며 시각장애인 사용자에게도 편리한 화면을 제공합니다."
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

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAccessibilityClick = () => {
    navigate('/login'); 
  };

  const handleLoginClick = () => {
    navigate('/disabled');
  };

  const handleMouseOver = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

  const handlePopupOpen = () => {
    speak("로그인 이용 후 가능합니다");
  };

  const handleLongBoxMouseOver = () => {
    speak("해당 페이지는 과목 조회 페이지입니다. 예비 수강신청 및 일반 수강신청을 희망하는 학생은 위 [수강신청] 카테고리를 이용해 주시기 바랍니다.");
  };

  const handleNavClick = (path) => {
    navigate(path);
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
          <div className={styles.navbar1}>
            <button 
              onClick={() => handleNavClick('/disabled/notice2')} 
              onMouseOver={() => handleMouseOver('공지사항')}
            >
              공지사항
            </button>
            <button 
              className={styles.application} 
              onClick={() => handleNavClick('/disabled/inquiry2')} 
              onMouseOver={() => handleMouseOver('과목조회')}
            >
              과목조회
            </button>
          </div>

          <div className={styles.navbar2}>
            <button 
              onClick={handlePopupOpen}
              onMouseOver={() => handleMouseOver('수강신청')}
            >
              수강신청
            </button>
            <button 
              onClick={handlePopupOpen}
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
                  backgroundColor: selectedYearContainer === year ? '#637ABF' : 'white',
                  color: selectedYearContainer === year ? 'white' : 'rgb(104, 108, 109)',
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

export default DisabledInquiry2;
