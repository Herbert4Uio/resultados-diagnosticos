"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AssessmentLead, AssessmentCapacidades } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import ResultsScreen from "./ResultsScreen";
import Result from "./Result";
import { generateAssessmentPDF } from "@/utils/generatePDF";

interface DashboardClientProps {
  initialLeads: AssessmentLead[];
  initialCapacidades: AssessmentCapacidades[];
}

export default function DashboardClient({ initialLeads, initialCapacidades }: DashboardClientProps) {
  const [selectedLead, setSelectedLead] = useState<AssessmentLead | null>(null);
  const [selectedCapacidad, setSelectedCapacidad] = useState<AssessmentCapacidades | null>(null);

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCapacidadModalOpen, setIsCapacidadModalOpen] = useState(false);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const openLeadModal = (lead: AssessmentLead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const openCapacidadModal = (capacidad: AssessmentCapacidades) => {
    setSelectedCapacidad(capacidad);
    setIsCapacidadModalOpen(true);
  };

  const handleDownloadPDF = async (type: 'lead' | 'capacidad') => {
    const elementId = type === 'lead' ? 'pdf-lead-content' : 'pdf-capacidad-content';
    const name = type === 'lead' ? selectedLead?.company_name : selectedCapacidad?.company;
    
    setIsGeneratingPDF(true);
    try {
      await generateAssessmentPDF(elementId, name || "Empresa");
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Hubo un error al generar el PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div>
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="mb-8 bg-zinc-900 border border-zinc-800 p-1">
          <TabsTrigger value="leads" className="text-zinc-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Evaluación Completa (Leads)
          </TabsTrigger>
          <TabsTrigger value="capacidades" className="text-zinc-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Evaluación de Capacidades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-900">
                <TableRow className="border-zinc-800 hover:bg-zinc-900">
                  <TableHead className="text-zinc-400">Fecha</TableHead>
                  <TableHead className="text-zinc-400">Empresa</TableHead>
                  <TableHead className="text-zinc-400">Contacto</TableHead>
                  <TableHead className="text-zinc-400">Celular</TableHead>
                  <TableHead className="text-zinc-400 text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialLeads.length === 0 ? (
                  <TableRow className="border-zinc-800">
                    <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                      No hay datos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="text-zinc-300">{formatDate(lead.created_at)}</TableCell>
                      <TableCell className="font-medium text-zinc-100">{lead.company_name}</TableCell>
                      <TableCell className="text-zinc-300">{lead.contact_name}</TableCell>
                      <TableCell className="text-zinc-300">{lead.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openLeadModal(lead)}
                          className="bg-transparent border-zinc-700 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950 hover:border-indigo-800"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver y Descargar PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="capacidades">
          <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-900">
                <TableRow className="border-zinc-800 hover:bg-zinc-900">
                  <TableHead className="text-zinc-400">Fecha</TableHead>
                  <TableHead className="text-zinc-400">Empresa</TableHead>
                  <TableHead className="text-zinc-400">Contacto</TableHead>
                  <TableHead className="text-zinc-400">Celular</TableHead>
                  <TableHead className="text-zinc-400 text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialCapacidades.length === 0 ? (
                  <TableRow className="border-zinc-800">
                    <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                      No hay datos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialCapacidades.map((capacidad) => (
                    <TableRow key={capacidad.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="text-zinc-300">{formatDate(capacidad.created_at)}</TableCell>
                      <TableCell className="font-medium text-zinc-100">{capacidad.company}</TableCell>
                      <TableCell className="text-zinc-300">{capacidad.name}</TableCell>
                      <TableCell className="text-zinc-300">{capacidad.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openCapacidadModal(capacidad)}
                          className="bg-transparent border-zinc-700 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950 hover:border-indigo-800"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver y Descargar PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para Leads (Evaluación Completa) */}
      <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
        <DialogContent 
          className="w-[95vw] max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-0 sm:rounded-xl"
          style={{ maxWidth: '1152px' }}
        >
          <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 p-4 pr-16 flex justify-between items-center">
            <h2 className="text-xl font-bold">Resultados: {selectedLead?.company_name}</h2>
            <Button 
              onClick={() => handleDownloadPDF('lead')} 
              disabled={isGeneratingPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
            </Button>
          </div>
          <div className="p-8 bg-zinc-50" id="pdf-lead-content">
            {/* El div superior tiene fondo claro porque normalmente el PDF se imprime sobre blanco. */}
            {selectedLead && <ResultsScreen data={selectedLead} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Capacidades */}
      <Dialog open={isCapacidadModalOpen} onOpenChange={setIsCapacidadModalOpen}>
        <DialogContent 
          className="w-[95vw] max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-0 sm:rounded-xl"
          style={{ maxWidth: '1152px' }}
        >
          <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 p-4 pr-16 flex justify-between items-center">
            <h2 className="text-xl font-bold">Resultados: {selectedCapacidad?.company}</h2>
            <Button 
              onClick={() => handleDownloadPDF('capacidad')} 
              disabled={isGeneratingPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
            </Button>
          </div>
          <div className="p-8 bg-zinc-50" id="pdf-capacidad-content">
            {selectedCapacidad && <Result data={selectedCapacidad} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
