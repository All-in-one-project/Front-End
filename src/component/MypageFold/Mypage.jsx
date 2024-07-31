import React, { useEffect, useState } from 'react';
import styles from './Mypage.module.css';
import { useNavigate } from 'react-router-dom';
import Schedule from '../ScheduleFold/Schedule.jsx';
import LeftBar from '../SideBarFold/LeftBar.jsx';

const Mypage = () => {
  const [overallGPA, setOverallGPA] = useState(null);
  const [majorGPA, setMajorGPA] = useState(null);
   const [selectedSubNav, setSelectedSubNav] = useState('학생 정보 확인');
  const navigate = useNavigate();

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
          <button onClick={() => handleNavClick('/application')}>수강신청</button>
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
            <div className={styles.status}>재학 중 (현재 2학기 수강 중)</div>
            <div className={styles.remaining}>졸업까지 총 6학기 남아 있습니다.</div>
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
              졸업 요건 <span className={styles['status-highlight']}>미충족</span> 상태입니다.
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
