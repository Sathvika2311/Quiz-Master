import React, { useContext, useState, useEffect } from "react";
import "./Profile.css";
import { toast, ToastContainer } from "react-toastify";
import { CurrentUser } from "../firebasesetup/UserContext";
import { db } from "../firebasesetup/Firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

function Profile() {
    const { user, setUser } = CurrentUser;
    const usersCollection = collection(db, "users");

    const [visible, setVisible] = useState(false);
    const [isUpdateClicked, setIsUpdateClicked] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [password, setPassword] = useState("");

    // Fetch user data once when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const q = query(usersCollection, where("email", "==", email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();
                    setUsername(userDoc.username);
                    setPassword(userDoc.password);
                }
            } catch (e) {
                console.error("Error while fetching user data: ", e);
            }
        };
        fetchUserData();
    }, [email]); // Runs when email changes

    const updateUserDetails = async (e) => {
        e.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            toast.error("Empty fields are invalid!", { hideProgressBar: true, position: "top-center" });
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters!", { hideProgressBar: true, position: "top-center" });
            return;
        }

        try {
            setIsUpdateClicked(true);
            const q = query(usersCollection, where("uid", "==", localStorage.getItem("uid")));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userRef = userDoc.ref;
                await updateDoc(userRef, { username: username, password: password });

                localStorage.setItem("username", username); // Update localStorage
                toast.success("User successfully updated", { hideProgressBar: true, position: "top-center" });
            } else {
                toast.error("User not found!", { hideProgressBar: true, position: "top-center" });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Update failed! Please retry!!", { hideProgressBar: true, position: "top-center" });
        } finally {
            setIsUpdateClicked(false);
        }
    };

    return (
        <div id="profile">
            <ToastContainer />
            <div className="profile">
                <img src="/profile_icon_black.png" id="profile-icon" alt="" />
                <form className="userInfo" name="userForm" id="userForm" onSubmit={updateUserDetails}>
                    <ul>
                        <li>
                            <div className="details">
                                <label htmlFor="username"><b>Username: </b></label>
                                <input type="text" id="username" className="inp" name="username" 
                                    value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </li>
                        <li>
                            <div className="details">
                                <label htmlFor="email"><b>Email ID&nbsp;&nbsp;&nbsp;: </b></label>
                                <div id="email" name="email" className="inp" style={{ color: "gray" }}>{email}</div>
                            </div>
                        </li>
                        <li>
                            <div className="details">
                                <label htmlFor="password"><b>Password: </b></label>
                                <div className="inp">
                                    <input name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                        type={visible ? "text" : "password"} 
                                        style={{ border: "none", margin: "0", width: "calc(100% - 30px)", background: "none" }} />
                                    <div onClick={() => setVisible(!visible)}>
                                        {visible ? <img src="/closed-eye.png" width="24px" height="24px" alt="show" /> : 
                                            <img src="/opened-eye.png" width="24px" height="24px" alt="hide" />}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <button id="update-btn" style={{ padding: "10px 20px", width: "40%", height: "fit-content", borderRadius: "15px",
                        background: "#3098ff", border: "none", color: "white", fontWeight: "bold" }} 
                        disabled={isUpdateClicked}>
                        {isUpdateClicked ? <img src="/loading.gif" id="loader" width="24px" height="24px" style={{ background: "none" }} alt="Updating..." /> 
                            : "Update"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
