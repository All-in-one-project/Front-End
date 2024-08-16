import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainBar.module.css';

const MainBar = () => {  
  const [selectedSubNav, setSelectedSubNav] = useState('FAQ');
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubNavClick = (subNav) => {
    setSelectedSubNav(subNav);
    if (subNav === '전체 공지사항') {
      navigate('/notice');
    } else if (subNav === 'FAQ') {
      navigate('/faq');
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.mainContent}>
        {/* 상단 네비게이션 바 */}
        <div className={styles.navbar}>
          <button className={styles.application} onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button onClick={() => handleNavClick('/reserve')}>수강신청</button>
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
      </div>
    </div>
  );
};

export default MainBar;
