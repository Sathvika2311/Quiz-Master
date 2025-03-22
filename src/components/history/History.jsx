import React, { useEffect, useState } from "react";
import { db } from "../firebasesetup/Firebase";
import "./History.css";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { CurrentUser } from "../firebasesetup/UserContext"; 

function History() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = CurrentUser(); // Get logged-in user

  useEffect(() => {
    //if (!currentUser) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "quizzes"),
          where("userId", "==", localStorage.getItem("uid")), // Fetch only current user's quizzes
          orderBy("timestamp", "desc") // Sort by most recent first
        );

        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setQuizHistory(historyData);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="Loading" />
              <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="..." />
            </div>;
  }

  return (
    <div className="history">
      <h2>Your Quiz History</h2>
      {quizHistory.length === 0 ? (
        <div id="emptypage">
          <p>No quizzes found!!!</p>
        </div>
      ) : (
        <div>
          {quizHistory.map((quiz, index) => (
            <div key={quiz.id} className="quiz-history-item">
              <h3>Quiz { quizHistory.length - index } - {quiz.category} ({quiz.difficulty})</h3>
              <p><strong>Score:</strong> {quiz.score} / {quiz.totalQuestions}</p>
              <details>
                <summary>View Questions</summary>
                <ul>
                  {quiz.questions.map((q, idx) => (
                    <li key={idx}>
                      <p><strong>Q{idx + 1}:</strong> {q.question}</p>
                      <p><strong>Options:</strong></p>
                      <p>{String(q.options)}</p>
                      <p><strong>Your Answer:</strong> {q.user_answer || "Not answered"}</p>
                      <p><strong>Correct Answer:</strong> {q.correct_answer}</p>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
