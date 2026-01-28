"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Sparkles,
    Loader2,
    Save,
    FileText,
    CheckCircle,
    Edit,
    Trash2,
    Plus,
    Minus
} from "lucide-react";

export default function LessonPlannerPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [previousPlans, setPreviousPlans] = useState([]);
    const [fetchingPrevious, setFetchingPrevious] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        subject: "",
        gradeLevel: "",
        educationLevel: "school",
        duration: "45 minutes",
        learningObjectives: [""],
        additionalContext: ""
    });

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchPreviousPlans();
        }
    }, [user]);

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
        } else {
            router.push("/login");
        }
    };

    const fetchPreviousPlans = async () => {
        if (!user) return;
        setFetchingPrevious(true);
        try {
            const response = await fetch(`/api/teacher/lesson-plans?teacherId=${user.id}`);
            const data = await response.json();
            if (data.success) {
                setPreviousPlans(data.lessonPlans);
            }
        } catch (error) {
            console.error("Error fetching previous plans:", error);
        } finally {
            setFetchingPrevious(false);
        }
    };

    const loadLessonPlan = (plan) => {
        setGeneratedPlan(plan);
        setIsEditing(false);
        // Scroll to the generated plan section on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleObjectiveChange = (index, value) => {
        const newObjectives = [...formData.learningObjectives];
        newObjectives[index] = value;
        setFormData(prev => ({ ...prev, learningObjectives: newObjectives }));
    };

    const addObjective = () => {
        setFormData(prev => ({
            ...prev,
            learningObjectives: [...prev.learningObjectives, ""]
        }));
    };

    const removeObjective = (index) => {
        if (formData.learningObjectives.length > 1) {
            const newObjectives = formData.learningObjectives.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, learningObjectives: newObjectives }));
        }
    };

    const handleGenerate = async () => {
        if (!formData.subject || !formData.gradeLevel) {
            alert("Please fill in subject and grade level");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/generate-lesson-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacherId: user.id,
                    subject: formData.subject,
                    gradeLevel: formData.gradeLevel,
                    educationLevel: formData.educationLevel,
                    duration: formData.duration,
                    learningObjectives: formData.learningObjectives.filter(obj => obj.trim() !== ""),
                    additionalContext: formData.additionalContext
                })
            });

            const data = await response.json();

            if (data.success) {
                setGeneratedPlan(data.lessonPlan);
                setIsEditing(false);
            } else {
                alert("Error generating lesson plan: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to generate lesson plan");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedPlan) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from("lesson_plans")
                .update({
                    title: generatedPlan.title,
                    learning_objectives: generatedPlan.learning_objectives,
                    materials_needed: generatedPlan.materials_needed,
                    activities: generatedPlan.activities,
                    assessment_methods: generatedPlan.assessment_methods,
                    differentiation_strategies: generatedPlan.differentiation_strategies,
                    homework_assignment: generatedPlan.homework_assignment,
                    additional_resources: generatedPlan.additional_resources,
                    is_published: true
                })
                .eq("id", generatedPlan.id);

            if (error) {
                alert("Error saving lesson plan: " + error.message);
            } else {
                setShowSuccess(true);
                fetchPreviousPlans(); // Refresh the list
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save lesson plan");
        } finally {
            setSaving(false);
        }
    };

    const handleEditField = (field, value) => {
        setGeneratedPlan(prev => ({ ...prev, [field]: value }));
    };

    const handleEditArrayField = (field, index, value) => {
        const newArray = [...generatedPlan[field]];
        newArray[index] = value;
        setGeneratedPlan(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setGeneratedPlan(prev => ({
            ...prev,
            [field]: [...prev[field], ""]
        }));
    };

    const removeArrayItem = (field, index) => {
        const newArray = generatedPlan[field].filter((_, i) => i !== index);
        setGeneratedPlan(prev => ({ ...prev, [field]: newArray }));
    };

    return (
        <div className="min-h-screen bg-[#060606] text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/teacher"
                            className="p-2 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                                <Sparkles className="h-8 w-8 text-emerald-400" />
                                AI Lesson Planner
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Generate comprehensive lesson plans with AI assistance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <p className="text-emerald-300 font-medium">Lesson plan saved successfully!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Form and Recent Plans */}
                    <div className="space-y-6">
                        {/* Form Section */}
                        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Lesson Parameters</h2>

                            <div className="space-y-4">
                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Climate Change, Renewable Energy"
                                        className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Grade Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Grade Level *
                                    </label>
                                    <input
                                        type="text"
                                        name="gradeLevel"
                                        value={formData.gradeLevel}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Grade 8, High School, College Freshman"
                                        className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Education Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Education Level *
                                    </label>
                                    <select
                                        name="educationLevel"
                                        value={formData.educationLevel}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="school">School</option>
                                        <option value="college">College</option>
                                    </select>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Duration
                                    </label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="30 minutes">30 minutes</option>
                                        <option value="45 minutes">45 minutes</option>
                                        <option value="1 hour">1 hour</option>
                                        <option value="90 minutes">90 minutes</option>
                                        <option value="2 hours">2 hours</option>
                                    </select>
                                </div>

                                {/* Learning Objectives */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Learning Objectives (Optional)
                                    </label>
                                    <div className="space-y-2">
                                        {formData.learningObjectives.map((objective, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={objective}
                                                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                                    placeholder={`Objective ${index + 1}`}
                                                    className="flex-1 bg-black border-2 border-zinc-700 text-white rounded-lg p-3 placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                                />
                                                {formData.learningObjectives.length > 1 && (
                                                    <button
                                                        onClick={() => removeObjective(index)}
                                                        className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4 text-red-400" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={addObjective}
                                            className="w-full p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 text-emerald-300 font-medium"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Objective
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Context */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Additional Context (Optional)
                                    </label>
                                    <textarea
                                        name="additionalContext"
                                        value={formData.additionalContext}
                                        onChange={handleInputChange}
                                        placeholder="Any specific requirements, themes, or focus areas..."
                                        rows={4}
                                        className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !formData.subject || !formData.gradeLevel}
                                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#04210f] disabled:text-gray-400 py-3 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5" />
                                            Generate Lesson Plan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Recent Plans Section */}
                        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-400" />
                                Recently Generated Plans
                            </h2>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {fetchingPrevious ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                                    </div>
                                ) : previousPlans.length > 0 ? (
                                    previousPlans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => loadLessonPlan(plan)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all ${generatedPlan?.id === plan.id
                                                ? "bg-emerald-500/10 border-emerald-500/50"
                                                : "bg-black/40 border-[#1a1a1a] hover:border-emerald-500/30 hover:bg-[#151515]"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-white truncate pr-2">{plan.title}</h3>
                                                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                                    {new Date(plan.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span>{plan.subject}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>{plan.grade_level}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No previously saved plans found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Generated Plan Section */}
                    <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] p-6 h-fit sticky top-6">
                        {generatedPlan ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">Generated Lesson Plan</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center gap-2 text-blue-300 font-medium"
                                        >
                                            <Edit className="h-4 w-4" />
                                            {isEditing ? "View" : "Edit"}
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-600 text-[#04210f] disabled:text-gray-400 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Save
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                            Title
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={generatedPlan.title}
                                                onChange={(e) => handleEditField("title", e.target.value)}
                                                className="w-full bg-black border border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        ) : (
                                            <p className="text-white text-lg font-semibold">{generatedPlan.title}</p>
                                        )}
                                    </div>

                                    {/* Learning Objectives */}
                                    <div>
                                        <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                            Learning Objectives
                                        </label>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                {generatedPlan.learning_objectives?.map((obj, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={obj}
                                                            onChange={(e) => handleEditArrayField("learning_objectives", index, e.target.value)}
                                                            className="flex-1 bg-black border border-zinc-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                        <button
                                                            onClick={() => removeArrayItem("learning_objectives", index)}
                                                            className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addArrayItem("learning_objectives")}
                                                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Add Objective
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                                {generatedPlan.learning_objectives?.map((obj, index) => (
                                                    <li key={index}>{obj}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Materials Needed */}
                                    <div>
                                        <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                            Materials Needed
                                        </label>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                {generatedPlan.materials_needed?.map((material, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={material}
                                                            onChange={(e) => handleEditArrayField("materials_needed", index, e.target.value)}
                                                            className="flex-1 bg-black border border-zinc-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                        <button
                                                            onClick={() => removeArrayItem("materials_needed", index)}
                                                            className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addArrayItem("materials_needed")}
                                                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Add Material
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                                {generatedPlan.materials_needed?.map((material, index) => (
                                                    <li key={index}>{material}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Activities */}
                                    <div>
                                        <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                            Activities
                                        </label>
                                        <div className="space-y-3">
                                            {generatedPlan.activities?.map((activity, index) => (
                                                <div key={index} className="bg-[#1a1a1a] rounded-lg p-4">
                                                    <h4 className="font-semibold text-white mb-2">
                                                        {activity.name} ({activity.duration})
                                                    </h4>
                                                    <p className="text-gray-300 text-sm mb-2">{activity.description}</p>
                                                    {activity.instructions && (
                                                        <p className="text-gray-400 text-sm italic">{activity.instructions}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Assessment Methods */}
                                    <div>
                                        <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                            Assessment Methods
                                        </label>
                                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                                            {generatedPlan.assessment_methods?.map((method, index) => (
                                                <li key={index}>{method}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Differentiation Strategies */}
                                    <div>
                                        <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                            Differentiation Strategies
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={generatedPlan.differentiation_strategies}
                                                onChange={(e) => handleEditField("differentiation_strategies", e.target.value)}
                                                rows={4}
                                                className="w-full bg-black border border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                            />
                                        ) : (
                                            <p className="text-gray-300">{generatedPlan.differentiation_strategies}</p>
                                        )}
                                    </div>

                                    {/* Homework Assignment */}
                                    {generatedPlan.homework_assignment && (
                                        <div>
                                            <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                                Homework Assignment
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    value={generatedPlan.homework_assignment}
                                                    onChange={(e) => handleEditField("homework_assignment", e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-black border border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                                />
                                            ) : (
                                                <p className="text-gray-300">{generatedPlan.homework_assignment}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Additional Resources */}
                                    {generatedPlan.additional_resources?.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-emerald-400 mb-2">
                                                Additional Resources
                                            </label>
                                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                                {generatedPlan.additional_resources.map((resource, index) => (
                                                    <li key={index}>{resource}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20 px-6">
                                <FileText className="h-16 w-16 text-[#1a1a1a] mb-4" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                                    No Lesson Plan Generated Yet
                                </h3>
                                <p className="text-gray-500">
                                    Fill in the form or select a recent plan to get started
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

