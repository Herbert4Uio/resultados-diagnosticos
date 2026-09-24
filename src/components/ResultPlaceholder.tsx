"use client";

import { AssessmentCapacidades } from "@/lib/types";

interface Props {
  data: AssessmentCapacidades;
}

export default function ResultPlaceholder({ data }: Props) {
  // Aquí es donde insertarás el código original de <Result />
  
  return (
    <div className="text-zinc-900">
      <h1 className="text-3xl font-bold mb-4">Capacidades - {data.company}</h1>
      <p className="text-zinc-600 mb-8">Banda: {data.band}</p>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-emerald-700">Mayor Fortaleza</h3>
          <div className="text-2xl font-bold text-emerald-900">{data.strength}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-rose-700">Prioridad</h3>
          <div className="text-2xl font-bold text-rose-900">{data.priority}</div>
        </div>
      </div>

      <div className="mt-8 text-center text-zinc-400 p-8 border-2 border-dashed border-zinc-300 rounded-xl">
        <p>Reemplaza este componente con tu <code>&lt;Result /&gt;</code> original.</p>
        <p className="text-sm mt-2">Los datos en crudo (JSON) son accesibles a través de la prop <code>data</code>.</p>
      </div>
    </div>
  );
}
