import React, { useEffect, useState } from 'react';
import './Performance.css';
import { db } from "../firebasesetup/Firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { CurrentUser } from "../firebasesetup/UserContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const calculateWeightedAverageScores = (quizData) => {
    const courseScores = {};
    quizData.forEach(({ course, score, difficulty }) => {
        const weight = difficulty === 'Hard' ? 2 : difficulty === 'Medium' ? 1.5 : 1;
        if (!courseScores[course]) {
            courseScores[course] = { total: 0, count: 0 };
        }
        courseScores[course].total += score * weight;
        courseScores[course].count += weight;
    });

    return Object.keys(courseScores).map((course) => ({
        course,
        score: (courseScores[course].total / courseScores[course].count).toFixed(2)
    }));
};

const Performance = () => {
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Overall");
    const [quizScores, setQuizScores] = useState([]);
    const { currentUser } = CurrentUser();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "quizzes"),
                    where("userId", "==", localStorage.getItem("uid")),
                    orderBy("timestamp", "desc")
                );
                const querySnapshot = await getDocs(q);
                const historyData = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    quizName: `Quiz-${querySnapshot.docs.length - index }`,
                    ...doc.data()
                }));
                setQuizHistory(historyData);

                const scores = historyData.map((quiz) => ({
                    course: quiz.category,
                    score: ((quiz.score / quiz.totalQuestions) * 100).toFixed(2),
                    difficulty: quiz.difficulty || 'Easy'
                }));
                setQuizScores(scores);
            } catch (error) {
                console.error("Error fetching quiz history:", error);
            }
            setLoading(false);
        };

        fetchHistory();
    }, []);

    const filteredData = filter === "Overall"
        ? calculateWeightedAverageScores(quizScores)
        : quizHistory.filter((quiz) => quiz.category === filter).map((quiz) => ({
            course: quiz.quizName,
            score: ((quiz.score / quiz.totalQuestions) * 100).toFixed(2)
        }));

    const uniqueCourses = ["Overall", ...new Set(quizHistory.map(quiz => quiz.category))];

    if (loading) {
        return <div style={{ width: "100dvw", height: "100dvh", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="Loading" />
                  <img src="/loading3.gif" width="70px" height="70px" style={{ margin: "0px" }} alt="..." />
                </div>;
    }

    return (
        <div id='performance'>
            <h2>Performance</h2>
            {filteredData.length === 0 ? (
                <div id="emptypage">
                    <p>No Data to analyse your performance!!!</p>
                </div>
            ) : (
                <div className='performance'>
                    <div style={{width:"100%",justifyContent:"center", display:"flex", flexDirection:"row"}}>
                        <p style={{padding:"5px 10px 5px 10px"}}>Select Category : </p>
                        <select onChange={(e) => setFilter(e.target.value)} value={filter} style={{width:"fit-content", height:"fit-content", 
                            padding:"5px 10px 5px 10px", border:"2px solid #178bff", borderRadius:"5px", background:"black", color:"white"}}>
                            {uniqueCourses.map((course, index) => (
                                <option key={index} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={500} style={{ marginTop: "30px" }}>
                        <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="course" angle={-10} textAnchor="middle" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#4285F4" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default Performance;
