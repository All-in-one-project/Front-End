import React from 'react';
import styles from './ReserveDelete.module.css';

const ReserveDelete = ({ lecture, onConfirm, onCancel }) => {
  return (
    <div className={styles.reserveDeleteTotalBox}>
      <p className={styles.reserveDeleteTitle}>일반 수강 신청 내역</p>
      <p className={styles.reserveDeleteClassName}>{lecture.name}</p>
      <p className={styles.reserveDeleteAsk}>정말 수강 신청 취소하시겠습니까?</p>
      <div className={styles.reserveDeleteButtonContainer}>
        <button className={styles.reserveDeleteButtonDelete} onClick={onConfirm}>신청 취소하기</button>
        <button className={styles.reserveDeleteButtonBack} onClick={onCancel}>돌아가기</button>
      </div>
    </div>
  );
};

export default ReserveDelete;
