import './Main.css';
import Profile from '../profile/Profile';
import About from '../about/About';
import Header from '../header/Header';
import History from '../history/History';
import Sidebar from '../sidebar/Sidebar';
import { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '../dashboard/Dashboard';
import Performance from '../performance/Performance';

function MainCompo() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    
    <div id="Body">
      <Header toggleSidebar={toggleSidebar} />
      
      <div>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main>
            <Routes>
              <Route path="/" element={<Navigate to="/quizmaster/dashboard" replace />} /> 
              <Route path="history" element={<History/>}/>
              <Route path="profile" element={<Profile/>} />
              <Route path="about" element={<About/>} />
              <Route path="dashboard" element={<Dashboard/>} />
              <Route path="performance" element={<Performance/>} />
            </Routes>
        </main>
      </div>
    </div>
    
  );
}

export default MainCompo;