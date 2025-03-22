import React, { useState } from "react";
import './Login.css';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Navigate } from "react-router-dom";
import { db, auth, googleProvider, signInWithPopup } from '../firebasesetup/Firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { CurrentUser } from "../firebasesetup/UserContext";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = CurrentUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [registererrorMessage, setRegisterErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegclicked, setIsRegClicked] = useState(false);

  const usersCollection = collection(db, "users");

  if (user) {
    return <Navigate to="/quizmaster/dashboard" replace />;
  }

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const q = query(usersCollection, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        await addDoc(usersCollection, {
          uid: user.uid,
          username: user.displayName,
          email: user.email.toLowerCase(),
          password: user.displayName,
          createdAt: new Date()
        });
      }

      const userDoc = querySnapshot.docs[0].data();
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("username", userDoc.username);
      localStorage.setItem("email", user.email.toLowerCase());
      setUser(userDoc);
      toast.success("Login successful!", { hideProgressBar: true, position: "top-center" });
      navigate("/quizmaster/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In failed. Try again.", { hideProgressBar: true, position: "top-center" });
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!loginEmail || !loginPassword) {
      setErrorMessage("Email and password cannot be empty!");
      return;
    }
    try {
      setIsSubmitting(true);
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const loginUser = userCredential.user;
      
      const q = query(usersCollection, where("email", "==", loginEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErrorMessage("User not found!");
        return;
      }
      const userDoc = querySnapshot.docs[0].data();
      setUser({ uid: userDoc.uid, password: userDoc.password, email: userDoc.email, username: userDoc.username });
      localStorage.setItem("uid", loginUser.uid);
      localStorage.setItem("username", userDoc.username);
      localStorage.setItem("email", loginUser.email.toLowerCase());
      navigate("/quizmaster/dashboard");
    } catch (error) {
      setIsSubmitting(false);
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid email or password!");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error! Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setRegisterErrorMessage("");
    if (password.length < 6) {
      setRegisterErrorMessage("Password must be at least 6 characters!");
      return;
    }
    if (!username || !email || !password) {
      setRegisterErrorMessage("All fields are required!");
      return;
    }
    try {
      setIsSubmitting(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      const data = { uid: newUser.uid, username: username, email: email.toLowerCase(), password: password, createdAt: new Date() };
      await addDoc(usersCollection, data);
      setIsRegClicked(!isRegclicked);
      localStorage.setItem("uid", newUser.uid);
      localStorage.setItem("username", username);
      localStorage.setItem("email", newUser.email.toLowerCase());
      setUser(data);
    } catch (error) {
      setIsSubmitting(false);
      setRegisterErrorMessage("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return(
    <div id="login">
      <ToastContainer/>
      <button id="back-btn" onClick={()=>navigate('/home')}><img src="/back-arrow.png" width="30px" height="30px" alt="Back"/></button>
      <div className= { isRegclicked ? "container active" : "container" } >
        <div className="form-box login">
            <form name="loginform" onSubmit={login}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="email" placeholder="Email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value.toString().trim())} required/>
                    <img className='ic' src="/email.png" width="22px" height="24px" alt=""/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} required/>
                    <img className='ic' src="/lock_icon.png" width="22px" height="24px" alt=""/>
                </div>
                {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
              
              <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? <img src="/loading.gif" id="loader" width="24px" height="24px" alt="Logging in..."/> : "Login"}
              </button>
              <hr/>
              <button className="google-login" onClick={googleSignIn}>
                <img src="/google.webp" width="24px" height="24px" alt="" /> Sign in with Google
              </button>
              
            </form>
        </div>
        <div className="form-box register">
            <form name="registerform" onSubmit={register}>
                <h1>Registration</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value.toString().trim())} required/>
                    <img className='ic' src="/profile_icon_black.png" width="20px" height="20px" alt=""/>
                </div>
                <div className="input-box">
                    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value.toString().trim())} required/>
                    <img className='ic' src="/email.png" width="22px" height="24px" alt=""/>               
                </div>
                <div className="input-box">
                  <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <img className='ic' src="/lock_icon.png" width="22px" height="24px" alt=""/>
                  </div>
                  {registererrorMessage && <p id="error-message" style={{color:"red", margin: "0"}}>{registererrorMessage}</p>}  
                </div> 
              <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? <img src="/loading.gif" id="loader" width="24px" height="24px" alt="Registering..."/> : "Register"}
              </button>
              <hr/>
              <button className="google-login" onClick={googleSignIn}>
                <img src="/google.webp" width="24px" height="24px" alt="" /> Sign up with Google
              </button>
              
            </form>
            </div>
              <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                  <img src="/quizmaster_logo0.png" width="150px" height="70px" alt="" style={{marginBottom:"20px"}}/>
                  <h1 style={{color:"white", fontFamily:"cursive"}}>Hello, Welcome</h1>
                  <p style={{color:"white"}}>Don't have a account</p>
                  <button className="btn register-btn" style={{ 
                    background: "linear-gradient( 360deg, #19a8ff, #30b1ff, #48baff, #62c4ff )"}} 
                          onClick={()=> setIsRegClicked(!isRegclicked)} >Register</button>
                </div>
                <div className="toggle-panel toggle-right">
                  <img src="/quizmaster_logo0.png" width="150px" height="70px" alt="" style={{marginBottom:"20px"}}/>
                  <h1 style={{color:"white", fontFamily:"cursive"}}> Welcome Back</h1>
                  <p style={{color:"white"}}>Already have a account</p>
                  <button className="btn login-btn" style={{ 
                    background: "linear-gradient( 360deg, #19a8ff, #30b1ff, #48baff, #62c4ff )"}}
                          onClick={()=> setIsRegClicked(!isRegclicked)} >Login</button>
                </div>
              </div>
            </div>
    </div>
  );
};

export default Login;

/*
<p> or login with social media</p>
<p> or Register with social media</p>
              <div className="social-icons">
                <img className='ic' src="/google.webp" width="24px" height="24px" alt=""/>
                <img className='ic' src="/fb_icon.png" width="24px" height="24px" alt=""/>
                <img className='ic' src="/linkedin_icon.webp" width="24px" height="24px" alt=""/>
                <img className='ic' src="/github.png" width="24px" height="24px" alt=""/>
              </div>
*/
/*import React, { useState } from "react";
import './Login.css';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Navigate } from "react-router-dom";
import { db, auth, googleProvider, signInWithPopup } from '../firebasesetup/Firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { CurrentUser } from "../firebasesetup/UserContext";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = CurrentUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [registererrorMessage, setRegisterErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegclicked, setIsRegClicked] = useState(false);

  const usersCollection = collection(db, "users");

  if (user) {
    return <Navigate to="/quizmaster/dashboard" replace />;
  }

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const q = query(usersCollection, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        await addDoc(usersCollection, {
          uid: user.uid,
          username: user.displayName,
          email: user.email.toLowerCase(),
          password: user.displayName,
          createdAt: new Date()
        });
      }

      const userDoc = querySnapshot.docs[0].data();
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("username", userDoc.username);
      localStorage.setItem("email", user.email.toLowerCase());
      setUser(userDoc);
      toast.success("Login successful!", { hideProgressBar: true, position: "top-center" });
      navigate("/quizmaster/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In failed. Try again.", { hideProgressBar: true, position: "top-center" });
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!loginEmail || !loginPassword) {
      setErrorMessage("Email and password cannot be empty!");
      return;
    }
    try {
      setIsSubmitting(true);
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const loginUser = userCredential.user;
      
      const q = query(usersCollection, where("email", "==", loginEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErrorMessage("User not found!");
        return;
      }
      const userDoc = querySnapshot.docs[0].data();
      setUser({ uid: userDoc.uid, password: userDoc.password, email: userDoc.email, username: userDoc.username });
      localStorage.setItem("uid", loginUser.uid);
      localStorage.setItem("username", userDoc.username);
      localStorage.setItem("email", loginUser.email.toLowerCase());
      navigate("/quizmaster/dashboard");
    } catch (error) {
      setIsSubmitting(false);
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid email or password!");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error! Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setRegisterErrorMessage("");
    if (password.length < 6) {
      setRegisterErrorMessage("Password must be at least 6 characters!");
      return;
    }
    if (!username || !email || !password) {
      setRegisterErrorMessage("All fields are required!");
      return;
    }
    try {
      setIsSubmitting(true);
      const q = query(usersCollection, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setRegisterErrorMessage("An account already exists with this email!");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      const data = { uid: newUser.uid, username: username, email: email.toLowerCase(), password: password, createdAt: new Date().toISOString() };
      await addDoc(usersCollection, data);
      setIsRegClicked(!isRegclicked);
      localStorage.setItem("uid", newUser.uid);
      localStorage.setItem("username", username);
      localStorage.setItem("email", newUser.email.toLowerCase());
      setUser(data);
    } catch (error) {
      setIsSubmitting(false);
      console.log("Error: ", error);
      setRegisterErrorMessage("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return(
    <div id="login">
      <ToastContainer/>
      <button id="back-btn" onClick={()=>navigate('/home')}><img src="/back-arrow.png" width="30px" height="30px" alt="Back"/></button>
      <div className= { isRegclicked ? "container active" : "container" } >
        <div className="form-box login">
            <form name="loginform" onSubmit={login}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="email" placeholder="Email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value.toString().trim())} required/>
                    <img className='ic' src="/email.png" width="22px" height="24px" alt=""/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} required/>
                    <img className='ic' src="/lock_icon.png" width="22px" height="24px" alt=""/>
                </div>
                {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
              
              <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? <img src="/loading.gif" id="loader" width="24px" height="24px" alt="Logging in..."/> : "Login"}
              </button>
              <hr/>
              <button className="google-login" onClick={googleSignIn}>
                <img src="/google.webp" width="24px" height="24px" alt="" /> Sign in with Google
              </button>
              
            </form>
        </div>
        <div className="form-box register">
            <form name="registerform" onSubmit={register}>
                <h1>Registration</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value.toString().trim())} required/>
                    <img className='ic' src="/profile_icon_black.png" width="20px" height="20px" alt=""/>
                </div>
                <div className="input-box">
                    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value.toString().trim())} required/>
                    <img className='ic' src="/email.png" width="22px" height="24px" alt=""/>               
                </div>
                <div className="input-box">
                  <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <img className='ic' src="/lock_icon.png" width="22px" height="24px" alt=""/>
                  </div>
                  {registererrorMessage && <p id="error-message" style={{color:"red", margin: "0"}}>{registererrorMessage}</p>}  
                </div> 
              <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? <img src="/loading.gif" id="loader" width="24px" height="24px" alt="Registering..."/> : "Register"}
              </button>
              <hr/>
              <button className="google-login" onClick={googleSignIn}>
                <img src="/google.webp" width="24px" height="24px" alt="" /> Sign up with Google
              </button>
              
            </form>
            </div>
              <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                  <img src="/quizmaster_logo0.png" width="150px" height="70px" alt="" style={{marginBottom:"20px"}}/>
                  <h1 style={{color:"white", fontFamily:"cursive"}}>Hello, Welcome</h1>
                  <p style={{color:"white"}}>Don't have a account</p>
                  <button className="btn register-btn" style={{ 
                    background: "linear-gradient( 360deg, #19a8ff, #30b1ff, #48baff, #62c4ff )"}} 
                          onClick={()=> setIsRegClicked(!isRegclicked)} >Register</button>
                </div>
                <div className="toggle-panel toggle-right">
                  <img src="/quizmaster_logo0.png" width="150px" height="70px" alt="" style={{marginBottom:"20px"}}/>
                  <h1 style={{color:"white", fontFamily:"cursive"}}> Welcome Back</h1>
                  <p style={{color:"white"}}>Already have a account</p>
                  <button className="btn login-btn" style={{ 
                    background: "linear-gradient( 360deg, #19a8ff, #30b1ff, #48baff, #62c4ff )"}}
                          onClick={()=> setIsRegClicked(!isRegclicked)} >Login</button>
                </div>
              </div>
            </div>
    </div>
  );
};

export default Login;
*/