//로그인 하지 않은 시각장애인_과목조회화면

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
  const [selectedYearContainer, setSelectedYearContainer] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [lecturePlan, setLecturePlan] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [lectureList, setLectureList] = useState([
    { id: 1, subjectName: "20세기 한국사", hoursPerWeek: "(월4,5)" },
    { id: 2, subjectName: "경제학 입문", hoursPerWeek: "(화3,4)" },
    { id: 3, subjectName: "프로그래밍 기초", hoursPerWeek: "(수1,2)" },
    { id: 4, subjectName: "심리학 개론", hoursPerWeek: "(목2,3)" },
  ]);

  const additionalLectures = [
    { id: 5, subjectName: "철학 개론", hoursPerWeek: "(금1,2)" },
    { id: 6, subjectName: "미적분학", hoursPerWeek: "(월1,2)" },
    { id: 7, subjectName: "물리학", hoursPerWeek: "(화2,3)" },
    { id: 8, subjectName: "화학", hoursPerWeek: "(수3,4)" },
    { id: 9, subjectName: "생물학", hoursPerWeek: "(목4,5)" },
    { id: 10, subjectName: "통계학", hoursPerWeek: "(금3,4)" },
  ];


const apiUrl = "http://43.202.223.188:8080"; // 하드코딩된 URL

  useEffect(() => {
    console.log('Fetching colleges');
    axios.get(`${apiUrl}/api/college`)
      .then(response => {
        console.log('Received response:', response); // 응답 전체 확인
        setColleges(response.data);
        console.log('Fetched Colleges:', response.data); // 데이터가 설정되었는지 확인
      })
      .catch(error => {
        console.error('There was an error fetching the colleges!', error); // 에러 메시지 확인
      });
  }, []);



const fetchDepartments = (collegeId) => {
  console.log(`Fetching departments for collegeId: ${collegeId}`);
  axios.get(`${apiUrl}/api/departments/${collegeId}`)
    .then(response => {
      setDepartments(response.data);
      console.log('Fetched Departments:', response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the departments!', error);
    });
};
const fetchSubjects = (departmentId) => {
  console.log(`Fetching subjects for departmentId: ${departmentId}`);
  axios.get(`${apiUrl}/api/subjects/${departmentId}`)
    .then(response => {
      setLectures(response.data);
      console.log('Fetched Subjects:', response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the subjects!', error);
    });
};


useEffect(() => {
  if (selectedGridContainer) {
    console.log('Fetching departments for selected college:', selectedGridContainer);
    fetchDepartments(selectedGridContainer);
  }
}, [selectedGridContainer]);

useEffect(() => {
  if (selectedDepartmentContainer) {
    console.log('Fetching subjects for selected department:', selectedDepartmentContainer);
    fetchSubjects(selectedDepartmentContainer);
  }
}, [selectedDepartmentContainer]);



  const handleNavClick = (path) => {
    navigate(path);
  };

  /*로그아웃 API*/
  /*일단은 로그아웃 누르면 원래 화면 path:'' 인 곳에 이동함*/
 const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('토큰이 존재하지 않습니다.');
      navigate('/'); // 토큰이 없으면 바로 로그인 페이지로
      return;
    }

    try {
      const response = await axios.post('http://43.202.223.188:8080/api/logout', { token });
      
      if (response.status === 200) {
        console.log(response.data.message); // "Logout successful"
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        navigate('/'); // 로그아웃 후 메인 페이지나 로그인 페이지로 이동
      } else {
        console.error('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('서버와의 통신에 실패했습니다:', error);
    }
  };

  const handleGridContainerClick = (collegeId) => {
  console.log('College clicked:', collegeId); // 추가된 로그
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
      console.log('Selected College:', collegeId); 
      setFilteredLectures([]);
      fetchDepartments(collegeId);
    }
  }
};

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
         console.log('Selected Department:', departmentId); 
        fetchSubjects(departmentId);
      }
    }
  };

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

  const togglePopup = (type) => {
    setPopupType(type);
    setIsPopupVisible(!isPopupVisible);
  };

  const renderErrorCloseButton = () => {
    return (
      <button className={styles.closeBtnmultiple} onClick={() => togglePopup('')}>
        확인 및 다시 선택하기
      </button>
    );
  };

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

  const filterLecturesByGrade = (grades) => {
    const filtered = lectures.filter(lecture => grades.includes(lecture.targetGrade));
    setFilteredLectures(filtered);
  };

  const fetchLecturePlan = (id) => {
    const lecture = filteredLectures.find(lecture => lecture.id === id);
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
    axios.get('http://43.202.223.188:8080/subjects/search', {
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
       "해당 칸을 클릭 시 로그인 화면이 생성되며 수강 신청 마이페이지를 이용할 수 있게 됩니다 . 로그인하지 않은 경우 공지사항과 과목조회만 이용 가능한 점 양해 바랍니다. 시각장애인 배려용 화면에서는 모든 화면과 기능을 음성으로 제공하며 시각장애인 사용자에게도 편리한 화면을 제공합니다."

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
          <div className={styles['section-title1']}>  단과대 선택</div>
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

export default DisabledInquiry2;
