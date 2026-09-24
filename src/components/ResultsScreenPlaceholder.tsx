"use client";

import { AssessmentLead } from "@/lib/types";

interface Props {
  data: AssessmentLead;
}

export default function ResultsScreenPlaceholder({ data }: Props) {
  // Aquí es donde insertarás el código original de <ResultsScreen />
  // Modificándolo para que acepte "data" por props en lugar de usar estados globales o locales vacíos.
  
  return (
    <div className="text-zinc-900">
      <h1 className="text-3xl font-bold mb-4">Evaluación Completa - {data.company_name}</h1>
      <p className="text-zinc-600 mb-8">Puntaje Total: {data.total_score} | Nivel: {data.level_name}</p>
      
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Índice de Madurez</h3>
        <div className="text-4xl font-black text-indigo-900">{data.maturity_index}%</div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Respuesta a pregunta abierta:</h3>
        <p className="text-zinc-700 italic">"{data.open_question_answer}"</p>
      </div>

      <div className="mt-8 text-center text-zinc-400 p-8 border-2 border-dashed border-zinc-300 rounded-xl">
        <p>Reemplaza este componente con tu <code>&lt;ResultsScreen /&gt;</code> original.</p>
        <p className="text-sm mt-2">Asegúrate de que tus componentes de recharts estén envueltos en divs con dimensiones fijas o AspectRatio para evitar problemas al generar el PDF.</p>
      </div>
    </div>
  );
}
