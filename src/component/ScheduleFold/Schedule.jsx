import React from 'react'; 
import styles from './Schedule.module.css'; // CSS Modules 스타일 임포트

const Schedule = () => { 
  return ( 
    <div className={styles.body}>
    <div className={styles.sidebar}> 
      <div className={styles.sidebarHeader}> 
        나의 시간표 
      </div> 
      <div className={styles['schedule-table']}>
        <div className={styles['schedule-header']}>
          {['월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div key={index} className={styles['schedule-cell']}>{day}</div>
          ))}
        </div>
        {[...Array(8)].map((_, rowIndex) => (
          <div key={rowIndex} className={styles['schedule-row']}>
            {[...Array(6)].map((_, colIndex) => (
              <div key={colIndex} className={styles['schedule-cell']}></div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.footer}> 
        현재 수강 학점 (/최대 수강 가능 학점)
        <br />
        0 / 21
        <br/> 
     
      </div> 
    </div> 
    </div>
  ); 
}; 

export default Schedule;
