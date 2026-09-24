import { AssessmentLead } from '@/lib/types';
import { dimensions, questions } from '../data/assessmentQuestions';
import { DimensionScore, AssessmentResult, Answer } from '../types/assessment';

export function calculateLeadResult(lead: AssessmentLead): { result: AssessmentResult; answers: Answer[] } {
  let answers: Answer[] = [];
  try {
    const raw = typeof lead.responses === 'string' ? JSON.parse(lead.responses) : (lead.responses || []);
    // Map old format DIM1_Q1 to new format DIR-01
    const mapByNum: Record<string, string> = { '1': 'DIR', '2': 'CLI', '3': 'PRO', '4': 'PER', '5': 'FIN', '6': 'DAT', '7': 'CRE' };
    answers = raw.map((a: any) => {
      let qId = a.questionId;
      const match = qId.match(/DIM(\d+)_Q(\d+)/);
      if (match) qId = `${mapByNum[match[1]]}-0${match[2]}`;
      return { ...a, questionId: qId };
    });
  } catch (e) {
    console.error("Error parsing responses", e);
  }

  let totalScore = 0;
  const dimensionScores: DimensionScore[] = dimensions.map(dim => {
    const dimQuestions = questions.filter(q => q.dimensionCode === dim.code);
    const dimAnswers = answers.filter(a => dimQuestions.some(q => q.id === a.questionId));
    
    const score = dimAnswers.reduce((sum, a) => sum + (a.value || 0), 0);
    const maxScore = dimQuestions.length * 5;
    const percentage = Math.round((score / maxScore) * 100) || 0;
    
    let level = 'Inicial';
    if (percentage >= 80) level = 'Optimizado';
    else if (percentage >= 60) level = 'Gestionado';
    else if (percentage >= 40) level = 'Definido';
    else if (percentage >= 20) level = 'En desarrollo';

    totalScore += score;

    return {
      code: dim.code,
      name: dim.name,
      score,
      maxScore,
      percentage,
      level
    };
  });

  const sortedDims = [...dimensionScores].sort((a, b) => b.percentage - a.percentage);
  const topStrengths = sortedDims.slice(0, 2);
  const topPriorities = sortedDims.slice(-2).reverse(); // lowest first

  const maxTotalScore = questions.length * 5;
  const maturityIndex = Math.round((totalScore / maxTotalScore) * 100) || 0;

  const result: AssessmentResult = {
    totalScore,
    maxScore: maxTotalScore,
    maturityIndex,
    level: lead.level,
    levelName: lead.level_name,
    dimensionScores,
    topStrengths,
    topPriorities
  };

  return { result, answers };
}
