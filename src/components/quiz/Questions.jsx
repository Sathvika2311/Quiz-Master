import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Questions.css';
import { db } from "../firebasesetup/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function Questions() {
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

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    let allQuestions = [];
    const chunkSize = 10;

    try {
      while (allQuestions.length < number) {
        const chunk = Math.min(chunkSize, number - allQuestions.length);
        
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyDfVq-HvZRtGaHAYSLiAbl5oBPElgt1bNA",
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
          setError("Error parsing questions. Please try again.");
          break;
        }
      }

      setQuestions(allQuestions.slice(0, number));
    } catch (err) {
      console.error("API request failed:", err);
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, number]);

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

      try {
        // Store quiz data in Firestore
        const docRef = await addDoc(collection(db, "quizzes"), {
          userId: localStorage.getItem("uid"),
          category: category,
          difficulty: difficulty,
          totalQuestions: questions.length,
          score: newScore,
          timestamp: serverTimestamp(), // Auto-generate timestamp
          questions: questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            user_answer: userAnswers[index] || null
          }))
        });
  
        alert("Submitted successfully");
      } catch (error) {
        console.error("Error saving quiz to Firestore:", error);
      }
      
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

  if (loading || questions.length === 0) {
    return (
      <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="Loading..." />
        <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="Loading..." />
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
              <Button variant="contained" color="primary" size="large" style={{width:"150px"}} onClick={handleNextQuestion}>Next</Button>
            )}
            {currentQuestionIndex > 0 && (
              <Button variant="contained" color="primary" size="large" style={{width:"150px"}} onClick={handlePreviousQuestion}>Previous</Button>
            )}
            <Button variant="contained" color="primary" size="large" style={{width:"150px"}} onClick={handleSubmitQuiz}>Submit Quiz</Button>
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