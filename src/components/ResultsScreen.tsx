"use client";

import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';
import { Target, Trophy, AlertTriangle } from 'lucide-react';
import { AssessmentLead } from '@/lib/types';
import { calculateLeadResult } from '@/utils/scoring';
import { questions } from '@/data/assessmentQuestions';

interface Props {
  data: AssessmentLead;
}

export default function ResultsScreen({ data }: Props) {
  const { result, answers } = calculateLeadResult(data);
  const companyData = { companyName: data.company_name };
  const openQuestionAnswer = data.open_question_answer;

  const radarData = result.dimensionScores.map(d => ({
    subject: d.name,
    A: d.percentage,
    fullMark: 100,
  }));

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-blue-500';
      case 5: return 'text-green-500';
      default: return 'text-slate-500';
    }
  };
  
  const getLevelBg = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getLevelInterpretation = (level: number) => {
    switch(level) {
      case 1: return "La empresa funciona principalmente mediante prácticas informales y reactivas. Existe una alta dependencia del propietario o de determinadas personas clave. Los procesos, controles y responsabilidades todavía no se encuentran suficientemente definidos.";
      case 2: return "La empresa aplica algunas prácticas de gestión, pero estas son parciales, ocasionales o no se utilizan de manera uniforme. Existen avances importantes, aunque todavía predomina la informalidad en varias áreas.";
      case 3: return "La empresa tiene definidos sus principales procesos, responsabilidades y herramientas de gestión. Sin embargo, todavía existen brechas de medición, coordinación, integración y uso sistemático de la información.";
      case 4: return "La empresa opera con procesos formalizados, responsabilidades claras e indicadores periódicos. La información se utiliza regularmente para controlar el desempeño y tomar decisiones.";
      case 5: return "La empresa mide, controla y mejora continuamente sus procesos. Utiliza datos, tecnología y capacidades organizacionales para innovar, adaptarse y crecer de manera controlada.";
      default: return "";
    }
  };

  const getLevelPriority = (level: number) => {
    switch(level) {
      case 1: return "Ordenar la operación, establecer controles básicos, organizar la información y definir responsabilidades.";
      case 2: return "Formalizar los procesos, organizar la información y establecer mecanismos básicos de seguimiento.";
      case 3: return "Conectar las áreas, medir el desempeño y fortalecer la toma de decisiones basada en datos.";
      case 4: return "Optimizar, integrar y automatizar los procesos de mayor impacto.";
      case 5: return "Escalar, innovar y utilizar analítica avanzada, automatización e inteligencia artificial.";
      default: return "";
    }
  };

  const strStrengths = result.topStrengths.map(d => d.name).join(' y ');
  const strPriorities = result.topPriorities.map(d => d.name).join(' y ');

  return (
    <div className="max-w-6xl mx-auto opacity-100 bg-slate-950 text-slate-100 font-sans p-8 rounded-xl shadow-xl">
      <div className="bg-slate-900 rounded-2xl p-6 md:p-12 shadow-2xl border border-slate-800">
        <div className="border-b border-slate-800 pb-8 mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Resultado de la Evaluación de Madurez Empresarial</h1>
            <p className="text-xl text-blue-400">{companyData.companyName}</p>
            <p className="text-slate-400 text-sm mt-1">Fecha de evaluación: {new Date(data.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 mb-1">Puntaje Total</div>
            <div className="text-4xl font-bold text-white">{result.totalScore} <span className="text-lg text-slate-500 font-normal">/ {result.maxScore}</span></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="flex flex-col justify-center items-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="relative w-48 h-48 mb-4 flex justify-center items-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke="currentColor" strokeWidth="8" 
                  strokeDasharray={`${(result.maturityIndex / 100) * 283} 283`}
                  className={`${getLevelColor(result.level)} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                <span className="text-4xl font-bold text-white">{result.maturityIndex}%</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Índice</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-2 ${getLevelBg(result.level)} text-white`}>
                NIVEL {result.level}: {result.levelName?.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4 text-white">Interpretación</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              {getLevelInterpretation(result.level)}
            </p>
            
            <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl">
              <h4 className="text-blue-400 font-semibold flex items-center gap-2 mb-2">
                <Target size={18} /> Prioridad Estratégica
              </h4>
              <p className="text-blue-100 text-sm">
                {getLevelPriority(result.level)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-slate-950/50 rounded-2xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold mb-4 text-white">Resumen Ejecutivo</h3>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">{companyData.companyName}</strong> obtuvo <strong>{result.totalScore}</strong> de {result.maxScore} puntos, 
            alcanzando un índice de madurez de <strong>{result.maturityIndex}%</strong>. 
            Este resultado la ubica en el nivel <strong>{result.level}: {result.levelName}</strong>.
            <br/><br/>
            Sus principales fortalezas se encuentran en <strong className="text-blue-400">{strStrengths}</strong>. 
            Las mayores oportunidades de mejora se concentran en <strong className="text-orange-400">{strPriorities}</strong>.
            <br/><br/>
            La prioridad recomendada es fortalecer <strong className="text-white">{result.topPriorities[0]?.name}</strong>, 
            antes de avanzar hacia iniciativas de mayor complejidad.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Resultados por Dimensión</h3>
            <div className="space-y-4">
              {result.dimensionScores.map((dim, idx) => (
                <div key={dim.code} className="bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-200 font-medium text-sm pr-4">{idx + 1}. {dim.name}</span>
                    <span className="text-slate-400 font-mono text-sm whitespace-nowrap">{dim.score} / {dim.maxScore}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-grow h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${dim.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold w-24 text-right text-blue-400">
                      {dim.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-2 text-white text-center">Perfil de Madurez</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#64748b' }}
                    axisLine={false} 
                  />
                  <Radar 
                    name="Madurez %" 
                    dataKey="A" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.4} 
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Trophy className="text-green-500" /> Principales Fortalezas
            </h3>
            <ul className="space-y-3">
              {result.topStrengths.map(s => (
                <li key={s.code} className="text-slate-300 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span> 
                  <div>
                    <strong className="text-slate-200 block">{s.name}</strong>
                    <span className="text-sm text-slate-400">Nivel: {s.level} ({s.percentage}%)</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="text-orange-500" /> Áreas Prioritarias
            </h3>
            <ul className="space-y-3">
              {result.topPriorities.map(p => (
                <li key={p.code} className="text-slate-300 flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span> 
                  <div>
                    <strong className="text-slate-200 block">{p.name}</strong>
                    <span className="text-sm text-slate-400">Nivel: {p.level} ({p.percentage}%)</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {openQuestionAnswer && (
          <div className="bg-slate-950/50 p-8 rounded-2xl border border-slate-800 mb-12">
            <h3 className="text-lg font-bold mb-4 text-white">Principal desafío a 12 meses</h3>
            <p className="text-slate-300 italic border-l-4 border-blue-500 pl-4 py-1 bg-slate-800/30 rounded-r">
              "{openQuestionAnswer}"
            </p>
          </div>
        )}

        <div className="bg-slate-950/50 p-8 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-4">Detalle de Respuestas</h3>
          <div className="space-y-6">
            {result.dimensionScores.map((dim) => {
              const dimQuestions = questions.filter(q => q.dimensionCode === dim.code);
              return (
                <div key={dim.code} className="mb-6">
                  <h4 className="text-blue-400 font-bold mb-3">{dim.name}</h4>
                  <div className="space-y-2">
                    {dimQuestions.map(q => {
                      const ans = answers.find(a => a.questionId === q.id);
                      return (
                        <div key={q.id} className="flex flex-col md:flex-row justify-between gap-4 p-3 bg-slate-800/30 rounded-lg text-sm items-center">
                          <span className="text-slate-300 md:w-3/4">{q.question}</span>
                          <span className={`font-mono font-bold whitespace-nowrap px-3 py-1 rounded-md border md:w-1/4 text-center ${
                            !ans || ans.value === 0 || ans.value === null ? 'bg-slate-800 text-slate-400 border-slate-700' :
                            ans.value <= 2 ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                            ans.value === 3 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          }`}>
                            {ans ? ans.value : 0} / 5
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
