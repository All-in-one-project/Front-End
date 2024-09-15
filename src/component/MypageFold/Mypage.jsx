import React, { useEffect, useState,useContext } from 'react';
import styles from './Mypage.module.css';
import { useNavigate } from 'react-router-dom';
import Schedule from '../ScheduleFold/Schedule.jsx';
import LeftBar from '../SideBarFold/LeftBar.jsx';
import { UserContext } from '../UserContext';

const Mypage = () => {
  const [overallGPA, setOverallGPA] = useState(null);   // 전체 학점 평점
  const [majorGPA, setMajorGPA] = useState(null);       // 전공 학점 평점
  const [graduationStatus, setGraduationStatus] = useState(''); // 졸업 상태
  const [currentSemester, setCurrentSemester] = useState(null); // 현재 학기
  const [remainingSemesters, setRemainingSemesters] = useState(null); // 남은 학기
  const [status, setStatus] = useState('');             // 졸업 요건 충족 여부
  const [selectedSubNav, setSelectedSubNav] = useState('학생 정보 확인');
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // UserContext에서 user 정보 가져오기

  useEffect(() => {
    if (user) {
      // user가 있을 때만 API 호출
     const fetchStudentData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // 저장된 토큰 가져오기
        const departmentId = 1; // 임시로 departmentId 설정

        const response = await fetch(`/mypage/${user.studentId}?departmentId=${departmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Authorization 헤더 추가
          }
        });

        if (response.ok) {
          const data = await response.json();
          const studentData = data[0]; // 첫 번째 객체 가져옴

          // 상태 업데이트
          setOverallGPA(studentData.gpa);
          setMajorGPA(studentData.majorGpa);
          setGraduationStatus(studentData.graduationStatus);
          setCurrentSemester(studentData.currentSemester);
          setRemainingSemesters(studentData.remainingSemesters);
          setStatus(studentData.status);
        } else {
          console.error(`API 호출 실패. Status: ${response.status}`); // 상태 코드 출력
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };


      fetchStudentData();
    }
  }, [user]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === 'Mypage') {
      navigate('/notice');
    } else if (subNav === '수강 신청 내역') {
      navigate('/course');
    }
  };



  return (
    <div className={styles.body}>
      <LeftBar></LeftBar>

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
        
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.header}>재학 상태</div>
          <div className={styles.content}>
            <div className={styles.status}>
                <span className={styles.boldText}>{graduationStatus}</span> (현재 {currentSemester}학기 수강 중)
            </div>
             <div className={styles.remaining}>
              졸업까지 총 <span className={styles.boldText}>{remainingSemesters}</span> 학기 남아 있습니다.
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.header}>학점 평점</div>
          <div className={styles.content}>
            <div className={styles.grade}>
              전체 학점 평점 <span className={styles.score}>{overallGPA} / 4.5</span>
            </div>
            <div className={styles.grade}>
              전공 학점 평점 <span className={styles.score}>{majorGPA} / 4.5</span>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.header}>학부 졸업 요건 충족 여부</div>
          <div className={styles.content}>
            <div className={styles.status}>
              졸업 요건 <span className={styles['status-highlight']}>{status}</span> 상태입니다.
            </div>
            <div className={styles.link}>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                학부별 졸업 요건 확인하기
              </a>
            </div>
          </div>
        </div>
      </div>
      <Schedule></Schedule>
    </div>
    </div>
  );
};

export default Mypage;
