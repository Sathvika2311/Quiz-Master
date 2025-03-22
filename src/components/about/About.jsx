import React from "react";
import "./About.css";

function About(){
    return(
        <div id="about" >
            <div className="about">
                <div style={{ textAlign:"center", width:"100%", alignItems:"center", height:"fit-content", borderRadius:"30px 30px 0 0",
                    background: "linear-gradient( 45deg, #009fff, #19a8ff, #30b1ff, #48baff, #62c4ff )"}}>
                       <h3> Welcome to Quiz Master </h3><br></br></div>
                <div className="ele" id="about-us">
                    <div className="content" id="about-us-content">
                        Quiz Master is your ultimate companion in preparing for competitive exams.
                        This platform is to simplify your preparation journey and help you to achieve success.
                    </div>
                </div>
                <div className="ele" id="mission"><h4>Our Mission</h4><br></br>
                    <div className="content">At Quiz Master, our mission is to empower aspirants with personalized and 
                        innovative tools to excel in their competitive exams. We aim to make learning 
                        engaging, efficient, and accessible for everyone.
                    </div>
                </div>
                <div className="ele"><h4>Why Choose Quiz Master?</h4><br></br>
                    <div className="content">
                        <ul>
                        <li><h5>Tailored to Your Needs</h5>
                            Choose the course you're preparing for, and we'll generate quizzes tailored to your specific exam syllabus.
                        </li>
                        <li><h5>Track Your Performance</h5>
                            Access your quiz history, review your answers, and identify areas for improvement.
                        </li>
                        <li><h5>Detailed Explanations</h5>
                            Get comprehensive explanations for each question after completing a quiz to ensure you fully understand the concepts.
                        </li>
                        <li><h5>Interactive and Engaging</h5>
                            Our application is designed to keep you motivated and focused with interactive features and a user-friendly interface.
                        </li>
                        <li><h5>Anywhere, Anytime Access</h5>
                            Study and practice from the comfort of your home or on the go, anytime and on any device.
                        </li>
                        </ul>
                    </div>
                </div>
                <div className="ele"><h4>How It Works</h4><br></br>
                    <div className="content">
                        <ul>
                            <li><h5>Create an Account</h5>
                                Sign up for free and personalize your profile.
                            </li>
                            <li><h5>Take Quizzes</h5>
                                Access a variety of quizzes generated using the latest and most relevant questions.
                            </li>
                            <li><h5>Review and Improve</h5>
                                Analyze your performance and improve with detailed explanations and feedback.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="ele"><h4>Join Our Community</h4><br></br>
                    <div className="content">
                        Thousands of aspirants trust Quiz Master to help them prepare for their exams. 
                        Join our growing community and take the next step in achieving your dreams.
                    </div>
                </div>
                <div className="ele" id="contact"><h4>Contact Us</h4><br></br>
                    <div className="content">
                        We're here to help! If you have any questions or feedback, feel free to reach out:<br/>
                        <b>Email:</b> <u style={{fontStyle:'italic',color:'blue'}}>quizmaster@gmail.com</u>
                    </div>
                </div>
                <div className="ele" id="close-stmt">
                    At Quiz Master, we believe that with the right preparation tools, no goal is too big. 
                    Start your journey to success today and let us be a part of your story!
                </div>
            </div>
        </div>
    );
}

export default About;