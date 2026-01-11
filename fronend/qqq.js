const BACKEND_URL = "http://localhost:3000/generate-quiz";
const SAVE_URL = "http://localhost:3000/save-result";

const quizBox = document.getElementById("quiz-box");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");

let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let timer;
let timeLeft = 10;
let currentTopicRaw = "";
let currentDifficulty = "Medium";

async function fetchQuiz(topic, difficulty) {
  const cleanTopic = topic.replace(/-/g, ' ').toUpperCase();
  const heading = document.getElementById('quizheading');

// Changing the text
heading.innerText = `Quiz: ${topic}`;
  quizBox.innerHTML = `<div class='loading'><h2>Generating ${difficulty} Quiz...</h2><p>Topic: ${cleanTopic}</p></div>`;
  
  try {
    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: cleanTopic, difficulty }), 
    });
    return await response.json(); 
  } catch (error) {
    quizBox.innerHTML = "<h2>Error generating quiz. Please try again.</h2>";
   if(cleanTopic =="QUANTITATIVE APTITUDE" ) {return  [
    { q: "12 + 15 = ?", options: ["25","27","28","30"], answer: "27" },
    { q: "Square root of 144?", options: ["10","11","12","13"], answer: "12" },
    { q: "Average of 10, 20, 30?", options: ["15","20","25","30"], answer: "20" },
    { q: "15 × 3 = ?", options: ["45","40","50","35"], answer: "45" },
    { q: "25 ÷ 5 = ?", options: ["5","6","4","7"], answer: "5" }
    ];}
    if(cleanTopic === "LOGICAL REASONING" ) {return  [
    { q: "Find odd one: Dog, Cat, Cow, Mango", options:["Dog","Cat","Cow","Mango"], answer:"Mango" },
    { q: "If A=1, B=2, Z=?", options:["24","25","26","27"], answer:"26" },
    { q: "What comes next: 2,4,8,16?", options:["18","24","32","20"], answer:"32" },
    { q: "Opposite of True?", options:["False","Wrong","No","Off"], answer:"False" },
    { q: "Complete series: 1,1,2,3,5,?", options:["7","8","6","9"], answer:"8" }
  ];}
    if(cleanTopic ==="NUMBER SERIES" ) {return   [
    { q: "2,4,8,16,?", options:["20","32","24","30"], answer:"32" },
    { q: "5,10,15,?", options:["18","20","25","30"], answer:"20" },
    { q: "1,3,6,10,?", options:["14","15","13","12"], answer:"15" },
    { q: "10,9,7,4,?", options:["0","3","2","5"], answer:"2" },
    { q: "3,6,12,24,?", options:["36","48","50","60"], answer:"48" }
  ];}
    if(cleanTopic ==="DATA INTERPRETATION" ) {return [
    { q: "If total sales = 100 and X sold 40, what %?", options:["40%","50%","30%","60%"], answer:"40%" },
    { q: "Pie chart shows 50% as A, rest B. B = ?", options:["50","45","40","60"], answer:"50" },
    { q: "If average = 20, sum of 5 numbers?", options:["100","90","80","120"], answer:"100" },
    { q: "If max=90, min=30, range?", options:["60","50","70","40"], answer:"60" },
    { q: "If ratio = 3:2, total = 25?", options:["15 & 10","12 & 8","18 & 12","20 & 5"], answer:"15 & 10" }
  ];}
  return  [
   
  ]
  }
}

async function loadQuizFromURL() {
  const params = new URLSearchParams(window.location.search);
  currentTopicRaw = params.get("quiz") || "General";
  currentDifficulty = params.get("difficulty") || "Medium";
  
  currentQuiz = await fetchQuiz(currentTopicRaw, currentDifficulty);
  if (currentQuiz && currentQuiz.length > 0) {
      showQuestion();
  }
}

function showQuestion() {
  if (currentIndex >= currentQuiz.length) { showResult(); return; }
  clearInterval(timer);
  timeLeft = 10;
  selectedAnswer = null;
  nextBtn.disabled = true;

  const q = currentQuiz[currentIndex];
  quizBox.innerHTML = `
    <div class="quiz-card">
      <h2>Question ${currentIndex + 1}</h2>
      <p style="font-size:1.2rem; margin-bottom:15px;">${q.q}</p>
      <div class="options">
        ${q.options.map(opt => `<button class="option-btn" onclick="selectOption(this, '${opt}')">${opt}</button>`).join("")}
      </div>
      <p id="timer" style="margin-top:15px; font-weight:bold;">Time Left: 10s</p>
    </div>`;
  startTimer();
}

window.selectOption = (btn, val) => {
    document.querySelectorAll(".option-btn").forEach(b => b.style.background = "#f9f9f9");
    btn.style.background = "#00bfff";
    btn.style.color = "white";
    selectedAnswer = val;
    nextBtn.disabled = false;
};

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const t = document.getElementById("timer");
    if(t) t.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) { clearInterval(timer); nextQuestion(); }
  }, 1000);
}

function nextQuestion() {
  const correctAnswer = currentQuiz[currentIndex].answer;
  if (selectedAnswer && selectedAnswer.trim() === correctAnswer.trim()) {
      score++;
  }
  currentIndex++;
  showQuestion();
}

async function showResult() {
  quizBox.innerHTML = "<h2>Calculating Results...</h2>";
  nextBtn.style.display = "none";
  const name = prompt("Enter your name for the leaderboard:", "Guest Player");
  
  const finalTopic = currentTopicRaw.replace(/-/g, ' ').toUpperCase();

  const resultData = {
    username: name || "Anonymous",
    topic: finalTopic,
    difficulty: currentDifficulty,
    score: score,
    totalQuestions: currentQuiz.length
  };

  try {
    await fetch(SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData)
    });
    
    resultBox.innerHTML = `
        <div style="text-align:center;">
            <h1>Quiz Over!</h1>
            <p style="font-size:1.5rem;">Your Score: ${score} / ${currentQuiz.length}</p>
            <p>✅ Data successfully saved to Leaderboard.</p>
            <br>
            <a href="leaderboard.html"><button class="option-btn" style="background:#00bfff; color:white; width:200px;">View Rankings</button></a>
            <a href="quiz.html"><button class="option-btn" style="width:200px;">Try Another</button></a>
        </div>`;
  } catch (e) {
    resultBox.innerHTML = `<h2>Score: ${score}</h2><p>Error saving to database.</p>`;
  }
}

nextBtn.addEventListener("click", nextQuestion);
window.onload = loadQuizFromURL;