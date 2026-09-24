import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import { AssessmentLead, AssessmentCapacidades } from "@/lib/types";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every load

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Handle potential DB connection errors gracefully (e.g., if .env is missing)
  let leads: AssessmentLead[] = [];
  let capacidades: AssessmentCapacidades[] = [];
  let dbError = null;

  try {
    if (process.env.DATABASE_URL) {
      leads = await sql<AssessmentLead[]>`SELECT * FROM assessment_leads ORDER BY created_at DESC`;
      capacidades = await sql<AssessmentCapacidades[]>`SELECT * FROM assessment_capacidades ORDER BY created_at DESC`;
    } else {
      dbError = "Falta configurar DATABASE_URL en las variables de entorno.";
    }
  } catch (error: any) {
    console.error("DB Error:", error);
    dbError = "Error al conectar con la base de datos: " + error.message;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Panel de Administración</h1>
            <p className="text-zinc-400 mt-2">Gestiona y descarga los resultados de las evaluaciones.</p>
          </div>
          <div className="text-sm text-zinc-500">
            Sesión iniciada como <span className="text-zinc-300 font-medium">{session.user?.name}</span>
          </div>
        </header>

        {dbError ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Error de Base de Datos</h3>
            <p>{dbError}</p>
          </div>
        ) : (
          <DashboardClient initialLeads={leads} initialCapacidades={capacidades} />
        )}
      </div>
    </div>
  );
}
