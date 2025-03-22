import './App.css';
import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import MainCompo from './components/main/MainCompo';
import { UserContext } from './components/firebasesetup/UserContext';
import { auth } from './components/firebasesetup/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './components/loading/Loading';
import Quiz from './components/quiz/Quiz';
import Questions from './components/quiz/Questions';
import Score from './components/quiz/Score';
import Home from './components/home/Home';
import VideoPlayer from './components/dashboard/VideoPlayer';

function App() {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          username: user.username || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [setUser]);

  return (
    
    <Router>
      <div className='fragment'>
      <Routes>
        <Route path="/quizmaster/*" element={<MainCompo/>} />
        <Route path="/" element={<Loading/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path='/questions' element={<Questions key={Date.now()} />} />
        <Route path='/score' element={<Score/>} />
        <Route path="/quizmaster/learning-content" element={<VideoPlayer/>} />
      </Routes>
      </div>
    </Router>
  
  );
}

export default App;
