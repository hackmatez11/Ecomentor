import { useState, useEffect } from "react";
import { Brain, Play, CheckCircle, XCircle, Award, Clock, ArrowLeft, Sparkles, BookOpen, Trophy, Target } from "lucide-react";

export default function QuizGenerator() {
  const [studentClass, setStudentClass] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, showResults, timeLeft]);

  const classOptions = [
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" },
    { value: "college-1", label: "College Year 1" },
    { value: "college-2", label: "College Year 2" },
    { value: "college-3", label: "College Year 3" },
    { value: "college-4", label: "College Year 4" }
  ];

  const topicOptions = [
    "Climate Change",
    "Renewable Energy",
    "Water Conservation",
    "Waste Management",
    "Biodiversity",
    "Pollution Control",
    "Sustainable Agriculture",
    "Ecosystem Services",
    "Carbon Footprint",
    "Ocean Conservation"
  ];

  // Simulated AI Quiz Generation (Replace with actual Gemini AI API call)
  const generateQuiz = async () => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock quiz data - Replace this with actual Gemini AI API call
    const mockQuiz = {
      title: `${quizTopic} Quiz for ${classOptions.find(c => c.value === studentClass)?.label}`,
      topic: quizTopic,
      difficulty: difficulty,
      totalQuestions: 10,
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: `What is the primary cause of ${quizTopic.toLowerCase()} according to recent scientific studies?`,
          options: [
            "Natural climate cycles",
            "Human activities and greenhouse gas emissions",
            "Solar radiation changes",
            "Volcanic activity"
          ],
          correctAnswer: 1,
          explanation: "Scientific consensus shows that human activities, particularly burning fossil fuels and deforestation, are the primary drivers of current climate change.",
          points: 10
        },
        {
          id: 2,
          question: `Which renewable energy source has seen the most growth globally in the past decade?`,
          options: [
            "Hydroelectric power",
            "Wind energy",
            "Solar photovoltaic",
            "Geothermal energy"
          ],
          correctAnswer: 2,
          explanation: "Solar photovoltaic capacity has grown exponentially due to decreasing costs and technological improvements.",
          points: 10
        },
        {
          id: 3,
          question: `What percentage of the Earth's surface is covered by oceans?`,
          options: [
            "50%",
            "60%",
            "71%",
            "85%"
          ],
          correctAnswer: 2,
          explanation: "Approximately 71% of Earth's surface is covered by oceans, which play a crucial role in regulating climate.",
          points: 10
        },
        {
          id: 4,
          question: `Which of the following is NOT a greenhouse gas?`,
          options: [
            "Carbon dioxide (CO2)",
            "Methane (CH4)",
            "Oxygen (O2)",
            "Nitrous oxide (N2O)"
          ],
          correctAnswer: 2,
          explanation: "Oxygen is not a greenhouse gas. The main greenhouse gases are CO2, methane, nitrous oxide, and water vapor.",
          points: 10
        },
        {
          id: 5,
          question: `What is the term for meeting present needs without compromising future generations?`,
          options: [
            "Conservation",
            "Sustainability",
            "Preservation",
            "Environmentalism"
          ],
          correctAnswer: 1,
          explanation: "Sustainability refers to meeting current needs without compromising the ability of future generations to meet their own needs.",
          points: 10
        },
        {
          id: 6,
          question: `Which ecosystem stores the most carbon per unit area?`,
          options: [
            "Tropical rainforests",
            "Grasslands",
            "Peatlands",
            "Oceans"
          ],
          correctAnswer: 2,
          explanation: "Peatlands store more carbon per unit area than any other ecosystem, making their conservation crucial for climate regulation.",
          points: 10
        },
        {
          id: 7,
          question: `What is the main environmental benefit of composting?`,
          options: [
            "Reduces water usage",
            "Reduces landfill waste and creates nutrient-rich soil",
            "Increases air quality",
            "Reduces noise pollution"
          ],
          correctAnswer: 1,
          explanation: "Composting reduces landfill waste, decreases methane emissions, and creates valuable organic matter for soil enrichment.",
          points: 10
        },
        {
          id: 8,
          question: `Which international agreement aims to limit global warming to below 2°C?`,
          options: [
            "Kyoto Protocol",
            "Montreal Protocol",
            "Paris Agreement",
            "Copenhagen Accord"
          ],
          correctAnswer: 2,
          explanation: "The Paris Agreement (2015) aims to limit global temperature increase to well below 2°C above pre-industrial levels.",
          points: 10
        },
        {
          id: 9,
          question: `What is the average time for a plastic bottle to decompose in nature?`,
          options: [
            "50 years",
            "100 years",
            "450 years",
            "1000 years"
          ],
          correctAnswer: 2,
          explanation: "Plastic bottles can take up to 450 years or more to decompose, highlighting the importance of recycling and reducing plastic use.",
          points: 10
        },
        {
          id: 10,
          question: `Which of these actions has the highest impact on reducing your carbon footprint?`,
          options: [
            "Switching to LED bulbs",
            "Recycling regularly",
            "Reducing meat consumption",
            "Taking shorter showers"
          ],
          correctAnswer: 2,
          explanation: "Reducing meat consumption, especially beef, has one of the highest impacts on reducing individual carbon footprints due to the resources required for livestock production.",
          points: 10
        }
      ]
    };

    setQuiz(mockQuiz);
    setIsGenerating(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(quiz.timeLimit);
  };

  const selectAnswer = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setQuizStarted(false);
    setShowResults(true);
  };

  const calculateResults = () => {
    let correct = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
        totalPoints += q.points;
      }
    });

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
      points: totalPoints,
      maxPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0)
    };
  };

  const resetQuiz = () => {
    setQuiz(null);
    setQuizStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(600);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Setup Screen
  if (!quiz) {
    return (
      <div className="min-h-screen text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="text-emerald-500" size={48} />
              <h1 className="text-4xl font-bold text-white">Take the Quiz, Earn Points</h1>
            </div>
            <p className="text-gray-400 text-lg">Personalized Environmental Education Quizzes</p>
          </div>

          {/* Setup Card */}
          <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold text-white">Take Quiz</h2>
            </div>

            <div className="space-y-6">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Select Your Class/Year
                </label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose your class...</option>
                  {classOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Quiz Topic
                </label>
                <select
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a topic...</option>
                  {topicOptions.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-3 rounded-lg font-bold capitalize transition-all ${
                        difficulty === level
                          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                          : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 border border-zinc-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateQuiz}
                disabled={!studentClass || !quizTopic || isGenerating}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Preparing Quiz...
                  </>
                ) : (
                  <>
                    <Brain size={24} />
                    Start Quiz
                  </>
                )}
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 text-center">
                <BookOpen className="text-blue-400 mx-auto mb-2" size={32} />
                <h3 className="font-bold text-white mb-1">AI-Powered</h3>
                <p className="text-sm text-blue-200/70">Generated using AI</p>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-lg p-4 text-center">
                <Target className="text-emerald-400 mx-auto mb-2" size={32} />
                <h3 className="font-bold text-white mb-1">Personalized</h3>
                <p className="text-sm text-emerald-200/70">Tailored to your level</p>
              </div>
              <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4 text-center">
                <Trophy className="text-purple-400 mx-auto mb-2" size={32} />
                <h3 className="font-bold text-white mb-1">Earn Points</h3>
                <p className="text-sm text-purple-200/70">Get EcoPoints rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Preview/Start Screen
  if (!quizStarted && !showResults) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Setup
          </button>

          <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-8">
            <div className="text-center mb-8">
              <Award className="text-yellow-500 mx-auto mb-4" size={64} />
              <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
              <p className="text-gray-400">Ready to test your knowledge?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
                <BookOpen className="text-blue-400 mx-auto mb-2" size={32} />
                <p className="text-gray-400 text-sm mb-1">Questions</p>
                <p className="text-2xl font-bold text-white">{quiz.totalQuestions}</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
                <Clock className="text-emerald-500 mx-auto mb-2" size={32} />
                <p className="text-gray-400 text-sm mb-1">Time Limit</p>
                <p className="text-2xl font-bold text-white">{formatTime(quiz.timeLimit)}</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
              <h3 className="font-bold text-yellow-500 mb-2">Instructions:</h3>
              <ul className="space-y-1 text-sm text-yellow-100/80">
                <li>• Answer all {quiz.totalQuestions} questions within the time limit</li>
                <li>• Each correct answer earns you 10 points</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• Review explanations after completing the quiz</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Play size={24} fill="currentColor" />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  if (quizStarted && !showResults) {
    const question = quiz.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-[#18181b] rounded-lg border border-zinc-800 p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="text-emerald-500" size={20} />
                <span className={`font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-8 mb-6">
            <div className="mb-6">
              <span className="inline-block bg-emerald-900/30 text-emerald-400 border border-emerald-900 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {quiz.topic}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">{question.question}</h2>
              <p className="text-gray-400 text-sm">Select the best answer</p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(question.id, index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[question.id] === index
                      ? 'border-emerald-500 bg-emerald-900/20'
                      : 'border-zinc-700 bg-black hover:border-emerald-500/50 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      answers[question.id] === index
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-zinc-500'
                    }`}>
                      {answers[question.id] === index && (
                        <CheckCircle className="text-black" size={16} />
                      )}
                    </div>
                    <span className={answers[question.id] === index ? 'text-emerald-100 font-medium' : 'text-gray-300'}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
            >
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </p>
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-8 mb-6 text-center">
            <Award className="text-yellow-500 mx-auto mb-4" size={80} />
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
            <p className="text-gray-400 mb-6">Great job on completing the quiz</p>

            {/* Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-emerald-900/10 border border-emerald-900/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-1">Score</p>
                <p className="text-4xl font-bold text-emerald-400">{results.percentage}%</p>
              </div>
              <div className="bg-blue-900/10 border border-blue-900/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-1">Correct Answers</p>
                <p className="text-4xl font-bold text-blue-400">{results.correct}/{results.total}</p>
              </div>
              <div className="bg-yellow-900/10 border border-yellow-900/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-1">EcoPoints Earned</p>
                <p className="text-4xl font-bold text-yellow-500">{results.points}</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`rounded-lg p-4 border ${
              results.percentage >= 80 ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300' :
              results.percentage >= 60 ? 'bg-yellow-900/20 border-yellow-800 text-yellow-300' :
              'bg-red-900/20 border-red-800 text-red-300'
            }`}>
              <p className="font-bold text-lg">
                {results.percentage >= 80 ? '🎉 Excellent Work!' :
                 results.percentage >= 60 ? '👍 Good Job!' :
                 '💪 Keep Learning!'}
              </p>
              <p className="text-sm mt-1 opacity-90">
                {results.percentage >= 80 ? 'You have a strong understanding of this topic!' :
                 results.percentage >= 60 ? 'You\'re on the right track. Review the explanations below.' :
                 'Don\'t give up! Review the material and try again.'}
              </p>
            </div>
          </div>

          {/* Answer Review */}
          <div className="bg-[#18181b] rounded-2xl border border-zinc-800 p-8 mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Answer Review</h3>
            <div className="space-y-6">
              {quiz.questions.map((question, qIndex) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border-b border-zinc-800 pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="text-emerald-500 flex-shrink-0 mt-1" size={24} />
                      ) : (
                        <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-white mb-2">
                          Question {qIndex + 1}: {question.question}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">
                            <span className="font-medium text-gray-300">Your answer:</span>{' '}
                            <span className={userAnswer !== undefined ? (isCorrect ? 'text-emerald-400' : 'text-red-400') : 'text-gray-500'}>
                              {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-gray-400">
                              <span className="font-medium text-gray-300">Correct answer:</span>{' '}
                              <span className="text-emerald-400">{question.options[question.correctAnswer]}</span>
                            </p>
                          )}
                        </div>
                        <div className="mt-3 bg-zinc-900 border border-zinc-700 rounded-lg p-3">
                          <p className="text-sm text-gray-400">
                            <span className="font-medium text-emerald-500">Explanation:</span> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={resetQuiz}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-medium transition-colors border border-zinc-700"
            >
              Generate New Quiz
            </button>
            <button
              onClick={startQuiz}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }
}