import React, { useState } from "react";
import ReactPlayer from "react-player";
import './Dashboard.css';
import Quiz from "../quiz/Quiz"
import { useNavigate } from "react-router-dom";

const Dashboard = () =>{
    const navigate = useNavigate();
    const [ videos, setVideos ] = useState([
        {id:0, title:"Html5", link:"https://www.youtube.com/watch?v=kUMe1FH4CHE"},
        {id:1, title:"CSS", link:"https://www.youtube.com/watch?v=OXGznpKZ_sA"},
        {id:2, title:"React", link:"https://www.youtube.com/watch?v=SqcY0GlETPk"},
        {id:3, title:"Javascript", link:"https://www.youtube.com/watch?v=PkZNo7MFNFg"},
        {id:4, title:"Java", link:"https://www.youtube.com/watch?v=Qgl81fPcLc8"},
        {id:5, title:"Python", link:"https://www.youtube.com/watch?v=rfscVS0vtbw"},
        {id:6, title:"C Programming", link:"https://www.youtube.com/watch?v=1uR4tL-OSNI"},
        {id:7, title:"DBMS", link:"https://www.youtube.com/watch?v=scxc0FXp2rg"},
        {id:8, title:"Operating System", link:"https://www.youtube.com/watch?v=mXw9ruZaxzQ"},
        {id:9, title:"DSA", link:"https://www.youtube.com/watch?v=jQqQpPMYPXs"},
        {id:10, title:"Computer Networks", link:"https://www.youtube.com/watch?v=HTpZ1rLRsNQ"},
        {id:11, title:"Angular", link:"https://www.youtube.com/watch?v=f7BJFTEbc10"},
        {id:12, title:"Kotlin", link:"https://www.youtube.com/watch?v=cxm9AHNDMPI"},
        {id:13, title:"MongoDB", link:"https://www.youtube.com/watch?v=QPFlGswpyJY"},
        {id:14, title:"Next.js", link:""}
    ]);

    const gotoVideo = ( title, link ) =>{
        navigate( "/quizmaster/learning-content", {state: { title: title, link: link } });
    };

    return(
        <div id="dashboard">
            <div className="dashboard">
                { videos.length === 0 ? (
                    <div id="emptypage">
                        <p>No Data!!! </p>
                    </div>
                ) : (
                    <div id="learning-content">
                        
                        {
                            videos.map((video)=>{
                                return <div key={video.id} className="learning-video" 
                                            onClick={()=> gotoVideo( video.title, video.link )}>
                                            <div className="thumbnail">
                                                <ReactPlayer width="100%" height="100%" url={video.link} />
                                            </div>
                                            <div>{video.title}</div>
                                        </div>
                            })
                        }
                    </div>
                )}
                <div id="quizdiv">
                    <Quiz/>
                </div>
            </div>  
        </div>
    );
}

export default Dashboard;
