import React from 'react';
import { 
  Search, 
  FileText, 
  Sparkles, 
  Send, 
  Bot, 
  BookOpen, 
  Mic, 
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface PipelineStageTrackerProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  completedStages: number[];
  unlockedMaxStage: number;
}

export const PipelineStageTracker: React.FC<PipelineStageTrackerProps> = ({
  currentStage,
  onSelectStage,
  completedStages,
  unlockedMaxStage
}) => {
  const stages = [
    {
      id: 1 as StageId,
      name: "Job Discovery Agent",
      subtitle: "Global Markets & Software Roles",
      icon: Search,
      badge: "Stage 1"
    },
    {
      id: 2 as StageId,
      name: "JD Parsing & Match",
      subtitle: "Target Country CV Standards",
      icon: FileText,
      badge: "Stage 2"
    },
    {
      id: 3 as StageId,
      name: "Resume Generation",
      subtitle: "Multi-Country ATS PDF Engine",
      icon: Sparkles,
      badge: "Stage 3"
    },
    {
      id: 4 as StageId,
      name: "Telegram HITL Alert",
      subtitle: "One-Click Mobile/Desktop Apply",
      icon: Send,
      badge: "Stage 4"
    },
    {
      id: 5 as StageId,
      name: "Browser Worker",
      subtitle: "Playwright Headless Apply",
      icon: Bot,
      badge: "Stage 5"
    },
    {
      id: 6 as StageId,
      name: "Interview Prep Guide",
      subtitle: "Technical, Design & STAR Guide",
      icon: BookOpen,
      badge: "Stage 6"
    },
    {
      id: 7 as StageId,
      name: "AI Voice Mock Interview",
      subtitle: "Realtime Speech & Scoring",
      icon: Mic,
      badge: "Stage 7"
    }
  ];

  return (
    <div id="pipeline-stage-tracker" className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
              End-to-End Pipeline Journey
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              User Journey Progression Active
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Stages unlock dynamically as you progress from Discovery → Multi-Country Resumes → Telegram HITL → Apply → Interview Practice.
          </p>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-950 text-emerald-400 border border-neutral-800 self-start sm:self-auto">
          Stage {currentStage} of 7 Active
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);
          const isUnlocked = stage.id <= unlockedMaxStage || isCompleted || isSelected;

          return (
            <div key={stage.id} className="relative flex flex-col">
              <button
                type="button"
                id={`stage-card-${stage.id}`}
                disabled={!isUnlocked}
                tabIndex={isUnlocked ? 0 : -1}
                aria-label={`Navigate to ${stage.badge}: ${stage.name} - ${stage.subtitle} (${isSelected ? 'Active' : isCompleted ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'})`}
                aria-current={isSelected ? 'step' : undefined}
                onClick={() => isUnlocked && onSelectStage(stage.id)}
                className={`text-left p-3 rounded-lg border transition-all h-full flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                    : isCompleted
                    ? 'bg-neutral-900/90 border-neutral-700 hover:border-neutral-600 text-neutral-200 cursor-pointer'
                    : isUnlocked
                    ? 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700 text-neutral-300 cursor-pointer'
                    : 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isSelected
                        ? 'bg-emerald-500 text-neutral-950'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : isUnlocked
                        ? 'bg-neutral-800 text-neutral-400'
                        : 'bg-neutral-900 text-neutral-600'
                    }`}>
                      {stage.badge}
                    </span>

                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : !isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-neutral-600" />
                    ) : (
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`} />
                    )}
                  </div>

                  <h3 className={`text-[11px] font-bold leading-tight mb-1 ${
                    isSelected ? 'text-white' : isUnlocked ? 'text-neutral-200' : 'text-neutral-500'
                  }`}>
                    {stage.name}
                  </h3>
                </div>

                <p className="text-[10px] text-neutral-400 mt-1.5 font-mono line-clamp-1">
                  {stage.subtitle}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
