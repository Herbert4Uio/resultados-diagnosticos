"use client";

import React from 'react';
import { AssessmentCapacidades } from '@/lib/types';

interface ResultProps {
  data: AssessmentCapacidades;
}

const CAPACIDADES_QUESTIONS: Record<string, { label: string; section: string }> = {
  // Perfil
  'P01': { label: 'Sector principal de la empresa', section: 'Perfil de Empresa' },
  'P02': { label: 'Tamaño (personas que trabajan)', section: 'Perfil de Empresa' },
  'P03': { label: 'Operación actual', section: 'Perfil de Empresa' },
  'P04': { label: 'Función principal del encuestado', section: 'Perfil de Empresa' },
  // Situación
  'P05': { label: 'Problemas que generan pérdida de control/tiempo', section: 'Situación Actual' },
  'P06': { label: 'Dónde se concentra la información operativa', section: 'Situación Actual' },
  'P07': { label: 'Frecuencia en que gerencia recibe información', section: 'Situación Actual' },
  // Madurez (Capacidades)
  'P08': { label: 'Procesos críticos documentados y ejecutados con criterios', section: 'Madurez de Gestión (1 al 5)' },
  'P09': { label: 'Responsabilidades y excepciones claramente definidas', section: 'Madurez de Gestión (1 al 5)' },
  'P10': { label: 'Fuente confiable y compartida de datos principales', section: 'Madurez de Gestión (1 al 5)' },
  'P11': { label: 'Reportes llegan con frecuencia necesaria para actuar', section: 'Madurez de Gestión (1 al 5)' },
  'P12': { label: 'Inventario, ventas y movimientos rastreables', section: 'Madurez de Gestión (1 al 5)' },
  'P13': { label: 'Caja, cobros y conciliaciones con controles', section: 'Madurez de Gestión (1 al 5)' },
  'P14': { label: 'Áreas y sistemas comparten información sin reprocesos', section: 'Madurez de Gestión (1 al 5)' },
  'P15': { label: 'Tareas repetitivas automatizadas o controladas', section: 'Madurez de Gestión (1 al 5)' },
  'P16': { label: 'Gerencia utiliza indicadores para priorizar', section: 'Madurez de Gestión (1 al 5)' },
  'P17': { label: 'Responsable y tiempo asignado para implementar mejoras', section: 'Madurez de Gestión (1 al 5)' },
  // Prioridad
  'P18': { label: 'Impacto si la situación continúa', section: 'Prioridad y Siguiente Paso' },
  'P19': { label: 'Plazo en el que necesita avanzar', section: 'Prioridad y Siguiente Paso' },
  'P20': { label: 'Qué le gustaría hacer al finalizar', section: 'Prioridad y Siguiente Paso' }
};

const renderAnswer = (answer: string | string[] | undefined, isScore: boolean) => {
  if (!answer) return <span className="text-slate-400 italic">Sin respuesta</span>;
  
  if (isScore && !Array.isArray(answer)) {
    const val = parseInt(answer);
    if (!isNaN(val)) {
      let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
      if (val <= 2) colorClass = 'bg-red-50 text-red-600 border-red-200 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
      else if (val === 3) colorClass = 'bg-orange-50 text-orange-600 border-orange-200';
      else if (val >= 4) colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
      
      return (
        <span className={`px-4 py-1.5 rounded-md border font-bold inline-block text-center min-w-[80px] ${colorClass}`}>
          {val} / 5
        </span>
      );
    }
  }

  if (Array.isArray(answer)) {
    return (
      <ul className="list-disc list-inside text-left">
        {answer.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  }

  return <span className="bg-slate-100 px-3 py-1 rounded text-slate-700">{answer}</span>;
};

export default function Result({ data }: ResultProps) {
  let parsedDimensions: { name: string; score: number }[] = [];
  try {
    parsedDimensions = typeof data.dimensions === 'string' ? JSON.parse(data.dimensions) : (data.dimensions || []);
  } catch (e) {
    console.error("Error parsing dimensions", e);
  }

  let parsedResponses: Record<string, string | string[]> = {};
  try {
    parsedResponses = typeof data.responses === 'string' ? JSON.parse(data.responses) : (data.responses || {});
  } catch (e) {
    console.error("Error parsing responses", e);
  }

  let message = '';
  const index = data.result_index;
  if (index >= 80) {
    message = 'Tus capacidades de gestión están consolidadas, medidas y mejorando de forma continua. Se recomienda profundizar en automatización y escalamiento.';
  } else if (index >= 60) {
    message = 'Tus procesos, datos e indicadores funcionan de manera consistente. Existen brechas puntuales que, bien trabajadas, te permitirán escalar con control.';
  } else if (index >= 40) {
    message = 'Existen avances importantes en varias capacidades, pero el control aún depende de esfuerzos parciales. Es momento de definir criterios, fuentes de datos y seguimiento.';
  } else if (index >= 20) {
    message = 'La operación funciona con prácticas informales y gran dependencia de personas clave. Ordenar la información, definir responsabilidades y documentar procesos aporta el mayor valor.';
  } else {
    message = 'Todavía no existen mecanismos sistemáticos de gestión. Partir de controles básicos y una fuente común de información es el punto de partida recomendado.';
  }

  return (
    <main className="max-w-4xl mx-auto bg-slate-950 text-slate-100 p-8 rounded-xl font-sans" style={{ color: '#0f172a', backgroundColor: '#f8fafc' }}>
      <header className="flex justify-between items-center mb-12 pb-4 border-b border-slate-200">
        <div className="font-bold text-xl tracking-tight" style={{ color: '#0f172a' }}>
          <span className="text-blue-600 mr-1">P</span>
          Pegasus <b>Nexus</b>
        </div>
        <span className="text-sm text-slate-500 font-medium">Evaluación completada</span>
      </header>

      <section className="flex flex-col md:flex-row gap-8 mb-16 items-center">
        <div className="flex-1">
          <span className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-2 block">Tu resultado orientativo</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#0f172a' }}>{data.band}</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mb-6">{message}</p>
          <div className="inline-block bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200">
            Empresa: <b>{data.company}</b>
          </div>
        </div>
        
        <div className="relative w-48 h-48 flex items-center justify-center rounded-full shrink-0" style={{ background: `conic-gradient(#3b82f6 ${index}%, #e2e8f0 0)` }}>
          <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
            <strong className="text-5xl font-black" style={{ color: '#0f172a' }}>{index}</strong>
            <span className="text-slate-400 font-bold text-sm">/ 100</span>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-blue-100 text-blue-700 font-mono text-sm font-bold px-2 py-1 rounded">01</span>
            <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>Tus cinco capacidades</h2>
          </div>
          
          <div className="space-y-6">
            {parsedDimensions.map(d => (
              <div key={d.name}>
                <div className="flex justify-between items-end mb-2">
                  <b className="text-slate-700 font-semibold">{d.name}</b>
                  <span className="text-blue-600 font-bold">{d.score}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${d.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2" />
          
          <span className="text-blue-400 font-bold tracking-wider text-xs uppercase mb-6 block">Lectura preliminar</span>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-green-400">●</span> Fortaleza
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <b className="text-white">{data.strength}</b> aparece como tu capacidad más desarrollada.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-orange-400">●</span> Oportunidad prioritaria
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <b className="text-white">{data.priority}</b> concentra la mayor oportunidad de mejora.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#0f172a' }}>Detalle de Respuestas</h2>
        
        {['Perfil de Empresa', 'Situación Actual', 'Madurez de Gestión (1 al 5)', 'Prioridad y Siguiente Paso'].map(section => {
          const sectionQuestions = Object.entries(CAPACIDADES_QUESTIONS).filter(([, q]) => q.section === section);
          return (
            <div key={section} className="mb-8 last:mb-0">
              <h3 className="text-lg font-bold text-blue-600 mb-4 pb-2 border-b border-slate-100">{section}</h3>
              <div className="space-y-3">
                {sectionQuestions.map(([key, q]) => (
                  <div key={key} className="flex flex-col md:flex-row md:items-start justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-600 md:w-2/3">{q.label}</span>
                    <div className="md:w-1/3 md:text-right font-medium flex justify-end items-center">
                      {renderAnswer(parsedResponses[key], section === 'Madurez de Gestión (1 al 5)')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>Este resultado no reemplaza un diagnóstico técnico o empresarial.</p>
        <p className="mt-2">Evaluación registrada el {new Date(data.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </footer>
    </main>
  );
}
