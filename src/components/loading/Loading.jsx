import React, { useContext } from "react";
import './Loading.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../firebasesetup/UserContext";

const Loading = () => {

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  if(user===null){
    setTimeout(()=>{ navigate("/home")}, 2500);
  }
  else{
    setTimeout(()=>{ navigate("/quizmaster/dashboard")}, 2500);
  }
  return (
    <div id="load">
      <img src="/qm_logo.png" id="logo" width="200px" height="120px" alt="Quiz Master"/>
      <div id="loading">
        <img src="/loading3.gif" width="70px" height="70px" style={{marginRight:"0px"}} alt="Loading..."/>
        <img src="/loading3.gif" width="70px" height="70px" style={{marginLeft:"0px"}} alt="Loading..."/>
      </div>
    </div>
  );
}

export default Loading;