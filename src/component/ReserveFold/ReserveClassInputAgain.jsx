import React from 'react';
import styles from './ReserveClassInputAgain.module.css';

const ReserveClassInputAgain = ({ lecture, onConfirm, onCancel }) => {
  return (
    <div className={styles.reserveClassInputAgainTotalBox}>
      <p className={styles.reserveClassInputAgainTitle}>과목 코드 직접 입력</p>
      <div className={styles.reserveClassInputNoticeContainer}>
      <p className={styles.reserveClassInputAgainNotice}style={{marginBottom:'10px'}}>해당 과목이 존재하지 않거나</p>
      <p className={styles.reserveClassInputAgainNotice}style={{marginBottom:'10px'}}>이미 수강한 과목입니다.</p>
      <p className={styles.reserveClassInputAgainNotice}>과목 코드를 확인 후 다시 입력 바립니다!</p>
      </div>
      <div className={styles.reserveClassInputAgainButtonContainer}>
        <button className={styles.reserveClassInputAgainButtonDelete} onClick={onConfirm}>확인 및 다시 입력하기</button>
       
      </div>
    </div>
  );
};

export default ReserveClassInputAgain;
