import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Reserve_css.css';
import { useNavigate } from 'react-router-dom'; // React Router 사용

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가
  const [sidebarLectures, setSidebarLectures] = useState([]); // 사이드바에 추가될 강의 상태
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업창 상태 추가
  const [popupType, setPopupType] = useState(''); // 팝업창 타입 상태 추가
  const [lecturePlan, setLecturePlan] = useState(''); // 강의 계획서 상태 추가

  /*맨 위에 공지사항, 과목조회, 수강신청, 마이페이지 버튼 눌를시 페이지 이동시켜주는 React훅*/
  const navigate = useNavigate(); // React Router의 useNavigate 사용
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

  const handleAddToCart = () => {
    console.log('장바구니에 담겼습니다.');
  };

  const handleLogout = () => {
    console.log('로그아웃되었습니다.');
    navigate('/'); // 초기화면으로 리디렉션
  };

  const handleSubNavClick = (event) => {
    setSelectedSubNav(event.target.innerText);
  };

  /*단과대 섹션에서 단과대 선택을 뭘하냐에 따라 학부 나오게 하는*/

  const handleGridContainerClick = (container) => {
    if (selectedGridContainer === container) {
      setSelectedGridContainer('');
      setSelectedDepartmentContainer(''); // 학부 선택도 취소
      setDepartmentList([]);
    } else if (selectedGridContainer === '') {
      setSelectedGridContainer(container);
      setDepartmentList(departmentMapping[container]);
    } else {
      alert('단과대는 1개만 선택할 수 있습니다.');
    }
  };


  const handleDepartmentContainerClick = (container) => {
    if (selectedDepartmentContainer === container) {
      setSelectedDepartmentContainer('');
    } else if (selectedDepartmentContainer === '') {
      setSelectedDepartmentContainer(container);
    } else {
      alert('학부는 1개만 선택할 수 있습니다.');
    }
  };

  const handleYearContainerClick = (container) => {
    if (selectedYearContainer.includes(container)) {
      setSelectedYearContainer(selectedYearContainer.filter(item => item !== container));
    } else if (selectedYearContainer.length < 4) {
      setSelectedYearContainer([...selectedYearContainer, container]);
    } else {
      alert('학년은 4개까지 선택할 수 있습니다.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // 사이드바 토글 함수
  };

  const togglePopup = (type) => {
    setPopupType(type); // 팝업창 타입 설정
    setIsPopupVisible(!isPopupVisible); // 팝업창 토글 함수
  };

  const renderCloseButton = () => {
    switch (popupType) {
      case 'totalInfo':
        return (
          <button className="close-btn-totalInfo" onClick={() => togglePopup('')}>
            ✖
          </button>
        );
      case 'moreLectures':
        return (
          <button className="close-btn-moreLectures" onClick={() => togglePopup('')}>
            ✖
          </button>
        );
      default:
        return (
          <button className="close-btn" onClick={() => togglePopup('')}>
            X
          </button>
        );
    }
  };

  const handleAddLectureToSidebar = (lecture) => {
    console.log('장바구니에 담겼습니다.');
    setSidebarLectures([...sidebarLectures, lecture]);
  };

  const handleApplyLecture = (lecture) => {
    console.log('수강신청이 완료되었습니다.');
    setSidebarLectures([...sidebarLectures, lecture]);
  };

  const handleRemoveLectureFromSidebar = (id) => {
    console.log('장바구니에서 삭제되었습니다.');
    setSidebarLectures(sidebarLectures.filter((lecture) => lecture.id !== id));
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

  const fetchLecturePlan = (id) => {
    console.log('강의 계획서를 불러오는 데 실패했습니다.');
    // 여기서 실제 데이터를 가져오는 로직을 추가해야 합니다.
  };

  useEffect(() => {
    if (selectedGridContainer && selectedDepartmentContainer && selectedYearContainer.length > 0) {
      const collegeId = Object.keys(departmentMapping).indexOf(selectedGridContainer) + 1;
      const departmentId = departmentMapping[selectedGridContainer].indexOf(selectedDepartmentContainer) + 1;
      const gradeId = parseInt(selectedYearContainer[0][0], 10); // '1학년', '2학년' 등에서 숫자만 추출
      fetchLectures(collegeId, departmentId, gradeId);
    }
  }, [selectedGridContainer, selectedDepartmentContainer, selectedYearContainer]);

  const MainLectureItem = ({ lecture }) => (
    <div className="lecture-box">
      <div className="top-row">
        <div>{lecture.id}</div>
        <div className="category">{lecture.category}</div> {/* category를 추가하여 오른쪽으로 배치 */}
      </div>
      <div className="name">{lecture.name}</div> {/* name을 아래로 이동 */}
      <div className="time">교수 {lecture.professor} | {lecture.time}</div> {/* 교수와 시간을 표시 */}
      <div className="buttons">
        <button className="basket" onClick={() => handleAddLectureToSidebar(lecture)}>장바구니</button>
        <button className="plan" onClick={() => fetchLecturePlan(lecture.id)}>강의 계획서</button> {/* 강의 계획서 버튼 */}
      </div>
    </div>
  );

  const LectureItem = ({ lecture }) => (
    <div className="lecture-item">
      <span className="lecture-name">{lecture.name} {lecture.hours}</span>
      <button className="info-btn" onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
      <button className="apply-btn" onClick={() => handleAddLectureToSidebar(lecture)}>추가</button>
    </div>
  );

  const PopupLectureItem = ({ lecture }) => (
    <div className="lecture-item">
      <span className="lecture-name">{lecture.name}</span>
      <button className="info-btn" onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
      <button className="apply-btn" onClick={() => handleAddLectureToSidebar(lecture)}>추가</button>
    </div>
  );

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

  const [departmentList, setDepartmentList] = useState(departmentMapping['ICT융합과학대학']); // 초기값 설정

  // 임의의 강의 리스트 추가
  const additionalLectures = [
    { id: 5, name: "철학 개론 (금1,2)" },
    { id: 6, name: "미적분학 (월1,2)" },
    { id: 7, name: "물리학 (화2,3)" },
    { id: 8, name: "화학 (수3,4)" },
    { id: 9, name: "생물학 (목4,5)" },
    { id: 10, name: "통계학 (금3,4)" },
  ];

  return (
    <div className="body">
      <div className="left-bar">
        <div className="title">
          <h3>한국대학교
            <div>수강신청</div></h3>
        </div>
        <div className="user-info">
          <div>이름 홍길동</div>
          <div>학번 12345678</div>
          <h4>학과 (부전공)</h4>
          <div>컴퓨터공학과</div>
          <div>(없음)</div>
        </div>

        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className="credits-info">
          <h4>학점 정보 (부전공)</h4>
          <div>총합 /130</div>
          <div>전핵 /24</div>
          <div>전선 /48</div>
          <div>전교 /9</div>
          <div>전취 /3</div>
        </div>

        <div className="toggle-btn">
          <button onClick={() => togglePopup('totalInfo')}>+</button>전체 정보 보기
        </div>
        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className="logout-btn">
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
      
      <div className="main-content">
        {/* 상단 네비게이션 바 */}
        <div className="navbar">
          <button onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/application')}>과목조회</button>
          <button className="application">수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>

        {/* 하위 네비게이션 바 */}
        <div className="sub-navbar">
          <button
            className={`sub-navbar-btn ${selectedSubNav === '예비수강신청' ? 'selected' : ''}`}
            onClick={handleSubNavClick}
          >
            예비수강신청
          </button>
          <button
            className={`sub-navbar-btn ${selectedSubNav === '일반수강신청' ? 'selected' : ''}`}
            onClick={handleSubNavClick}
          >
            일반수강신청
          </button>
        </div>

        {/* 단과대 선택 섹션 */}
        <div className="section">
          <div className="section-title">단과대 선택</div>
          <div className="grid-container">
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

        {/* 학부 및 학과 선택 섹션 */}
        <div className="section">
          <div className="section-title">학부 및 학과 선택</div>
          <div className="department-container">
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

        {/* 학년 선택 섹션 */}
        <div className="section">
          <div className="section-title">학년 선택</div>
          <div className="year-container">
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

        <div className="section">
          <div className="lecture-container">
            {lectures.map((lecture, index) => (
              <MainLectureItem key={index} lecture={lecture} />
            ))}
          </div>
        </div>
      </div>

      {/* 슬라이드로 생기는 오른쪽 사이드바 */}
      {!isSidebarOpen && (
        <button className="circle-button" onClick={toggleSidebar}>
          +
        </button>
      )}
      <div className={`right-bar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar-button" onClick={toggleSidebar}>
            ㅡ
        </button>
        <div className="sidebar-content">
            <div className="sidebar-section">
            <div className="basket-title">예비수강신청 내역</div>
            {sidebarLectures.map((lecture, index) => (
                <div key={index} className="lecture-box">
                <div className="name">{lecture.name}</div> {/* 이름 위치 수정 */}
                <div className="top-row">
                    <div>{lecture.id} {lecture.category}</div>
                </div>
                <div className="buttons">
                    <button className="remove" onClick={() => handleRemoveLectureFromSidebar(lecture.id)}>X</button>
                </div>
                </div>
            ))}
            </div>
        </div>
    </div>


      {/*진짜 오른쪽 사이드바*/}
      <div className={`right-bar2`}>
        {/* 강의명으로 조회 및 검색 섹션 */}
        <div className="section" style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          <div className="section-title">강의명으로 조회 후 신청</div>
          <div className="search-container">
            <input type="text" placeholder="강의명 검색" />
            <FaSearch className="search-icon" />
          </div>
        </div>

        {/* 강의 리스트 섹션 */}
        <div className="lecture-list" style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          {lectureList.map((lecture) => (
            <LectureItem key={lecture.id} lecture={lecture} />
          ))}
          <button type="button" className="more" onClick={() => togglePopup('moreLectures')}>더보기</button>
        </div>

        {/* 과목 코드 직접 입력 섹션 */}
        <div className="section-subject" style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          <div className="section-title">과목 코드 직접 입력</div>
          <input
            type="text"
            placeholder="과목 코드 입력"
            className="subject-code"
            value={subjectCode}
            onChange={handleSubjectCodeChange}
          />
          <input
            type="text"
            placeholder="분반 코드 입력"
            value={divisionCode}
            onChange={handleDivisionCodeChange}
          />
          <button type="button" className="cart-btn" onClick={handleAddToCart}>
            장바구니 담기
          </button>
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup">
          <div className={`popup-inner ${popupType}`}>
            {renderCloseButton()} {/* 조건부 렌더링된 닫기 버튼 */}
            {popupType === 'totalInfo' && (
              <div>
                <h3 className="popup-title">전체 학점 정보 (부전공)</h3>
                <ul className="info-list">
                  <li><span className="label">총합</span> <span className="value">0 / 130</span></li>
                  <li><span className="label">전공 핵심</span> <span className="value">0 / 24</span></li>
                  <li><span className="label">전공 선택</span> <span className="value">0 / 48</span></li>
                  <li><span className="label">전공 교양</span> <span className="value">0 / 9</span></li>
                  <li><span className="label">전공 취업</span> <span className="value">0 / 3</span></li>
                  <li><span className="label">중요 핵심</span> <span className="value">0 / 4</span></li>
                  <li><span className="label">기술 교양</span> <span className="value">0 / 18</span></li>
                  <li><span className="label">선택 교양</span> <span className="value">0 / 18</span></li>
                  <li><span className="label">일반 선택</span> <span className="value">0 / 45</span></li>
                  <li><span className="label">전공 교양</span> <span className="value">0 / 9</span></li>
                  <li><span className="label">전공 필수</span> <span className="value">0 / 27</span></li>
                  <li><span className="label">전공 선택</span> <span className="value">0 / 6</span></li>
                </ul>
              </div>
            )}
            {popupType === 'moreLectures' && (
              <div>
                <h3 className="popup-title">강의명으로 조회 후 신청</h3>
                <div className="search-container">
                  <input className="lecture-search" type="text" placeholder="강의명 검색" />
                  <FaSearch className="popup-search-icon" />
                </div>
                <div className="lecture-list popup-lecture-list">
                  {[...lectureList, ...additionalLectures].map((lecture) => (
                    <PopupLectureItem key={lecture.id} lecture={lecture} />
                  ))}
                </div>
              </div>
            )}
            {popupType === 'lecturePlan' && (
              <div>
                <h3 className="popup-title">강의 계획서</h3>
                <p>{lecturePlan}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reserve;