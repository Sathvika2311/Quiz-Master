import React, { useState, useEffect } from 'react';
import { db } from '../firebasesetup/Firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Admin() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);

  // Add New Quiz
  const handleAddQuiz = async () => {
    if (!quizTitle || questions.length === 0) {
      toast.error('Enter title and at least one question.');
      return;
    }
    await addDoc(collection(db, 'quizzes'), {
      createdBy: localStorage.getItem('uid'),
      title: quizTitle,
      questions,
      createdAt: new Date()
    });
    toast.success('Quiz added successfully');
  };

  // Fetch Attempts
  const fetchAttempts = async () => {
    const q = query(
      collection(db, 'attempts'),
      where('quizCreatedBy', '==', localStorage.getItem('uid'))
    );
    const querySnapshot = await getDocs(q);
    const attemptsData = querySnapshot.docs.map((doc) => doc.data());
    setAttempts(attemptsData);
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      <div>
        <h3>Add New Quiz</h3>
        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
        <button onClick={handleAddQuiz}>Add Quiz</button>
      </div>
      <div>
        <h3>Attempted Quizzes</h3>
        {attempts.map((attempt, index) => (
          <div key={index}>
            <p>User: {attempt.userId}, Score: {attempt.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
