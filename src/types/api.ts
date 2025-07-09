// API Response Types
export interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface CreateAppointmentRequest {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
}

export interface CreateAppointmentResponse {
  success: true;
  appointment_id: string;
  message: string;
}

export interface GetAppointmentsResponse {
  success: true;
  appointments: Appointment[];
}

export interface GetStatsResponse {
  success: true;
  stats: AppointmentStats;
}

export interface UpdateAppointmentRequest {
  status: Appointment['status'];
}

export interface UpdateAppointmentResponse {
  success: true;
  message: string;
}

export interface DeleteAppointmentResponse {
  success: true;
  message: string;
} 