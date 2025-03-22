import React, { useState, useEffect } from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebasesetup/Firebase";
import { signOut } from "firebase/auth";
import { CurrentUser } from "../firebasesetup/UserContext";
import { db } from "../firebasesetup/Firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

function Header({ toggleSidebar }){

    const navigate = useNavigate();
    const usersCollection = collection(db, "users");
    const { user, setUser } = CurrentUser();
    const [username, setUsername] = useState(localStorage.getItem("username"));

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const q = query(usersCollection, where("email", "==", localStorage.getItem("email")));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();
                    setUsername(userDoc.username);
                }
            } catch (e) {
                console.error("Error while fetching user data: ", e);
            }
        };
        fetchUserData();
    }, []);

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

    return(
        <div className="header">
            <div className="head">
                <button id="menu-btn" onClick={toggleSidebar}>
                        ☰
                </button>
                <div className="heading">
                    <img className="logo" src="/quizmaster_logo0.png" alt="Loading" />
                    <div id="appname">Quiz Master</div>
                </div>
                <div className="logout">
                    <ul>
                        <li><div style={{alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"row"}}>
                            <img src="/profile_icon_black.png" alt="Profile" width='30px' height='30px'style={{margin:"5px",background:"rgb(225,225,225)",padding:"3px",border:"none",borderRadius:"50%"}}/>{ user === null || user.username === "" ? username : user.username }</div></li>
                        <li style={{background:"black", padding:"5px 10px 5px 10px"}}><div id="logout" onClick={logout} style={{alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"row"}}>
                            Logout<img src="/logout.png" alt="Logout" width='18px' height='18px' style={{ marginLeft:"5px", background:"linear-gradient(to right, rgb(24,24,24), black )"}}/></div></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;