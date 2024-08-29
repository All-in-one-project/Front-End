import React, { useEffect, useState } from 'react';
import styles from './ReserveWating.module.css'; 
import { useNavigate } from 'react-router-dom';

const ReserveWating = () => {
    const totalAnimationTime = 3; // 총 애니메이션 시간 (초)
    const [remainingTime, setRemainingTime] = useState(totalAnimationTime);
    const [queuePosition, setQueuePosition] = useState(1006); // 초기 대기 순번
    const navigate = useNavigate(); // 페이지 전환을 위한 네비게이트 훅

    useEffect(() => {
        let interval;
        // 2초 후에 애니메이션 시작
        const timer = setTimeout(() => {
            const percentBar = document.getElementById('percentBarInner');
            if (percentBar) {
                percentBar.style.width = '100%';

                // 남은 시간을 업데이트하는 인터벌 설정
                interval = setInterval(() => {
                    setRemainingTime(prevTime => {
                        if (prevTime > 0) {
                            setQueuePosition(prevPosition => {
                                // 1 ~ 현재 queuePosition 사이의 랜덤한 값으로 감소
                                const randomDecrease = Math.floor(Math.random() * prevPosition) + 1;
                                return prevPosition - randomDecrease;
                            });
                            return prevTime - 1;
                        } else {
                            clearInterval(interval);
                            return 0;
                        }
                    });
                }, 1000);
            }
        }, 2000);

        // 3초 후에 다시 Reserve 페이지로 돌아가기
        const returnTimer = setTimeout(() => {
            navigate('/reserve'); // 수강신청 페이지로 돌아감
        }, totalAnimationTime * 1000);

        // 컴포넌트 언마운트 시 타이머 및 인터벌 정리
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            clearTimeout(returnTimer);
        };
    }, [navigate]);

    return (
        <div className={styles.reserveWatingTotalBox}>
            <p className={styles.reserveWatingTitle}>신청 중 입니다!</p>
            <p className={styles.reserveWatingTitleEstimatedTime}>
                예상 대기 시간은 {remainingTime < 10 ? `00분 0${remainingTime}초` : `00분 ${remainingTime}초`} 입니다.
            </p>
            <div className={styles.reserveWatingPercentBar}>
                <div id="percentBarInner" className={styles.reserveWatingPercentBarInner}></div>
            </div>
            <p className={styles.reserveWatingProcedure}>현재 {queuePosition}번째 입니다.</p>
            <p className={styles.reserveWatingNotice}>* 새로고침 시 초기화되어 더 늦어질 수 있습니다.</p>
        </div>
    );
};

export default ReserveWating;
