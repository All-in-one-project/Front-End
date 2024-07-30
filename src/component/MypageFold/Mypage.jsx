import React, { useEffect, useState } from 'react';
import styles from './Mypage.module.css';

const Mypage = () => {
  const [overallGPA, setOverallGPA] = useState(null);
  const [majorGPA, setMajorGPA] = useState(null);

  useEffect(() => {
    // API URL 입력
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/gpa');
        const data = await response.json();
        setOverallGPA(data.overallGPA);
        setMajorGPA(data.majorGPA);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (overallGPA === null || majorGPA === null) {
    return <div>Loading...</div>;
  }

  return (
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
  );
};

export default Mypage;
