import { useState, useEffect, FormEvent } from "react";
import { Module, Challenge, MentorMessage } from "../types";
import { 
  ArrowLeft, Play, Sparkles, MessageSquare, 
  Send, HelpCircle, Loader2, CheckCircle, 
  AlertTriangle, Lightbulb, Terminal, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WorkspaceProps {
  module?: Module;
  challenge?: Challenge;
  language: string;
  onBack: () => void;
  onSuccess: (xpEarned: number, targetId: string) => void;
}

export default function Workspace({
  module,
  challenge,
  language,
  onBack,
  onSuccess
}: WorkspaceProps) {
  // Determine if we are working on a custom Lesson module or preset Challenge
  const title = module ? module.lesson.lessonTitle : challenge?.title || "Challenge";
  const instructions = module ? module.lesson.challengeInstructions : challenge?.instructions || "";
  const initialCode = module ? module.lesson.codeTemplate : challenge?.starterCode || "";
  const criteria = module ? module.lesson.solutionCriteria : challenge?.solutionCriteria || "";
  const id = module ? module.id : challenge?.id || "";
  const xpReward = module ? 50 : challenge?.xpReward || 20;

  // Editor states
  const [code, setCode] = useState(initialCode);
  const [terminalOutput, setTerminalOutput] = useState<string>("Console ready. Write code and press 'Run Locally' or 'AI Evaluate'.");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Chat Mentor states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<MentorMessage[]>([
    {
      id: "m-1",
      role: "model",
      text: `Hi! I'm your CodePathways Mentor. I can see you are working on "${title}". Ask me any questions, or paste errors you don't understand!`,
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [sendingChat, setSendingChat] = useState(false);

  // Load starter template when workspace changes
  useEffect(() => {
    setCode(initialCode);
    setTerminalOutput("Console ready. Write code and press 'Run Locally' or 'AI Evaluate'.");
    setIsSuccess(false);
    setAiSuggestions([]);
    setAiFeedback(null);
  }, [id, initialCode]);

  // Run user code locally in sandbox (JS only)
  const handleRunLocally = () => {
    setTerminalOutput("Running script locally...\n");
    
    if (language !== "JavaScript" && language !== "TypeScript") {
      setTerminalOutput(
        `Local in-browser interpreter is fully optimized for JavaScript!\n` +
        `For Python or other tracks, click the 'Evaluate with AI Expert' button above to run your code on our AI cloud engine and retrieve feedback.`
      );
      return;
    }

    // Capture standard console.log output
    const capturedLogs: string[] = [];
    const originalLog = console.log;
    
    console.log = (...args: any[]) => {
      capturedLogs.push(
        args.map(arg => typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)).join(" ")
      );
    };

    try {
      // Safe execution boundaries
      const runUserCode = new Function(code);
      runUserCode();
      
      console.log = originalLog;
      
      if (capturedLogs.length === 0) {
        setTerminalOutput("Code executed successfully but did not print any logs.\nMake sure to call console.log() to print outputs!");
      } else {
        setTerminalOutput(capturedLogs.join("\n"));
      }
    } catch (err: any) {
      console.log = originalLog;
      setTerminalOutput(`Execution Error: ${err.message}\nCheck your syntax and variable names!`);
    }
  };

  // Run AI valuation (Cloud Gemini engine)
  const handleAIEvaluate = async () => {
    setIsEvaluating(true);
    setTerminalOutput("Connecting to CodePathways evaluation sandbox...\nEvaluating logic and structures via Gemini 3.5...");
    setAiFeedback(null);
    setAiSuggestions([]);

    try {
      const response = await fetch("/api/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          challengeTitle: title,
          challengeInstructions: instructions,
          solutionCriteria: criteria,
        }),
      });

      if (!response.ok) {
        throw new Error("Evaluation server error. Please try again.");
      }

      const result = await response.json();
      
      // Update workspace feedback states
      setTerminalOutput(result.simulatedOutput || "No console outputs generated.");
      setAiFeedback(result.feedback);
      setAiSuggestions(result.suggestions || []);
      
      if (result.isCorrect) {
        setIsSuccess(true);
        onSuccess(xpReward, id);
      } else {
        setIsSuccess(false);
      }

    } catch (error: any) {
      console.error(error);
      setTerminalOutput(`AI Evaluation Error: ${error.message || "Failed to reach AI evaluation endpoint."}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Chat Mentor Send Message
  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;

    const studentMsg: MentorMessage = {
      id: `student-${Date.now()}`,
      role: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory(prev => [...prev, studentMsg]);
    setChatInput("");
    setSendingChat(true);

    try {
      const res = await fetch("/api/chat-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          question: studentMsg.text,
          code,
          history: chatHistory.map(item => ({ role: item.role, text: item.text })),
        }),
      });

      if (!res.ok) {
        throw new Error("Mentor connection issue.");
      }

      const data = await res.json();
      
      const mentorMsg: MentorMessage = {
        id: `mentor-${Date.now()}`,
        role: "model",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatHistory(prev => [...prev, mentorMsg]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        {
          id: `mentor-err-${Date.now()}`,
          role: "model",
          text: "I am having some connection issues, but I encourage you to double-check your variables and check if your functions are returning correctly!",
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-[100vw] overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* 1. Sub-Header */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">
              {module ? "Interactive Tutorial" : "Coding Challenge"}
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white truncate max-w-[180px] sm:max-w-xs">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-505/10 px-2.5 py-1 rounded">
            💎 +{xpReward} XP Reward
          </span>

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              chatOpen 
                ? "bg-indigo-600 border-indigo-500 text-white" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI Mentor</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Split Screen */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          {/* Left panel: Lesson and explanation */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/30 overflow-y-auto p-5 md:p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                {module ? module.lesson.lessonTitle : "Instructions"}
              </h2>

              {module && (
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-sans whitespace-pre-wrap">
                  {module.lesson.content}
                </div>
              )}

              {challenge && (
                <div className="bg-slate-800/40 p-4 border border-slate-700/40 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider">CHALLENGE GOAL</h3>
                  <p className="text-sm text-slate-200">{challenge.description}</p>
                </div>
              )}
            </div>

            {/* Steps & Checklist */}
            <div className="bg-slate-800/20 border border-slate-800 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Student Objective</h3>
              <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono">
                {instructions}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-bold text-indigo-400 font-mono uppercase">CRITERIA TO PASS</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">{criteria}</p>
              </div>
            </div>
          </div>

          {/* Right panel: Editor and Console Workspace */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {/* Editor Header */}
            <div className="h-11 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-rose-500 rounded-full" />
                <span className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs font-mono text-slate-400 ml-2">editor.{language === "HTML_CSS" ? "html" : language === "Python" ? "py" : "js"}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRunLocally}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded text-xs font-semibold text-slate-300 transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  Run Locally
                </button>
                
                <button
                  onClick={handleAIEvaluate}
                  disabled={isEvaluating}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-80 rounded text-xs font-semibold text-white transition flex items-center gap-1.5 shadow"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      AI Evaluate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Custom interactive text editor */}
            <div className="flex-1 relative font-mono text-sm overflow-hidden flex">
              {/* Fake Line Numbers */}
              <div className="w-10 bg-slate-900/20 text-slate-600 text-right pr-2 py-4 select-none border-r border-slate-800 text-xs leading-6">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable Text Area */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-slate-100 p-4 font-mono text-xs md:text-sm leading-6 focus:outline-none resize-none overflow-y-auto"
                style={{ tabSize: 2 }}
                spellCheck="false"
              />
            </div>

            {/* Interactive Console Terminal Output */}
            <div className="h-44 border-t border-slate-800 bg-slate-900/60 flex flex-col shrink-0 overflow-hidden">
              <div className="h-8 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Console Logs</span>
                </div>
                <span>Output Stream</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-5">
                {terminalOutput}
              </div>
            </div>
          </div>

        </div>

        {/* 3. Sliding / Floating AI Mentor Sidebar */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-30"
            >
              <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-600/10 border border-indigo-600/30 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">AI Code Mentor</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Learning Tutor Active</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="text-xs text-slate-400 hover:text-white font-mono px-2 py-1 rounded hover:bg-slate-800"
                >
                  Close
                </button>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[10px] text-slate-500 font-mono mb-1">{msg.role === "user" ? "You" : "Mentor"} • {msg.timestamp}</div>
                    <div className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700/40 rounded-tl-none whitespace-pre-wrap"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {sendingChat && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span>Mentor is reviewing your questions...</span>
                  </div>
                )}
              </div>

              {/* Message inputs */}
              <form onSubmit={handleSendChat} className="p-4 border-t border-slate-800 shrink-0 bg-slate-950">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question about this code..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || sendingChat}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. AI Feedback Overlay Alert Dialog / Success Modal */}
      <AnimatePresence>
        {aiFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl z-40 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
                <span className={`text-xs font-bold font-mono uppercase tracking-wide ${isSuccess ? "text-emerald-400" : "text-amber-400"}`}>
                  {isSuccess ? "AI EVALUATION: PASSED!" : "AI EVALUATION: TRY AGAIN"}
                </span>
              </div>
              <button 
                onClick={() => setAiFeedback(null)}
                className="text-[10px] text-slate-500 hover:text-slate-300 font-mono font-bold"
              >
                DISMISS
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{aiFeedback}</p>

            {aiSuggestions.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  Code Improvement Suggestions:
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pl-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {isSuccess && (
              <div className="pt-2">
                <button
                  onClick={onBack}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Awesome! Back to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
