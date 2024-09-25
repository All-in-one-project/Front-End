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
  const [error, setError] = useState(null); // 오류 상태 선언
  const navigate = useNavigate();
  const totalPages = 5; // 페이지네이션

   useEffect(() => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(`https://43.202.223.188:8080/notice/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
          },
        });
        
        console.log("API Response:", response.data); // API 응답 확인

        if (response.data) {
          setNotice(response.data); // 응답 데이터가 있으면 상태에 저장
          setLoading(false); // 로딩 완료
        } else {
          setError('공지사항을 찾을 수 없습니다.'); // 데이터가 없을 경우 에러 설정
          setLoading(false);
        }
      } catch (error) {
        console.error('공지사항 상세를 불러오는 중 오류가 발생했습니다:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchNoticeDetail(); // 공지사항 상세 데이터 가져오기
  }, [id]);

  const handleNavClick = (path) => {
    navigate(path); // 네비게이션 핸들링
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  if (error) {
    return <div>{error}</div>; // 오류 발생 시 에러 메시지 출력
  }

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>; // 공지사항이 없는 경우 처리
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
          <h1>{notice.title || '제목 없음'}</h1> {/* 제목 없을 때 대비 */}
          <p>{notice.content || '내용이 없습니다.'}</p> {/* 내용 없을 때 대비 */}
          <p>공지 날짜: {notice.noticeTime ? new Date(notice.noticeTime).toLocaleDateString() : '날짜 없음'}</p> {/* 날짜 형식 변환 */}
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
