"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { 
  MessageSquare,
  Trophy ,
  BookOpen ,
  Target,
  Upload,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  Zap,
  Briefcase
} from "lucide-react";
import QuizGenerator from "./QuizGenerator.jsx";

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";
  const [user, setUser] = useState(null);
  const [studentData, setStudentData] = useState({
    ecoPoints: 0,
    level: "school",
    classroom: null,
    rank: 0,
    completedTasks: 0,
    pendingSubmissions: 0,
    environmentalImpact: {
      co2Saved: 0,
      treesPlanted: 0,
      plasticReduced: 0
    }
  });
  const [learningPaths, setLearningPaths] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchLearningPaths();
    fetchSubmissions();
    fetchOpportunities();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      // Fetch student profile from Firestore/Supabase
      // This is a mock - replace with actual Firestore calls
      setStudentData({
        ecoPoints: 1250,
        level: "college",
        classroom: "ENV-101-A",
        rank: 12,
        completedTasks: 24,
        pendingSubmissions: 3,
        environmentalImpact: {
          co2Saved: 45.5,
          treesPlanted: 8,
          plasticReduced: 12.3
        }
      });
    }
  };

  const fetchLearningPaths = () => {
    // Mock data - replace with Firestore fetch
    setLearningPaths([
      { id: 1, title: "Water Conservation Basics", progress: 75, difficulty: "Beginner", points: 100 },
      { id: 2, title: "Renewable Energy Systems", progress: 30, difficulty: "Intermediate", points: 150 },
      { id: 3, title: "Sustainable Agriculture", progress: 0, difficulty: "Advanced", points: 200 }
    ]);
  };

  const fetchSubmissions = () => {
    // Mock data
    setSubmissions([
      { id: 1, action: "Planted 5 trees in local park", status: "approved", points: 150, date: "2025-10-01" },
      { id: 2, action: "Organized beach cleanup", status: "pending", points: 200, date: "2025-10-02" },
      { id: 3, action: "Created recycling program", status: "under_review", points: 180, date: "2025-10-03" }
    ]);
  };

  const fetchOpportunities = () => {
    // Mock data
    setOpportunities([
      { id: 1, title: "Green Peace Internship", ngo: "GreenPeace", duration: "3 months", minPoints: 1000 },
      { id: 2, title: "Wildlife Conservation Volunteer", ngo: "WWF", duration: "2 weeks", minPoints: 500 },
      { id: 3, title: "Climate Action Ambassador", ngo: "Climate Reality", duration: "6 months", minPoints: 1500 }
    ]);
  };


  const sendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput, sender: "user", time: new Date() }]);
      setChatInput("");
      // Simulate community response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "Great question! I'm working on something similar.", 
          sender: "other", 
          name: "Alex K.",
          time: new Date() 
        }]);
      }, 1000);
    }
  };


  const renderHome = () => {
    const leaderboardPreview = [
      { rank: 1, name: "Sarah Chen", points: 2850 },
      { rank: 2, name: "Marcus Johnson", points: 2640 },
      { rank: 3, name: "Emily Rodriguez", points: 2420 },
    ];

    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-3xl font-bold mb-1 text-white">
              Welcome back, {user?.email?.split("@")[0] || "EcoMentor"}! 🌱
            </h2>
            <p className="text-gray-400">
              Continue your journey to make a positive environmental impact
            </p>
          </div>
          <button
            onClick={() => setShowEcoBot(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Chat with EcoBot
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-1">
              <p className="text-sm text-gray-500">Total EcoPoints</p>
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{studentData.ecoPoints}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-emerald-400 font-semibold">+125</span> this week
            </p>
          </div>

          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-1">
              <p className="text-sm text-gray-400">Learning Paths</p>
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{learningPaths.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active modules in progress</p>
          </div>

          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-1">
              <p className="text-sm text-gray-400">Tasks Completed</p>
              <Target className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{studentData.completedTasks}</div>
            <p className="text-xs text-gray-500 mt-1">{studentData.pendingSubmissions} pending review</p>
          </div>

          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-1">
              <p className="text-sm text-gray-400">Global Rank</p>
              <Trophy className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">#{studentData.rank}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-emerald-400 font-semibold">↑ 2</span> positions
            </p>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Your Learning Paths</h3>
              <a
                href="/dashboard/student/learning"
                className="text-emerald-400 font-semibold inline-flex items-center gap-2 hover:text-emerald-300"
              >
                View All <ArrowRight className="h-4 w-4" />
              </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.slice(0, 2).map((path) => (
              <div key={path.id} className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{path.title}</h4>
                    <p className="text-sm text-gray-400">Difficulty: {path.difficulty}</p>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {path.points} pts
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Progress</span>
                    <span className="font-semibold text-emerald-300">{path.progress}%</span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full transition-all"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
                <a
                  href="/dashboard/student/learning"
                  className="mt-4 w-full inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-[#04210f] py-2 rounded-xl font-semibold transition-colors"
                >
                  {path.progress > 0 ? "Continue" : "Start Learning"}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tasks & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tasks */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Active Tasks</h3>
                <a
                  href="/dashboard/student/learning"
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Go to tasks
                </a>
            </div>
            {submissions.map((sub) => (
                <div key={sub.id} className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] p-4 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">{sub.action}</h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          sub.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : sub.status === "pending"
                            ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                            : "bg-blue-500/15 text-blue-200 border border-blue-500/30"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                      <p className="text-sm text-gray-400 mb-2">Points: {sub.points}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-emerald-400" />
                        {studentData.level}
                      </span>
                      <span>{sub.date}</span>
                    </div>
                  </div>
                    <button className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: EcoBot + Leaderboard */}
          <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0b0b0b] rounded-2xl border border-[#1a1a1a] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  <h4 className="font-semibold text-white">EcoBot Assistant</h4>
              </div>
                <p className="text-sm text-gray-400 mb-3">
                "Based on your progress, explore renewable energy next!"
              </p>
              <button
                onClick={() => setShowEcoBot(true)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#04210f] font-semibold py-2 rounded-xl shadow-md shadow-emerald-500/30"
              >
                Start Conversation
              </button>
            </div>

              <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-emerald-400" />
                  <h4 className="font-semibold text-white">Top Performers</h4>
              </div>
              <div className="space-y-3">
                {leaderboardPreview.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1 ? "bg-emerald-500/20 text-emerald-300" : "bg-[#111] text-gray-300"
                        }`}
                      >
                        {entry.rank}
                      </div>
                        <span className="font-medium text-white">{entry.name}</span>
                    </div>
                      <span className="text-sm font-semibold text-emerald-300">{entry.points}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("leaderboard")}
                  className="w-full mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300 border border-[#1a1a1a] rounded-xl py-2"
              >
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>

        {/* NGO Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">NGO Opportunities</h3>
            <button
              onClick={() => setActiveTab("opportunities")}
              className="text-emerald-400 font-semibold inline-flex items-center gap-2 hover:text-emerald-300"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {opportunity.duration}
                  </span>
                  <span className="text-xs text-gray-500">+{opportunity.minPoints} pts</span>
                </div>
                <h4 className="text-lg font-semibold text-white">{opportunity.title}</h4>
                <p className="text-sm text-gray-400 mb-2">by {opportunity.ngo}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Minimum required: {opportunity.minPoints} EcoPoints
                </p>
                <button
                  onClick={() => setActiveTab("opportunities")}
                  className="w-full text-sm font-semibold text-emerald-400 hover:text-emerald-300 border border-[#1a1a1a] rounded-xl py-2"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => (
    <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <Trophy className="text-yellow-500" />
        Community Leaderboard
      </h2>
      
      <div className="space-y-3">
        {[
          { rank: 1, name: "Sarah Chen", points: 2850, avatar: "SC" },
          { rank: 2, name: "Marcus Johnson", points: 2640, avatar: "MJ" },
          { rank: 3, name: "Emily Rodriguez", points: 2420, avatar: "ER" },
          { rank: 12, name: "You", points: studentData.ecoPoints, avatar: "ME", highlight: true }
        ].map(student => (
          <div 
            key={student.rank}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              student.highlight 
                ? "bg-emerald-900/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank Number Badge */}
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-lg ${
                student.rank === 1 ? "bg-yellow-500 text-black" :
                student.rank === 2 ? "bg-zinc-400 text-black" :
                student.rank === 3 ? "bg-orange-500 text-black" :
                "bg-zinc-800 text-gray-500"
              }`}>
                {student.rank}
              </div>
              
              {/* Avatar Circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                 student.highlight 
                 ? "bg-emerald-500 text-black border-emerald-400" 
                 : "bg-zinc-800 text-emerald-400 border-zinc-700"
              }`}>
                {student.avatar}
              </div>
              
              {/* User Info */}
              <div>
                <p className={`font-bold ${student.highlight ? "text-emerald-400" : "text-white"}`}>
                  {student.name}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="text-emerald-500 font-medium">{student.points}</span> EcoPoints
                </p>
              </div>
            </div>
  
            {/* Trophy Icon for Top 3 */}
            {student.rank <= 3 && (
              <Trophy className={
                student.rank === 1 ? "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" :
                student.rank === 2 ? "text-zinc-400" :
                "text-orange-500"
              } size={24} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // const renderCommunity = () => (
  //   <div className="space-y-6">
  //     <div className=" rounded-lg shadow p-6">
  //       <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
  //         <MessageSquare className="text-blue-600" />
  //         Community Chat
  //       </h2>
        
  //       <div className="border rounded-lg h-96 flex flex-col">
  //         <div className="flex-1 overflow-y-auto p-4 space-y-3">
  //           {chatMessages.map((msg, idx) => (
  //             <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
  //               <div className={`max-w-xs p-3 rounded-lg ${
  //                 msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
  //               }`}>
  //                 {msg.sender === "other" && <p className="text-xs font-bold mb-1">{msg.name}</p>}
  //                 <p>{msg.text}</p>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
          
  //         <div className="border-t p-4 flex gap-2">
  //           <input 
  //             type="text"
  //             value={chatInput}
  //             onChange={(e) => setChatInput(e.target.value)}
  //             onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
  //             className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
  //             placeholder="Type a message..."
  //           />
  //           <button 
  //             onClick={sendChatMessage}
  //             className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
  //           >
  //             Send
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderOpportunities = () => (
    <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <Briefcase className="text-emerald-500" />
        NGO Opportunities
      </h2>
      
      <div className="space-y-4">
        {opportunities.map(opp => (
          <div 
            key={opp.id} 
            className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/30 hover:bg-zinc-900 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                  {opp.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  by <span className="text-gray-300">{opp.ngo}</span>
                </p>
              </div>
              {/* Green Badge */}
              <span className="px-3 py-1 bg-emerald-900/20 text-emerald-300 border border-emerald-900/50 text-sm rounded-full font-medium">
                {opp.duration}
              </span>
            </div>
            
            <div className="mb-4 bg-black/40 rounded-lg p-3 border border-zinc-800">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">
                Minimum Required
              </p>
              <p className="text-white font-bold text-lg flex items-center gap-2">
                {opp.minPoints} <span className="text-emerald-500 text-sm font-normal">EcoPoints</span>
              </p>
            </div>
            
            <button 
              disabled={studentData.ecoPoints < opp.minPoints}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                studentData.ecoPoints >= opp.minPoints
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-70"
              }`}
            >
              {studentData.ecoPoints >= opp.minPoints 
                ? "Apply Now" 
                : `Need ${opp.minPoints - studentData.ecoPoints} more points`
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Profile Settings</h2>
      
      <div className="space-y-5">
        {/* Email Field (Disabled) */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">Email</label>
          <input 
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full bg-zinc-900/50 border border-zinc-800 text-gray-500 rounded-lg p-3 cursor-not-allowed"
          />
        </div>
        
        {/* Education Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Education Level</label>
          <select className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
            <option value="school">School</option>
            <option value="college">College</option>
          </select>
        </div>
        
        {/* Classroom Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Classroom Code</label>
          <input 
            type="text"
            value={studentData.classroom || ""}
            className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter classroom code"
          />
        </div>
        
        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Interests</label>
          <input 
            type="text"
            className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g., Climate Change, Renewable Energy"
          />
        </div>
        
        {/* Save Button */}
        <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-lg font-bold text-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <>
      {activeTab === "home" && renderHome()}
      {activeTab === "leaderboard" && renderLeaderboard()}
      {activeTab === "opportunities" && renderOpportunities()}
      {activeTab === "profile" && renderProfile()}
      {activeTab === "quiz" && <QuizGenerator />}
    </>
  );
}