import { useState, useEffect } from "react";
import { StudentProfile, Challenge, CustomPath } from "./types";
import { PRESET_COURSES, CODING_CHALLENGES } from "./data";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";
import { Sparkles, Trophy, Flame, LogOut, Code, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

const sagarAvatar = new URL("./assets/images/sagar_original_logo_1783245919409.jpg", import.meta.url).href;
const codifyLogo = new URL("./assets/images/codify_logo_1783246973214.jpg", import.meta.url).href;

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>("JavaScript");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Load profile from localStorage on boot
  useEffect(() => {
    const saved = localStorage.getItem("codepathways_profile");
    if (saved) {
      try {
        const parsed: StudentProfile = JSON.parse(saved);
        
        // Dynamic daily login streak evaluation logic
        const todayStr = new Date().toISOString().split("T")[0];
        if (parsed.lastActiveDate) {
          const lastActive = new Date(parsed.lastActiveDate);
          const today = new Date(todayStr);
          const diffTime = Math.abs(today.getTime() - lastActive.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            parsed.streakDays += 1;
          } else if (diffDays > 1) {
            parsed.streakDays = 1; // Streak broken, reset
          }
        } else {
          parsed.streakDays = 1;
        }

        parsed.lastActiveDate = todayStr;
        setProfile(parsed);
        if (parsed.currentLanguage) {
          setActiveLanguage(parsed.currentLanguage);
        }
      } catch (err) {
        console.error("Error parsing saved profile", err);
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const saveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem("codepathways_profile", JSON.stringify(newProfile));
  };

  // Complete onboarding
  const handleOnboardingComplete = (newProfile: StudentProfile) => {
    saveProfile(newProfile);
    setActiveLanguage(newProfile.currentLanguage);
  };

  // Reset profile (return to onboarding)
  const handleResetOnboarding = () => {
    if (window.confirm("Are you sure you want to reset your profile and build a new AI personalized path?")) {
      localStorage.removeItem("codepathways_profile");
      setProfile(null);
      setSelectedModuleId(null);
      setSelectedChallenge(null);
    }
  };

  // Handle successful lesson or challenge completion
  const handleSuccess = (xpEarned: number, targetId: string) => {
    if (!profile) return;

    let updatedCompletedModules = [...profile.completedModuleIds];
    let updatedCompletedChallenges = [...profile.completedChallengeIds];

    const isModule = targetId.startsWith("mod-") || targetId.includes("mod");
    let isAlreadyCompleted = false;

    if (isModule) {
      isAlreadyCompleted = updatedCompletedModules.includes(targetId);
      if (!isAlreadyCompleted) {
        updatedCompletedModules.push(targetId);
      }
    } else {
      isAlreadyCompleted = updatedCompletedChallenges.includes(targetId);
      if (!isAlreadyCompleted) {
        updatedCompletedChallenges.push(targetId);
      }
    }

    const awardXp = isAlreadyCompleted ? 0 : xpEarned;

    const todayStr = new Date().toISOString().split("T")[0];

    const updatedProfile: StudentProfile = {
      ...profile,
      completedModuleIds: updatedCompletedModules,
      completedChallengeIds: updatedCompletedChallenges,
      xp: profile.xp + awardXp,
      lastActiveDate: todayStr,
    };

    saveProfile(updatedProfile);
  };

  // Find the selected module object based on language course
  const activeCourse = profile 
    ? (profile.customPaths[activeLanguage] || PRESET_COURSES[activeLanguage]) 
    : null;
  const selectedModule = activeCourse?.modules.find(m => m.id === selectedModuleId);

  // If no profile is loaded, direct to Onboarding Questionnaire
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Dynamic top bar navigation (not displayed in active workspace) */}
      {!selectedModuleId && !selectedChallenge && (
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-md flex-shrink-0 bg-slate-800">
              <img 
                src={codifyLogo} 
                alt="Codify Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover animate-pulse-once"
              />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">Codify</span>
              <span className="text-[10px] text-indigo-400 font-mono font-black block leading-none tracking-wider mt-0.5">CODING PLATFORM</span>
            </div>
          </div>

          {/* Progress Tracker Widget */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Level and total XP */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-800/40 border border-slate-700/40 px-3.5 py-1.5 rounded-xl">
              <GraduationCap className="w-4.5 h-4.5 text-blue-400" />
              <div className="text-left leading-none">
                <div className="text-[10px] text-slate-400 font-mono">LEVEL {Math.floor(profile.xp / 100) + 1}</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">{profile.xp} XP</div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-2.5 bg-slate-800/40 border border-slate-700/40 px-3.5 py-1.5 rounded-xl">
              <Flame className="w-4.5 h-4.5 text-orange-400 fill-orange-400/10" />
              <div className="text-left leading-none">
                <div className="text-[10px] text-slate-400 font-mono">STREAK</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">{profile.streakDays} Day{profile.streakDays > 1 ? "s" : ""}</div>
              </div>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/40 px-2.5 py-1.5 rounded-xl shrink-0">
              <div className="w-6.5 h-6.5 rounded-full overflow-hidden border border-indigo-500 shadow-sm flex-shrink-0 bg-slate-900" title={`${profile.name}'s Profile`}>
                <img 
                  src={sagarAvatar} 
                  alt="User Profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:inline text-[10px] font-bold text-slate-300 font-mono pr-1">{profile.name}</span>
            </div>

            {/* Change Profile / Reset button */}
            <button
              onClick={handleResetOnboarding}
              title="Reset profile"
              className="p-2 bg-slate-800 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Container Views Router */}
      <main className="flex-1 overflow-hidden">
        {selectedModuleId && selectedModule ? (
          <Workspace
            module={selectedModule}
            language={activeLanguage}
            onBack={() => setSelectedModuleId(null)}
            onSuccess={handleSuccess}
          />
        ) : selectedChallenge ? (
          <Workspace
            challenge={selectedChallenge}
            language={activeLanguage}
            onBack={() => setSelectedChallenge(null)}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="py-8">
            <Dashboard
              profile={profile}
              courses={profile.customPaths}
              activeLanguage={activeLanguage}
              challenges={CODING_CHALLENGES}
              onSelectModule={(id) => setSelectedModuleId(id)}
              onSelectChallenge={(challenge) => setSelectedChallenge(challenge)}
              onLanguageChange={(lang) => {
                setActiveLanguage(lang);
                // Sync current track choice to profile
                saveProfile({ ...profile, currentLanguage: lang });
              }}
              onResetOnboarding={handleResetOnboarding}
              onUpdateXp={(xp) => {
                const updatedProfile = {
                  ...profile,
                  xp: profile.xp + xp,
                  lastActiveDate: new Date().toISOString().split("T")[0]
                };
                saveProfile(updatedProfile);
              }}
            />
          </div>
        )}
      </main>

    </div>
  );
}
