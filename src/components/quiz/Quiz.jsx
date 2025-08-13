import React, { useState } from "react";
import "../quiz/Quiz.css";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState(false);
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const navigate = useNavigate();

  const categories = [
    "HTML", "ReactJs", "CSS", "JavaScript", "Java", "C", "Python",
    "PHP", "SQL", "NextJs", "Firebase", "Mongo DB", "Kotlin",
    "Database Management System", "Computer Networks", "Operating System"
  ];

  // Format category name (First letter capital, rest lowercase)
  const formatCategory = (cat) =>
    cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value > 50) {
      setNumberError("Please enter a number between 1 and 50");
    } else {
      setNumberError("");
    }
    setNumber(Math.max(1, value));
  };

  const handleSubmit = () => {
    if (!category || !difficulty || !number || numberError) {
      setError(true);
      return;
    } else {
      setError(false);
      sessionStorage.setItem('category', formatCategory(category));
      sessionStorage.setItem('difficulty', difficulty);
      sessionStorage.setItem('number', number);
      navigate("/questions");
    }
  };

  return (
    <div className="settings">
      <span style={{ fontSize: 30 }}>Test Your Knowledge!</span>
      <div className="settings__select">
        {error && <ErrorMessage>Please fill all the fields</ErrorMessage>}
        {numberError && <ErrorMessage>{numberError}</ErrorMessage>}

        {/* Autocomplete for category */}
        <Autocomplete
          freeSolo
          options={categories}
          value={category}
          style={{width:"100%"}}
          onChange={(event, newValue) => {
            if (newValue) {
              setCategory(formatCategory(newValue));
            }
          }}
          onInputChange={(event, newInputValue) => {
            setCategory(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter Category..."
              variant="outlined"
              style={{ marginBottom: 30 }}
              
            />
          )}
        />

        <TextField
          label="Enter No of Questions(5-50)"
          type="number"
          variant="outlined"
          style={{ marginBottom: 30 }}
          onChange={handleNumberChange}
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

        <Button id="start-quiz" onClick={handleSubmit}>
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
