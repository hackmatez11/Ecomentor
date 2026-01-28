# Phase 2: Quick Start Guide

## For Students

### Accessing Learning Paths
1. Log in to your student dashboard
2. Click **"Learning Paths"** in the sidebar (✨ icon)
3. Select up to 5 interests from the list or add custom ones
4. Click **"Generate Paths"**
5. Browse the 3 personalized learning paths
6. Click a path to see detailed modules
7. Click **"Enroll Now"** to start learning

### Accessing Recommended Tasks
1. Click **"Recommended Tasks"** in the sidebar (🎯 icon)
2. View 6 personalized eco-action tasks
3. Use filters to narrow by difficulty or action type
4. Click a task to see full details including:
   - Step-by-step instructions
   - Required resources
   - Environmental impact metrics
   - Estimated time and points
5. Click **"Start This Task"** to begin

## For Developers

### Running the Database Migration

1. Open Supabase SQL Editor
2. Copy contents of `d:\Ecomentor\phase2_schema.sql`
3. Execute the SQL
4. Verify tables created:
   - `learning_paths`
   - `student_learning_progress`
   - `recommended_tasks`
   - `student_interests`

### Testing the Features

**Test as School Student:**
```bash
# Sign up with education level: "Grade 5"
# Expected: Simple language, basic concepts, lower points
```

**Test as College Student:**
```bash
# Sign up with education level: "College/University"
# Expected: Advanced language, complex concepts, higher points
```

### API Endpoints

**Generate Learning Paths:**
```javascript
POST /api/learning-paths
Body: {
  userId: "uuid",
  interests: ["climate change", "renewable energy"],
  regenerate: true
}
```

**Get Learning Paths:**
```javascript
GET /api/learning-paths?userId=uuid&educationLevel=Grade%208&difficulty=intermediate
```

**Generate Task Recommendations:**
```javascript
POST /api/tasks
Body: {
  userId: "uuid",
  limit: 5,
  regenerate: false
}
```

**Get Recommended Tasks:**
```javascript
GET /api/tasks?educationLevel=College&difficulty=hard&limit=10
```

## Environment Variables Required

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## File Structure

```
Ecomentor/
├── phase2_schema.sql                    # Database schema
├── Frontend/
│   └── src/
│       └── app/
│           ├── api/
│           │   ├── learning-paths/
│           │   │   └── route.js         # Learning paths API
│           │   └── tasks/
│           │       └── route.js         # Task recommendations API
│           └── dashboard/
│               └── student/
│                   ├── components/
│                   │   ├── LearningPathGenerator.jsx
│                   │   ├── TaskRecommendations.jsx
│                   │   └── StudentLayout.jsx (modified)
│                   └── page.jsx (modified)
```

## Key Features

✅ **Education Level Detection** - Automatically detects school grade or college level  
✅ **AI Content Adjustment** - Gemini AI adjusts complexity based on student level  
✅ **Personalized Recommendations** - Tasks and paths match interests and capabilities  
✅ **Progress Tracking** - Students can enroll and track learning progress  
✅ **Smart Caching** - AI-generated content saved to database for efficiency  
✅ **Responsive UI** - Beautiful, modern interface with dark theme
