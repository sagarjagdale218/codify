import React, { useState, useEffect } from "react";
import { ShowcaseProject, StudentProfile } from "../types";
import { 
  Code, Heart, MessageSquare, Plus, ExternalLink, 
  Github, Image as ImageIcon, Send, X, Sparkles, FolderHeart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectShowcaseProps {
  profile: StudentProfile;
  onUpdateXp?: (xp: number) => void;
}

const PRESET_SCREENSHOTS = [
  { name: "Tech Workspace", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60" },
  { name: "Modern Laptop", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60" },
  { name: "Code Editor Screen", url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60" },
  { name: "Cyber Matrix", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60" }
];

export default function ProjectShowcase({ profile, onUpdateXp }: ProjectShowcaseProps) {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<ShowcaseProject | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [codeLink, setCodeLink] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState(PRESET_SCREENSHOTS[0].url);
  const [customScreenshotUrl, setCustomScreenshotUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment state
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const studentName = profile.name || "Sagar";

  // Fetch projects from server
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Liking / Unliking a project
  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/projects/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName }),
      });
      if (res.ok) {
        const data = await res.json();
        
        // Update local list state
        setProjects(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, likes: data.likes, likedBy: data.likedBy };
          }
          return p;
        }));

        // Sync detail modal project if open
        if (activeProject && activeProject.id === id) {
          setActiveProject(prev => prev ? { ...prev, likes: data.likes, likedBy: data.likedBy } : null);
        }
      }
    } catch (err) {
      console.error("Failed to register like:", err);
    }
  };

  // Handle submitting a comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newComment.trim()) return;

    try {
      setIsCommenting(true);
      const res = await fetch(`/api/projects/${activeProject.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, text: newComment.trim() }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        
        // Update projects state list
        setProjects(prev => prev.map(p => {
          if (p.id === activeProject.id) {
            return { ...p, comments: [...p.comments, addedComment] };
          }
          return p;
        }));

        // Update current modal state
        setActiveProject(prev => {
          if (!prev) return null;
          return { ...prev, comments: [...prev.comments, addedComment] };
        });

        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsCommenting(false);
    }
  };

  // Submit new project
  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !description.trim()) {
      setFormError("Please fill out both Title and Description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const finalImage = customScreenshotUrl.trim() || screenshotUrl;
      const parsedTags = tagsInput
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          studentName,
          description: description.trim(),
          screenshotUrl: finalImage,
          demoLink: demoLink.trim(),
          codeLink: codeLink.trim(),
          tags: parsedTags.length > 0 ? parsedTags : ["General"]
        }),
      });

      if (res.ok) {
        const newProj = await res.json();
        setProjects(prev => [newProj, ...prev]);
        
        // Award some XP bonus for uploading a project!
        if (onUpdateXp) {
          onUpdateXp(30); // 30 XP for submitting a showcase project
        }

        // Reset form
        setTitle("");
        setDescription("");
        setDemoLink("");
        setCodeLink("");
        setCustomScreenshotUrl("");
        setTagsInput("");
        setIsAddingProject(false);
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to submit project.");
      }
    } catch (err) {
      setFormError("Server connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <FolderHeart className="w-5.5 h-5.5 text-indigo-600" />
            Student Innovation Hub
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl leading-normal mt-0.5">
            Share your personal Coding projects, browse fellow classmates' designs, click likes, and add constructive comment feedback!
          </p>
        </div>
        
        <button
          onClick={() => setIsAddingProject(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit sm:w-auto self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Showcase Your Project
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-3xl h-64 flex flex-col justify-between p-5">
              <div className="h-28 bg-slate-100 rounded-2xl w-full" />
              <div className="h-4 bg-slate-100 rounded w-2/3 mt-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mt-1" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
          <Code className="w-10 h-10 mx-auto text-slate-400 stroke-[1.5]" />
          <h4 className="text-slate-700 font-bold mt-3">Be the first to showcase!</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            No projects have been uploaded to Codify yet. Click "Showcase Your Project" to post your own work and earn +30 XP!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const hasLiked = project.likedBy && project.likedBy.includes(studentName);
            return (
              <motion.div
                key={project.id}
                layoutId={`proj-card-${project.id}`}
                onClick={() => setActiveProject(project)}
                className="bg-white border border-slate-200 hover:border-indigo-200 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-[360px]"
              >
                {/* Screenshot Header */}
                <div className="relative h-44 overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={project.screenshotUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-md tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info and stats footer */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">
                      {project.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
                      By {project.studentName}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3 text-slate-500 text-xs">
                    <button
                      onClick={(e) => handleLike(project.id, e)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer font-bold font-mono ${
                        hasLiked ? "text-rose-600 font-bold" : ""
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500 text-rose-500 animate-bounce" : ""}`} />
                      {project.likes}
                    </button>

                    <div className="flex items-center gap-1.5 text-slate-400 font-bold font-mono">
                      <MessageSquare className="w-4 h-4" />
                      {project.comments ? project.comments.length : 0}
                    </div>

                    <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      View details
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]"
            >
              
              {/* Image banner with floating close button */}
              <div className="relative h-60 md:h-64 bg-slate-900 shrink-0">
                <img
                  src={activeProject.screenshotUrl}
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-950/70 hover:bg-slate-900/90 text-white rounded-full transition cursor-pointer shadow"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Scrollable details and commenting section */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {activeProject.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 font-medium">
                    Showcase submitted by: <span className="text-slate-700 font-bold font-sans">{activeProject.studentName}</span>
                  </p>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeProject.description}
                </div>

                {/* External links */}
                <div className="flex gap-3 flex-wrap">
                  {activeProject.demoLink && (
                    <a
                      href={activeProject.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Application Demo
                    </a>
                  )}
                  {activeProject.codeLink && (
                    <a
                      href={activeProject.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
                    >
                      <Github className="w-3.5 h-3.5" />
                      View Source Code
                    </a>
                  )}
                </div>

                {/* Liking and comments count summary row */}
                <div className="flex items-center gap-6 py-2.5 border-y border-slate-100 text-sm">
                  <button
                    onClick={() => handleLike(activeProject.id)}
                    className="flex items-center gap-2 hover:text-rose-600 text-slate-600 font-bold transition cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${activeProject.likedBy && activeProject.likedBy.includes(studentName) ? "fill-rose-500 text-rose-500" : ""}`} />
                    {activeProject.likes} Student Likes
                  </button>
                  <span className="flex items-center gap-2 text-slate-500 font-bold">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    {activeProject.comments ? activeProject.comments.length : 0} Class Comments
                  </span>
                </div>

                {/* Comments Thread */}
                <div className="space-y-4 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Discussion Thread</h4>

                  {activeProject.comments && activeProject.comments.length > 0 ? (
                    <div className="space-y-3">
                      {activeProject.comments.map((comm) => (
                        <div key={comm.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700">{comm.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(comm.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed font-sans">{comm.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No comments posted yet. Start the conversation below!</p>
                  )}

                  {/* Add Comment input */}
                  <form onSubmit={handleAddComment} className="flex gap-2.5 pt-2">
                    <input
                      type="text"
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ask a question or leave positive feedback..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition"
                    />
                    <button
                      type="submit"
                      disabled={isCommenting}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition flex items-center justify-center cursor-pointer"
                    >
                      {isCommenting ? <span className="animate-spin">⏳</span> : <Send className="w-3.5 h-3.5" />}
                    </button>
                  </form>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddingProject && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto flex flex-col justify-between space-y-6"
            >
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Showcase Your Coding Craft
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5">
                    Share your work with the Codify classroom community. Get reviewed and secure +30 XP!
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingProject(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs text-center font-bold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddProjectSubmit} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Astro-Calculator"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your app does, which key libraries were imported, and what challenge you conquered building it..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition leading-relaxed"
                  />
                </div>

                {/* Demo Link */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Demo URL</label>
                    <input
                      type="url"
                      value={demoLink}
                      onChange={(e) => setDemoLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GitHub Code URL</label>
                    <input
                      type="url"
                      value={codeLink}
                      onChange={(e) => setCodeLink(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, CSS, Game Dev, Gemini"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition"
                  />
                </div>

                {/* Preset screenshot selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Screenshot/Cover Photo</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_SCREENSHOTS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setScreenshotUrl(preset.url);
                          setCustomScreenshotUrl("");
                        }}
                        className={`h-14 rounded-xl overflow-hidden border-2 relative cursor-pointer ${
                          screenshotUrl === preset.url && !customScreenshotUrl
                            ? "border-indigo-600 scale-95 shadow-sm"
                            : "border-slate-100 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 right-1 text-[8px] bg-slate-950/80 text-white font-bold px-0.5 rounded text-center truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Or use a custom screenshot URL</label>
                    <input
                      type="url"
                      value={customScreenshotUrl}
                      onChange={(e) => setCustomScreenshotUrl(e.target.value)}
                      placeholder="Paste image link: https://..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 transition mt-1"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingProject(false)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer disabled:bg-indigo-400"
                  >
                    {isSubmitting ? "Submitting Showcase..." : "Post to Classroom"}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
