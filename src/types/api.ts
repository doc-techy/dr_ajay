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

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GetAppointmentsResponse {
  success: true;
  appointments: Appointment[];
  pagination?: PaginationMeta;
  count?: number; // Alternative pagination format
  results?: Appointment[]; // Alternative data format
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

// Blocked Slots Types
export interface BlockedSlot {
  blocked_id: number;
  date?: string; // For specific dates
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  day_of_week?: number; // 1=Monday, 7=Sunday
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlockedSlotRequest {
  // For recurring blocks
  days?: number[];
  start_time: string;
  end_time: string;
  reason: string;
  // For specific date blocks
  date?: string;
  is_recurring?: boolean;
}

export interface CreateBlockedSlotResponse {
  success: true;
  message: string;
  blocked_slot?: BlockedSlot;
  blocked_slots?: BlockedSlot[];
}

export interface GetBlockedSlotsResponse {
  success: true;
  blocked_slots: BlockedSlot[];
}

export interface UpdateBlockedSlotRequest {
  start_time?: string;
  end_time?: string;
  reason?: string;
}

export interface UpdateBlockedSlotResponse {
  success: true;
  message: string;
  blocked_slot: BlockedSlot;
}

export interface DeleteBlockedSlotResponse {
  success: true;
  message: string;
}

export interface BlockedSlotsSummaryResponse {
  success: true;
  summary: {
    total_blocked_slots: number;
    recurring_blocked_slots: number;
    specific_blocked_slots: number;
    recurring_by_day: Record<string, number>;
    upcoming_blocks: BlockedSlot[];
  };
} 