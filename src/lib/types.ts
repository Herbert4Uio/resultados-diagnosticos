export interface AssessmentLead {
  id: string;
  created_at: Date;
  company_name: string;
  contact_name: string;
  phone: string;
  total_score: number;
  maturity_index: number;
  level: number;
  level_name: string;
  open_question_answer: string;
  responses: string; // JSON string
}

export interface AssessmentCapacidades {
  id: string;
  created_at: Date;
  company: string;
  name: string;
  phone: string;
  result_index: number;
  band: string;
  dimensions: string; // JSON string
  strength: string;
  priority: string;
  responses: string; // JSON string
}
