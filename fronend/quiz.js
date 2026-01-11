// quiz.js - Logic for searching and starting quizzes

/**
 * Filters the displayed quiz categories based on user search input.
 * It searches through the text of all section cards and highlights matches.
 */
function searchTopic() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let sections = document.querySelectorAll(".section-card");

  sections.forEach(sec => {
    let text = sec.innerText.toLowerCase();
    if (text.includes(input)) {
      sec.style.display = "block"; // Show matching category
      sec.scrollIntoView({ behavior: "smooth", block: "center" });
      sec.style.border = "2px solid #00bfff"; // Highlight match with theme color
    } else {
      sec.style.display = "none"; // Hide non-matching category
    }
  });
}

/**
 * Captures the selected difficulty and topic, then redirects to the quiz execution page.
 * This replaces the static href links to ensure the backend receives the difficulty parameter.
 * @param {string} topic - The quiz topic identifier (e.g., 'Python', 'DBMS').
 */
function startQuiz(topic) {
  // Get the difficulty level from the dropdown added to quiz.html
  const difficultyElement = document.getElementById("difficulty");
  const difficulty = difficultyElement ? difficultyElement.value : "Medium";
  
  // Redirect to qqq.html with both topic and difficulty as URL parameters
  window.location.href = `qqq.html?quiz=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}`;
}

// Optional: Allow pressing "Enter" in the search bar to trigger searchTopic
document.getElementById("searchInput")?.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchTopic();
  }
});