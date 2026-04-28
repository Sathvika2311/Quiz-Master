import React, { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebasesetup/Firebase";
import { signOut } from "firebase/auth";
import { CurrentUser } from "../firebasesetup/UserContext";
import Follow from "../follow/Follow";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isFollowOpen, toggleFollow] = useState(false);
  const [activePage, setActivePage] = useState("HOME"); // Default active element
  const { setUser } = CurrentUser();
  const logout = async () => {
          try {
            await signOut(auth);
            setUser(null);
            localStorage.clear();
            navigate("/");
          } 
          catch (error) {
            console.error("Error during logout:", error.message);
          }
  };

  const pages = [
    { id: 1, name: "Home", icon: "/dashboard.png", link: "/quizmaster/dashboard" },
    { id: 2, name: "Performance", icon: "/performance.png", link: "/quizmaster/performance" },
    { id: 3, name: "History", icon: "/history.png", link: "/quizmaster/history" },
    { id: 4, name: "Profile", icon: "/profile.png", link: "/quizmaster/profile" },
    { id: 5, name: "About Us", icon: "/about.png", link: "/quizmaster/about" }
  ];

  const handleNavigation = (pageName, link) => {
    setActivePage(pageName); // Set the clicked page as active
    if(pageName==="Logout"){
      logout();
    }
    else{
      navigate(link); // Navigate to the page
    }
  };

  return(
    <div id="side-navbar" className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="pgs">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`element ${activePage === page.name ? "active" : ""}`} // Highlight active page
                onClick={() => handleNavigation(page.name, page.link)}
              >
                <img src={page.icon} alt={page.name} width="24px" height="24px" />
                <div className={isOpen ? "name active" : "name"}>{page.name}</div>
              </div>
            ))}
            <div className="element" onClick={logout}><img src="/logout.png" width="24px" height="24px" alt="Logout"/>
                <div className={isOpen ? "name active" : "name"} style={{color:"white",fontSize:"medium"}}>Logout</div> 
            </div>
            <div className="element" onClick={()=>{toggleFollow(!isFollowOpen);}}>
                <img src="/arrow.png" width="24px" height="24px" alt="More" style={{rotate: isFollowOpen ? "-180deg" : "0deg"}}/>
                <div className={isOpen ? "name active" : "name"} style={{color:"white",fontSize:"medium"}}>More</div>
                <div style={{display: isFollowOpen ? "block" : "none",position:"absolute",bottom:"0",left:"45px"}}><Follow/></div>
            </div>
        </div>
    </div>
  );
};

export default Sidebar;
