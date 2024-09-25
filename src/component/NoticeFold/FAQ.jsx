import React, { useState,useEffect } from 'react';
import styles from './FAQ.module.css';
import LeftBar from '../SideBarFold/LeftBar.jsx';
import Schedule from '../ScheduleFold/Schedule.jsx';
import MainBar from '../SideBarFold/MainBar.jsx';
import axios from 'axios';

const FAQItem = ({ id, question }) => {
  const [isOpen, setIsOpen] = useState(false); // 열림/닫힘 상태
  const [answer, setAnswer] = useState(''); // 답변 저장 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const toggleOpen = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      setLoading(true);
      try {
        // API 호출: /faq/{id}
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/faq/${id}`);
        setAnswer(response.data.answer); // 서버에서 받은 답변 저장
        setLoading(false);
      } catch (err) {
        console.error('FAQ 데이터를 불러오는 중 오류가 발생했습니다:', err);
        setError('답변을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles['faq-item']}>
      <div className={styles['faq-question']} onClick={toggleOpen}>
        {question}
        <span className={`${styles['faq-icon']} ${isOpen ? styles['open'] : ''}`}></span>
      </div>
      {isOpen && (
        <div className={styles['faq-answer']}>
          {loading ? '로딩 중...' : error ? error : answer}
        </div>
      )}
    </div>
  );
};


const FAQList = () => {
  const [faqs, setFaqs] = useState([]); // 서버에서 받은 FAQ 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태


useEffect(() => {
  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/faq`);

      console.log('FAQs from server (raw response):', response); // 전체 응답 로그
      console.log('FAQs data length:', response.data.length); // 데이터 배열의 길이 확인
      console.log('First FAQ item:', response.data[0]); // 첫 번째 항목 확인

      setFaqs(response.data); // 서버에서 받은 데이터 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error('FAQ 데이터를 불러오는 중 오류가 발생했습니다:', error);
      setError('FAQ 데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false); // 로딩 완료
    }
  };

  fetchFAQs(); // 컴포넌트가 마운트될 때 데이터를 가져옴
}, []);


  if (loading) {
    return <div>로딩 중...</div>; // 데이터를 불러오는 동안 로딩 메시지 표시
  }

  if (error) {
    return <div>{error}</div>; // 에러 발생 시 에러 메시지 표시
  }

  return (
    <div className={styles.container}>
      <div className={styles['faq-list']}>
        {faqs.map((faq) => (
          <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};


const FAQ = () => {
  return (
    <div className={styles.body}>
      <LeftBar />
      <MainBar />
      <FAQList />
      <Schedule />
    </div>
  );
};

export default FAQ;
