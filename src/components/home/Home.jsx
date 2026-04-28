import React, { useState } from "react";
import './Home.css';
import { useNavigate } from "react-router-dom";
import Follow from "../follow/Follow";

function Home(){

    const navigate = useNavigate();

    return(
        <div id="home">
            <div id="header">
                <div className="ele">
                    <img src="/quizmaster_logo0.png" alt="" style={{width:"120px",height:"60px"}}/>
                    <h1 className="ele">Quiz Master</h1>
                </div>
                <div className="ele" style={{minWidth:"30%", justifyContent:"space-evenly"}}>
                    <div className="ele">Home</div>
                    <button id="login-btn" className="btn" onClick={()=>navigate('/login')}>Login / Sign Up</button>
                </div>
            </div>
            <div className="home">
                <div id="quiz" >
                    <div>
                        <div className="ele" style={{fontSize:"30px"}}><strong>Welcome to Quiz Master!</strong></div>
                        <div className="ele" id="about-us" style={{width:"50dvw", height:"fit-content",
                                lineHeight:"2", fontSize:"larger"
                            }}>
                                Quiz Master is your ultimate companion in preparing for competitive exams.<br/>
                                This platform is to simplify your preparation journey and help you to achieve success.
                        </div>
                        <div style={{width:"50dvw", height:"fit-content",margin:"10px 5px 5dvh 5px" ,textAlign:"center",
                        fontSize:"larger", fontWeight:"bold", fontFamily:"cursive"}}>
                            At Quiz Master, we believe that with the right preparation tools, no goal is too big. 
                            Start your journey to success today and let us be a part of your story!
                        </div> 
                        <button className="btn" style={{padding:"15px"}} onClick={()=>navigate('/login')}>Let's get Started!</button> 
                    </div>
                    <div id="image1"></div>                 
                </div> 
                <div id="qm-start">
                    <div id="image2"></div>
                    <div style={{width:"max-content", height:"fit-content",lineHeight:"2",fontSize:"large"}}>
                        <div className="ele">
                            <ul style={{listStyle:"none"}}>
                                <li><strong>Take Quizzes</strong><br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;Access a variety of quizzes generated using the latest and most relevant questions.
                                </li>
                                
                                <li><strong>Review and Improve</strong><br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;Analyze your performance and improve with detailed explanations and feedback.
                                </li>
                            </ul>
                        </div>
                        <div style={{textAlign:"center",width:"100%",padding:"20px"}}>
                            <div>Lets take a quiz to test your proficiency in your selected domain</div>
                            <div><button className="btn" onClick={()=>navigate('/login')}>Take Quiz</button></div>
                        </div>
                    </div>
                </div>
                <div id="footer">
                <div className="ele" style={{width:"100dvw",height:"fit-content",justifyContent:"space-evenly"}}>
                    <div>
                        <div>
                            <p><strong>Contact</strong></p>
                            <p>Email: quizmaster@gmail.com</p>
                        </div>
                        <div>
                            <p><strong>Org Location:</strong></p>
                            <p>Nambur, Guntur, India</p>
                        </div>
                    </div>
                    <div>
                            <p><strong>Product</strong></p>
                            <p>Online Quizzes</p>
                            <p>AI generated questions</p>
                            <p>Performance Analysis</p>
                    </div>
                    <div>
                            <p><strong>For Education</strong></p>
                            <p>Aspirants</p>
                            <p>Students</p>
                            <p>Educational Institutions</p>
                    </div>
                    <div>
                            <p><strong>Educational Usecases</strong></p>
                            <p>Competition</p>
                            <p>Preparation</p>
                    </div>
                </div>
                <div className="ele" id="copyright">
                    <div className="ele">
                        <div className="ele">Copyright © Quizmaster 2025</div>
                        <div className="ele">Privacy Policy</div>
                        <div className="ele">Terms and Conditions</div>
                    </div>
                    <div id="home-follow" className="ele">
                        <Follow />
                    </div>
                </div>
            </div>  
            </div>
             
        </div>
    );
}

export default Home;