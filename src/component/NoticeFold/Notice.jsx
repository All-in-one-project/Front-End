import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notice.module.css';
import LeftBar from '../SideBarFold/LeftBar.jsx';
import Schedule from '../ScheduleFold/Schedule.jsx';

const data = [
  { 번호: 1, 제목: '한국대학교 수강신청 웹 사이트 이용 수칙', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 2, 제목: '과목 조회 주의사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 3, 제목: '예비 / 일반 수강 신청 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 4, 제목: '학년별 수강 신청 기간 및 정정 기간 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 5, 제목: '2024년도 1학기 개설 과목 강의계획서 업데이트 안내', 날짜: '2024.00.00', 링크: '#' },
];

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubNav, setSelectedSubNav] = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '공지사항') {
      navigate('/notice');
    } else if (subNav === 'FAQ') {
      navigate('/faq');
    }
  };

  return (
    <div className={styles.body}>
      <LeftBar />
      <div className={styles.mainContent}>
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <button className={styles.application} onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button onClick={() => handleNavClick('/application')}>수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>

        {/* 하위 네비게이션 바 */}
        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '전체 공지사항' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('전체 공지사항')}
          >
            전체 공지사항
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === 'FAQ' ? styles.selected : ''}`}
            onClick={() => handleSubNavClick('FAQ')}
          >
            FAQ
          </button>
        </div>

        {/* 공지사항 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item) => (
              <tr key={item.번호}>
                <td>{item.번호}</td>
                <td><a href={item.링크}>{item.제목}</a></td>
                <td>{item.날짜}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? styles.active : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <Schedule />
      </div>
    </div>
  );
};

export default Notice;
