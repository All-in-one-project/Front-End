import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '././App.css';
import Login from './component/Login/Login.jsx';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/student/login' element={<Login />}/> {/*exact는 "/" 이게 정확히 일치할경우에만 출력되는*/}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
