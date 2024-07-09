import React from 'react';
import './Application_css.css';

const Application = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>한국대학교</h2>
        <h3>수강신청</h3>
        <p>이름: 홍길동</p>
        <p>학번: 240115</p>
        <p>학과: 컴퓨터공학과</p>
        <p>(없음)</p>
        <h4>학점 정보 (부전공)</h4>
        <p>총합: 130</p>
        <p>전학: 24</p>
        <p>전선: 48</p>
        <p>전교: 9</p>
        <p>전취: 3</p>
        <button>전체 정보 보기</button>
        <button>로그아웃</button>
      </div>
      <div className="main-content">
        <div className="header">
          <button>공지사항</button>
          <button>과목 조회</button>
          <button>수강 신청</button>
          <button>마이 페이지</button>
        </div>
        <div className="content">
          <div className="course-table">
            <h3>예비 수강 신청</h3>
            <h3>일반 수강 신청</h3>
            <table>
              <thead>
                <tr>
                  <th>과목명</th>
                  <th>분류</th>
                  <th>교수명</th>
                  <th>강의 정보</th>
                  <th>신청 여부</th>
                  <th>과목 코드</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>컴퓨터 네트워크</td>
                  <td>전학</td>
                  <td>김철수</td>
                  <td>월 1, 2, 3 (IT302)</td>
                  <td><button>신청</button></td>
                  <td>21032-001</td>
                </tr>
                <tr>
                  <td>소프트웨어 공학</td>
                  <td>전선</td>
                  <td>유정</td>
                  <td>월 5, 6, 7, 8 (IT210)</td>
                  <td><button>신청</button></td>
                  <td>21033-003</td>
                </tr>
                {/* 추가 과목 목록 */}
              </tbody>
            </table>
          </div>
          <div className="schedule">
            <h3>나의 시간표</h3>
            <table>
              <thead>
                <tr>
                  <th>월</th>
                  <th>화</th>
                  <th>수</th>
                  <th>목</th>
                  <th>금</th>
                  <th>토</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {/* 추가 시간표 행 */}
              </tbody>
            </table>
            <p>현재 수강 학점 / 최대 수강 가능 학점</p>
            <p>0 / 21</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
