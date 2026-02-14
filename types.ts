
export enum HealthMetricType {
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  GLUCOSE = 'GLUCOSE',
  HEART_RATE = 'HEART_RATE',
  WEIGHT = 'WEIGHT'
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
  remainingPills: number;
  totalPills: number;
  type: 'pill' | 'liquid' | 'injection' | 'topical';
  color: string;
}

export interface HealthRecord {
  timestamp: string;
  value: number;
  unit: string;
  type: HealthMetricType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}
