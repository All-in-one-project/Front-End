
import React from 'react';
import '../App.css'; // CSS import

function LoginForm() {
    return (
        <form>
            <input type="text" placeholder="아이디/학번 입력" />
            <input type="password" placeholder="비밀번호 입력" />
            <button type="submit">로그인</button>
        </form>
    );
}

export default LoginForm;
