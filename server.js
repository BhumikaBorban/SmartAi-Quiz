import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// 1. MongoDB Connection (Using 127.0.0.1 for stability)
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Database Schema
const resultSchema = new mongoose.Schema({
    username: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, default: 'Medium' },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
const QuizResult = mongoose.model('QuizResult', resultSchema);

// 3. Gemini AI Config
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

app.use(cors());
app.use(express.json());

// 4. Save Result Endpoint
app.post('/save-result', async (req, res) => {
    const { username, topic, score, totalQuestions, difficulty } = req.body;
    try {
        const newResult = new QuizResult({ username, topic, score, totalQuestions, difficulty });
        await newResult.save();
        res.status(201).json({ message: "Result saved!" });
    } catch (error) {
        res.status(500).json({ error: "Database save failed" });
    }
});

// 5. Get Leaderboard Endpoint with Query Filtering
app.get('/leaderboard', async (req, res) => {
    try {
        const { topic } = req.query; 
        let query = {};
        
        // Only filter if topic is provided and is not "All"
        if (topic && topic !== "All") {
            query.topic = topic.toUpperCase(); 
        }

        const topScores = await QuizResult.find(query)
            .sort({ score: -1, date: -1 }) 
            .limit(10);
        res.json(topScores);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// 6. Quiz Generation Endpoint
app.post('/generate-quiz', async (req, res) => {
    const { topic, difficulty = 'Medium' } = req.body;
    const prompt = `Generate a 5-question ${difficulty} difficulty multiple-choice quiz about '${topic}'. Return ONLY a JSON object with key 'quiz' containing array of {q, options, answer}.`;
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Corrected model name
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const jsonText = result.text.trim().replace(/^```json|```$/g, '').trim();
        res.json(JSON.parse(jsonText).quiz || JSON.parse(jsonText)); 
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI Generation Error" });
    }
});

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));