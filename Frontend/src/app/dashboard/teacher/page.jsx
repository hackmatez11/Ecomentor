"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Users,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  Sparkles
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingReviews: 0,
    activeLessonPlans: 0,
    totalClassPoints: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Fetch students count
        const studentsRes = await fetch(`/api/teacher/students?teacherId=${user.id}`);
        const studentsData = await studentsRes.json();

        // Fetch pending submissions
        const submissionsRes = await fetch(`/api/teacher/submissions?teacherId=${user.id}`);
        const submissionsData = await submissionsRes.json();

        // Fetch lesson plans count
        const { data: lessonPlans } = await supabase
          .from('lesson_plans')
          .select('id')
          .eq('teacher_id', user.id);

        setStats({
          totalStudents: studentsData.students?.length || 0,
          pendingReviews: submissionsData.submissions?.length || 0,
          activeLessonPlans: lessonPlans?.length || 0,
          totalClassPoints: studentsData.students?.reduce((sum, s) => sum + s.ecoPoints, 0) || 0
        });

        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060606] text-gray-100 flex items-center justify-center">
        <div className="text-emerald-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-400">Teacher Portal</p>
            <h1 className="text-4xl font-bold text-white mt-1">Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome back, {user?.email?.split("@")[0]}! 👋
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-xl">
              🎓
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04210f] font-semibold transition-colors shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-2">
              <p className="text-sm text-gray-400">Total Students</p>
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-2">Across all classrooms</p>
          </div>

          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-2">
              <p className="text-sm text-gray-400">Pending Reviews</p>
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.pendingReviews}</div>
            <p className="text-xs text-gray-500 mt-2">Submissions awaiting review</p>
          </div>

          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-2">
              <p className="text-sm text-gray-400">Lesson Plans</p>
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeLessonPlans}</div>
            <p className="text-xs text-gray-500 mt-2">AI-generated & custom</p>
          </div>

          <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between pb-2">
              <p className="text-sm text-gray-400">Class Points</p>
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400">{stats.totalClassPoints}</div>
            <p className="text-xs text-gray-500 mt-2">Total eco-points earned</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/teacher/lesson-planner"
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">AI Lesson Planner</h3>
              </div>
              <p className="text-emerald-100 text-sm">
                Generate comprehensive lesson plans with AI assistance
              </p>
            </Link>

            <Link
              href="/dashboard/teacher/rubric-generator"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <ClipboardCheck className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Rubric Generator</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Create detailed assessment rubrics automatically
              </p>
            </Link>

            <Link
              href="/dashboard/teacher/review-queue"
              className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all relative"
            >
              {stats.pendingReviews > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {stats.pendingReviews}
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Review Queue</h3>
              </div>
              <p className="text-amber-100 text-sm">
                Review and approve student eco-action submissions
              </p>
            </Link>

            <Link
              href="/dashboard/teacher/student-progress"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Student Progress</h3>
              </div>
              <p className="text-purple-100 text-sm">
                Monitor individual student achievements and growth
              </p>
            </Link>

            <Link
              href="/dashboard/teacher/classrooms"
              className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Manage Classrooms</h3>
              </div>
              <p className="text-pink-100 text-sm">
                Organize and manage your classroom sections
              </p>
            </Link>

            <Link
              href="/dashboard/teacher/lesson-plans"
              className="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">View Lesson Plans</h3>
              </div>
              <p className="text-cyan-100 text-sm">
                Browse and manage your saved lesson plans
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0f0f0f] rounded-2xl shadow-sm border border-[#1a1a1a] p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.pendingReviews > 0 ? (
              <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {stats.pendingReviews} submission{stats.pendingReviews > 1 ? 's' : ''} awaiting review
                  </p>
                  <p className="text-sm text-gray-400">Review student eco-actions to award points</p>
                </div>
                <Link
                  href="/dashboard/teacher/review-queue"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#04210f] rounded-lg font-semibold transition-colors"
                >
                  Review Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-white font-medium">All caught up!</p>
                  <p className="text-sm text-gray-400">No pending submissions to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
