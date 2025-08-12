import React, { useState, useEffect } from 'react';
import { Quiz, Question, AssessmentResult } from '../types';

interface AssessmentPageProps {
  assessments: Quiz[];
  onAddResult: (result: Omit<AssessmentResult, 'id' | 'date' | 'agentId' | 'agentName'>) => void;
}

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


const RadialProgress: React.FC<{ progress: number, size?: number, strokeWidth?: number }> = ({ progress, size = 160, strokeWidth = 12 }) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const color = progress >= 70 ? 'text-green-500' : progress >= 50 ? 'text-amber-500' : 'text-red-500';

  useEffect(() => {
    const progressOffset = circumference - (progress / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [progress, circumference]);

  return (
    <div className={`relative ${color}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-slate-200" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={center} cy={center} />
        <circle stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" r={radius} cx={center} cy={center} style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s ease-out' }} />
      </svg>
    </div>
  );
}

const QuizRunner: React.FC<{ quiz: Quiz; onBack: () => void, onAddResult: (result: Omit<AssessmentResult, 'id' | 'date' | 'agentId' | 'agentName'>) => void; }> = ({ quiz, onBack, onAddResult }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  
  const score = userAnswers.reduce((acc, answer, index) => (answer === quiz.questions[index].correctAnswerIndex ? acc + 1 : acc), 0);
  
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (showResult) {
        if (!hasBeenSaved) {
            const durationInSeconds = Math.round((Date.now() - startTime) / 1000);
            const percentage = quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;
            const answersMap: { [questionId: string]: number } = {};
            quiz.questions.forEach((q, index) => {
                const answer = userAnswers[index];
                if (answer !== null) {
                    answersMap[q.id] = answer;
                }
            });

            onAddResult({
                quizId: quiz.id,
                quizTitle: quiz.title,
                score: score,
                totalQuestions: quiz.questions.length,
                percentage: percentage,
                userAnswers: answersMap,
                duration: durationInSeconds,
            });
            setHasBeenSaved(true);
        }

        let start = 0;
        const end = score;
        const duration = 1200;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentVal = Math.round(end * progress);
            setDisplayScore(currentVal);
            if (frame === totalFrames) {
                clearInterval(counter);
                setDisplayScore(end);
            }
        }, frameDuration);

        return () => clearInterval(counter);
    }
  }, [showResult, score, quiz, onAddResult, hasBeenSaved, userAnswers, startTime]);


  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = index;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(userAnswers[currentQuestionIndex + 1]);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
      setCurrentQuestionIndex(0);
      setUserAnswers(Array(quiz.questions.length).fill(null));
      setSelectedOption(null);
      setShowResult(false);
      setHasBeenSaved(false);
      setDisplayScore(0);
      setStartTime(Date.now());
  }

  if (showResult) {
    const percentage = quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;
    return (
        <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-card max-w-3xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Avaliação Concluída!</h2>
                <p className="text-lg text-text-secondary mb-6">Seu resultado para "{quiz.title}"</p>
                
                <div className="my-6 w-40 h-40 mx-auto flex items-center justify-center relative">
                    <RadialProgress progress={percentage} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-text-primary">{displayScore}</span>
                        <span className="text-lg text-text-secondary">de {quiz.questions.length}</span>
                    </div>
                </div>

                <p className="text-xl font-semibold mb-8">Você acertou {percentage.toFixed(0)}% das questões.</p>
            </div>

            <div className="mt-8 pt-6 border-t border-border-color">
                <h3 className="text-xl font-bold text-text-primary mb-4">Revisão das Questões</h3>
                <div className="space-y-4">
                    {quiz.questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.correctAnswerIndex;
                        return (
                            <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                <p className="font-semibold text-text-primary">{index + 1}. {q.text}</p>
                                <div className="mt-2 text-sm">
                                    <p className={`flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        {isCorrect ? <CheckIcon /> : <XIcon />}
                                        Sua resposta: <span className="font-semibold">{userAnswer !== null ? q.options[userAnswer] : 'Não respondida'}</span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="flex items-center gap-2 text-text-secondary mt-1">
                                            <span className="text-green-600"><CheckIcon /></span>
                                            Resposta correta: <span className="font-semibold">{q.options[q.correctAnswerIndex]}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <button onClick={restartQuiz} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                    Tentar Novamente
                </button>
                <button onClick={onBack} className="w-full sm:w-auto bg-slate-200 text-text-secondary font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors">
                    Voltar
                </button>
            </div>
        </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  if (!currentQuestion) {
      return (
          <div className="bg-surface p-8 rounded-xl shadow-card text-center">
              <h2 className="text-xl font-bold text-primary">Avaliação Inválida</h2>
              <p className="text-text-secondary mt-2">Esta avaliação não contém perguntas.</p>
              <button onClick={onBack} className="mt-4 bg-slate-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                  Voltar
              </button>
          </div>
      )
  }

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-card max-w-3xl mx-auto animate-fade-in">
      <div className="border-b border-border-color pb-4 mb-6">
        <p className="text-sm font-semibold text-primary mb-1">Avaliação</p>
        <h2 className="text-xl font-bold text-primary">{quiz.title}</h2>
        <p className="text-text-secondary mt-4 text-right">Questão <span className="font-bold">{currentQuestionIndex + 1}</span> de <span className="font-bold">{quiz.questions.length}</span></p>
      </div>

      {(currentQuestion.imageUrl || currentQuestion.videoUrl) && (
        <div className="mb-6 rounded-lg overflow-hidden bg-slate-100 border border-border-color">
            {currentQuestion.videoUrl ? (
                <video key={`${currentQuestion.id}-video`} src={currentQuestion.videoUrl} controls className="w-full h-auto object-contain max-h-96">
                    Seu navegador não suporta a tag de vídeo.
                </video>
            ) : currentQuestion.imageUrl && (
                <img key={`${currentQuestion.id}-image`} src={currentQuestion.imageUrl} alt="Conteúdo da questão" className="w-full h-auto object-contain max-h-96" />
            )}
        </div>
      )}
      
      <p className="text-lg font-semibold text-text-primary mb-6 min-h-[3em]">{currentQuestion.text}</p>
      
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center text-text-primary ${selectedOption === index ? 'border-primary bg-primary-light ring-2 ring-primary/50' : 'border-border-color bg-white hover:bg-slate-50 hover:border-slate-300'}`}
          >
            <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center ${selectedOption === index ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                {selectedOption === index && <CheckIcon />}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="bg-primary text-white font-bold py-3 px-8 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg transform disabled:transform-none hover:-translate-y-0.5"
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima' : 'Finalizar'}
        </button>
      </div>
    </div>
  );
};


const AssessmentPage: React.FC<AssessmentPageProps> = ({ assessments, onAddResult }) => {
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    
    const visibleAssessments = assessments.filter(quiz => quiz.isVisible);

    if (activeQuiz) {
        return <QuizRunner quiz={activeQuiz} onBack={() => setActiveQuiz(null)} onAddResult={onAddResult} />;
    }

    if (visibleAssessments.length === 0) {
        return (
            <div className="text-center p-12 bg-surface rounded-lg shadow-card animate-fade-in">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-text-primary">Nenhuma avaliação disponível</h3>
                <p className="mt-2 text-text-secondary">No momento, não há avaliações liberadas para você. Volte mais tarde!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAssessments.map((quiz, index) => (
                <div key={quiz.id} className="bg-surface p-6 rounded-xl shadow-card flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-stagger-item-in" style={{ animationDelay: `${index * 75}ms`}}>
                    <h3 className="text-xl font-bold text-primary">{quiz.title}</h3>
                    <p className="text-text-secondary my-2 flex-grow">{quiz.description}</p>
                    <button onClick={() => setActiveQuiz(quiz)} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                        Iniciar Avaliação
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AssessmentPage;