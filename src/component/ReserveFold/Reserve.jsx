import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './Reserve.module.css'; 
import { useNavigate } from 'react-router-dom';

function Reserve() {  
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
  const [popupMessage, setPopupMessage] = useState(''); 
  const [appliedLectures, setAppliedLectures] = useState([]); 
  const [schedule, setSchedule] = useState(Array(5).fill(null).map(() => Array(5).fill(null))); 

  const navigate = useNavigate(); 

  const handleNavClick = (path) => {
    navigate(path);
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
    // Check if the lecture is already in the cart
    const isAlreadyInCart = sidebarLectures.some(item => item.id === lecture.id);

    // If it's not in the cart, add it
    if (!isAlreadyInCart) {
      setSidebarLectures([...sidebarLectures, lecture]);
    } else {
      alert('이미 장바구니에 담긴 과목입니다.');
    }
  };

  const handleRemoveLectureFromSidebar = (id) => {
    const lectureToRemove = sidebarLectures.find((lecture) => lecture.id === id);

    // Remove the lecture from the sidebar
    setSidebarLectures(sidebarLectures.filter((lecture) => lecture.id !== id));

    // Update the schedule to remove the lecture
    if (lectureToRemove) {
      removeLectureFromSchedule(lectureToRemove);
    }
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

    // Remove the lecture from applied lectures list
    setAppliedLectures(appliedLectures.filter((appliedLecture) => appliedLecture.id !== lecture.id));
  };

  const handleApplyLecture = (lecture) => {
    if (appliedLectures.length < 21) {
      setAppliedLectures([...appliedLectures, lecture]);
      updateSchedule(lecture);
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
        <br/>
        <span style={{ fontWeight: 'normal' }}>
          (단과대 및 학과/학부 복수 선택 불가능)
        </span>
      </div>);
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
        <br/>
        <span style={{ fontWeight: 'normal' }}>
          (단과대 및 학과/학부 복수 선택 불가)
        </span>
      </div>);
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

  const MainLectureItem = ({ lecture }) => (
    <div className={styles.lectureBox}>
      <div className={styles.topRow}>
        <div>{lecture.id}</div>
        <div className={styles.category}>{lecture.category}</div> 
      </div>
      <div className={styles.name}>{lecture.name}</div> 
      <div className={styles.time}>교수 {lecture.professor} | {lecture.time}</div> 
      <div className={styles.buttons}>
        <button className={styles.basket} onClick={() => handleAddToCart(lecture)}>장바구니</button>
        <button className={styles.plan} onClick={() => fetchLecturePlan(lecture.id)}>강의 계획서</button> 
      </div>
    </div>
  );

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

  return (
    <div className={styles.body}>
      <div className={styles.leftBar}>
        <div className={styles.title}>
          <h3>한국대학교
            <div>수강신청</div></h3>
        </div>
        <div className={styles.userInfo}>
          <div>이름 홍길동</div>
          <div>학번 12345678</div>
          <h4>학과 (부전공)</h4>
          <div>컴퓨터공학과</div>
          <div>(없음)</div>
        </div>

        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className={styles.creditsInfo}>
          <h4>학점 정보 (부전공)</h4>
          <div>총합 /130</div>
          <div>전핵 /24</div>
          <div>전선 /48</div>
          <div>전교 /9</div>
          <div>전취 /3</div>
        </div>

        <div className={styles.toggleBtn}>
          <button onClick={() => togglePopup('totalInfo')}>+</button>전체 정보 보기
        </div>
        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className={styles.logoutBtn}>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <button onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button className={styles.application}>수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
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
            <div><div style={{ width: '700px', height: '0.5px', backgroundColor: 'gray', marginTop:'4px'}} /></div> 

            <div className={styles.section}>
              <div className={styles.lectureContainer}>
                {lectures.map((lecture, index) => (
                  <MainLectureItem key={index} lecture={lecture} />
                ))}
              </div>
            </div>

            {!isSidebarOpen && (
              <button className={styles.circleButton} onClick={toggleSidebar}>
                +
              </button>
            )}
            <div className={`${styles.rightBar} ${isSidebarOpen ? styles.open : ''}`}>
              <button className={styles.closeSidebarButton} onClick={toggleSidebar}>
                  ㅡ
              </button>
              <div className={styles.sidebarContent}>
                  <div className={styles.sidebarSection}>
                  <div className={styles.basketTitle}>예비수강신청 내역</div>
                  {sidebarLectures.map((lecture, index) => (
                      <div key={index} className={styles.lectureBox}>
                      <div className={styles.name}>{lecture.name}</div> 
                      <div className={styles.topRow}>
                          <div>{lecture.id} {lecture.category}</div>
                      </div>
                      <div className={styles.buttons}>
                          <button className={styles.remove} onClick={() => handleRemoveLectureFromSidebar(lecture.id)}>X</button>
                      </div>
                      </div>
                  ))}
                  </div>
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
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', width: '40px', height: '30px' ,backgroundColor:'white'}}>No</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' ,backgroundColor:'white' }}>과목명</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' ,backgroundColor:'white'}}>분류</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' ,backgroundColor:'white' }}>교수명</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' ,backgroundColor:'white' }}>강의 정보</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' ,backgroundColor:'white' }}>신청 여부</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' ,backgroundColor:'white' }}>과목 코드</th>
          </tr>
        </thead>

        <tbody>
          {sidebarLectures.map((lecture, index) => (
            <tr key={index} style={{ backgroundColor: 'white' }}>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left', verticalAlign: 'middle', fontWeight: 'bold', height: '30px' }}>{lecture.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>{lecture.category.replace(/[\[\]]/g, '')}</td>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>{lecture.professor}</td>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>{lecture.time}</td>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>
                <button 
                  onClick={() => handleApplyLecture(lecture)}
                  style={{ 
                    backgroundColor: appliedLectures.includes(lecture) ? '#637ABF' : 'rgb(212, 216, 243)', 
                    color: appliedLectures.includes(lecture) ? 'white' : 'black',
                    border: 'none',
                    fontWeight: '700',
                    padding: '2px 5px',  // padding 줄이기
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '60px',
                    textAlign: 'center',
                    height: '26px'  // 높이 줄이기
                  }}
                >
                  {appliedLectures.includes(lecture) ? '완료' : '신청'}
                </button>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', height: '30px' }}>{lecture.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
              </div>
              <div className={styles.scheduleContainer}>
        <h3 className={styles.scheduleTitle}>나의 시간표</h3>
        <table className={styles.scheduleTable}>
          <thead>
            <tr >
              <th style={{backgroundColor:'white'}}>월</th>
              <th style={{backgroundColor:'white'}}>화</th>
              <th style={{backgroundColor:'white'}}>수</th>
              <th style={{backgroundColor:'white'}}>목</th>
              <th style={{backgroundColor:'white'}}>금</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(9)].map((_, timeSlot) => (
              <tr key={timeSlot} style={{ backgroundColor: 'white' }}>
                {schedule.map((day, dayIndex) => (
                  <td key={dayIndex} style={{ backgroundColor: day[timeSlot] ? '#637ABF' : 'transparent', height: '50px', width: '50px' }}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.creditsInfoSchedule }>
          현재 수강 학점 (/최대 수강 가능 학점):<br/><br/>  {appliedLectures.length * 3} / 21
        </div>
      </div>
            </div>
            {!isSidebarOpen && (
              <button className={styles.circleButton} onClick={toggleSidebar}>
                +
              </button>
            )}
            <div className={`${styles.rightBar} ${isSidebarOpen ? styles.open : ''}`}>
              <button className={styles.closeSidebarButton} onClick={toggleSidebar}>
                  ㅡ
              </button>
              <div className={styles.sidebarContent}>
                  <div className={styles.sidebarSection}>
                  <div className={styles.basketTitle}>예비수강신청 내역</div>
                  {sidebarLectures.map((lecture, index) => (
                      <div key={index} className={styles.lectureBox}>
                      <div className={styles.name}>{lecture.name}</div> 
                      <div className={styles.topRow}>
                          <div>{lecture.id} {lecture.category}</div>
                      </div>
                      <div className={styles.buttons}>
                          <button className={styles.remove} onClick={() => handleRemoveLectureFromSidebar(lecture.id)}>X</button>
                      </div>
                      </div>
                  ))}
                  </div>
              </div>
          </div>
          </>
        )}
      </div>

      <div className={styles.rightBar2}>
        <div className={styles.section} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          <div className={styles.sectionTitle}>강의명으로 조회 후 신청</div>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="강의명 검색" />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.lectureList} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          {lectureList.map((lecture) => (
            <LectureItem key={lecture.id} lecture={lecture} />
          ))}
          <button type="button" className={styles.more} onClick={() => togglePopup('moreLectures')}>더보기</button>
        </div>

        <div className={styles.sectionSubject} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          <div className={styles.sectionTitle}>과목 코드 직접 입력</div>
          <input
            type="text"
            placeholder="과목 코드 입력"
            className={styles.subjectCode}
            value={subjectCode}
            onChange={handleSubjectCodeChange}
          />
          <input
            type="text"
            placeholder="분반 코드 입력"
            value={divisionCode}
            onChange={handleDivisionCodeChange}
          />
          <button type="button" className={styles.cartBtn} onClick={handleAddToCart}>
            장바구니 담기
          </button>
        </div>
      </div>

      {isPopupVisible && (
        <div className={styles.popup}>
          <div className={`${styles.popupInner} ${styles[popupType]}`}>
            {renderCloseButton()}
            {popupType === 'totalInfo' && (
              <div>
                <h3 className={styles.popupTitle}>전체 학점 정보 (부전공)</h3>
                <ul className={styles.infoList}>
                  <li><span className={styles.label}>총합</span> <span className={styles.value}>0 / 130</span></li>
                  <li><span className={styles.label}>전공 핵심</span> <span className={styles.value}>0 / 24</span></li>
                  <li><span className={styles.label}>전공 선택</span> <span className={styles.value}>0 / 48</span></li>
                  <li><span className={styles.label}>전공 교양</span> <span className={styles.value}>0 / 9</span></li>
                  <li><span className={styles.label}>전공 취업</span> <span className={styles.value}>0 / 3</span></li>
                  <li><span className={styles.label}>중요 핵심</span> <span className={styles.value}>0 / 4</span></li>
                  <li><span className={styles.label}>기술 교양</span> <span className={styles.value}>0 / 18</span></li>
                  <li><span className={styles.label}>선택 교양</span> <span className={styles.value}>0 / 18</span></li>
                  <li><span className={styles.label}>일반 선택</span> <span className={styles.value}>0 / 45</span></li>
                  <li><span className={styles.label}>전공 교양</span> <span className={styles.value}>0 / 9</span></li>
                  <li><span className={styles.label}>전공 필수</span> <span className={styles.value}>0 / 27</span></li>
                  <li><span className={styles.label}>전공 선택</span> <span className={styles.value}>0 / 6</span></li>
                </ul>
              </div>
            )}
            {popupType === 'moreLectures' && (
              <div>
                <h3 className={styles.popupTitle}>강의명으로 조회 후 신청</h3>
                <div className={styles.searchContainer}>
                  <input className={styles.lectureSearch} type="text" placeholder="강의명 검색" />
                  <FaSearch className={styles.popupSearchIcon} />
                </div>
               <div className={`${styles.lectureList} ${styles.popupLectureList}`}>
                  {[...lectureList, ...additionalLectures].map((lecture) => (
                    <PopupLectureItem key={lecture.id} lecture={lecture} />
                  ))}
                </div>
              </div>
            )}
            {popupType === 'lecturePlan' && (
              <div>
                <h3 className={styles.popupTitle}>강의 계획서</h3>
                <p>{lecturePlan}</p>
              </div>
            )}
            {popupType === 'error' && (
              <div>
                <h4 className={styles.popupTitle}>단과대 및 학과/학부 선택</h4>
                <p>{popupMessage}</p>
                {renderErrorCloseButton()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reserve;
