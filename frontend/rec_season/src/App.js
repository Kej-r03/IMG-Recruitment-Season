import './App.css';
import React, { Component } from 'react'
import Home from './components/Home';
import Test from './components/Rounds/Test';
import Interview from './components/Rounds/Interview';
// import Evaluate from './components/Evaluate';
import { BrowserRouter, Routes, Route, Navigate, Router } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';
import OnLogin from './components/OnLogin';
import Rd from './components/redirector';
import ProfilePage from './components/userProfile';
import CandidateList from './components/CandidateList';
import Panel from './components/Rounds/Panel.js'
import Form from './components/Form';
import axios from 'axios';
import {useEffect} from 'react';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <>
      <Route path="" element={<NonLoginRoute><Home/></NonLoginRoute>}></Route>
      <Route path='redirector' element={<NonLoginRoute><Rd /></NonLoginRoute>}></Route>
      <Route path="onlogin" element={<PrivateRoute><OnLogin /></PrivateRoute>}></Route>
      <Route path='form' element={<PrivateRoute><Form/></PrivateRoute>}></Route>
      <Route path='candidates/:id' element={<PrivateRoute><CandidateList /></PrivateRoute>}></Route>
      <Route path="test/:id" element={<PrivateRoute><Test/></PrivateRoute>}></Route>
      <Route path="interview/:id" element={<PrivateRoute><Interview/></PrivateRoute>}></Route>
      <Route path="dashboard/:id" element={<PrivateRoute><Dashboard/></PrivateRoute>}></Route>
      <Route path="profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}></Route>
      <Route path="panel/:id" element={<PrivateRoute><Panel/></PrivateRoute>}></Route>
      </>
    </Routes>
    </BrowserRouter>
  );
}


const PrivateRoute=({children})=>{

  const [isLoggedIn,setIsLoggedIn]=React.useState()
  useEffect(()=>{
      axios
      .get("http://localhost:8000/login/info/",{withCredentials:true})
      .then(function(response){
          setIsLoggedIn(response.data.isLoggedIn)
      })
  },[])
  if(isLoggedIn==true)
  return children
  else if(isLoggedIn==false)
  return <Navigate to="/" />
}

function NonLoginRoute({children}){
  const [isLoggedIn,setIsLoggedIn]=React.useState()
  useEffect(()=>{
      axios
      .get("http://localhost:8000/login/info/",{withCredentials:true})
      .then(function(response){
          setIsLoggedIn(response.data.isLoggedIn)
      })
  },[])
  if(isLoggedIn==false)
  return children
  else if(isLoggedIn==true)
  return <Navigate to="/onlogin/" />
}

export default App;
