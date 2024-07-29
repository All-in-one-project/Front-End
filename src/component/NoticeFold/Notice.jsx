import React, { useState } from 'react';
import styles from './Notice.module.css';
import LeftBar from '../SideBarFold/LeftBar.jsx'
import Schedule from '../ScheduleFold/Schedule.jsx'

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const data = [
  { 번호: 1, 제목: '한국대학교 수강신청 웹 사이트 이용 수칙', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 2, 제목: '과목 조회 주의사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 3, 제목: '예비 / 일반 수강 신청 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 4, 제목: '학년별 수강 신청 기간 및 정정 기간 공지사항', 날짜: '2024.00.00', 링크: '#' },
  { 번호: 5, 제목: '2024년도 1학기 개설 과목 강의계획서 업데이트 안내', 날짜: '2024.00.00', 링크: '#' },
];

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.body}>
      <LeftBar></LeftBar>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map(item => (
            <tr key={item.번호}>
              <td>{item.번호}</td>
              <td><a href={item.링크}>{item.제목}</a></td>
              <td>{item.날짜}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <Schedule></Schedule>
    </div>
    
  );
};

export default Notice;
