/*과목조회 컴포넌트*/

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import styles from './Inquiry.module.css';
import { useNavigate } from 'react-router-dom';

function Inquiry() {
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

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://43.202.223.188/api/college')
      .then(response => {
        setColleges(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the colleges!', error);
      });
  }, []);

  const fetchDepartments = (collegeId) => {
    axios.get(`https://43.202.223.188/api/departments/${collegeId}`)

      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
      });
  };

  const fetchSubjects = (departmentId) => {
    axios.get(`https://43.202.223.188/api/subjects/${departmentId}`)
      .then(response => {
        setLectures(response.data);
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

  useEffect(() => {
    if (selectedYearContainer.length > 0) {
      filterLecturesByGrade(selectedYearContainer);
    }
  }, [selectedYearContainer]);

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
      const response = await axios.post('https://43.202.223.188/api/logout', { token });
      
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
    axios.get('https://43.202.223.188/subjects/search', {
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

  return (
    <div className={styles['body']}>
      <div className={styles['left-bar']}>
        <div className={styles['title']}>
          <h3>한국대학교
            <div>수강신청</div></h3>
        </div>
        <div className={styles['user-info']}>
          <div>이름 홍길동</div>
          <div>학번 12345678</div>
          <h4>학과 (부전공)</h4>
          <div>컴퓨터공학과</div>
          <div>(없음)</div>
        </div>

        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className={styles['credits-info']}>
          <h4>학점 정보 (부전공)</h4>
          <div>총합 /130</div>
          <div>전핵 /24</div>
          <div>전선 /48</div>
          <div>전교 /9</div>
          <div>전취 /3</div>
        </div>

        <div className={styles['toggle-btn']}>
          <button onClick={() => togglePopup('totalInfo')}>+</button>전체 정보 보기
        </div>
        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className={styles['logout-btn']}>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <div className={styles['main-content']}>
        <div className={styles['navbar']}>
          <button onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button className={styles['application']}>과목조회</button>
          <button onClick={() => handleNavClick('/')}>수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>
        <div className={styles['sub-navbar']}>
          <div className={styles['long-box']}>
            <div>해당 페이지는 과목 조회 페이지입니다.</div>
            예비 수강신청 및 일반 수강신청을 희망하는 학생은 위 <span className={styles['bold']}>[수강신청]</span> 카테고리를 이용해 주시기 바랍니다.
          </div>
        </div>

        <div className={styles['section']}>
          <div className={styles['section-title']}>단과대 선택</div>
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
          <div className={styles['section-title']}>학부 및 학과 선택</div>
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

      <div className={styles['right-bar2']}>
        <div className={styles['section']} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          <div className={styles['section-title']}>강의명으로 조회</div>
          <div className={styles['search-container']}>
            <input
              type="text"
              placeholder="강의명 검색"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <FaSearch className={styles['search-icon']} onClick={handleSearch} />
          </div>
        </div>

        <div className={styles['lecture-list']} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          {searchResults.length > 0 ? (
            searchResults.map((lecture) => (
              <LectureItem key={lecture.id} lecture={lecture} />
            ))
          ) : (
            lectureList.map((lecture) => (
              <LectureItem key={lecture.id} lecture={lecture} />
            ))
          )}
          <button type="button" className={styles['more']} onClick={() => togglePopup('moreLectures')}>더보기</button>
        </div>

        <div className={styles['section']} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          <div className={styles['schedule-title-container']}>
            <div className={styles['schedule-title']}>나의 시간표</div>
          </div>
          <div className={styles['schedule-table']}>
            <div className={styles['schedule-header']}>
              {['월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={index} className={styles['schedule-cell']}>{day}</div>
              ))}
            </div>
            {[...Array(8)].map((_, rowIndex) => (
              <div key={rowIndex} className={styles['schedule-row']}>
                {[...Array(6)].map((_, colIndex) => (
                  <div key={colIndex} className={styles['schedule-cell']}></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className={styles['popup']}>
          <div className={`${styles['popup-inner']} ${styles[popupType]}`}>
            {renderCloseButton()}
            {popupType === 'totalInfo' && (
              <div>
                <h3 className={styles['popup-title']}>전체 학점 정보 (부전공)</h3>
                <ul className={styles['info-list']}>
                  <li><span className={styles['label']}>총합</span> <span className={styles['value']}>0 / 130</span></li>
                  <li><span className={styles['label']}>전공 핵심</span> <span className={styles['value']}>0 / 24</span></li>
                  <li><span className={styles['label']}>전공 선택</span> <span className={styles['value']}>0 / 48</span></li>
                  <li><span className={styles['label']}>전공 교양</span> <span className={styles['value']}>0 / 9</span></li>
                  <li><span className={styles['label']}>전공 취업</span> <span className={styles['value']}>0 / 3</span></li>
                  <li><span className={styles['label']}>중요 핵심</span> <span className={styles['value']}>0 / 4</span></li>
                  <li><span className={styles['label']}>기술 교양</span> <span className={styles['value']}>0 / 18</span></li>
                  <li><span className={styles['label']}>선택 교양</span> <span className={styles['value']}>0 / 18</span></li>
                  <li><span className={styles['label']}>일반 선택</span> <span className={styles['value']}>0 / 45</span></li>
                  <li><span className={styles['label']}>전공 교양</span> <span className={styles['value']}>0 / 9</span></li>
                  <li><span className={styles['label']}>전공 필수</span> <span className={styles['value']}>0 / 27</span></li>
                  <li><span className={styles['label']}>전공 선택</span> <span className={styles['value']}>0 / 6</span></li>
                </ul>
              </div>
            )}
            {popupType === 'moreLectures' && (
              <div>
                <h3 className={styles['popup-title']}>강의명으로 조회</h3>
                <div className={styles['search-container']}>
                  <input className={styles['lecture-search']} type="text" placeholder="강의명 검색" />
                  <FaSearch className={styles['popup-search-icon']} />
                </div>
                <div className={styles['lecture-list']}>
                  {[...lectureList, ...additionalLectures].map((lecture) => (
                    <LectureItem key={lecture.id} lecture={lecture} />
                  ))}
                </div>
              </div>
            )}
            {popupType === 'lecturePlan' && (
              <div>
                <h3 className={styles['popup-title']}>강의 계획서</h3>
                <p>{lecturePlan}</p>
              </div>
            )}
            {popupType === 'error' && (
              <div>
                <h4 className={styles['popup-title']}>단과대 및 학과/학부 선택</h4>
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

export default Inquiry;
