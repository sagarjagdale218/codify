import { StudentProfile, Challenge, CustomPath } from "../types";
import { 
  Trophy, Flame, Award, BookOpen, 
  ChevronRight, Brain, HelpCircle, 
  Sparkles, CheckCircle2, Zap, Play, ArrowRight, RotateCcw,
  BarChart3, Code2, Users2, Calendar
} from "lucide-react";
import { motion } from "motion/react";
import ProjectShowcase from "./ProjectShowcase";
import StudyMaterial from "./StudyMaterial";

const sagarAvatar = new URL("../assets/images/sagar_original_logo_1783245919409.jpg", import.meta.url).href;

interface DashboardProps {
  profile: StudentProfile;
  courses: Record<string, CustomPath>;
  activeLanguage: string;
  challenges: Challenge[];
  onSelectModule: (moduleId: string) => void;
  onSelectChallenge: (challenge: Challenge) => void;
  onLanguageChange: (lang: string) => void;
  onResetOnboarding: () => void;
  onUpdateXp?: (xp: number) => void;
}

export default function Dashboard({
  profile,
  courses,
  activeLanguage,
  challenges,
  onSelectModule,
  onSelectChallenge,
  onLanguageChange,
  onResetOnboarding,
  onUpdateXp
}: DashboardProps) {
  // Calculate Level and XP target bounds
  const currentLevel = Math.floor(profile.xp / 100) + 1;
  const xpInCurrentLevel = profile.xp % 100;
  const xpNeededForNext = 100 - xpInCurrentLevel;

  const activePath = courses[activeLanguage];
  const completedModules = profile.completedModuleIds;
  const completedChallenges = profile.completedChallengeIds;

  // Language display names
  const getLanguageName = (key: string) => {
    if (key === "HTML_CSS") return "HTML & CSS";
    return key;
  };

  // Check completion rates
  const totalModulesCount = activePath ? activePath.modules.length : 0;
  const completedModulesInActiveLang = activePath 
    ? activePath.modules.filter(m => completedModules.includes(m.id)).length 
    : 0;

  const progressPercent = totalModulesCount > 0 
    ? Math.round((completedModulesInActiveLang / totalModulesCount) * 100) 
    : 0;

  // Simple static items to fill Leaderboard bento box nicely
  const leaders = [
    { name: "Rushi khodade", xp: 12450, tag: "RK", rank: 1 },
    { name: "Rama Bhakare", xp: 11920, tag: "RB", rank: 2 },
    { name: "Sagar Jagdale", xp: 1400, tag: "SJ", rank: 3 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 pb-12 text-slate-800">
      
      {/* 1. Master Bento Grid Dashboard Layout */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Bento Box 1: Progress Dashboard & Active Track (Spans 8 cols on medium+) */}
        <section className="col-span-12 md:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 z-0"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
            <div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                Active Pathway
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3 tracking-tight">
                {getLanguageName(activeLanguage)} Route
              </h1>
              {activePath?.summary ? (
                <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">
                  {activePath.summary}
                </p>
              ) : (
                <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">
                  Welcome to {getLanguageName(activeLanguage)}! This interactive pathway is customized to take you from a curious student to an active developer.
                </p>
              )}
            </div>

            {/* Completion Progress bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-800 font-mono">{progressPercent}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course Progress</span>
                </div>
                <div className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {completedModulesInActiveLang} / {totalModulesCount} Modules Completed
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => {
                  // Find first incomplete module or default to first
                  if (activePath?.modules && activePath.modules.length > 0) {
                    const nextIncomplete = activePath.modules.find(m => !completedModules.includes(m.id)) || activePath.modules[0];
                    onSelectModule(nextIncomplete.id);
                  }
                }}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Coding Lesson
              </button>
              
              <button 
                onClick={onResetOnboarding}
                className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Customize Learning Blueprint
              </button>
            </div>
          </div>
        </section>

        {/* Bento Box 2: Streak & Energy Level (Spans 4 cols) */}
        <section className="col-span-12 md:col-span-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 bg-indigo-500 rounded-lg text-[10px] font-bold tracking-wider uppercase font-mono">
                Student Energy
              </span>
              <Flame className="w-6 h-6 text-orange-400 fill-orange-400" />
            </div>
            
            <h3 className="text-lg font-bold mt-4">Current Streak</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-black tracking-tight">{profile.streakDays}</span>
              <span className="text-sm font-semibold text-indigo-200">Consecutive Days</span>
            </div>
            
            <p className="mt-2 text-indigo-100 text-xs leading-relaxed">
              Complete any coding challenge or lesson today to secure your streak multiplier and boost your learning speed!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-500/40 flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center font-mono text-xs font-bold">
              ⚡
            </div>
            <div className="text-left">
              <div className="text-[10px] text-indigo-200 font-mono">STREAK MULTIPLIER</div>
              <div className="text-xs font-bold text-white font-mono">1.2x Daily Bonus Active</div>
            </div>
          </div>
        </section>

        {/* Bento Box 3: Student Profile & Level Info (Spans 4 cols) */}
        <section className="col-span-12 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm flex-shrink-0 bg-slate-800">
                <img 
                  src={sagarAvatar} 
                  alt="Sagar Profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">{profile.name || "Sagar"} (You)</h3>
                <p className="text-[11px] text-slate-400 font-mono">Level {currentLevel} Pathfinder</p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-400">LEVEL PROGRESS</span>
                <span className="text-indigo-600">{profile.xp} / {(currentLevel * 100)} XP</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right font-mono">
                {xpNeededForNext} XP until Level {currentLevel + 1}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs font-mono text-slate-500">
            <div>Experience: <span className="text-slate-800 font-bold">{profile.xp} XP</span></div>
            <div>Rank: <span className="text-slate-800 font-bold">Top 5%</span></div>
          </div>
        </section>

        {/* Bento Box 4: Learning Velocity Bar Chart (Spans 4 cols) */}
        <section className="col-span-12 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 text-sm">Learning Velocity</h3>
          </div>
          
          <div className="flex items-end gap-2.5 h-20 mb-4 pt-4">
            <div className="flex-1 bg-slate-100 rounded-t-lg h-[40%] hover:bg-slate-200 transition-all duration-200" title="Mon"></div>
            <div className="flex-1 bg-slate-100 rounded-t-lg h-[60%] hover:bg-slate-200 transition-all duration-200" title="Tue"></div>
            <div className="flex-1 bg-slate-100 rounded-t-lg h-[30%] hover:bg-slate-200 transition-all duration-200" title="Wed"></div>
            <div className="flex-1 bg-indigo-500 rounded-t-lg h-[90%] hover:bg-indigo-600 transition-all duration-200" title="Thu"></div>
            <div className="flex-1 bg-indigo-500 rounded-t-lg h-[80%] hover:bg-indigo-600 transition-all duration-200" title="Fri"></div>
            <div className="flex-1 bg-slate-100 rounded-t-lg h-[50%] hover:bg-slate-200 transition-all duration-200" title="Sat"></div>
            <div className="flex-1 bg-indigo-600 rounded-t-lg h-[95%] hover:bg-indigo-700 transition-all duration-200" title="Sun"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {profile.weeklyHours === "1-2 hours" ? "2h" : profile.weeklyHours === "3-5 hours" ? "4.5h" : "8h"}
              </p>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Weekly Goal</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {completedModules.length * 3 + completedChallenges.length * 2}
              </p>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Tasks Done</p>
            </div>
          </div>
        </section>

        {/* Bento Box 5: Leaderboard / Class Pathfinders (Spans 4 cols) */}
        <section className="col-span-12 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <Users2 className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm">Top Pathfinders</h3>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">Active</span>
            </div>
            
            <div className="space-y-3 pt-2">
              {leaders.map((l, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {l.name.includes("You") ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-500 shadow-sm flex-shrink-0 bg-slate-800">
                        <img 
                          src={sagarAvatar} 
                          alt="Sagar" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-[10px] flex items-center justify-center font-bold text-indigo-600 font-mono">
                        {l.tag}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-700">
                      {l.name.includes("You") ? `${profile.name || "Sagar"} (You)` : l.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 font-mono">{l.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* 2. Track Route Navigator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-3xl shadow-sm mt-8">
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interactive Syllabus Selection</div>
          <div className="text-base font-bold flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold font-mono uppercase">Current</span>
            {getLanguageName(activeLanguage)}
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {Object.keys(courses).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeLanguage === lang
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/10"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {getLanguageName(lang)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Personalized Roadmaps & Modules */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm mt-6">
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60 z-0" />
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-bold tracking-tight text-slate-800">Your AI-Curated Learning Timeline</h3>
            </div>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
              Step-by-step custom route designed dynamically by the mentor to align with your commitment parameters.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pathway Progress</div>
              <div className="text-sm font-bold text-slate-800 font-mono">
                {completedModulesInActiveLang} / {totalModulesCount} Completed
              </div>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 font-mono text-xs">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Modules Timeline */}
        {activePath?.modules && activePath.modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {/* Visual connector line for horizontal timeline in desktop */}
            <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-slate-100 z-0" />

            {activePath.modules.map((mod, index) => {
              const isCompleted = completedModules.includes(mod.id);
              const isUnlocked = index === 0 || completedModules.includes(activePath.modules[index - 1].id);

              return (
                <div 
                  key={mod.id}
                  className={`flex flex-col items-center text-center relative z-10 transition-all duration-300 ${
                    !isUnlocked ? "opacity-50" : ""
                  }`}
                >
                  {/* Circle indicator */}
                  <div className="mb-4 relative">
                    <button
                      onClick={() => isUnlocked && onSelectModule(mod.id)}
                      disabled={!isUnlocked}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-md shadow-emerald-500/10 cursor-pointer"
                          : isUnlocked
                          ? "bg-indigo-600 border-indigo-400 text-white hover:scale-105 hover:shadow-md hover:shadow-indigo-500/20 cursor-pointer"
                          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span className="font-bold text-sm font-mono">{index + 1}</span>
                      )}
                    </button>
                    
                    {/* Tiny visual lock icon */}
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 p-1 rounded-full text-[9px] shadow-sm leading-none">
                        🔒
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{mod.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 max-w-[180px] mx-auto leading-normal">
                      {mod.description}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                        ⏱️ {mod.estimatedHours} hrs
                      </span>
                    </div>
                  </div>

                  {isUnlocked && (
                    <button
                      onClick={() => onSelectModule(mod.id)}
                      className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 group/btn cursor-pointer"
                    >
                      {isCompleted ? "Review Lesson" : "Start Learning"}
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover/btn:translate-x-1" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-3xl relative z-10">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400 stroke-[1.5]" />
            <div className="text-sm text-slate-500 mt-2">No learning path loaded. Click customize learning blueprint above!</div>
          </div>
        )}
      </div>

      {/* 4. Bento-Style Code Challenges Section */}
      <div className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h3 className="text-xl font-bold tracking-tight text-slate-800">Coding Practice Challenges</h3>
            <p className="text-xs text-slate-500 leading-snug">Solidify syntax rules with automated test review parameters.</p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-xl">
            Track: {getLanguageName(activeLanguage)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {challenges
            .filter((c) => c.language === activeLanguage)
            .map((challenge) => {
              const isDone = completedChallenges.includes(challenge.id);

              return (
                <div 
                  key={challenge.id}
                  className="bg-white hover:bg-slate-50/50 border border-slate-200 rounded-3xl p-5 md:p-6 flex items-start justify-between gap-4 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                        challenge.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : challenge.difficulty === "Medium"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono font-medium">+{challenge.xpReward} XP Reward</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      {challenge.title}
                      {isDone && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-md leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectChallenge(challenge)}
                    className={`shrink-0 p-3.5 rounded-2xl border transition duration-200 cursor-pointer ${
                      isDone
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/50"
                        : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-md hover:shadow-indigo-500/10"
                    }`}
                  >
                    <Play className="w-4.5 h-4.5 fill-current" />
                  </button>
                </div>
              );
            })}

          {challenges.filter((c) => c.language === activeLanguage).length === 0 && (
            <div className="col-span-2 text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-sm font-medium">
              ⚡ No challenges currently defined for {getLanguageName(activeLanguage)}. Try switching paths!
            </div>
          )}
        </div>
      </div>

      {/* GeeksforGeeks Study Corner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mt-8">
        <StudyMaterial language={activeLanguage} />
      </div>

      {/* 5. Classroom Project Showcase Section */}
      <hr className="border-slate-200/60 my-4" />
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <ProjectShowcase profile={profile} onUpdateXp={onUpdateXp} />
      </div>

    </div>
  );
}
