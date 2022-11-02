import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Main from './layout/Main';
import Rooms from './pages/rooms/Rooms';
import Cameras from './pages/cameras/Cameras';
import Users from './pages/users/Users';
import Register from './pages/auth/signup/Register';
import './App.css';

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/main' element={<Main />} />
        <Route path='/room' element={<Rooms />} />
        <Route path='/camera' element={<Cameras />} />
        <Route path='/users' element={<Users />} />

      </Routes>
    </div>
  );
}

export default App;
