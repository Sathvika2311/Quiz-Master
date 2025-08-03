import React, { useState } from "react";
import './Dashboard.css';
import Quiz from "../quiz/Quiz"
import { useNavigate } from "react-router-dom";

const Dashboard = () =>{
    const navigate = useNavigate();
    const [ videos, setVideos ] = useState([
        {id:0, title:"Html5", src:"/HTML5.jpeg", link:"https://www.youtube.com/watch?v=kUMe1FH4CHE"},
        {id:1, title:"CSS", src:"/CSS.jpeg", link:"https://www.youtube.com/watch?v=OXGznpKZ_sA"},
        {id:2, title:"ReactJs", src:"/React.jpeg", link:"https://www.youtube.com/watch?v=SqcY0GlETPk"},
        {id:3, title:"Javascript", src:"/Javascript.jpeg", link:"https://www.youtube.com/watch?v=PkZNo7MFNFg"},
        {id:4, title:"Java", src:"/Java.jpeg", link:"https://www.youtube.com/watch?v=Qgl81fPcLc8"},
        {id:5, title:"Python", src:"/Python.jpeg", link:"https://www.youtube.com/watch?v=rfscVS0vtbw"},
        {id:6, title:"C Programming", src:"/C.jpeg", link:"https://www.youtube.com/watch?v=1uR4tL-OSNI"},
        {id:7, title:"DBMS & SQL", src:"/DBMS.jpeg", link:"https://www.youtube.com/watch?v=scxc0FXp2rg"},
        {id:8, title:"Operating Systems", src:"/Os.jpeg", link:"https://www.youtube.com/watch?v=mXw9ruZaxzQ"},
        {id:9, title:"DSA", src:"/DSA.jpeg", link:"https://www.youtube.com/watch?v=jQqQpPMYPXs"},
        {id:10, title:"Computer Networks", src:"/CN.jpeg", link:"https://www.youtube.com/watch?v=HTpZ1rLRsNQ"},
        {id:11, title:"AngularJs", src:"/Angular.jpeg", link:"https://www.youtube.com/watch?v=f7BJFTEbc10"},
        {id:12, title:"Kotlin", src:"/Kotlin.jpeg", link:"https://www.youtube.com/watch?v=cxm9AHNDMPI"},
        {id:13, title:"MongoDB", src:"/MongoDB.jpeg", link:"https://www.youtube.com/watch?v=QPFlGswpyJY"},
        {id:14, title:"NextJs", src:"/NextJs.jpeg", link:"https://www.youtube.com/watch?v=ZVnjOPwW4ZA"},
        {id:15, title:"PHP", src:"/PHP.jpeg", link:"https://www.youtube.com/watch?v=ny4-hGENWVk"},
        {id:16, title:"Firebase", src:"/Firebase.jpeg", link:"https://www.youtube.com/watch?v=fgdpvwEWJ9M"}
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
                                                <img width="100%" height="100%" src={video.src} style={{borderRadius:"5px 5px 0 0"}}/>
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
