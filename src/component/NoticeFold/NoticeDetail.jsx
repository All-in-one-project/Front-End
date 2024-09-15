import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Notice.module.css';
import LeftBar from '../SideBarFold/LeftBar.jsx';
import Schedule from '../ScheduleFold/Schedule.jsx';

const NoticeDetail = () => {
   const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams(); // URL에서 공지사항 ID 가져옴
  const [notice, setNotice] = useState(null); // 공지사항 상세 정보 상태
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const totalPages = 5;/*페이지네이션*/
   const [error, setError] = useState(null); // 오류 상태 선언


useEffect(() => {
  const fetchNoticeDetail = async () => {
    try {
      const response = await axios.get(`https://43.202.223.188:8080/notice/${id}`);
      
      console.log("API Response:", response.data);
      
      setNotice(response.data);
      console.log("Notice state:", response.data); // 상태가 제대로 설정되었는지 확인
      
      setLoading(false);
    } catch (error) {
      console.error('공지사항 상세를 불러오는 중 오류가 발생했습니다:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  fetchNoticeDetail();
}, [id]);



  const handleNavClick = (path) => {
    navigate(path); // 네비게이션 핸들링
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>; // 공지사항을 찾지 못했을 때
  }

  return (
    <div className={styles.body}>
      <LeftBar />
      <div className={styles.mainContent}>
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <button className={styles.application} onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button onClick={() => handleNavClick('/reserve')}>수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>

        {/* 공지사항 상세 정보 */}
        <div className={styles.noticeDetail}>
          <h1>{notice.title}</h1>
          <p>{notice.content}</p>
          <p>공지 날짜: {notice.noticeTime}</p>
        </div>

                 {/* 페이지네이션 */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <React.Fragment key={index + 1}>
            <button
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? styles.active : ''}
            >
              {index + 1}
            </button>
            {index + 1 < totalPages && (
              <span className={styles.separator}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>

        {/* Schedule 컴포넌트 */}
        <Schedule />
      </div>
    </div>
  );
};

export default NoticeDetail;
