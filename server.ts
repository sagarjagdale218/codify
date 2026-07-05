import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize the Google Gen AI client with the system's API key
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_IF_ABSENT",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

app.use(express.json());

// API: Check status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Generate Personalized Learning Path
app.post("/api/personalized-path", async (req, res) => {
  const { language, level, weeklyHours, goals, interests } = req.body;

  if (!language) {
    return res.status(400).json({ error: "Language is required" });
  }

  try {
    const ai = getAIClient();
    const prompt = `Create a personalized, student-focused, step-by-step programming learning roadmap for learning ${language}.
Student Profile:
- Current Level: ${level || "Beginner"}
- Time Commitment: ${weeklyHours || "3-5"} hours per week
- Primary Goals: ${goals || "Build personal projects"}
- Key Topics of Interest: ${interests || "General programming concepts"}

Design a comprehensive roadmap consisting of exactly 4 sequential learning modules. 
Each module must have:
1. An ID (e.g. "mod-1")
2. A descriptive, engaging title
3. A short, motivating description
4. Estimated hours to complete
5. 3 key concepts learned
6. A modular interactive lesson containing:
   - lessonTitle: A descriptive title for the core hands-on lesson
   - content: Explanatory text, styled nicely, describing the key logic
   - codeTemplate: Starter code for an interactive challenge (in ${language})
   - challengeInstructions: Clean instructions telling the student what to edit or build to complete the module
   - solutionCriteria: A string description of what the solution must achieve (used to evaluate code)
   - sampleAnswer: A valid code solution that satisfies the criteria

Return the roadmap in strict JSON format matching the schema requested.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert curriculum developer for Codeshala, specializing in engaging, accessible programming courses for school and college students.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["language", "level", "summary", "modules"],
          properties: {
            language: { type: Type.STRING },
            level: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A highly encouraging personalized overview of why this path fits the student's goals." },
            modules: {
              type: Type.ARRAY,
              description: "A list of exactly 4 sequential modules",
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "description", "estimatedHours", "keyConcepts", "lesson"],
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                  keyConcepts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  lesson: {
                    type: Type.OBJECT,
                    required: ["lessonTitle", "content", "codeTemplate", "challengeInstructions", "solutionCriteria", "sampleAnswer"],
                    properties: {
                      lessonTitle: { type: Type.STRING },
                      content: { type: Type.STRING, description: "Engaging step-by-step explanatory text of the coding concepts (max 300 words)." },
                      codeTemplate: { type: Type.STRING, description: "The starting template code with comments guiding the student." },
                      challengeInstructions: { type: Type.STRING, description: "Clear instructions of what needs to be changed in the code." },
                      solutionCriteria: { type: Type.STRING, description: "Validation assertions or check conditions written as plain text guidelines." },
                      sampleAnswer: { type: Type.STRING, description: "A correct reference answer code that satisfies the instructions." }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating personalized path:", error);
    res.status(500).json({ error: error.message || "Failed to generate path" });
  }
});

// API: Evaluate Code Challenge
app.post("/api/evaluate-code", async (req, res) => {
  const { language, code, challengeTitle, challengeInstructions, solutionCriteria } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and user code are required" });
  }

  try {
    const ai = getAIClient();
    const prompt = `Evaluate the student's code submission for accuracy and correctness.
Challenge Title: ${challengeTitle}
Challenge Instructions: ${challengeInstructions}
Expected Solution Criteria: ${solutionCriteria}
Language: ${language}

Student's Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Analyze:
1. Does the code accomplish the challenge objectives correctly? Be flexible with syntax formatting but strict with logical accuracy.
2. Are there any syntax or run-time errors?
3. What are the key suggestions for improvements (readability, efficiency, best practices)?
4. Simulate what the expected console/stdout or result output would be if this code were compiled/run.

Respond strictly in JSON format as specified by the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly, encouraging AI compiler and code reviewer for Codeshala. Keep feedback concise, actionable, and tailored to students.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["isCorrect", "simulatedOutput", "feedback", "suggestions"],
          properties: {
            isCorrect: { type: Type.BOOLEAN, description: "True if the student's code matches the logic requested." },
            simulatedOutput: { type: Type.STRING, description: "The simulated console log or execution result from running the code." },
            feedback: { type: Type.STRING, description: "A constructive, friendly critique of what they did well and where they can adjust." },
            suggestions: {
              type: Type.ARRAY,
              description: "A list of 2-3 specific optimization or formatting suggestions.",
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Error evaluating code:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate code" });
  }
});

// API: Chat Mentor
app.post("/api/chat-mentor", async (req, res) => {
  const { language, question, code, history } = req.body;

  try {
    const ai = getAIClient();
    
    // Construct formatting for chat history or prompt context
    let contextHistory = "";
    if (history && Array.isArray(history)) {
      contextHistory = history.map((item: any) => `${item.role === 'user' ? 'Student' : 'Mentor'}: ${item.text}`).join("\n");
    }

    const prompt = `You are an expert programming mentor at Codeshala. Help the student with their question about ${language || "programming"}.
Current code they are working on:
\`\`\`${language || "code"}
${code || "// No code snippet loaded"}
\`\`\`

Conversation History:
${contextHistory}

New Student Question:
"${question}"

Provide a friendly, engaging response. Explain any concepts using easy analogies, give small helpful code examples if relevant, and inspire them to keep trying! Never give away the full exact answer to active homework or challenges immediately; instead, guide them step-by-step so they can learn.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are 'Codeshala Mentor', a supportive and brilliant high school & college coding teacher. You explain things simply, use visual metaphors, and motivate students.",
      }
    });

    res.json({ answer: response.text || "I'm sorry, I couldn't process that question right now. Keep coding!" });
  } catch (error: any) {
    console.error("Error in chat mentor:", error);
    res.status(500).json({ error: error.message || "Mentor was unable to respond." });
  }
});


// ==========================================
// PROJECT SHOWCASE DATA STORE & ENDPOINTS
// ==========================================

interface ShowcaseComment {
  id: string;
  studentName: string;
  text: string;
  createdAt: string;
}

interface ShowcaseProject {
  id: string;
  title: string;
  studentName: string;
  description: string;
  screenshotUrl: string;
  demoLink?: string;
  codeLink?: string;
  tags: string[];
  likes: number;
  likedBy: string[]; // Store clientNames or basic identifiers to track unique likes
  comments: ShowcaseComment[];
  createdAt: string;
}

// Seed data
let showcaseProjects: ShowcaseProject[] = [
  {
    id: "proj-1",
    title: "Space Invaders Retro Game",
    studentName: "Aditya Sharma",
    description: "An arcade classic built with pure HTML Canvas and JavaScript! Features multiple waves of alien invaders, score multipliers, responsive keyboard layouts, and retro visual styling.",
    screenshotUrl: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=800&auto=format&fit=crop&q=60",
    demoLink: "https://aditya-invaders.demo",
    codeLink: "https://github.com/aditya/retro-invaders",
    tags: ["JavaScript", "HTML Canvas", "Game Dev"],
    likes: 24,
    likedBy: [],
    comments: [
      { id: "c-1", studentName: "Riya Verma", text: "Wow, this runs so smoothly! How did you handle the frame rate?", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { id: "c-2", studentName: "Aditya Sharma", text: "Thanks Riya! I used standard requestAnimationFrame() which syncs with the screen refresh rate.", createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "proj-2",
    title: "Portfolio Hub & Bento Grid",
    studentName: "Meera Patel",
    description: "A gorgeous, responsive developer portfolio utilizing interactive bento grid cards. Showcases my active learning milestones, project lists, and certifications.",
    screenshotUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
    demoLink: "https://meerapatel.dev",
    codeLink: "https://github.com/meera/portfolio-bento",
    tags: ["HTML & CSS", "Responsive", "UI/UX"],
    likes: 18,
    likedBy: [],
    comments: [
      { id: "c-3", studentName: "Kabir Das", text: "The modern grid design is beautiful. I will use a similar layout for my portfolio!", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "proj-3",
    title: "AI Interactive Flashcard Maker",
    studentName: "Siddharth Sen",
    description: "An educational app leveraging the Gemini API to analyze study guides and automatically output standard multiple-choice quiz questions and flashcards.",
    screenshotUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    demoLink: "https://ai-quizzer.demo",
    codeLink: "https://github.com/siddharth/ai-quiz-maker",
    tags: ["Python", "Flask", "Gemini API"],
    likes: 31,
    likedBy: [],
    comments: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET: Retrieve all projects
app.get("/api/projects", (req, res) => {
  res.json(showcaseProjects);
});

// POST: Add new project
app.post("/api/projects", (req, res) => {
  const { title, studentName, description, screenshotUrl, demoLink, codeLink, tags } = req.body;

  if (!title || !studentName || !description) {
    return res.status(400).json({ error: "Title, Student Name, and Description are required parameters." });
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60", // Code
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60", // Laptop
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60", // HTML screen
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"  // Cyber/tech
  ];

  const selectedImage = screenshotUrl || defaultImages[Math.floor(Math.random() * defaultImages.length)];

  const newProject: ShowcaseProject = {
    id: `proj-${Date.now()}`,
    title,
    studentName,
    description,
    screenshotUrl: selectedImage,
    demoLink: demoLink || "",
    codeLink: codeLink || "",
    tags: Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
    likes: 0,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString()
  };

  showcaseProjects.unshift(newProject);
  res.status(211).json(newProject);
});

// POST: Like a project
app.post("/api/projects/:id/like", (req, res) => {
  const { id } = req.params;
  const { studentName } = req.body; // use student name as client identifier

  if (!studentName) {
    return res.status(400).json({ error: "studentName is required to register likes" });
  }

  const project = showcaseProjects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  if (!project.likedBy) {
    project.likedBy = [];
  }

  const index = project.likedBy.indexOf(studentName);
  if (index >= 0) {
    // Unlike
    project.likedBy.splice(index, 1);
    project.likes = Math.max(0, project.likes - 1);
  } else {
    // Like
    project.likedBy.push(studentName);
    project.likes += 1;
  }

  res.json({ id: project.id, likes: project.likes, likedBy: project.likedBy });
});

// POST: Comment on a project
app.post("/api/projects/:id/comment", (req, res) => {
  const { id } = req.params;
  const { studentName, text } = req.body;

  if (!studentName || !text) {
    return res.status(400).json({ error: "studentName and text parameters are required to leave a comment." });
  }

  const project = showcaseProjects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const newComment: ShowcaseComment = {
    id: `c-${Date.now()}`,
    studentName,
    text,
    createdAt: new Date().toISOString()
  };

  project.comments.push(newComment);
  res.status(211).json(newComment);
});


// Vite Dev Server / Production Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Codeshala server running at http://localhost:${PORT}`);
  });
}

startServer();
