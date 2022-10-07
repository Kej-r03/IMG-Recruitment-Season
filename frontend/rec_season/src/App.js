import './App.css';
import React from 'react'
import Home from './components/Home';
import Test from './components/Test';
import Interview from './components/Interview';
import Evaluate from './components/Evaluate';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="" element={<Home/>}></Route>
      <Route path="test" element={<Test/>}></Route>
      <Route path="interview" element={<Interview/>}></Route>
      <Route path="dashboard" element={<Dashboard/>}></Route>
      <Route path="evaluate" element={<Evaluate />}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
