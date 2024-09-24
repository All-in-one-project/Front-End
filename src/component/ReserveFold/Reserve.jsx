import React, { useState, useEffect,useContext  } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Reserve.module.css';
import ReserveWating from './ReserveWating'; // 대기 화면 컴포넌트
import ReserveDelete from './ReserveDelete'; // 삭제 확인 화면 컴포넌트
import ReserveClassInputAgain from './ReserveClassInputAgain'; // 과목 코드 입력 오류 확인 화면 컴포넌트
import axios from 'axios';
import { UserContext } from '../UserContext';

function Reserve() {
  const [lectures, setLectures] = useState([]);
  const lecturelist = [
    { id: 1, subjectName: "20세기 한국사", hours: "(월4,5)", lecture: "21032-001" },
    { id: 2, subjectName: "경제학 입문", hours: "(화3,4)", lecture: "21032-002" },
    { id: 3, subjectName: "프로그래밍 기초", hours: "(수1,2)", lecture: "21032-003" },
    { id: 4, subjectName: "심리학 개론", hours: "(목2,3)", lecture: "21032-004" },
  ];
  const [lectureList, setLectureList] = useState(lecturelist);
  const [subjectCode, setSubjectCode] = useState('');
  const [divisionCode, setDivisionCode] = useState('');
  const [selectedSubNav, setSelectedSubNav] = useState('');
  const [selectedGridContainer, setSelectedGridContainer] = useState('');
  const [selectedDepartmentContainer, setSelectedDepartmentContainer] = useState('');
  const [selectedYearContainer, setSelectedYearContainer] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarLectures, setSidebarLectures] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [lecturePlan, setLecturePlan] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [sidebarTitle, setSidebarTitle] = useState('예비수강신청');
  const [isWaiting, setIsWaiting] = useState(false); // 대기 상태를 관리하는 state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 화면 제어
  const [lectureToRemove, setLectureToRemove] = useState(null); // 삭제할 강의 정보
  const [showInputError, setShowInputError] = useState(false); // 과목 코드 오류 화면 제어
  const [colleges, setColleges] = useState([]); // 대학 리스트
  const [departments, setDepartments] = useState([]); // 학과 리스트
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [selectedYear, setSelectedYear] = useState(''); // 선택된 학년
  const [inputSubjectName,setInputSubjectName] =useState('') //강의명 검색
  const [subjectName, setSubjectName] =useState('')// 
  const { user } = useContext(UserContext); // 이미 로그인한 사용자 정보가 있다면 가져오기
  const [searchResults, setSearchResults] = useState([]); // 강의명으로 조회 결과 데이터
  const [basketLectures, setBasketLectures] = useState([]); // 장바구니 데이터 저장 상태
  const [scheduleData, setScheduleData] = useState([]); // 서버에서 받은 시간표 데이터
  const [schedule, setSchedule] = useState(Array(5).fill(null).map(() => Array(9).fill(null))); // 기존 시간표 상태

  const [appliedLectures, setAppliedLectures] = useState(() => {
    const savedLectures = JSON.parse(localStorage.getItem('appliedLectures')) || [];
    return savedLectures;
  });
  useEffect(() => {
    // 시간표 API 호출
    const fetchScheduleData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // 토큰을 로컬스토리지에서 가져옴
        const response = await axios.get('http://43.202.223.188:8080/enrollment/schedule', {
          params: {
            studentId: 1,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더 추가
          },
        });

        if (response.data.status === 201) {
          setScheduleData(response.data.data); // 서버에서 받은 시간표 데이터 설정
        } else {
          console.error('Error fetching schedule:', response.data);
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      }
    };

    fetchScheduleData();
  }, []);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const isTimeInRange = (time, firstTime, lastTime) => {
    const targetTime = new Date(`1970-01-01T${time}:00`).getTime(); // 비교할 시간
    const startTime = new Date(`1970-01-01T${firstTime}`).getTime();
    const endTime = new Date(`1970-01-01T${lastTime}`).getTime();

    return targetTime >= startTime && targetTime < endTime; // 해당 시간이 강의 시간 범위 내에 있는지
  };

  useEffect(() => {
    const savedLectures = JSON.parse(localStorage.getItem('appliedLectures'));
    if (savedLectures) {
      setAppliedLectures(savedLectures);
    }
  }, []);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.get('http://43.202.223.188:8080/api/college')
      .then(response => {
        console.log('Received response:', response); // 응답 전체 확인
        setColleges(response.data);
        console.log('Fetched Colleges:', response.data); // 데이터가 설정되었는지 확인
      })
      .catch(error => {
        console.error('There was an error fetching the colleges!', error); // 에러 메시지 확인
      });
  }, []);


  // 수강신청 

  const sendEnrollmentData = async (lecture) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        "http://43.202.223.188:8080/enrollment",
        {
          studentId: 1,
          lectureId: lecture.lectureId, // 동적으로 전달된 강의의 id 사용
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    
      console.log('수강 신청 성공:', response.data);
      
      // 수강 신청 후 시간표 데이터를 다시 가져옴
      await fetchScheduleData();  // 시간표 업데이트
    } catch (error) {
      console.error('수강 신청 실패:', error);
    }
  };
  

  //예비수강신청 장바구니 담기
  const sendBasketData = async (lecture) => {
    try {
      // 토큰을 로컬 스토리지에서 가져오거나 Context에서 가져올 수 있음
      const accessToken = localStorage.getItem('accessToken');
  
      // Axios 요청에 accessToken을 헤더로 추가하여 POST 요청
      const response = await axios.post(
        "http://43.202.223.188:8080/basket",
        {
          studentId: 1, // 실제 studentId를 동적으로 할당
          lectureId: lecture.id, // 선택된 강의의 id 전달
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 포함
          },
        }
      );
  
      console.log('장바구니 담기 성공:', response.data); // 서버 응답 처리
    } catch (error) {
      console.error('장바구니 담기에 실패했습니다.', error);
    }
  };
  
  const handleAddToCart = async (lecture) => {
    // sidebarLectures가 배열인지 확인하고, 아니면 빈 배열로 처리
    const lectures = Array.isArray(sidebarLectures) ? sidebarLectures : [];
  
    const isAlreadyInCart = lectures.some(item => item.id === lecture.id);
  
    if (!isAlreadyInCart) {
      setSidebarLectures([...lectures, lecture]);
      await sendBasketData(lecture); // 장바구니에 담고 서버로 전송
      await checkBasketData(); // 장바구니 데이터를 다시 불러와 상태 업데이트
    } else {
      alert('이미 장바구니에 담긴 과목입니다.');
    }
  };
  

  // 예비 수강신청 장바구니 조회
  const checkBasketData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await axios.get(
        `http://43.202.223.188:8080/basket/1`, // studentId를 경로에 포함
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 포함
          },
        }
      );
  
      console.log('장바구니 조회:', response.data.data);
  
      // 항상 서버로부터 최신 데이터를 받아옴
      setSidebarLectures(response.data.data)
      setBasketLectures(response.data.data); // 데이터 저장
    } catch (error) {
      console.error('장바구니 조회에 실패했습니다.', error);
    }
  };
  
  // 상태 추가
  
  // 장바구니 조회를 한 번 호출
  useEffect(() => {
    checkBasketData();
  }, []);
  


  const fetchDepartments = (collegeId) => {
    axios.get(`http://43.202.223.188:8080/api/departments/${collegeId}`)
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
      });
  };

  const fetchSubjects = (departmentId) => {
    axios.get(`http://43.202.223.188:8080/api/subjects/${departmentId}`)
      .then(response => {
        console.log("Fetched Subjects:", response.data); // 추가된 로그
        setLectures(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the subjects!', error);
      });
  };

  // 예비수강신청 장바구니 삭제 함수
  const DeleteBasketData = async (lectureId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log(lectureId)
      
      const response = await axios.delete(
        `http://43.202.223.188:8080/basket/1/${lectureId}`, // student_id와 lecture_id를 경로로 전달
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
  
      if(response.data.status===200){
        console.log('장바구니에서 삭제를 성공했습니다',response.data.status);
      }else{
        console.log('장바구니에서 삭제를 실패했습니다',response.data);
      }
      
    } catch (error) {
      console.error('장바구니에서 삭제에 실패했습니다.', error);
    }
  };

  useEffect(() => {
    if (selectedGridContainer && selectedDepartmentContainer && selectedYearContainer.length > 0) {
      console.log('Selected Grid:', selectedGridContainer);
      console.log('Selected Department:', selectedDepartmentContainer);
      console.log('Selected Year:', selectedYearContainer);
    }
  }, [selectedGridContainer, selectedDepartmentContainer, selectedYearContainer]);

  const handleSubjectCodeChange = (e) => setSubjectCode(e.target.value);
  const handleDivisionCodeChange = (e) => setDivisionCode(e.target.value);

  const handleRemoveLectureFromSidebar = (id) => {
    const lecture = sidebarLectures.find((lecture) => lecture.id === id);

    if (selectedSubNav === '예비수강신청') {
      // 장바구니에서 강의 삭제
      DeleteBasketData(lecture.lectureId);
      // 예비수강신청일 때는 바로 삭제 처리
      setSidebarLectures(sidebarLectures.filter((lecture) => lecture.id !== id));
      removeLectureFromSchedule(lecture);

    } else {
      // 일반수강신청일 때는 삭제 확인 화면 표시
      setLectureToRemove(lecture);
      setShowDeleteConfirm(true);
    }
  };


  useEffect(() => {
    // "일반수강신청"을 선택했을 때 장바구니 데이터를 로드
    if (selectedSubNav === '일반수강신청') {
      checkBasketData();  // 장바구니 데이터를 로드하는 함수 호출
    }
  }, [selectedSubNav]);

  
//수강신청 취소
const cancelEnrollment = async (lectureId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.delete(
      `http://43.202.223.188:8080/enrollment/1/${lectureId}`, // studentId와 lectureId를 포함한 경로
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    );
    console.log('수강 취소 성공:', response.data);
    
    // 수강 취소 후 시간표 데이터를 다시 가져옴
    await fetchScheduleData();  // 시간표 업데이트
  } catch (error) {
    console.error('수강 취소 실패:', error);
  }
};

  
const fetchScheduleData = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get('http://43.202.223.188:8080/enrollment/schedule', {
      params: {
        studentId: 1,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status === 201) {
      setScheduleData(response.data.data); // 서버에서 받은 시간표 데이터 설정
    } else {
      console.error('Error fetching schedule:', response.data);
    }
  } catch (error) {
    console.error('Error fetching schedule data:', error);
  }
};


const handleConfirmDelete = async () => {
  try {
    // 수강 취소 API 호출
    await cancelEnrollment(lectureToRemove.lectureId);

    // 신청 취소 후 상태 업데이트
    setAppliedLectures(appliedLectures.filter((lecture) => lecture.lectureId !== lectureToRemove.lectureId));

    const lectures = Array.isArray(sidebarLectures) ? sidebarLectures : [];
    setSidebarLectures(lectures.filter((lecture) => lecture.id !== lectureToRemove.id));

    // 사이드바를 열지 않도록 변경
    removeLectureFromSchedule(lectureToRemove);
    setShowDeleteConfirm(false); // 삭제 확인 화면 숨김
  } catch (error) {
    console.error('삭제 처리 중 오류 발생:', error);
  }
};


  

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false); // 삭제 확인 화면 숨김
  };

  const removeLectureFromSchedule = (lecture) => {
    const timeMapping = {
      '월': 0,
      '화': 1,
      '수': 2,
      '목': 3,
      '금': 4,
    };
  
    // lectureTimes가 존재하는지 확인
    if (!lecture.lectureTimes || lecture.lectureTimes.length === 0) {
      console.error("Lecture times are missing or invalid.");
      return; // lectureTimes가 없는 경우 함수 종료
    }
  
    console.log(lecture);
  
    // 새로운 시간표 배열을 복사
    const newSchedule = [...schedule];
  
    // lectureTimes 배열을 순회하여 요일과 시간을 추출
    lecture.lectureTimes.forEach(timeSlot => {
      const day = timeSlot.dayOfWeek; // 요일 추출
      const firstTime = parseInt(timeSlot.firstTime.split(':')[0], 10); // 시작 시간의 시(hour) 추출
      const lastTime = parseInt(timeSlot.lastTime.split(':')[0], 10); // 끝나는 시간의 시(hour) 추출
  
      // 요일과 시간에 맞는 시간표 데이터를 업데이트 (예: 09:00부터 12:00까지)
      for (let time = firstTime; time < lastTime; time++) {
        newSchedule[timeMapping[day]][time - 9] = null; // 시간표에서 9시가 첫 번째(0번째) 슬롯이라고 가정
      }
    });
  
    // 업데이트된 시간표를 상태에 반영
    setSchedule(newSchedule);
  
    // 강의를 appliedLectures에서 제거
    setAppliedLectures(appliedLectures.filter((appliedLecture) => appliedLecture.id !== lecture.id));
  };
  


// 신청 버튼을 눌렀을 때 상태 업데이트
const handleApplyLecture = async (lecture) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `http://43.202.223.188:8080/enrollment/1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const appliedLecturesFromServer = response.data.data || [];

    if (!Array.isArray(appliedLecturesFromServer)) {
      console.error('Invalid data format for appliedLectures:', appliedLecturesFromServer);
      return;
    }

    if (appliedLecturesFromServer.some(appliedLecture => appliedLecture.lectureId === lecture.lectureId)) {
      alert('이미 신청된 과목입니다.');
      return;
    }

    await sendEnrollmentData(lecture); // 수강 신청

    // 신청이 완료된 후 수강 신청 내역을 갱신
    const updatedLectures = Array.isArray(appliedLectures) ? [...appliedLectures, lecture] : [lecture];
    setAppliedLectures(updatedLectures);

    // 사이드바 상태를 갱신하여 신청 내역이 바로 반영되도록 업데이트
    await checkEnrollmentData();  // 수강신청 데이터 불러오기

    localStorage.setItem('appliedLectures', JSON.stringify(updatedLectures));
    console.log('신청 성공:', lecture);
  } catch (error) {
    console.error('신청 실패:', error);
  }
};





  const updateSchedule = (lecture) => {
    const timeMapping = {
      '월': 0,
      '화': 1,
      '수': 2,
      '목': 3,
      '금': 4,
    };

    const days = lecture.time.match(/(월|화|수|목|금)/g);
    const times = lecture.time.match(/\d/g).map(Number);

    const newSchedule = [...schedule];

    days.forEach(day => {
      times.forEach(time => {
        newSchedule[timeMapping[day]][time - 1] = '#637ABF';
      });
    });

    setSchedule(newSchedule);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSubNavClick = (event) => {
    setSelectedSubNav(event.target.innerText);
  };

  const handleGridContainerClick = (collegeId) => {
    console.log('College clicked:', collegeId); // 추가된 로그
    if (selectedGridContainer === collegeId) {
      setSelectedGridContainer('');
      setSelectedDepartmentContainer('');
      setDepartments([]);
      setLectures([]);
      setFilteredLectures([]);
    } else {
      if (selectedGridContainer) {
        setPopupMessage(
          <div>
            해당 항목은 복수 선택이 불가능합니다!
            <br />
            <span style={{ fontWeight: 'normal' }}>
              (단과대 및 학과/학부 복수 선택 불가능)
            </span>
          </div>
        );
        togglePopup('error');
      } else {
        setSelectedGridContainer(collegeId);
        setSelectedDepartmentContainer('');
        setDepartments([]);
        setLectures([]);
        console.log('Selected College:', collegeId); 
        setFilteredLectures([]);
        fetchDepartments(collegeId);
      }
    }
  };

  const handleDepartmentContainerClick = (departmentId) => {
    if (selectedDepartmentContainer === departmentId) {
      setSelectedDepartmentContainer('');
      setLectures([]);
      setFilteredLectures([]);
    } else {
      if (selectedDepartmentContainer) {
        setPopupMessage(
          <div>
            해당 항목은 복수 선택이 불가능합니다!
            <br />
            <span style={{ fontWeight: 'normal' }}>
              (단과대 및 학과/학부 복수 선택 불가능)
            </span>
          </div>
        );
        togglePopup('error');
      } else {
        setSelectedDepartmentContainer(departmentId);
        setSelectedYearContainer([]);
        setLectures([]);
        setFilteredLectures([]);
         console.log('Selected Department:', departmentId); 
        fetchSubjects(departmentId);
      }
    }
  };

  const handleYearContainerClick = (year) => {
    if (selectedYearContainer.includes(year)) {
      // 학년 선택 해제 시 해당 학년의 강의 제거
      setSelectedYearContainer(selectedYearContainer.filter(item => item !== year));
      
      // 선택 해제된 학년에 해당하는 강의를 filteredLectures에서 제거
      setFilteredLectures(prevLectures => prevLectures.filter(lecture => lecture.targetGrade !== year));
      
    } else if (selectedYearContainer.length < 4) {
      // 학년 추가 시 선택된 학년과 강의를 상태에 추가
      setSelectedYearContainer([year]);  // 새로운 학년을 선택할 때는 이전 선택을 초기화
      
      // 선택된 학년에 따라 lectures 배열을 필터링하여 해당 학년 데이터만 저장
      const filteredLecturesByGrade = lectures.filter(lecture => lecture.targetGrade === year);
      
      // 이전 데이터를 유지하지 않고 새롭게 필터링된 데이터로 덮어쓰기
      setFilteredLectures(filteredLecturesByGrade);  // 이전 강의를 유지하지 않고 새롭게 설정
      
    } else {
      alert('학년은 4개까지 선택할 수 있습니다.');
    }
  };

  const filteredLecturesYear = lectures.filter(lecture => lecture.grade === selectedYear);

  const toggleSidebar = async () => {
    setIsSidebarOpen(!isSidebarOpen);
  
    if (selectedSubNav === '예비수강신청') {
      // 예비수강신청일 때 장바구니 데이터를 불러오기
      setSidebarTitle('예비수강신청');
      await checkBasketData();  // 장바구니 데이터 불러오기
    } else if (selectedSubNav === '일반수강신청') {
      // 일반수강신청일 때 수강신청 데이터를 불러오기
      setSidebarTitle('일반수강신청');
      await checkEnrollmentData();  // 수강신청 데이터 불러오기
    }
  };
  
  
// 수강신청 내역 조회 함수
const checkEnrollmentData = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `http://43.202.223.188:8080/enrollment/1`, // studentId 경로에 포함
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 토큰 추가
        },
      }
    );
    
    console.log('수강신청 내역 조회:', response.data.data);
    
    // 수강신청 내역을 appliedLectures에 저장하여 상태를 동기화
    setAppliedLectures(response.data.data);
    
    // 수강신청 내역을 sidebarLectures에도 저장
    setSidebarLectures(response.data.data);
  } catch (error) {
    console.error('수강신청 내역 조회에 실패했습니다.', error);
  }
};

useEffect(() => {
  // 페이지 로드 시 수강신청 내역을 불러옴
  checkEnrollmentData();
}, []);


  const togglePopup = (type) => {
    setPopupType(type);
    setIsPopupVisible(!isPopupVisible);
  };

  const renderCloseButton = () => {
    return (
      <button className={styles.closeBtn} onClick={() => togglePopup('')}>
        ✖
      </button>
    );
  };

  const renderErrorCloseButton = () => {
    return (
      <button className={styles.colseBtnmultiple} onClick={() => togglePopup('')}>
        확인 및 다시 선택하기
      </button>
    );
  };

  const fetchLectures = (collegeId, departmentId, gradeId) => {
    const exampleLectures = [
      {
        id: '21032-001',
        category: '[전핵]',
        name: '컴퓨터 네트워크',
        professor: '김철수',
        time: '월 1,2,3',
      },
      {
        id: '21032-002',
        category: '[전선]',
        name: '자바',
        professor: '유정',
        time: '월 5,6,7,8',
      },
      {
        id: '20930-001',
        category: '[전선]',
        name: '웹 프로그래밍',
        professor: '민경식',
        time: '수 2,3,4',
      },
      {
        id: '20931-012',
        category: '[전선]',
        name: '소프트웨어 공학',
        professor: '최지우',
        time: '목 6,7,8',
      },
      {
        id: '21032-003',
        category: '[전핵]',
        name: '캡스톤 디자인 1',
        professor: '김철수',
        time: '수 5,6,7',
      },
      {
        id: '21032-004',
        category: '[전선]',
        name: '인공지능',
        professor: '김철수',
        time: '금 2,3,4',
      },
      {
        id: '21032-005',
        category: '[전교]',
        name: '확률과 통계',
        professor: '김철수',
        time: '화 1,2,3',
      },
      {
        id: '21032-006',
        category: '[전선]',
        name: '데이터 베이스 관리',
        professor: '김철수',
        time: '목 1,2,3',
      },
    ];
    setLectures(exampleLectures);
  };

  useEffect(() => {
    if (selectedGridContainer && selectedDepartmentContainer && selectedYearContainer.length > 0) {
      const departmentsForSelectedCollege = departmentMapping[selectedGridContainer];
      
      if (!departmentsForSelectedCollege) {
        console.error("Selected college does not exist in the mapping.");
        return;
      }
  
      const collegeId = Object.keys(departmentMapping).indexOf(selectedGridContainer) + 1;
      const departmentId = departmentsForSelectedCollege.indexOf(selectedDepartmentContainer) + 1;
      const gradeId = parseInt(selectedYearContainer[0][0], 10);
  
      fetchLectures(collegeId, departmentId, gradeId);
    }
  }, [selectedGridContainer, selectedDepartmentContainer, selectedYearContainer]);

  const departmentMapping = {
    'ICT융합과학대학': ['컴퓨터공학부', '데이터과학부', '정보통신학부'],
    '건강과학대학': ['간호학부', '물리치료학부', '임상병리학부'],
    '음악대학': ['성악과', '기악과', '작곡과'],
    '법학대학': ['법학부'],
    '자연과학대학': ['수학부', '화학부', '물리학부'],
    '공과대학': ['기계공학부', '전기전자공학부', '화학공학부'],
    '인문사회대학': ['사회복지학부', '심리학부', '국문학부'],
    '미술대학': ['회화과', '조소과', '디자인과'],
    '체육대학': ['체육학부', '스포츠과학부', '무용과'],
    '교양대학': ['교양학부']
  };

  const [departmentList, setDepartmentList] = useState(departmentMapping['ICT융합과학대학']);

  const fetchLecturePlan = (lectureId) => {
    const lecturePlans = {
      '21032-001': 'This is the lecture plan for 컴퓨터 네트워크.',
      '21032-002': 'This is the lecture plan for 자바.',
      '21032-003': 'This is the lecture plan for 웹 프로그래밍.',
      '21032-004': 'This is the lecture plan for 소프트웨어 공학.',
    };

    setLecturePlan(lecturePlans[lectureId] || '해당 강의의 계획서를 찾을 수 없습니다.');
    togglePopup('lecturePlan');
  };

  const handleSubjectCodeInput = () => {
    const foundLecture = lectureList.find((lecture) => lecture.lecture === subjectCode);

    if (foundLecture) {
      handleAddToCart(foundLecture);
    } else {
      setShowInputError(true); // 과목 코드 오류 화면 표시
    }
  };

  const handleConfirmInputError = () => {
    setShowInputError(false); // 오류 화면 숨김
  };

  const MainLectureItem = ({ lecture }) => (
    <div className={styles.lectureBox}>
      <div className={styles.topRow}>
        <div>{lecture.subjectCode}</div>
        <div className={styles.category}>{lecture.subjectDivision}</div>
      </div>
      <div className={styles.name} style={{fontSize:'13px'}}>{lecture.subjectName}</div>
      <div className={styles.time}>{lecture.professorName} | {lecture.lectureTime}</div>
      <div className={styles.buttons} >
        <button className={styles.basket} onClick={() => handleAddToCart(lecture)} style={{marginRight:'4px'} }>장바구니</button>
        <button className={styles.plan} onClick={() => fetchLecturePlan(lecture.id)} style={{marginRight:'10px'} }>강의 계획서</button>
      </div>
    </div>
  );

  const LectureItem = ({ lecture }) => (
    <div className={styles.lectureItem}>
      <span className={styles.lectureName}>{lecture.subjectName}  {lecture.lectureTime}</span>
      <button className={styles.infoBtn} onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
      <button className={styles.applyBtn} onClick={() => handleAddToCart(lecture)}>추가</button>
    </div>
  );

  const PopupLectureItem = ({ lecture }) => (
    <div className={styles.lectureItem}>
      <span className={styles.lectureName}>{lecture.subjectName}</span>
      <button className={styles.infoBtn} onClick={() => fetchLecturePlan(lecture.id)}>정보</button>
      <button className={styles.applyBtn} onClick={() => handleAddToCart(lecture)}>추가</button>
    </div>
  );

  const additionalLectures = [
    { id: 5, name: "철학 개론 (금1,2)" },
    { id: 6, name: "미적분학 (월1,2)" },
    { id: 7, name: "물리학 (화2,3)" },
    { id: 8, name: "화학 (수3,4)" },
    { id: 9, name: "생물학 (목4,5)" },
    { id: 10, name: "통계학 (금3,4)" },
  ];

  // 대기 중이면 ReserveWating 컴포넌트를 렌더링
  if (isWaiting) {
    return <ReserveWating />;
  }

  // 삭제 확인 화면을 보여줍니다.
  if (showDeleteConfirm && lectureToRemove) {
    return (
      <ReserveDelete
        lecture={lectureToRemove}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    );
  }

  // 과목 코드 오류 화면을 보여줍니다.
  if (showInputError) {
    return (
      <ReserveClassInputAgain
        onConfirm={handleConfirmInputError}
      />
    );
  }

  //시각장애인 배려용 화면 변경 버튼 
  const handleNavClickdisabled = () => {
    navigate('/disabled'); // Disabled.jsx로 이동
  };

// 과목명으로 조회 후 신청
const handleFindSubjectName =(event)=>{
  setInputSubjectName(event.target.value)
  console.log(event.target.value)
}
console.log(inputSubjectName)

const onClickSearchIcon = async () => {
  const accessToken = localStorage.getItem('accessToken');
    axios.get('http://43.202.223.188:8080/api/subjects/search', {
      params: { lectureName: inputSubjectName },  
      headers: {
        Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 포함
      },
    })
    
    .then(response => {
      console.log(response.data)
      setSearchResults(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the search results!', error);
    });
};


  return (
    <div className={styles.body}>
      <div className={styles.leftBar}>
        <div className={styles.title}>
          <h3>한국대학교
            <div>수강신청</div></h3>
        </div>
        <div className={styles.userInfo}>
          <div>이름 김지훈</div>
          <div>학번 20210001</div>
          <h4>학과 (부전공)</h4>
          <div>데이터과학부</div>
          <div>(없음)</div>
        </div>

        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className={styles.creditsInfoE}>
          <button className={styles.sideBarComentBtn} onClick={handleNavClickdisabled}>
          <p className={styles.sideBarComent1} >시각장애인 배려용<br />화면 변경</p>
          <p className={styles.sideBarComent2}>이 네모칸을 클릭하면 <br /> 시각장애인 배려용<br /> 화면으로 넘어갑니다.</p>
          </button>
        </div>

        <div className={styles.toggleBtn}>
          <button onClick={() => togglePopup('totalInfo')}>+</button>전체 정보 보기
        </div>
        <div><hr style={{ border: '1px solid white' }} /></div>

        <div className={styles.logoutBtn}>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.navbar}>
          <button onClick={() => handleNavClick('/notice')}>공지사항</button>
          <button onClick={() => handleNavClick('/inquiry')}>과목조회</button>
          <button className={styles.application}>수강신청</button>
          <button onClick={() => handleNavClick('/mypage')}>마이페이지</button>
        </div>

        <div className={styles.subNavbar}>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '예비수강신청' ? styles.selected : ''}`}
            onClick={handleSubNavClick}
          >
            예비수강신청
          </button>
          <button
            className={`${styles.subNavbarBtn} ${selectedSubNav === '일반수강신청' ? styles.selected : ''}`}
            onClick={handleSubNavClick}
          >
            일반수강신청
          </button>
        </div>

        {selectedSubNav === '예비수강신청' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>단과대 선택</div>
              <div className={styles.gridContainer}>
                {colleges.map((college) => (
                  <div
                    key={college.id}
                    onClick={() => handleGridContainerClick(college.id)}
                    style={{
                      backgroundColor: selectedGridContainer === college.id ? '#637ABF' : 'white',
                      color: selectedGridContainer === college.id ? 'white' : 'rgb(104, 108, 109)',
                    }}
                  >
                    {college.collegeName}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>학부 및 학과 선택</div>
              <div className={styles.departmentContainer}>
                {departments.map((department) => (
                  <div
                    key={department.id}
                    onClick={() => handleDepartmentContainerClick(department.id)}
                    style={{
                      backgroundColor: selectedDepartmentContainer === department.id ? '#637ABF' : 'white',
                      color: selectedDepartmentContainer === department.id ? 'white' : 'rgb(104, 108, 109)',
                    }}
                  >
                    {department.departmentName}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
  <div className={styles.sectionTitle}>학년 선택</div>
  <div className={styles.yearContainer}>
    {['1학년', '2학년', '3학년', '4학년'].map((year) => (
      <div
        key={year}
        onClick={() => handleYearContainerClick(year)}
        style={{
          backgroundColor: selectedYearContainer.includes(year) ? '#637ABF' : 'white',
          color: selectedYearContainer.includes(year) ? 'white' : 'rgb(104, 108, 109)',
        }}
      >
        {year}
      </div>
    ))}
  </div>
</div>
<div><div style={{ width: '700px', height: '0.5px', backgroundColor: 'gray', marginTop: '4px' }} /></div>

<div className={styles.section}>
  <div className={styles.lectureContainer}>
    {filteredLectures.map((lecture, index) => (
      <MainLectureItem key={index} lecture={lecture} />
    ))}
  </div>
</div>

          </>
        )}

        {selectedSubNav === '일반수강신청' && (
          <>
            <div className={styles.generalApply}>
              <div className={styles.cartList}>
                <h3>장바구니 신청 내역</h3>
                <table style={{ backgroundColor: 'white', borderCollapse: 'collapse', width: '100%' }}>
                  <thead >
                    <tr >
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', width: '40px', height: '30px', backgroundColor: 'white' }}>No</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>과목명</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>분류</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>교수명</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>강의 정보</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>신청 여부</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', height: '30px', backgroundColor: 'white' }}>과목 코드</th>
                    </tr>
                  </thead>

                  <tbody>
  {Array.isArray(basketLectures) && basketLectures.length > 0 ? (
    basketLectures.map((lecture, index) => (
      <tr key={index} style={{ backgroundColor: 'white' }}>
        <td
          style={{
            border: '1px solid #ddd',
            padding: '4px',
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '30px',
          }}
        >
          {index + 1}
        </td>
        <td
          style={{
            border: '1px solid #ddd',
            padding: '4px',
            textAlign: 'left',
            verticalAlign: 'middle',
            fontWeight: 'bold',
            height: '30px',
          }}
        >
          {lecture.subjectName}
        </td>
        <td
          style={{
            border: '1px solid #ddd',
            padding: '4px',
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '30px',
          }}
        >
          {lecture.subjectDivision ? lecture.subjectDivision.replace(/[\[\]]/g, '') : 'N/A'}
        </td>
        <td
          style={{
            border: '1px solid #ddd',
            padding: '4px',
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '30px',
          }}
        >
          {lecture.professorName}
        </td>
        <td
          style={{
            border: '1px solid #ddd',
            padding: '4px',
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '30px',
          }}
        >
          {lecture.lectureTimes && lecture.lectureTimes.length > 0
            ? lecture.lectureTimes.map((time, idx) => (
                <span key={idx}>
                  {time.dayOfWeek} {time.firstTime.slice(0, 5)} ㅡ {time.lastTime.slice(0, 5)}
                  <br />
                </span>
              ))
            : '시간 정보 없음'}
        </td>

        <td
  style={{
    border: '1px solid #ddd',
    padding: '4px',
    textAlign: 'center',
    verticalAlign: 'middle',
    height: '30px',
  }}
>
  <button
    onClick={() => handleApplyLecture(lecture)}
    style={{
      backgroundColor: Array.isArray(appliedLectures) && appliedLectures.some(appliedLecture => appliedLecture.lectureId === lecture.lectureId) 
        ? '#637ABF' 
        : 'rgb(212, 216, 243)',
      color: Array.isArray(appliedLectures) && appliedLectures.some(appliedLecture => appliedLecture.lectureId === lecture.lectureId) 
        ? 'white' 
        : 'black',
      border: 'none',
      fontWeight: '700',
      padding: '2px 5px',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '60px',
      textAlign: 'center',
      height: '26px',
    }}
  >
    {Array.isArray(appliedLectures) && appliedLectures.some(appliedLecture => appliedLecture.lectureId === lecture.lectureId) 
      ? '완료' 
      : '신청'}
  </button>
</td>

        <td
          style={{
            border: '1px solid #ddd',
            padding: '4px',
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '30px',
          }}
        >
          {lecture.lectureNumber}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
        장바구니에 강의가 없습니다.
      </td>
    </tr>
  )}
</tbody>


                </table>
              </div>

              <hr style={{ marginTop: '30px' }} />
              <div className={styles.searchAndInputContainer}> {/* 새로운 가로 배치 div */}
              <div className={styles.sectionContainer} style={{ borderRight: '1px solid grey', paddingRight: '30px' }}>
  <div className={styles.section}>
    <div className={styles.sectionTitle}>과목 검색 및 신청</div>
    <div className={styles.searchContainer}>
      <input 
        type="text" 
        placeholder="과목명 검색" 
        style={{ width: '260px', marginRight: '50px', height: '30px', paddingLeft: '14px' }}
        value={inputSubjectName} // 입력 값을 상태로 관리
        onChange={handleFindSubjectName} // 입력 값 변경 시 상태 업데이트
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onClickSearchIcon(); // 엔터 키 입력 시 검색 실행
          }
        }}
      />
      <FaSearch className={styles.searchIcon} onClick={onClickSearchIcon} /> {/* 클릭 시 검색 실행 */}
    </div>
  </div>
  <div className={styles.lectureList}>
    {searchResults.length > 0 ? (
      searchResults.map((lecture) => (
        <LectureItem key={lecture.id} lecture={lecture} /> // 검색 결과 렌더링
      ))
    ) : (
      lectureList.map((lecture) => (
        <LectureItem key={lecture.id} lecture={lecture} /> // 기본 목록 렌더링
      ))
    )}
    <button type="button" className={styles.more} onClick={() => togglePopup('moreLectures')} style={{ width: '276px' }}>
      더보기
    </button>
  </div>
</div>


                <div className={styles.sectionContainer}>
                  <div className={styles.sectionSubject}>
                    <div className={styles.sectionTitle}>과목 코드 직접 입력</div>
                    <input
                      type="text"
                      placeholder="과목 코드 입력"
                      className={styles.subjectCode}
                      value={subjectCode}
                      onChange={handleSubjectCodeChange}
                      style={{ marginBottom: '10px', marginLeft: '5px' }}
                    />
                    <button type="button" className={styles.cartBtn} onClick={handleSubjectCodeInput}>
                      수강신청
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.rightBar2}>
        {selectedSubNav === '예비수강신청' && (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>강의명으로 조회 후 신청</div>
              <div className={styles.searchContainer}>
              <input
      type="text"
      placeholder="강의명 검색"
      value={inputSubjectName}
      onChange={handleFindSubjectName}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onClickSearchIcon();
        }
      }}
    />
                <FaSearch className={styles.searchIcon} onClick={onClickSearchIcon}/>
              </div>
            </div>

            <div className={styles['lectureList']} style={{ zIndex: isSidebarOpen ? '1' : '1000' }}>
          {searchResults.length > 0 ? (
            searchResults.map((lecture) => (
              <LectureItem key={lecture.id} lecture={lecture} />
            ))
          ) : (
            lecturelist.map((lecture) => (
              <LectureItem key={lecture.id} lecture={lecture} />
            ))
          )}
              <button type="button" className={styles.more} onClick={() => togglePopup('moreLectures')} style={{width:"278px"}}>더보기</button>
            </div>
          </>
        )}

        {selectedSubNav === '일반수강신청' && (
          <>
            <div className={styles.scheduleContainer}>
      <h3 className={styles.scheduleTitle}>나의 시간표</h3>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th style={{ backgroundColor: 'white' }}>시간</th>
            <th style={{ backgroundColor: 'white' }}>월</th>
            <th style={{ backgroundColor: 'white' }}>화</th>
            <th style={{ backgroundColor: 'white' }}>수</th>
            <th style={{ backgroundColor: 'white' }}>목</th>
            <th style={{ backgroundColor: 'white' }}>금</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, timeSlotIndex) => (
            <tr key={timeSlotIndex} style={{ backgroundColor: 'white' }}>
              <td>{time}</td> {/* 시간 표시 */}
              {['월', '화', '수', '목', '금'].map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  style={{
                    backgroundColor: scheduleData.some(
                      (lecture) => lecture.dayOfWeek === day &&
                        isTimeInRange(time, lecture.firstTime, lecture.lastTime)
                    )
                      ? '#637ABF' // 시간 범위에 있을 때 배경색 변경
                      : 'transparent',
                    height: '50px',
                    width: '100px'
                  }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.creditsInfoSchedule}>
        현재 수강 학점 (/최대 수강 가능 학점):<br /><br />  {scheduleData.length * 3} / 21
      </div>
    </div>
          </>
        )}
      </div>

      {!isSidebarOpen && (
        <button className={styles.circleButton} onClick={toggleSidebar}>
          +
        </button>
      )}
      <div className={`${styles.rightBar} ${isSidebarOpen ? styles.open : ''}`}>
        <button className={styles.closeSidebarButton} onClick={toggleSidebar}>
          ㅡ
        </button>
        <div className={styles.sidebarContent}>
  <div className={styles.sidebarSection}>
    <div className={styles.basketTitle}>{sidebarTitle}</div>
    {sidebarLectures && sidebarLectures.length > 0 ? (
      sidebarLectures.map((lecture, index) => (
        <div key={index} className={styles.lectureBox}>
          <div className={styles.name} style={{fontWeight: "900", fontSize: "16px"}}>{lecture.subjectName}</div>
          <div className={styles.topRow}>
            <div>{lecture.subjectCode} [{lecture.subjectDivision}]</div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.remove} onClick={() => handleRemoveLectureFromSidebar(lecture.id)}>X</button>
          </div>
        </div  >
      ))
    ) : (
      <div className={styles.nonSubject}>강의가 없습니다.</div> // 빈 장바구니일 때 표시할 메시지
    )}
  </div>
</div>
</div>

      {isPopupVisible && (
        <div className={styles.popup}>
          <div className={`${styles.popupInner} ${styles[popupType]}`}>
            {renderCloseButton()}
            {popupType === 'totalInfo' && (
              <div>
                <h3 className={styles.popupTitle}>전체 학점 정보 (부전공)</h3>
                <ul className={styles.infoList}>
                  <li><span className={styles.label}>총합</span> <span className={styles.value}>115 / 130</span></li>
                  <li><span className={styles.label}>전공 핵심</span> <span className={styles.value}>21/ 24</span></li>
                  <li><span className={styles.label}>전공 선택</span> <span className={styles.value}>36 / 48</span></li>
                  <li><span className={styles.label}>전공 교양</span> <span className={styles.value}>9 / 9</span></li>
                  <li><span className={styles.label}>전공 취업</span> <span className={styles.value}>3 / 3</span></li>
                  <li><span className={styles.label}>중요 핵심</span> <span className={styles.value}>4 / 4</span></li>
                  <li><span className={styles.label}>기술 교양</span> <span className={styles.value}>18 / 18</span></li>
                  <li><span className={styles.label}>선택 교양</span> <span className={styles.value}>18/ 18</span></li>
                  <li><span className={styles.label}>일반 선택</span> <span className={styles.value}>45 / 45</span></li>
                  <li><span className={styles.label}>전공 교양</span> <span className={styles.value}>9 / 9</span></li>
                  <li><span className={styles.label}>전공 필수</span> <span className={styles.value}>27 / 27</span></li>
                  <li><span className={styles.label}>전공 선택</span> <span className={styles.value}>6 / 6</span></li>
                </ul>
              </div>
            )}
            {popupType === 'moreLectures' && (
   <div>
   <h3 className={styles.popupTitle}>강의명으로 조회 후 신청</h3>
   <div className={styles.searchContainer}>
     <input
       className={styles.lectureSearch}
       type="text"
       placeholder="강의명 검색"
       value={inputSubjectName}
       onChange={handleFindSubjectName} // 입력 값 관리
       onKeyDown={(event) => {
         if (event.key === 'Enter') {
           onClickSearchIcon(); // 엔터 키 입력 시 검색 실행
         }
       }}
     />
     <FaSearch className={styles.popupSearchIcon} onClick={onClickSearchIcon} />
   </div>
   <div className={`${styles.lectureList} ${styles.popupLectureList}`}>
     {searchResults.length > 0 ? (
       searchResults.map((lecture) => (
         <PopupLectureItem key={lecture.id} lecture={lecture} />
       ))
     ) : (
       lectureList.map((lecture) => (
         <PopupLectureItem key={lecture.id} lecture={lecture} />
       ))
     )}
   </div>
 </div>
)}

            {popupType === 'lecturePlan' && (
              <div>
                <h3 className={styles.popupTitle}>강의 계획서</h3>
                <p>{lecturePlan}</p>
              </div>
            )}
            {popupType === 'error' && (
              <div>
                <h4 className={styles.popupTitle}>단과대 및 학과/학부 선택</h4>
                <p>{popupMessage}</p>
                {renderErrorCloseButton()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reserve;
