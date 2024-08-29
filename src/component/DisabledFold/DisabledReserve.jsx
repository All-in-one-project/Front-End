import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate,useLocation } from 'react-router-dom';
import styles from './DisabledReserve.module.css';
import DisabledReserveWating from './DisabledReserveWating'; // 대기 화면 컴포넌트s
import ReserveDelete from '../ReserveFold/ReserveDelete'; // 삭제 확인 화면 컴포넌트
import ReserveClassInputAgain from '../ReserveFold/ReserveClassInputAgain'; // 과목 코드 입력 오류 확인 화면 컴포넌트

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


function DisabledReserve() {
  const [lectures, setLectures] = useState([]);
  const lecturelist = [
    { id: 1, name: "20세기 한국사", hours: "(월4,5)", lecture: "21032-001" },
    { id: 2, name: "경제학 입문", hours: "(화3,4)", lecture: "21032-002" },
    { id: 3, name: "프로그래밍 기초", hours: "(수1,2)", lecture: "21032-003" },
    { id: 4, name: "심리학 개론", hours: "(목2,3)", lecture: "21032-004" },
  ];
  const [lectureList, setLectureList] = useState(lecturelist);
  const [subjectCode, setSubjectCode] = useState('');
  const [divisionCode, setDivisionCode] = useState('');
  const [selectedSubNav, setSelectedSubNav] = useState('');
  const [selectedGridContainer, setSelectedGridContainer] = useState('');
  const [selectedDepartmentContainer, setSelectedDepartmentContainer] = useState('');
  const [selectedYearContainer, setSelectedYearContainer] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLectures, setSidebarLectures] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [lecturePlan, setLecturePlan] = useState('');
  const location = useLocation();
  const [popupMessage, setPopupMessage] = useState('');
  const [appliedLectures, setAppliedLectures] = useState([]);
  const [schedule, setSchedule] = useState(Array(5).fill(null).map(() => Array(9).fill(null)));
  const [sidebarTitle, setSidebarTitle] = useState('예비수강신청');
  const [isWaiting, setIsWaiting] = useState(false); // 대기 상태를 관리하는 state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 화면 제어
  const [lectureToRemove, setLectureToRemove] = useState(null); // 삭제할 강의 정보
  const [showInputError, setShowInputError] = useState(false); // 과목 코드 오류 화면 제어
    const { speak } = useSpeechSynthesis();
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
  };
  // 단과대 선택 시 음성 제공
  const handleMouseOverButton = (text) => {
    speak(`${text} 선택`);
  };

    // 강의 목록에서 "장바구니" 또는 "강의계획서" 버튼에 마우스를 올렸을 때 음성 제공
  const handleMouseOverLectureButton = (lectureName, buttonText) => {
    speak(`${lectureName} ${buttonText === '장바구니' ? '장바구니에 넣겠습니까?' : '강의계획서'}`);
  };

  useEffect(() => {
    if (selectedGridContainer && selectedDepartmentContainer && selectedYearContainer.length > 0) {
      console.log('Selected Grid:', selectedGridContainer);
      console.log('Selected Department:', selectedDepartmentContainer);
      console.log('Selected Year:', selectedYearContainer);
    }
  }, [selectedGridContainer, selectedDepartmentContainer, selectedYearContainer]);

  const handleSubjectCodeChange = (e) => setSubjectCode(e.target.value);
  const handleDivisionCodeChange = (e) => setDivisionCode(e.target.value);

  const handleAddToCart = (lecture) => {
    const isAlreadyInCart = sidebarLectures.some(item => item.id === lecture.id);

    if (!isAlreadyInCart) {
      setSidebarLectures([...sidebarLectures, lecture]);
    } else {
      alert('이미 장바구니에 담긴 과목입니다.');
    }
  };

  const handleRemoveLectureFromSidebar = (id) => {
    const lecture = sidebarLectures.find((lecture) => lecture.id === id);

    if (selectedSubNav === '예비수강신청') {
      // 예비수강신청일 때는 바로 삭제 처리
      setSidebarLectures(sidebarLectures.filter((lecture) => lecture.id !== id));
      removeLectureFromSchedule(lecture);
    } else {
      // 일반수강신청일 때는 삭제 확인 화면 표시
      setLectureToRemove(lecture);
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    setSidebarLectures(sidebarLectures.filter((lecture) => lecture.id !== lectureToRemove.id));
    removeLectureFromSchedule(lectureToRemove);
    setShowDeleteConfirm(false); // 삭제 확인 화면 숨김
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false); // 삭제 확인 화면 숨김
  };

  const removeLectureFromSchedule = (lecture) => {
    const timeMapping = {
      '월': 0,
      '화': 1,
      '수': 2,
      '목': 3,
      '금': 4,
    };

    const days = lecture.time.match(/(월|화|수|목|금)/g);
    const times = lecture.time.match(/\d/g).map(Number);

    const newSchedule = [...schedule];

    days.forEach(day => {
      times.forEach(time => {
        newSchedule[timeMapping[day]][time - 1] = null;
      });
    });

    setSchedule(newSchedule);
    setAppliedLectures(appliedLectures.filter((appliedLecture) => appliedLecture.id !== lecture.id));
  };

  const handleApplyLecture = (lecture) => {
    const isAlreadyApplied = appliedLectures.some(appliedLecture => appliedLecture.id === lecture.id);

    if (isAlreadyApplied) {
      alert('이미 신청된 과목입니다.');
      return;
    }

    if (appliedLectures.length < 7) {
      // 신청 후 대기 화면으로 전환
      setIsWaiting(true);
      setTimeout(() => {
        setIsWaiting(false); // 대기 화면에서 돌아온 후

        // 신청 처리
        setAppliedLectures([...appliedLectures, lecture]);
        updateSchedule(lecture);
      }, 5000); // 5초 후에 다시 돌아옴
    } else {
      alert('최대 21학점까지만 신청할 수 있습니다.');
    }
  };

  const updateSchedule = (lecture) => {
    const timeMapping = {
      '월': 0,
      '화': 1,
      '수': 2,
      '목': 3,
      '금': 4,
    };

    const days = lecture.time.match(/(월|화|수|목|금)/g);
    const times = lecture.time.match(/\d/g).map(Number);

    const newSchedule = [...schedule];

    days.forEach(day => {
      times.forEach(time => {
        newSchedule[timeMapping[day]][time - 1] = '#637ABF';
      });
    });

    setSchedule(newSchedule);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSubNavClick = (event) => {
    setSelectedSubNav(event.target.innerText);
  };

  const handleGridContainerClick = (container) => {
    if (selectedGridContainer === container) {
      setSelectedGridContainer('');
      setSelectedDepartmentContainer('');
      setDepartmentList([]);
    } else if (selectedGridContainer === '') {
      setSelectedGridContainer(container);
      setDepartmentList(departmentMapping[container]);
    } else {
      setPopupMessage(
        <div>
          해당 항목은 복수 선택이 불가능합니다!
          <br />
          <span style={{ fontWeight: 'normal' }}>
            (단과대 및 학과/학부 복수 선택 불가)
          </span>
        </div>
      );
      togglePopup('error');
    }
  };

  const handleDepartmentContainerClick = (container) => {
    if (selectedDepartmentContainer === container) {
      setSelectedDepartmentContainer('');
    } else if (selectedDepartmentContainer === '') {
      setSelectedDepartmentContainer(container);
    } else {
      setPopupMessage(
        <div>
          해당 항목은 복수 선택이 불가능합니다!
          <br />
          <span style={{ fontWeight: 'normal' }}>
            (단과대 및 학과/학부 복수 선택 불가)
          </span>
        </div>
      );
      togglePopup('error');
    }
  };

  const handleYearContainerClick = (container) => {
    if (selectedYearContainer.includes(container)) {
      setSelectedYearContainer(selectedYearContainer.filter(item => item !== container));
    } else if (selectedYearContainer.length < 4) {
      setSelectedYearContainer([...selectedYearContainer, container]);
    } else {
      setPopupMessage('학년은 4개까지 선택할 수 있습니다.');
      togglePopup('error');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);

    // selectedSubNav에 따라 sidebarTitle을 변경합니다.
    if (selectedSubNav === '예비수강신청') {
      setSidebarTitle('예비수강신청');
    } else if (selectedSubNav === '일반수강신청') {
      setSidebarTitle('일반수강신청');
    }
  };

  const togglePopup = (type) => {
    setPopupType(type);
    setIsPopupVisible(!isPopupVisible);
  };

  const renderCloseButton = () => {
    return (
      <button className={styles.closeBtn} onClick={() => togglePopup('')}>
        ✖
      </button>
    );
  };

  const renderErrorCloseButton = () => {
    return (
      <button className={styles.colseBtnmultiple} onClick={() => togglePopup('')}>
        확인 및 다시 선택하기
      </button>
    );
  };

  const fetchLectures = (collegeId, departmentId, gradeId) => {
    const exampleLectures = [
      {
        id: '21032-001',
        category: '[전핵]',
        name: '컴퓨터 네트워크',
        professor: '김철수',
        time: '월 1,2,3',
      },
      {
        id: '21032-002',
        category: '[전선]',
        name: '자바',
        professor: '유정',
        time: '월 5,6,7,8',
      },
      {
        id: '20930-001',
        category: '[전선]',
        name: '웹 프로그래밍',
        professor: '민경식',
        time: '수 2,3,4',
      },
      {
        id: '20931-012',
        category: '[전선]',
        name: '소프트웨어 공학',
        professor: '최지우',
        time: '목 6,7,8',
      },
      {
        id: '21032-003',
        category: '[전핵]',
        name: '캡스톤 디자인 1',
        professor: '김철수',
        time: '수 5,6,7',
      },
      {
        id: '21032-004',
        category: '[전선]',
        name: '인공지능',
        professor: '김철수',
        time: '금 2,3,4',
      },
      {
        id: '21032-005',
        category: '[전교]',
        name: '확률과 통계',
        professor: '김철수',
        time: '화 1,2,3',
      },
      {
        id: '21032-006',
        category: '[전선]',
        name: '데이터 베이스 관리',
        professor: '김철수',
        time: '목 1,2,3',
      },
    ];
    setLectures(exampleLectures);
  };

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

  useEffect(() => {
    if (selectedGridContainer && selectedDepartmentContainer && selectedYearContainer.length > 0) {
      const collegeId = Object.keys(departmentMapping).indexOf(selectedGridContainer) + 1;
      const departmentId = departmentMapping[selectedGridContainer].indexOf(selectedDepartmentContainer) + 1;
      const gradeId = parseInt(selectedYearContainer[0][0], 10);
      fetchLectures(collegeId, departmentId, gradeId);
    }
  }, [selectedGridContainer, selectedDepartmentContainer, selectedYearContainer]);

  const departmentMapping = {
    'ICT융합과학대학': ['컴퓨터공학부', '데이터과학부', '정보통신학부'],
    '건강과학대학': ['간호학부', '물리치료학부', '임상병리학부'],
    '음악대학': ['성악과', '기악과', '작곡과'],
    '법학대학': ['법학부'],
    '자연과학대학': ['수학부', '화학부', '물리학부'],
    '공과대학': ['기계공학부', '전기전자공학부', '화학공학부'],
    '인문사회대학': ['사회복지학부', '심리학부', '국문학부'],
    '미술대학': ['회화과', '조소과', '디자인과'],
    '체육대학': ['체육학부', '스포츠과학부', '무용과'],
    '교양대학': ['교양학부']
  };

  const [departmentList, setDepartmentList] = useState(departmentMapping['ICT융합과학대학']);

  const fetchLecturePlan = (lectureId) => {
    const lecturePlans = {
      '21032-001': 'This is the lecture plan for 컴퓨터 네트워크.',
      '21032-002': 'This is the lecture plan for 자바.',
      '21032-003': 'This is the lecture plan for 웹 프로그래밍.',
      '21032-004': 'This is the lecture plan for 소프트웨어 공학.',
    };

    setLecturePlan(lecturePlans[lectureId] || '해당 강의의 계획서를 찾을 수 없습니다.');
    togglePopup('lecturePlan');
  };

  const handleSubjectCodeInput = () => {
    const foundLecture = lectureList.find((lecture) => lecture.lecture === subjectCode);

    if (foundLecture) {
      handleAddToCart(foundLecture);
    } else {
      setShowInputError(true); // 과목 코드 오류 화면 표시
    }
  };

  const handleConfirmInputError = () => {
    setShowInputError(false); // 오류 화면 숨김
  };

 const MainLectureItem = ({ lecture }) => {
  const { speak } = useSpeechSynthesis();

  const handleMouseOverLectureButton = (lectureName, buttonText) => {
    speak(`${lectureName} ${buttonText === '장바구니' ? '장바구니에 넣겠습니까?' : '강의계획서'}`);
  };

  return (
    <div className={styles.lectureBox}>
      <div className={styles.topRow}>
        <div>{lecture.id}</div>
        <div className={styles.category}>{lecture.category}</div>
      </div>
      <div className={styles.name}>{lecture.name}</div>
      <div className={styles.time}>교수 {lecture.professor} | {lecture.time}</div>
      <div className={styles.buttons}>
        <button 
          className={styles.basket} 
          onClick={() => handleAddToCart(lecture)}
          onMouseOver={() => handleMouseOverLectureButton(lecture.name, '장바구니')} // 마우스 오버 시 음성 안내
        >
          장바구니
        </button>
        <button 
          className={styles.plan} 
          onClick={() => fetchLecturePlan(lecture.id)}
          onMouseOver={() => handleMouseOverLectureButton(lecture.name, '강의계획서')} // 마우스 오버 시 음성 안내
        >
          강의 계획서
        </button>
      </div>
    </div>
  );
};

  const LectureItem = ({ lecture }) => (
    <div className={styles.lectureItem}>
      <span className={styles.lectureName}>{lecture.name} {lecture.hours}</span>
      <button className={styles.infoBtn} onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
      <button className={styles.applyBtn} onClick={() => handleAddToCart(lecture)}>추가</button>
    </div>
  );

  const PopupLectureItem = ({ lecture }) => (
    <div className={styles.lectureItem}>
      <span className={styles.lectureName}>{lecture.name}</span>
      <button className={styles.infoBtn} onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
      <button className={styles.applyBtn} onClick={() => handleAddToCart(lecture)}>추가</button>
    </div>
  );

  const additionalLectures = [
    { id: 5, name: "철학 개론 (금1,2)" },
    { id: 6, name: "미적분학 (월1,2)" },
    { id: 7, name: "물리학 (화2,3)" },
    { id: 8, name: "화학 (수3,4)" },
    { id: 9, name: "생물학 (목4,5)" },
    { id: 10, name: "통계학 (금3,4)" },
  ];

  // 대기 중이면 ReserveWating 컴포넌트를 렌더링
  if (isWaiting) {
    return <DisabledReserveWating />;
  }

  // 삭제 확인 화면을 보여줍니다.
  if (showDeleteConfirm && lectureToRemove) {
    return (
      <ReserveDelete
        lecture={lectureToRemove}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    );
  }

  // 과목 코드 오류 화면을 보여줍니다.
  if (showInputError) {
    return (
      <ReserveClassInputAgain
        onConfirm={handleConfirmInputError}
      />
    );
  }
  const handleAccessibilityClick = () => {
    navigate('/disabled'); 
  };

    const handleMouseOver = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

 // 강의 줄에 마우스를 올렸을 때 음성 안내 제공
const handleMouseOverLectureRow = (lectureName) => {
  speak(`${lectureName} 신청 하시겠습니까?`);
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
            onClick={handleAccessibilityClick} 
            onMouseOver={handleMouseOver}
        >
            <div>선택 화면으로</div>
            <h4>돌아가기</h4>
        </div>


        <div className={styles.accessibilityInfoBox} onClick={handleLogout}>
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
          <button onClick={() => handleNavClick('/disabled/notice2')}>공지사항</button>
          <button onClick={() => handleNavClick('/disabled/inquiry2')}>과목조회</button>
          <button className={styles.application}>수강신청</button>
          <button onClick={() => handleNavClick('/disabled/mypage')}>마이페이지</button>
        </div>

        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '예비수강신청' ? styles.selected : ''}`}
            onClick={handleSubNavClick}
          >
            예비수강신청
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '일반수강신청' ? styles.selected : ''}`}
            onClick={handleSubNavClick}
          >
            일반수강신청
          </button>
        </div>

        {selectedSubNav === '예비수강신청' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>단과대 선택</div>
              <div className={styles.gridContainer}>
                {['ICT융합과학대학', '건강과학대학', '음악대학', '법학대학', '자연과학대학', '공과대학', '인문사회대학', '미술대학', '체육대학', '교양대학'].map((name) => (
                  <div
                    key={name}
                    onClick={() => handleGridContainerClick(name)}
                    onMouseOver={() => handleMouseOverButton(name)} // 마우스 오버 시 음성 제공
                    style={{
                      backgroundColor: selectedGridContainer === name ? '#637ABF' : 'white',
                      color: selectedGridContainer === name ? 'white' : 'rgb(104, 108, 109)',
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>학부 및 학과 선택</div>
              <div className={styles.departmentContainer}>
                {departmentList.map((name) => (
                  <div
                    key={name}
                     onMouseOver={() => handleMouseOverButton(name)}
                    onClick={() => handleDepartmentContainerClick(name)}
                    style={{
                      backgroundColor: selectedDepartmentContainer === name ? '#637ABF' : 'white',
                      color: selectedDepartmentContainer === name ? 'white' : 'rgb(104, 108, 109)',
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>학년 선택</div>
              <div className={styles.yearContainer}>
                {['1학년', '2학년', '3학년', '4학년'].map((year) => (
                  <div
                    key={year}
                     onMouseOver={() => handleMouseOverButton(year)}
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

            <div className={styles.section}>
              <div className={styles.lectureContainer}>
                {lectures.map((lecture, index) => (
                  <MainLectureItem key={index} lecture={lecture} />
                ))}
              </div>
            </div>
          </>
        )}

        {selectedSubNav === '일반수강신청' && (
          <>
            <div className={styles.generalApply}>
              <div className={styles.cartList}>
                <h3>장바구니 신청 내역</h3>
                <table style={{ backgroundColor: 'white', borderCollapse: 'collapse', width: '100%' }}>
                  <thead >
                    <tr >
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', width: '40px', height: '30px', backgroundColor: 'white' }}>No</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>과목명</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>분류</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>교수명</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>강의 정보</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>신청 여부</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>과목 코드</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sidebarLectures.map((lecture, index) => (
                      <tr 
                        key={index} 
                        style={{ backgroundColor: 'white' }}
                        onMouseOver={() => handleMouseOverLectureRow(lecture.name)}  // 마우스 오버 시 음성 안내
                        onClick={() => handleApplyLecture(lecture)}  // 클릭 시 신청 기능
                      >
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '80px' }}>
                          {index + 1}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', fontSize: '30px' }}>
                          {lecture.name}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px', fontSize: '30px' }}>
                          {lecture.category.replace(/[\[\]]/g, '')}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px', fontSize: '30px' }}>
                          {lecture.professor}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px', fontSize: '30px' }}>
                          {lecture.time}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px', fontSize: '30px' }}>
                          <button
                            onClick={() => handleApplyLecture(lecture)}
                            style={{
                              backgroundColor: appliedLectures.includes(lecture) ? '#637ABF' : 'rgb(212, 216, 243)',
                              color: appliedLectures.includes(lecture) ? 'white' : 'black',
                              border: 'none',
                              fontWeight: '700',
                              fontSize: '30px',
                              padding: '2px 5px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              width: '60px',
                              textAlign: 'center',
                              height: '100px'
                            }}
                          >
                            {appliedLectures.includes(lecture) ? '완료' : '신청'}
                          </button>
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>
                          {lecture.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>    
            </div>
          </>
        )}
      </div>
      </div>


  );
}

export default DisabledReserve;
