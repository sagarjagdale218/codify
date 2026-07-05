import { useState, FormEvent } from "react";
import { StudentProfile } from "../types";
import { Sparkles, BrainCircuit, Rocket, Target, BookOpen, Clock, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void;
}

const sagarAvatar = new URL("../assets/images/sagar_original_logo_1783245919409.jpg", import.meta.url).href;
const codifyLogo = new URL("../assets/images/codify_logo_1783246973214.jpg", import.meta.url).href;

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("Sagar");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [weeklyHours, setWeeklyHours] = useState("3-5");
  const [goals, setGoals] = useState("Build web apps and personal projects");
  const [interests, setInterests] = useState("Interactive web applications, simple games");
  const [language, setLanguage] = useState("JavaScript");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name to start your Codify journey.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/personalized-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          level,
          weeklyHours,
          goals,
          interests,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not connect to AI server. Please try again.");
      }

      const generatedPath = await res.json();

      // Create a brand-new profile with this generated pathway included
      const newProfile: StudentProfile = {
        name: name.trim(),
        level,
        weeklyHours,
        goals,
        interests,
        currentLanguage: language,
        completedModuleIds: [],
        completedChallengeIds: [],
        xp: 20, // Give some starter XP for onboarding!
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        customPaths: {
          [language]: generatedPath,
        },
      };

      onComplete(newProfile);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate personalized path. Let's retry!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.1),rgba(255,255,255,0))]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative z-10"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/15 rounded-full blur-2xl" />
          <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg flex-shrink-0 bg-slate-800 mb-3">
            <img 
              src={codifyLogo} 
              alt="Codify Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome to Codify</h1>
          <p className="text-indigo-100 mt-2 text-sm max-w-md mx-auto">
            Answer a few quick questions so our AI can curate a personalized, student-friendly curriculum tailored precisely to your goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Student Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              What is your full name?
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sagar Jagdale"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition font-medium text-sm"
            />
          </div>

          {/* Primary Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Which language do you want to master first?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: "JavaScript", desc: "Interactive Web Scripts" },
                { name: "Python", desc: "Data & Simple Scripts" },
                { name: "HTML_CSS", desc: "Layout & Web Design" },
                { name: "Java", desc: "Robust & OOP Software" },
                { name: "Cpp", desc: "High-Speed Systems" },
                { name: "SQL", desc: "Databases & Analytics" }
              ].map((lang) => (
                <button
                  key={lang.name}
                  type="button"
                  onClick={() => setLanguage(lang.name)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                    language === lang.name
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md animate-pulse-once"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="font-bold text-sm">
                    {lang.name === "HTML_CSS" ? "HTML & CSS" : lang.name === "Cpp" ? "C++" : lang.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{lang.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-500" />
              What is your programming experience?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 font-bold text-sm ${
                    level === lvl
                      ? "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md"
                      : "border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-100/50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Commitment & Timing */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              How many hours can you commit per week?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["1-2 hours", "3-5 hours", "6+ hours"].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setWeeklyHours(hours)}
                  className={`p-3 rounded-2xl border text-center transition-all duration-200 text-sm font-semibold ${
                    weeklyHours === hours
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md"
                      : "border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-100/50"
                  }`}
                >
                  {hours}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Goals Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              What are your core goals?
            </label>
            <input
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. Pass my school computer science class, build static games"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Student's specific coding interests */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              What is your favorite topic or project idea?
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Interactive quizzes, dynamic animation dashboards"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative mt-4 py-4 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-80 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Designing Custom AI Pathway... (Takes ~5s)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>Generate My CodePathways Route</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
