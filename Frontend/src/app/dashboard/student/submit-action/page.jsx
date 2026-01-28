"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
    ArrowLeft,
    Upload,
    Camera,
    X,
    Loader2,
    CheckCircle,
    Clock,
    Award,
    MapPin,
    Calendar,
    Sparkles,
    AlertCircle
} from "lucide-react";

export default function SubmitActionPage() {
    const [formData, setFormData] = useState({
        actionType: "",
        description: "",
        location: "",
        date: new Date().toISOString().split('T')[0],
        estimatedImpact: ""
    });
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [studentId, setStudentId] = useState(null);
    const [submissionHistory, setSubmissionHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);


    const actionTypes = [
        "Tree Planting",
        "Beach Cleanup",
        "Waste Recycling",
        "Energy Conservation",
        "Water Conservation",
        "Community Education",
        "Sustainable Transport",
        "Wildlife Protection",
        "Composting",
        "Other"
    ];

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setStudentId(user.id);
                // Optionally fetch submission history
                // const response = await fetch(`/api/student-submissions?studentId=${user.id}`);
                // const data = await response.json();
                // if (data.success) setSubmissionHistory(data.submissions);
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("Maximum 5 images allowed");
            return;
        }

        setImages([...images, ...files]);

        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        URL.revokeObjectURL(previewUrls[index]);
        setImages(newImages);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId) {
            alert("Please log in to submit an action");
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert images to base64
            const imagePromises = images.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const base64Images = await Promise.all(imagePromises);

            // Call AI verification API
            const response = await fetch("/api/verify-action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    ...formData,
                    images: base64Images
                })
            });

            const result = await response.json();

            if (result.success) {
                const statusMessage = result.autoApproved
                    ? `🎉 Action approved automatically! You earned ${result.aiVerification.suggestedPoints} points!`
                    : result.status === 'ai_flagged'
                        ? `⏳ Your submission has been flagged for teacher review. You'll be notified once it's reviewed.`
                        : `✅ Submission successful! Your teacher will review it soon.`;

                alert(statusMessage);

                // Reset form
                setFormData({
                    actionType: "",
                    description: "",
                    location: "",
                    date: new Date().toISOString().split('T')[0],
                    estimatedImpact: ""
                });
                setImages([]);
                setPreviewUrls([]);
            } else {
                alert("Failed to submit action: " + result.error);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit action. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-5 mb-10">
                    <Link
                        href="/dashboard/student"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Upload className="h-6 w-6 text-emerald-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                                Submit Eco-Action
                            </h1>
                        </div>
                        <p className="text-gray-400 mt-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-500/60" />
                            Share your environmental impact and earn points
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Action Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                <Award className="h-4 w-4 text-emerald-400" />
                                Action Type *
                            </label>
                            <select
                                value={formData.actionType}
                                onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                                required
                                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="">Select action type</option>
                                {actionTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your eco-action in detail..."
                                rows={5}
                                required
                                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                            />
                        </div>

                        {/* Location and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-400" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="City, State"
                                    required
                                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-purple-400" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Estimated Impact */}
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3">
                                Estimated Impact (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.estimatedImpact}
                                onChange={(e) => setFormData({ ...formData, estimatedImpact: e.target.value })}
                                placeholder="e.g., 10 trees planted, 50kg waste collected"
                                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                <Camera className="h-4 w-4 text-pink-400" />
                                Upload Photos * (Max 5)
                            </label>

                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition-all bg-black/20">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={images.length >= 5}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer block">
                                    <Camera className="h-14 w-14 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 mb-1 font-semibold">Click to upload images</p>
                                    <p className="text-xs text-gray-600">PNG, JPG up to 10MB each</p>
                                </label>
                            </div>

                            {/* Image Previews */}
                            {previewUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-28 object-cover rounded-xl border border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            >
                                                <X className="h-3.5 w-3.5 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-blue-300 font-semibold mb-1">AI Verification</p>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Your submission will be verified by AI. High-confidence submissions are auto-approved,
                                        while others are reviewed by your teacher. You'll be notified of the result!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || images.length === 0 || !formData.actionType || !formData.description}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Submitting for Verification...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-5 w-5" />
                                    Submit for Verification
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
