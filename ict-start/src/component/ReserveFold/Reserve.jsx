import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios'; // Axios import
import lectures from './LectureList';
import './Reserve_css.css';

function Reserve() {
  const [lecture, setLecture] = useState(lectures);
  const lecturelist = [
    { id: 1, name: "20세기 한국사 (월4,5)" },
    { id: 2, name: "경제학 입문 (화3,4)" },
    { id: 3, name: "프로그래밍 기초 (수1,2)" },
    { id: 4, name: "심리학 개론 (목2,3)" },
  ];
  const [lectureList, setLectureList] = useState(lecturelist);
  const [subjectCode, setSubjectCode] = useState('');
  const [divisionCode, setDivisionCode] = useState('');
  const [selectedSubNav, setSelectedSubNav] = useState('');
  const [selectedGridContainer, setSelectedGridContainer] = useState('');
  const [selectedDepartmentContainer, setSelectedDepartmentContainer] = useState('');
  const [selectedYearContainer, setSelectedYearContainer] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가

  const handleSubjectCodeChange = (e) => setSubjectCode(e.target.value);
  const handleDivisionCodeChange = (e) => setDivisionCode(e.target.value);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('/api/reserve', {
        subjectCode: subjectCode,
        divisionCode: divisionCode
      });

      if (response.status === 200) {
        alert('장바구니에 담겼습니다.');
      } else {
        alert('장바구니에 담기 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('장바구니에 담기 중 오류가 발생했습니다.');
    }
  };

  const handleSubNavClick = (event) => {
    setSelectedSubNav(event.target.innerText);
  };

  const handleGridContainerClick = (container) => {
    setSelectedGridContainer(container);
  };

  const handleDepartmentContainerClick = (container) => {
    setSelectedDepartmentContainer(container);
  };

  const handleYearContainerClick = (container) => {
    setSelectedYearContainer(container);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // 사이드바 토글 함수
  };

  const LectureItem = ({ lecture }) => (
    <div className="lecture-item">
      <span className="lecture-name">{lecture.name}</span>
      <button className="info-btn">정보</button>
      <button className="apply-btn">신청</button>
    </div>
  );

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

        <hr style={{ border: '1px solid white' }} />
        <div className="credits-info">
          <h4>학점 정보 (부전공)</h4>
          <div>총합 /130</div>
          <div>전핵 /24</div>
          <div>전선 /48</div>
          <div>전교 /9</div>
          <div>전취 /3</div>
        </div>
        <h4>전체 정보 보기</h4>
        <div>
          <hr style={{ border: '1px solid white' }} />
        </div>
        <button>로그아웃</button>
      </div>

      <div className="main-content">
        {/* 상단 네비게이션 바 */}
        <div className="navbar">
          <button>공지사항</button>
          <button>과목조회</button>
          <button className="application">수강신청</button>
          <button>마이페이지</button>
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
            {['컴퓨터공학부', '데이터과학부', '정보통신학부'].map((name) => (
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
                  backgroundColor: selectedYearContainer === year ? '#637ABF' : 'white',
                  color: selectedYearContainer === year ? 'white' : 'rgb(104, 108, 109)',
                }}
              >
                {year}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="lecture-container">
            {lecture.map((lecture, index) => (
              <div className="lecture-box" key={index}>
                <div className="top-row">
                  <div>{lecture.id}</div>
                  <div>{lecture.category}</div>
                </div>
                <div className="name">{lecture.name}</div>
                <div className="time">교수 {lecture.professor} | {lecture.time}</div>
                <div className="buttons">
                  <button className="basket">장바구니</button>
                  <button className="plan">강의 계획서</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 동그라미 버튼 */}
      <button className="circle-button" onClick={toggleSidebar}>+</button>

      <div className={`right-bar ${isSidebarOpen ? 'open' : ''}`}>
        {/* 사이드바 내용 */}
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="section-title">추가 섹션 1</div>
            {/* 추가 섹션 1 내용 */}
          </div>
          <div className="sidebar-section">
            <div className="section-title">추가 섹션 2</div>
            {/* 추가 섹션 2 내용 */}
          </div>
        </div>
        </div>
      

    <div className="right-bar2">
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
        <button type="button" className="more">더보기</button>
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
    </div>
  );
}

export default Reserve;
