import React, { useState } from 'react';
import { MockTestConfig, generateMockQuestions } from '../../utils/mockQuestionGenerator';
import { MCQ } from '../../types';
import { MockTestSetup } from './MockTestSetup';
import { MockTestActive } from './MockTestActive';
import { MockTestResult } from './MockTestResult';
import { MockTestReview } from './MockTestReview';
import { useAuth, MockTestRecord } from '../../context/AuthContext';

interface Props {
  initialUniversity?: string;
  onBackToDashboard: () => void;
  onOpenAITutorWithContext?: (question: MCQ) => void;
}

export const MockTestModule: React.FC<Props> = ({
  initialUniversity = 'NED',
  onBackToDashboard,
  onOpenAITutorWithContext,
}) => {
  const { saveMockTestResult } = useAuth();

  const [step, setStep] = useState<'setup' | 'active' | 'result' | 'review'>('setup');
  const [config, setConfig] = useState<MockTestConfig | null>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<MockTestRecord | null>(null);

  // 1. Start Test Handler
  const handleStartTest = (cfg: MockTestConfig) => {
    setConfig(cfg);
    const generated = generateMockQuestions(cfg);
    setQuestions(generated);
    setUserAnswers({});
    setStep('active');
  };

  // 2. Submit Test Handler
  const handleSubmitTest = async (
    answers: Record<string, string>,
    timeSpentSeconds: number
  ) => {
    setUserAnswers(answers);

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedQuestions = 0;

    const subjectStats: Record<
      string,
      { total: number; correct: number; wrong: number; skipped: number }
    > = {};

    questions.forEach((q) => {
      if (!subjectStats[q.subject]) {
        subjectStats[q.subject] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
      }

      subjectStats[q.subject].total += 1;

      const userOpt = answers[q.id];
      if (!userOpt) {
        skippedQuestions += 1;
        subjectStats[q.subject].skipped += 1;
      } else if (userOpt === q.correctOptionId) {
        correctAnswers += 1;
        subjectStats[q.subject].correct += 1;
      } else {
        wrongAnswers += 1;
        subjectStats[q.subject].wrong += 1;
      }
    });

    const totalQuestions = questions.length;
    const score = correctAnswers; // 1 mark per question
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Identify Weak and Strong Topics
    const topicStats: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;
      if (answers[q.id] === q.correctOptionId) {
        topicStats[q.topic].correct += 1;
      }
    });

    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    Object.entries(topicStats).forEach(([top, stat]) => {
      const acc = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
      if (acc < 60) {
        weakTopics.push(top);
      } else if (acc >= 80) {
        strongTopics.push(top);
      }
    });

    const recordData: Omit<MockTestRecord, 'userId' | 'timestamp'> = {
      university: config?.university || 'NED',
      subject: config?.subject || 'All',
      totalQuestions,
      difficulty: config?.difficulty || 'All',
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      score,
      accuracy,
      timeSpentSeconds,
      subjectPerformance: subjectStats,
      weakTopics,
      strongTopics,
      userAnswers: answers,
    };

    // Save to Firestore
    const resultId = await saveMockTestResult(recordData);

    const fullRecord: MockTestRecord = {
      ...recordData,
      id: resultId || 'local-id',
      userId: 'current-user',
    };

    setTestResult(fullRecord);
    setStep('result');
  };

  // 3. Retake Test
  const handleRetake = () => {
    if (config) {
      handleStartTest(config);
    } else {
      setStep('setup');
    }
  };

  return (
    <div className="w-full min-h-screen pb-12">
      {step === 'setup' && (
        <MockTestSetup
          initialUni={initialUniversity}
          onStartTest={handleStartTest}
          onBack={onBackToDashboard}
        />
      )}

      {step === 'active' && config && (
        <MockTestActive
          questions={questions}
          university={config.university}
          timeLimitMinutes={
            config.questionCount === 20
              ? 30
              : config.questionCount === 50
              ? 60
              : 120
          }
          onSubmitTest={handleSubmitTest}
        />
      )}

      {step === 'result' && testResult && (
        <MockTestResult
          record={testResult}
          questions={questions}
          onReviewAnswers={() => setStep('review')}
          onRetakeTest={handleRetake}
          onBackToDashboard={onBackToDashboard}
        />
      )}

      {step === 'review' && testResult && (
        <MockTestReview
          questions={questions}
          userAnswers={userAnswers}
          onBackToResult={() => setStep('result')}
          onAskAITutor={(question) => {
            if (onOpenAITutorWithContext) {
              onOpenAITutorWithContext(question);
            }
          }}
        />
      )}
    </div>
  );
};
