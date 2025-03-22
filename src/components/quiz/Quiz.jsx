import React,{ useState } from "react";
import "../quiz/Quiz.css";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useNavigate } from "react-router-dom"; 

const Quiz = () => {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState(false);
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState(""); // State for number error
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!category || !difficulty || !number || numberError) {
      setError(true);
      return;
    } else {
      setError(false);
      sessionStorage.setItem('category', category);
      sessionStorage.setItem('difficulty', difficulty);
      sessionStorage.setItem('number', number);
      navigate("/questions");
    }
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value > 50) {
      setNumberError("Please enter a number between 1 and 100");
    } else {
      setNumberError(""); // Clear error message if valid
    }
    setNumber(Math.max(1, value)); // Ensure number stays within range
  };

  return (
    <div className="settings">
      <span style={{ fontSize: 30 }}>Test Your Knowledge!</span>
      <div className="settings__select">
        {error && <ErrorMessage>Please fill all the fields</ErrorMessage>}
        {numberError && <ErrorMessage>{numberError}</ErrorMessage>} {/* Display number error */}

        <TextField
          select
          label="Select Category"
          variant="outlined"
          style={{ marginBottom: 30 }}
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <MenuItem key="HTML" value="HTML">Html</MenuItem>
          <MenuItem key="react" value="react">React</MenuItem>
          <MenuItem key="css" value="css">CSS</MenuItem>
          <MenuItem key="javascript" value="javascript">JavaScript</MenuItem>
          <MenuItem key="Java" value="Java">Java</MenuItem>
          <MenuItem key="c" value="c">C</MenuItem>
          <MenuItem key="Python" value="Python">Python</MenuItem>
          <MenuItem key="PHP" value="PHP">PHP</MenuItem>
          <MenuItem key="sql" value="sql">SQL</MenuItem>
          <MenuItem key="Next.js" value="Next.js">Next.js</MenuItem>
          <MenuItem key="firebase" value="firebase">Firebase</MenuItem>
          <MenuItem key="Mongo DB" value="Mongo DB">Mongo DB</MenuItem>
          <MenuItem key="kotlin" value="kotlin">Kotlin</MenuItem>
          <MenuItem key="Database Management System" value="Database Management System">DBMS</MenuItem>
          <MenuItem key="Computer Networks" value="Computer Networks">Computer Networks</MenuItem>
          <MenuItem key="Operating System" value="Operating System">Operating System</MenuItem>
        </TextField>

        <TextField
          label="Enter No of Questions(5-50)"
          type="number"
          variant="outlined"
          style={{ marginBottom: 30 }}
          onChange={handleNumberChange} // Use the updated handler
          value={number}
          inputProps={{ min: 5, max: 50 }}
        />

        <TextField
          select
          label="Select Difficulty"
          variant="outlined"
          style={{ marginBottom: 30 }}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <MenuItem key="Easy" value="Easy">Easy</MenuItem>
          <MenuItem key="Medium" value="Medium">Medium</MenuItem>
          <MenuItem key="Hard" value="Hard">Hard</MenuItem>
        </TextField>

        <Button
          id="start-quiz"
          onClick={handleSubmit}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
  }

export default Quiz;