import React, { useEffect, useState } from "react";
import { db } from "../firebasesetup/Firebase";
import "./History.css";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { CurrentUser } from "../firebasesetup/UserContext";

function History() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = CurrentUser(); // Get logged-in user
  const [error, setError] = useState("No quizzes found!!!");
  const [selectedQuiz, setSelectedQuiz] = useState(0);

  useEffect(() => {
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
      } catch (e) {
        console.error("Error fetching quiz history:", e);
        setError("Please Check Internet Connection!");
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src="/loading3.gif"
          width="70px"
          height="70px"
          style={{ margin: "0px" }}
          alt="Loading"
        />
        <img
          src="/loading3.gif"
          width="70px"
          height="70px"
          style={{ margin: "0px" }}
          alt="..."
        />
      </div>
    );
  }

  return (
    <div className="history">
      <h2><b>Your Quiz History</b></h2>
      {quizHistory.length === 0 ? (
        <div id="emptypage">
          <p>{error}</p>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "80vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            position: "sticky"
          }}
        >
          {/* Left side list */}
          <div
            style={{
              width: "50%",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "5px"
            }}
          >
            {quizHistory.map((quiz, index) => (
              <div key={quiz.id} className="quiz-history-item"
                style={{
                  border:
                    index === selectedQuiz ? "2px solid #178bff" : "1px solid rgb(196, 194, 194)",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: index === selectedQuiz ? "#e6f3ff" : "white",
                  cursor: "pointer"
                }}>
                <div>
                  <h3>
                    Quiz {quizHistory.length - index} - {quiz.category} (
                    {quiz.difficulty})
                  </h3>
                  <p>
                    <strong>Score:</strong> {quiz.score} /{" "}
                    {quiz.totalQuestions}
                  </p>
                </div>
                <button
                  style={{
                    border: 0,
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    background: "#178bff"
                  }}
                  onClick={() => setSelectedQuiz(index)}
                >
                  View Questions
                </button>
              </div>
            ))}
          </div>

          {/* Right side quiz details */}
          {quizHistory[selectedQuiz] && (
            <div
              className="quiz-history-item"
              style={{
                width: "50%",
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgb(196, 194, 194)",
                borderRadius: "0 0 0 0",
                padding: "20px 10px 10px 10px",
                height: "78vh"
              }}
            >
              <div style={{ width:"100%", height:"fit-content", textAlign:"center",padding:"10px 5px 0px 5px", justifyContent: "center", 
                background: "#b4dbffff", marginBottom:"10px"}}>
                <strong><h3 style={{ justifyContent: "center"}}>
                  Quiz {quizHistory.length - selectedQuiz} -{" "}
                  {quizHistory[selectedQuiz].category} (
                  {quizHistory[selectedQuiz].difficulty})
                </h3>
                </strong>
                <p style={{ justifyContent: "center" }}>
                  <strong>Score:</strong> {quizHistory[selectedQuiz].score} /{" "}
                  {quizHistory[selectedQuiz].totalQuestions}
                </p>
              </div>
              <div>
                <ul>
                  <br/>
                  {quizHistory[selectedQuiz].questions.map((q, idx) => (
                    <li key={idx}>
                      <p>
                        <strong>Q{idx + 1}: {q.question}</strong> 
                      </p>
                      <p>
                        <strong>Options:</strong>
                      </p>
                      <p>{q.options[0]}<br/>{q.options[1]}<br/>{q.options[2]}<br/>{q.options[3]}</p>
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        {q.user_answer || "Not answered"}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong> {q.correct_answer}
                      </p>
                      <br/>
                      <div style={{width:"98%",height:"1px",background:"grey"}}></div>
                      <br/>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default History;
