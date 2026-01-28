import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';
import { ObjectId } from 'mongodb';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const status = searchParams.get('status');
    const classroomId = searchParams.get('classroomId');

    // If teacherId is provided, verify teacher role and get their classrooms
    let classroomIds = [];
    if (teacherId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', teacherId)
        .single();

      if (profileError || !profile || profile.role !== 'teacher') {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Get teacher's classrooms
      const { data: teacherClassrooms } = await supabase
        .from('teacher_classrooms')
        .select('classroom_id')
        .eq('teacher_id', teacherId)
        .eq('is_active', true);

      classroomIds = teacherClassrooms?.map(tc => tc.classroom_id) || [];
    }

    const { db } = await connectToDatabase();

    // Build query
    let query = {};

    // Filter by teacher's classrooms if teacherId provided
    if (teacherId && classroomIds.length > 0) {
      query.$or = [
        { classroomId: { $in: classroomIds } },
        { classroomId: null }
      ];
    } else if (classroomId) {
      query.classroomId = classroomId;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    } else if (teacherId) {
      // For teachers, only show pending and flagged by default
      query.status = { $in: ['pending_review', 'ai_flagged'] };
    }

    // Get submissions
    const submissions = await db
      .collection('action_submissions')
      .find(query)
      .sort({ submittedAt: -1 })
      .limit(100)
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedSubmissions = submissions.map(sub => ({
      ...sub,
      _id: sub._id.toString(),
      studentId: typeof sub.studentId === 'object' ? sub.studentId.toString() : sub.studentId,
      classroomId: sub.classroomId && typeof sub.classroomId === 'object' ? sub.classroomId.toString() : sub.classroomId
    }));

    // Calculate counts for teacher view
    const counts = teacherId ? {
      all: serializedSubmissions.length,
      ai_flagged: serializedSubmissions.filter(s => s.status === 'ai_flagged').length,
      pending_review: serializedSubmissions.filter(s => s.status === 'pending_review').length
    } : undefined;

    return NextResponse.json({
      success: true,
      submissions: serializedSubmissions,
      ...(counts && { counts })
    });

  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
