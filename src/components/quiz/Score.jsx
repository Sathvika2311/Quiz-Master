import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Questions.css';
import { Button } from '@mui/material';

function Score() {
  const location = useLocation();
  const { score, total, questions, userAnswers } = location.state || { score: 0, total: 0, questions: [], userAnswers: [] };
  const category = sessionStorage.getItem('category');
  const difficulty = sessionStorage.getItem('difficulty');
  const number = sessionStorage.getItem('number');
  const navigate = useNavigate();

  const handleHome = () => {
    sessionStorage.clear();
    navigate('/quizmaster/dashboard');
  };

  // Helper function to get the correct option letter
  const getCorrectAnswer = (question) => {
    const correctIndex = ["A", "B", "C", "D"].indexOf(question.correct_answer);
    return correctIndex !== -1 ? { letter: question.correct_answer, text: question.options[correctIndex] } : { letter: 'No Answer', text: 'No Answer' };
  };

  // Helper function to get the user's answer letter
  const getUserAnswer = (index) => {
    const userAnswer = userAnswers[index];
    if (!userAnswer) {
      return { letter: 'Not Attempted' };
    }
    return index !== -1 ? { letter: userAnswer } : { letter: 'Invalid' };
  };

  return (
    <div className="quiz">
      <h1>Quiz Master</h1>
      <p className="category">CATEGORY: {category}</p>
      <p className="category">DIFFICULTY: {difficulty}</p>
      <p className="category">No of Questions: {number}</p>
      <h1>Your Score : {score}/{total}</h1>

      <div className="controls">
        <Button variant="contained" color="primary" size="large" onClick={handleHome} style={{margin:"30px"}}>
          Go To Home
        </Button>
      </div>

      <div className="quiz-summary">
        <h3>Quiz Summary</h3>
        {questions.map((question, index) => {
          const { letter: userLetter } = getUserAnswer(index);
          const { letter: correctLetter } = getCorrectAnswer(question);
          
          return (
            <div key={index} className="question-summary">
              {/* Display question number and text */}
              <div className={`question-answer ${userLetter === correctLetter ? 'correct' : 'incorrect'}` }>
                <p><strong>Question {index + 1}:</strong> {question.question}
                  {userLetter === correctLetter ? (
                    <span style={{fontSize:"larger", color:"green"}}> ✔</span>
                  ) : (
                    <span style={{fontSize:"larger", color:"red"}}> ✖</span>
                  )}
                </p>
                
                {/* Display all options with their corresponding letters */}
                <p><strong>Options:</strong></p>
                {question.options.map((option, optionIndex) => (
                  <p key={optionIndex}> {option}</p> // Display options as A, B, C, D
                ))}

                {/* Show user's selected answer */}
                <p><strong>Your Answer: </strong>{userLetter}</p>

                {/* Show correct answer */}
                <p><strong>Correct Answer:</strong> {correctLetter}</p>
                <p><strong>Explanation:</strong> {question.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Score;
