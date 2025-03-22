import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useLocation } from "react-router-dom";
import "./VideoPlayer.css";

const VideoPlayer = ( ) => {
    const location = useLocation();
    const { title, link } = location.state || {};
    const navigate = useNavigate();

    return(
        <div id="videoplayer">
            <div id="header">
                <button id="back-btn" onClick={()=>navigate("/quizmaster/dashboard")}>
                    <img src="/back-arrow.png" width="30px" height="30px" alt="Back"/>
                </button>
                <div className="ele">
                    <img src="/quizmaster_logo0.png" alt="" style={{width:"120px",height:"60px"}}/>
                    <h1 className="ele">Quiz Master</h1>
                </div>
            </div>
            <div id="video-content">
                <ReactPlayer width="100%" height="100%" controls url={link} />
            </div>
        </div>
    );
}

export default VideoPlayer;