# Quiz Master 

**Quiz Master** is an interactive quiz application that allows users to learn, attempt quizzes, and track their performance over time. It offers a smooth user experience with login or registration, customizable quiz options, and detailed performance analytics.

## 🚀 Live Demo
[Visit Quiz Master](https://quiz-master-eosin.vercel.app)

---

## 📌 Features

### 🔑 Authentication
- **Login & Registration** using email and password.
- Secure user account management.

### 🏠 Navigation
- Navigation bar with:
  - **Home**
  - **Profile**
  - **Quiz History**
  - **Performance**
  - **About Us**
  - **Logout**

### 📚 Home
- Start a quiz by selecting:
  - **Category** (choose from dropdown or enter course name)
  - **Number of Questions** (5–50)
  - **Difficulty** (Easy / Medium / Hard)

### 📝 Quiz Page
- Displays one question at a time.
- **Question Navigator** to jump to any question:
  - Attempted questions marked in **green**.
- **Next**, **Previous**, and **Submit** buttons.
- On submission:
  - **Score page** with results and explanations for correct answers.

### 📊 Performance Tracking
- **Overall Performance**: Average score per course in bar graph format.
- **Course-Specific Performance**: Select a course to view past quiz scores in bar graph.

### 📜 Quiz History
- View all past quiz attempts with scores and details.

### 👤 Profile Management
- Change **username** and **password**.
- View registered **email** (non-editable).

---

## 🛠️ Tech Stack
- **Frontend**: React.js
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore

---

### 📌 **Usage**
- Register or Login using your email and password.

- Navigate to Home.

- Start a quiz by selecting category, question count, and difficulty.

- Attempt quiz using Next/Previous or the Question Navigator.

- Submit quiz to see your score and explanations.

- Check Performance and Quiz History anytime.

---

### 📄 **License**
- This project is licensed under the MIT License.

---

## 📥 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Sathvika2311/Quiz-Master.git

# Navigate to the project folder
cd quiz-master

#Create .env file where package.json was placed and setup with your gemini, firebase api keys

# Install dependencies
npm install

# Start the development server
npm start
