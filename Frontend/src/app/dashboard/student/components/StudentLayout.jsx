"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Home,
  Brain,
  BookOpen,
  Trophy,
  MessageSquare,
  Briefcase,
  User,
  Bell,
  LogOut,
  Leaf,
  Bot,
  Target,
  Sparkles,
  Gamepad2
} from "lucide-react";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEcoBot, setShowEcoBot] = useState(false);
  const [ecoBotInput, setEcoBotInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    // Mock data
    setNotifications([
      { id: 1, message: "Your tree planting submission was approved! +150 points", time: "2 hours ago", read: false },
      { id: 2, message: "New opportunity: Green Peace Internship", time: "5 hours ago", read: false },
      { id: 3, message: "You've reached Rank 12 on the leaderboard!", time: "1 day ago", read: true }
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const sendEcoBotMessage = () => {
    if (ecoBotInput.trim()) {
      setChatMessages([...chatMessages, { text: ecoBotInput, sender: "user", time: new Date() }]);
      setEcoBotInput("");
      // Simulate AI response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          text: "Based on your progress, I recommend focusing on the Water Conservation module next. You're doing great!",
          sender: "bot",
          time: new Date()
        }]);
      }, 1500);
    }
  };

  const getActiveTab = () => {
    if (pathname === "/dashboard/student") return "home";
    if (pathname === "/dashboard/student/learning") return "learning";
    if (pathname === "/dashboard/student/community") return "community";
    if (pathname === "/dashboard/student/activity") return "Activity";
    if (pathname?.includes("quiz")) return "quiz";
    if (pathname?.includes("games")) return "games";
    if (pathname?.includes("leaderboard")) return "leaderboard";
    if (pathname?.includes("opportunities")) return "opportunities";
    if (pathname?.includes("profile")) return "profile";
    return "home";
  };

  const activeTab = getActiveTab();

  const sidebarItems = [
    { id: "home", label: "Dashboard", icon: Home, href: "/dashboard/student" },
    { id: "learning-paths", label: "Learning Paths", icon: Sparkles, href: "/dashboard/student?tab=learning-paths" },
    { id: "tasks", label: "Recommended Tasks", icon: Target, href: "/dashboard/student?tab=tasks" },
    { id: "quiz", label: "AI Quizzes", icon: Brain, href: "/dashboard/student?tab=quiz" },
    { id: "games", label: "Games", icon: Gamepad2, href: "/dashboard/student/games" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/dashboard/student?tab=leaderboard" },
    { id: "community", label: "Community", icon: MessageSquare, href: "/dashboard/student/community" },
    { id: "opportunities", label: "Opportunities", icon: Briefcase, href: "/dashboard/student/opportunities" },
    { id: "profile", label: "Profile", icon: User, href: "/dashboard/student?tab=profile" },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-gray-100">
      <div className="mx-auto px-4 py-6 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-2 h-full">
          <div className="bg-[#0b0b0b] border border-[#111] rounded-xl p-4 space-y-2 sticky top-6 min-h-[calc(100vh-96px)]">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-emerald-600 text-white" : "text-gray-300 hover:bg-[#111]"
                    }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content + Navbar */}
        <div className="col-span-12 lg:col-span-10 space-y-6">
          {/* Top Navigation Bar */}
          <nav className="relative bg-[#0b0b0b] border border-[#111] rounded-xl px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Leaf className="text-emerald-500" size={28} />
                <h1 className="text-2xl font-semibold text-white">EcoMentor</h1>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-[#111] rounded-lg transition-colors text-gray-300"
                >
                  <Bell size={22} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-semibold"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-4 top-14 w-80 bg-[#0f0f0f] rounded-lg shadow-2xl border border-[#1a1a1a] z-50">
                <div className="p-4 border-b border-[#1a1a1a]">
                  <h3 className="font-bold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-[#1a1a1a] hover:bg-[#111] ${!notif.read ? "bg-[#0f1510]" : ""}`}
                    >
                      <p className="text-sm text-gray-200">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Main Content */}
          <div>
            {children}
          </div>
        </div>
      </div>

      {/* EcoBot Floating Button */}
      <button
        onClick={() => setShowEcoBot(!showEcoBot)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-[#04210f] font-bold rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-110 z-40"
      >
        <Bot size={24} />
      </button>

      {/* EcoBot Chat Window */}
      {showEcoBot && (
        <div className="fixed bottom-24 right-6 w-96 bg-[#0f0f0f] rounded-lg shadow-2xl border border-[#1a1a1a] overflow-hidden z-50">
          <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={22} />
              <h3 className="font-bold">EcoBot Assistant</h3>
            </div>
            <button
              onClick={() => setShowEcoBot(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-[#0b0b0b]">
            <div className="flex justify-start">
              <div className="max-w-xs p-3 rounded-lg bg-[#111] border border-[#1a1a1a] shadow-sm text-gray-100">
                <p className="text-sm">Hi! I'm EcoBot 🌱 Ask me about your progress, learning paths, or eco-actions!</p>
              </div>
            </div>

            {chatMessages.filter(m => m.sender === "user" || m.sender === "bot").map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs p-3 rounded-lg ${msg.sender === "user"
                  ? "bg-emerald-500 text-[#04210f]"
                  : "bg-[#111] text-gray-100 border border-[#1a1a1a]"
                  }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1a1a1a] p-3 bg-[#0f0f0f]">
            <div className="flex gap-2">
              <input
                type="text"
                value={ecoBotInput}
                onChange={(e) => setEcoBotInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendEcoBotMessage()}
                className="flex-1 border border-[#1a1a1a] bg-[#0b0b0b] text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ask EcoBot..."
              />
              <button
                onClick={sendEcoBotMessage}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#04210f] px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

