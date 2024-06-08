import React from 'react';
import LoginForm from './component/LoginForm';
import ForgotPasswordLink from './component/ForgotPasswordLink';
import Separator from './component/Separator';
import CloseButton from './component/CloseButton';
import './App.css';

function App() {
  return (
   
     <div className="App">
      
       <CloseButton onClose={() => console.log('Close button clicked')} />
       <h2>한국대학교 수강신청</h2>
       <LoginForm />
       <Separator />
       <ForgotPasswordLink />
      
     </div>
   
  );
}

export default App;
