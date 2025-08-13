import React, { useState } from "react";
import './Dashboard.css';
import Quiz from "../quiz/Quiz";
import Performance from "../performance/Performance";
import { useNavigate } from "react-router-dom";

const Dashboard = () =>{
    const navigate = useNavigate();

    return(
        <div id="dashboard">
            <div className="dashboard">
                <div style={{width:"70dvw", height:"80dvh"}}>
                    <img width="100%" height="100%" src="/bckgd2.png"></img>
                </div>
                <div id="quizdiv">
                    <Quiz/>
                </div>
            </div>  
        </div>
    );
}

export default Dashboard;
