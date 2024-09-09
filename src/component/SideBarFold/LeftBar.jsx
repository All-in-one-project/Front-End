import React, { useState, useContext } from 'react';
import styles from './LeftBar.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';


const LeftBar = ({ onLogout }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);


    /* 로그아웃 API */
    /* 일단은 로그아웃 누르면 원래 화면 path:'' 인 곳에 이동함 */
  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('토큰이 존재하지 않습니다.');
      navigate('/initial'); // 토큰이 없으면 바로 초기 화면으로 이동
      return;
    }

    try {
      // axios 요청에 토큰을 Authorization 헤더에 설정
      const response = await axios.post(
        'http://43.202.223.188:8080/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,  // 헤더에 토큰 설정
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message); // "Logout successful"

        // 로컬 스토리지에서 사용자 정보와 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');

        // UserContext의 user 상태 초기화
        setUser(null);

        navigate('/initial'); // 로그아웃 후 초기 화면으로 이동
      } else {
        console.error('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('서버와의 통신에 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };



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


    //시각장애인 배려용 화면 변경 버튼 
    const handleNavClickdisabled = () => {
      navigate('/disabled2'); // Disabled.jsx로 이동
    };
  
  return (
    <div className={styles.leftBar}>
      <div className={styles.title}>
        <h3>한국대학교
          <div>수강신청</div>
        </h3>
      </div>
      <div className={styles.userInfo}>
            <div>이름: {user.studentName}</div>
            <div>학번: {user.studentNumber}</div>
            <h4>학과 (부전공)</h4>
            <div>{user.departmentName}</div> 
            <div>(없음)</div>
      </div>

      <hr style={{ border: '1px solid white', backgroundColor: 'white', width: '190px',marginLeft: '-5px'}} />


      <div className={styles.creditsInfoE}>
          <button className={styles.sideBarComentBtn} onClick={handleNavClickdisabled}>
          <p className={styles.sideBarComent1} >시각장애인 배려용<br />화면 변경</p>
          <p className={styles.sideBarComent2}>이 네모칸을 클릭하면 <br /> 시각장애인 배려용<br /> 화면으로 넘어갑니다.</p>
          </button>
        </div>

      <div className={styles.toggleBtn}>
        <button onClick={() => togglePopup('totalInfo')}>+</button>전체 정보 보기
      </div>

      <hr style={{ border: '1px solid white', backgroundColor: 'white', width: '190px',marginLeft: '-5px'}} />


      <div className={styles['logoutBtn']}>
            <button onClick={handleLogout}>로그아웃</button>
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
