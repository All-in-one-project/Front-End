import React from 'react';
import LoginForm from './LoginForm';
import ForgotPasswordLink from './ForgotPasswordLink';
import Separator from './Separator';
import CloseButton from './CloseButton';
import '../App.css'; 

function LoginContainer() {
    return (
        <div className="login-container">
            <CloseButton onClose={() => console.log('Close button clicked')} />
            <h2>한국대학교 수강신청</h2>
            <LoginForm />
            <Separator />
            <ForgotPasswordLink />
        </div>
    );
}

export default LoginContainer;
