import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Layers, 
  ChevronRight, 
  Send,
  Zap,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobPosting, CandidateProfile, MockInterviewEvaluation } from '../types';

interface MockInterviewViewProps {
  job: JobPosting | null;
  candidateProfile: CandidateProfile;
}

interface PracticeQuestion {
  id: string;
  category: 'Technical' | 'System Design' | 'Behavioral';
  question: string;
  idealKeywords: string[];
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({
  job,
  candidateProfile
}) => {
  const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Mid-Level' | 'Senior' | 'Lead / Staff'>('Senior');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<MockInterviewEvaluation | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const questions: PracticeQuestion[] = [
    {
      id: 'q1',
      category: 'Technical',
      question: `Can you explain the difference between synchronous def and async def in FastAPI/Python, and what happens to the underlying event loop during blocking database queries?`,
      idealKeywords: ['Event Loop', 'Threadpool', 'Asyncio', 'Starlette', 'Non-blocking I/O']
    },
    {
      id: 'q2',
      category: 'System Design',
      question: `How would you architect a distributed job scraper and document processing pipeline that processes 500,000 requests per day with zero data loss?`,
      idealKeywords: ['Message Queue', 'Kafka / RabbitMQ', 'Rate Limiting', 'Idempotency', 'Redis Caching']
    },
    {
      id: 'q3',
      category: 'Behavioral',
      question: `Tell me about a time you encountered a severe production incident or high-priority deadline conflict. How did you diagnose, resolve, and communicate it?`,
      idealKeywords: ['Situation', 'Root Cause Analysis', 'Quantified Impact', 'Post-Mortem', 'Prevention']
    },
    {
      id: 'q4',
      category: 'Technical',
      question: `How do you optimize slow PostgreSQL queries on a database with tens of millions of records? What diagnostic tools and indexing strategies do you use?`,
      idealKeywords: ['EXPLAIN ANALYZE', 'Composite B-Tree', 'GIN Indexing', 'Index Bloat', 'Connection Pooling']
    }
  ];

  const currentQ = questions[currentQuestionIndex];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpokenTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access or type your answer below.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleSpeechRecognition = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      setSpokenTranscript('');
      setEvaluation(null);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsRecording(true);
        } else {
          setSpeechError('Speech recognition is not natively supported in this browser. You can type your answer below!');
        }
      } catch (e: any) {
        console.error('Failed to start speech recognition', e);
        setSpeechError('Microphone initialization error. You can type your response.');
      }
    }
  };

  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  const handleSubmitAnswerForEvaluation = async () => {
    if (!spokenTranscript.trim()) {
      alert('Please speak or type your answer before submitting for AI grading.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/gemini/mock-interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          candidateAnswer: spokenTranscript,
          experienceLevel,
          roleTitle: job?.title || 'Senior Software Engineer',
          jobDescription: job?.description || ''
        })
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        setEvaluation(data.feedback);
        if (data.feedback.score >= 80) {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.error('Failed to evaluate answer', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div id="stage-7-mock-interview" className="space-y-4">
      {/* Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
              STAGE 7: AI VOICE MOCK INTERVIEW ROOM
            </span>
            <span className="text-xs text-neutral-400">100% Free Browser Speech & AI Bar-Raiser Feedback</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Interactive Verbal Practice & Seniority Bar Grader
          </h2>
          <p className="text-xs text-neutral-400">
            Practice speaking your answers into the microphone. Gemini evaluates technical depth, clarity, and missing keywords based on your target seniority level.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Seniority Selector */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 text-xs">
            {(['Junior', 'Mid-Level', 'Senior', 'Lead / Staff'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setExperienceLevel(level)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  experienceLevel === level
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Practice Stage: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (7 cols): Question & Voice Recorder */}
        <div className="lg:col-span-7 space-y-4">
          {/* Question Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold">
                  {currentQ.category.toUpperCase()}
                </span>
                <span className="text-xs text-neutral-400 font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isAiSpeaking ? (
                  <button
                    onClick={handleStopSpeaking}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 text-rose-300 text-xs border border-rose-800 animate-pulse"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Mute</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSpeakQuestion}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs border border-neutral-700 transition"
                    title="Have AI Interviewer read question aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Read Aloud</span>
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base font-semibold text-white leading-relaxed">
              "{currentQ.question}"
            </h3>

            {/* Keyword Hint Badges */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[11px] text-neutral-500">Core Concepts to hit:</span>
              {currentQ.idealKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-neutral-950 text-neutral-300 rounded text-[10px] font-mono border border-neutral-800">
                  {kw}
                </span>
              ))}
            </div>

            {/* Question Switcher Pills */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setSpokenTranscript('');
                    setEvaluation(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    currentQuestionIndex === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Voice & Text Response Area */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                  Your Answer (Spoken or Typed)
                </h4>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono">
                {spokenTranscript.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {speechError && (
              <div className="p-2.5 rounded bg-amber-950/60 border border-amber-800/80 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Audio Recording Live State Banner */}
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSpeechRecognition}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-lg ${
                    isRecording 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-900/60' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Microphone Speech'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {isRecording ? 'Listening... Speak your answer now' : 'Click Mic to Record Answer'}
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {isRecording ? 'Real-time speech-to-text active' : 'Or type directly in the box below'}
                  </span>
                </div>
              </div>

              {isRecording && (
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>REC</span>
                </div>
              )}
            </div>

            {/* Editable Spoken Transcript Textarea */}
            <textarea
              value={spokenTranscript}
              onChange={(e) => setSpokenTranscript(e.target.value)}
              placeholder="Speak using the microphone or type your technical answer here in detail..."
              rows={5}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-emerald-500 outline-none leading-relaxed font-sans"
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setSpokenTranscript('');
                  setEvaluation(null);
                }}
                disabled={!spokenTranscript}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium border border-neutral-700 transition disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Answer</span>
              </button>

              <button
                onClick={handleSubmitAnswerForEvaluation}
                disabled={isEvaluating || !spokenTranscript.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950/40 transition disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                <span>{isEvaluating ? 'Evaluating with AI Bar Raiser...' : 'Grade My Answer (Gemini AI)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): AI Seniority & Depth Evaluation Scorecard */}
        <div className="lg:col-span-5 space-y-4">
          {isEvaluating ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Assessing Answer Rigor</h4>
              <p className="text-xs text-neutral-400">Comparing technical depth, trade-off analysis, and clarity against {experienceLevel} engineer expectations.</p>
            </div>
          ) : evaluation ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-lg">
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">AI Evaluation Result</span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      evaluation.score >= 85 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      evaluation.score >= 70 ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {evaluation.seniorityAssessment}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {evaluation.score}<span className="text-xs text-neutral-500 font-normal">/100</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Overall Score</span>
                </div>
              </div>

              {/* Sub-Scores */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">Technical Depth</span>
                  <span className="text-sm font-bold text-white font-mono">{evaluation.technicalDepthScore}%</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">Clarity & Structure</span>
                  <span className="text-sm font-bold text-white font-mono">{evaluation.clarityScore}%</span>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5 text-xs">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  What You Did Well
                </h5>
                <div className="space-y-1">
                  {evaluation.strengths.map((str, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-neutral-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="space-y-1.5 text-xs">
                <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  How to Elevate to Staff/Lead Level
                </h5>
                <div className="space-y-1">
                  {evaluation.areasForImprovement.map((imp, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-neutral-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              {evaluation.missingKeywords && evaluation.missingKeywords.length > 0 && (
                <div className="space-y-1.5 text-xs pt-1 border-t border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-semibold">Missing High-Impact Keywords:</span>
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {evaluation.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-neutral-950 text-rose-300 rounded text-[10px] font-mono border border-rose-900/60">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Model / Ideal Answer */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-neutral-800">
                <h5 className="text-[11px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Benchmark Model Answer
                </h5>
                <p className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-neutral-300 leading-relaxed font-sans text-[11px]">
                  "{evaluation.modelAnswer}"
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center space-y-3">
              <Mic className="w-8 h-8 text-neutral-600 mx-auto" />
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">AI Scorecard Ready</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Click the microphone button to start recording your response. Once finished, submit for real-time grading, score breakdown, and model answers!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
