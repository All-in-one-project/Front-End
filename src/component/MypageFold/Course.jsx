import React, { useState, useEffect } from 'react';
import styles from './Course.module.css'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import Schedule from '../ScheduleFold/Schedule.jsx';
import LeftBar from '../SideBarFold/LeftBar.jsx';

const Course = () => {
  const [selectedYear, setSelectedYear] = useState("2024학년도");
  const [courses, setCourses] = useState({ major: [], nonMajor: [] });
  const [selectedSubNav, setSelectedSubNav] = useState('수강 신청 내역');
  const navigate = useNavigate();
  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '학생 정보 확인') {
      navigate('/mypage');
    } else if (subNav === '수강 신청 내역') {
      navigate('/course');
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

    // 서버에서 수강 내역 데이터 가져오기
 const fetchCourses = async () => {
  try {
    const response = await axios.get('/mypage/enrollment', {
      params: { semester: 1 }, // GET 요청에서는 params를 사용
    });

    if (response.status === 200) {
      const data = response.data;

       // 서버로부터 받은 모든 데이터를 콘솔에 출력
      console.log('서버로부터 받은 데이터:', data);

      const majorCourses = data.filter(course =>
        course.subjectDivision === '전필' || course.subjectDivision === '전핵' || course.subjectDivision === '전선'
      );
      const nonMajorCourses = data.filter(course =>
        course.subjectDivision !== '전필' && course.subjectDivision !== '전핵' && course.subjectDivision !== '전선'
      );

      setCourses({ major: majorCourses, nonMajor: nonMajorCourses });
    } else {
      console.error('Failed to fetch courses');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};




    // 컴포넌트가 처음 렌더링될 때 서버에서 데이터를 가져옴
  useEffect(() => {
    fetchCourses();
  }, []); // 빈 배열이므로 컴포넌트가 처음 렌더링될 때만 실행



  return (
    <div className={styles.body}>
      <LeftBar />
      <div className={styles.mainContent}>
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <button onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button onClick={() => handleNavClick('/reserve')}>수강신청</button>
          <button className={styles.application} onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>

        {/* 하위 네비게이션 바 */}
        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '학생 정보 확인' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('학생 정보 확인')}
          >
            학생 정보 확인
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '수강 신청 내역' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('수강 신청 내역')}
          >
            수강 신청 내역
          </button>
        </div>

        {/* 컨테이너 */}
           <div className={styles.container}>
          {/* 수강 내역 */}
          <div className={styles.semester}>
            <h2>2024학년도 수강 내역</h2>
            <div className={styles.courses}>
              <div className={styles.major}>
                <h3>전공</h3>
                <ul>
                  {courses.major.map((course, index) => (
                    <li key={index}>{course.subjectName}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.nonMajor}>
                <h3>전공 외</h3>
                <ul>
                  {courses.nonMajor.map((course, index) => (
                    <li key={index}>{course.subjectName}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Schedule />
      </div>
    </div>
  );
};

export default Course;
