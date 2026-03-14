import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

interface Step {
  description: string;
  stepImage?: string;
}

interface StepsProps {
  recipeSteps: Step[];
}

const Steps = ({ recipeSteps }: StepsProps) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const completedCount = completedSteps.size;
  const totalCount = recipeSteps?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-[#BE6F50] rounded-full" />
          Steps
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {completedCount} / {totalCount} completed
          </span>
          {progress === 100 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full"
            >
              Done!
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[#272727] rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#BE6F50] to-[#E8956E] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#272727]" />

        {/* Steps */}
        <div className="space-y-6">
          {recipeSteps?.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isLast = index === recipeSteps.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex gap-6"
              >
                {/* Step Number / Check */}
                <button
                  onClick={() => toggleStep(index)}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#BE6F50] text-white shadow-lg shadow-[#BE6F50]/30"
                      : "bg-[#272727] text-gray-400 hover:bg-[#3A3633]"
                  }`}
                >
                  {isCompleted ? (
                    <FiCheck className="text-lg" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </button>

                {/* Step Content */}
                <div
                  className={`flex-1 ${!isLast ? "pb-6" : ""}`}
                  onClick={() => toggleStep(index)}
                >
                  <div
                    className={`p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isCompleted
                        ? "bg-[#BE6F50]/10 border border-[#BE6F50]/20"
                        : "bg-[#272727] hover:bg-[#2F2B29]"
                    }`}
                  >
                    {/* Step Label */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-[#BE6F50]/20 text-[#BE6F50]"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        Step {index + 1}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className={`leading-relaxed transition-colors ${
                        isCompleted ? "text-gray-400" : "text-white"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Step Image */}
                    {step.stepImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4"
                      >
                        <img
                          src={step.stepImage}
                          alt={`Step ${index + 1}`}
                          className="w-full max-w-md rounded-lg object-cover"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {(!recipeSteps || recipeSteps.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400">No steps available</p>
        </div>
      )}

      {/* Completion Message */}
      {progress === 100 && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-[#BE6F50]/20 to-[#E8956E]/20 rounded-xl text-center border border-[#BE6F50]/30"
        >
          <p className="text-lg text-white font-medium mb-1">
            Recipe Complete!
          </p>
          <p className="text-gray-400 text-sm">
            Great job finishing all the steps. Enjoy your meal!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Steps;
