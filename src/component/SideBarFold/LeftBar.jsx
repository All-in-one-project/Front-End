import React, { useState } from 'react';
import styles from './LeftBar.module.css';
import { useNavigate } from 'react-router-dom';

const LeftBar = ({ onLogout }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const navigate = useNavigate();

  const togglePopup = (type) => {
    if (popupType === type && isPopupVisible) {
      setIsPopupVisible(false);
    } else {
      setPopupType(type);
      setIsPopupVisible(true);
    }
  };

  const renderCloseButton = () => (
    <button className={styles.closeBtn} onClick={() => setIsPopupVisible(false)}>
      X
    </button>
  );

  return (
    <div className={styles.leftBar}>
      <div className={styles.title}>
        <h3>한국대학교
          <div>수강신청</div>
        </h3>
      </div>
      <div className={styles.userInfo}>
        <div>이름 홍길동</div>
        <div>학번 12345678</div>
        <h4>학과 (부전공)</h4>
        <div>컴퓨터공학과</div>
        <div>(없음)</div>
      </div>

      <hr style={{ border: '1px solid white', backgroundColor: 'white', width: '190px',marginLeft: '-5px'}} />


      <div className={styles.creditsInfo}>
        <h4>학점 정보 (부전공)</h4>
        <div>총합 /130</div>
        <div>전핵 /24</div>
        <div>전선 /48</div>
        <div>전교 /9</div>
        <div>전취 /3</div>
      </div>

      <div className={styles.toggleBtn}>
        <button onClick={() => togglePopup('totalInfo')}>+</button>전체 정보 보기
      </div>

      <hr style={{ border: '1px solid white', backgroundColor: 'white', width: '190px',marginLeft: '-5px'}} />


      <div className={styles.logoutBtn}>
        <button onClick={onLogout}>로그아웃</button>
      </div>

      {isPopupVisible && (
        <div className={styles['popup']}>
          <div className={`${styles['popupInner']} ${styles[popupType]}`}>
            {renderCloseButton()}
            {popupType === 'totalInfo' && (
              <div>
                <h3 className={styles['popupTitle']}>전체 학점 정보 (부전공)</h3>
                <ul className={styles['infoList']}>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftBar;
