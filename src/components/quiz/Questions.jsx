import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Questions.css';
import { db } from "../firebasesetup/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';

function Questions() {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const category = sessionStorage.getItem('category');
  const difficulty = sessionStorage.getItem('difficulty');
  const number = parseInt(sessionStorage.getItem('number'), 10) || 10;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Enforce full-screen mode when quiz starts or re-enters
  const enableFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };
  
  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  };

  useEffect(() => {
    // Block most shortcut keys
    enableFullScreen();
    const handleKeyDown = (e) => {
      if (
        (( e.ctrlKey || e.metaKey ) && ['n', 't', 'w', 'r','c'].includes(e.key.toLowerCase())) || // Ctrl+N, Ctrl+T, Ctrl+W, Ctrl+R
        (e.altKey && e.key === 'Tab') ||
        e.key === 'F12' || // Disable DevTools
        e.key === 'Escape' // Prevent exiting full-screen
      ) {
        e.preventDefault();
        toast.warn('This action is disabled during the quiz.',{ hideProgressBar: true, position: "top-center" });
      }
    };
  
    // Re-enable full-screen if the user switches tabs or minimizes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !document.fullscreenElement) {
        /*document.documentElement.requestFullscreen().catch((err) => {
          console.error('Error requesting full screen:', err);
        });*/
        enableFullScreen();
      }
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Fisher-Yates method to shuffle questions
  const shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    let allQuestions = [];
    const chunkSize = 10;

    try {
      while (allQuestions.length < number) {
        const chunk = Math.min(chunkSize, number - allQuestions.length);

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert quiz master. Provide ${number} multiple choice unique questions in the category ${category} 
                    with difficulty ${difficulty}. Convert the given response data into a structured JSON format for multiple-choice questions.
                    Each question should have: A question field containing the text of the question. An options array containing four choices
                    (A, B, C, D). A correct_answer field specifying the correct option. An explanation field giving a short explanation for 
                    the correct answer. The output should be a JSON array where each object represents a question.`
                  }
                ]
              }
            ]
          }
        );

        const questionsText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!questionsText) break;

        try {
          const parsedQuestions = JSON.parse(questionsText.replace(/```json|```/g, '').trim());
          if (Array.isArray(parsedQuestions)) {
            allQuestions = [...allQuestions, ...parsedQuestions];
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("JSON parsing error:", error);
          setError("Please try again.");
          break;
        }
      }
      const shuffledQuestions = shuffleQuestions(allQuestions.slice(0, number));
      setQuestions(shuffledQuestions);

    } catch (err) {
      console.error("API request failed:", err);
      setError("Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, number]);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (questions.length > 0) {
      setTimerRunning(true);
    }
  }, [questions]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAnswerChange = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = ["A", "B", "C", "D"][answer];
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSubmit = async (confirmed) => {
    if (confirmed) {
      const newScore = questions.reduce((acc, question, index) => {
        return acc + (userAnswers[index] === question.correct_answer ? 1 : 0);
      }, 0);

      setScore(newScore);
      setOpenConfirmDialog(false);
      try {
        // Store quiz data in Firestore
        await addDoc(collection(db, "quizzes"), {
          userId: localStorage.getItem("uid"),
          category: category,
          difficulty: difficulty,
          totalQuestions: questions.length,
          score: newScore,
          timetaken: timeElapsed,
          timestamp: serverTimestamp(),
          questions: questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            user_answer: userAnswers[index] || null
          }))
        });
        toast.success("Submitted successfully", { hideProgressBar: true, position: "top-center" });

      } catch (error) {
        console.error("Error saving quiz to Firestore:", error);
      }
      exitFullScreen();
      navigate('/score', {
        state: {
          score: newScore,
          total: questions.length,
          questions,
          userAnswers
        }
      });
    }
    setOpenConfirmDialog(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      handleSubmitQuiz();
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if( error ){
    exitFullScreen();
    return (
      <div className='quiz'>
        <div id="emptypage">
            <h3 style={{color:"red"}}>Something went wrong. Please try again!!! </h3>
            <p style={{color:"red"}}>Please Check Internet Connection!</p>
        </div>
        <Button variant="contained" color="primary" size="large" style={{ width: "150px", marginTop: "20px", marginLeft:"calc(50% - 75px)"}} onClick={()=> navigate("/quizmaster/dashboard")}>Go back</Button>
      </div>
    );
  }

  if (loading || questions.length === 0 ) {
    exitFullScreen();
    return (
      <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="Loading" />
        <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="..." />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (

    <div className="quiz">
      <div className='quiz-titlebar'>
        <h1>Quiz Master</h1>
        <div className='quiz-details'>
          <div className="category">CATEGORY: {category}</div>
          <div className="category">DIFFICULTY: {difficulty}</div>
          <div className="category">No of Questions: {number}</div>
          <div className="category">⏱️ Time: {formatTime(timeElapsed)}</div>
        </div>
        <div className='questions'>
          <div className="question">
            <p style={{ fontWeight: 'bold' }}> {currentQuestionIndex + 1}. {currentQuestion.question}</p>
          </div>
          <div className="options">
            {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(index)}
                className={userAnswers[currentQuestionIndex] === ["A", "B", "C", "D"][index] ? 'selected' : ''}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="controls">
            {currentQuestionIndex < questions.length - 1 && (
              <Button variant="contained" color="primary" size="large" style={{ width: "150px" }} onClick={handleNextQuestion}>Next</Button>
            )}
            {currentQuestionIndex > 0 && (
              <Button variant="contained" color="primary" size="large" style={{ width: "150px" }} onClick={handlePreviousQuestion}>Previous</Button>
            )}
            <Button variant="contained" color="primary" size="large" style={{ width: "150px" }} onClick={handleSubmitQuiz}>Submit Quiz</Button>
          </div>
        </div>
      </div>
      <div className="question-boxes">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`question-box ${currentQuestionIndex === index ? 'active' : ''} 
              ${userAnswers[index] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Are you sure you want to submit the quiz?</DialogTitle>
        <DialogContent>
          <p>Once you submit, you will not be able to change your answers.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmSubmit(false)} variant="contained" color="primary">No</Button>
          <Button onClick={() => handleConfirmSubmit(true)} variant="contained" color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Questions;
