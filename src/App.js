import './App.css';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import MainCompo from './components/main/MainCompo';
import { UserContext } from './components/firebasesetup/UserContext';
import { auth } from './components/firebasesetup/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './components/loading/Loading';
import Quiz from './components/quiz/Quiz';
import Questions from './components/quiz/Questions';
import Score from './components/quiz/Score';
import Home from './components/home/Home';
import VideoPlayer from './components/dashboard/VideoPlayer';
import Admin from './components/admin/Admin';

function App() {

  const { setUser } = useContext(UserContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!',{ hideProgressBar: true, position: "top-center"});
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No Internet Connection. Please check your network!', { hideProgressBar: true, position: "top-center"});
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
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

    return () => unsubscribe(); 
  }, [setUser]);

  return (
    
    <Router>
      <div className='fragment'>
      <ToastContainer/>
      <Routes>
        <Route path="/quizmaster/*" element={<MainCompo/>} />
        <Route path="/" element={<Loading/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path='/questions' element={<Questions key={Date.now()} />} />
        <Route path='/score' element={<Score/>} />
        <Route path="/quizmaster/learning-content" element={<VideoPlayer/>} />
        <Route path="/quizmaster/admin" element={<Admin/>}/>
      </Routes>
      </div>
    </Router>
  
  );
}

export default App;
