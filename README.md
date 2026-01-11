🚀 SmartAI Quiz
SmartAI Quiz is a sophisticated full-stack quiz platform that leverages Generative AI to create dynamic, on-demand assessments.
By integrating the Google Gemini 1.5 Flash API, the platform generates unique quizzes across various technical and academic topics,
featuring real-time scoring and a global competitive leaderboard.

🌟 Key Features
1.Dynamic AI Generation: Context-aware questions generated via Google Gemini API.
2.Difficulty Logic: Custom prompt engineering for Easy, Medium, and Hard levels.
3.Competitive Tracking: Persistence layer for high scores with topic-specific filtering.
4.Responsive UI: Mobile-first design with real-time countdown timers.

🛠️ Technical Stack
1.Backend: Node.js, Express.js
2.Database: MongoDB (Mongoose ODM)
3.AI Integration: Google Generative AI SDK
4.Frontend:  JavaScript, CSS3 Variables

📥 Installation & Setup
Clone & Install:

Bash

git clone https://github.com/your-username/smartai-quiz.git
cd backend && npm install
Environment Setup: Create a .env file in the backend folder:

Code snippet
GEMINI_API_KEY=your_key_here
MONGO_URI=mongodb://127.0.0.1:27017/aiquizz
Launch:
Bash
node server.js
📝 API Endpoints
POST /generate-quiz: Generates AI questions based on topic/difficulty.
POST /save-result: Persists user performance data to MongoDB.
GET /leaderboard: Retrieves top-10 rankings (supports ?topic= filter).

Developed by BHUMIKA BORBAN
