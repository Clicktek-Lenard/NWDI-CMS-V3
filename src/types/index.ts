// ============================================================
// CMS Type Definitions
// ============================================================

// --- Auth & Users ---
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  role: string[]; // JSON array of role strings e.g. ["[QUEUE]", "[NURSE]"]
  activated: boolean;
  ldap_import: boolean;
  created_at: string;
  updated_at: string;
}

/** A role string in bracket notation, e.g. "[QUEUE]", "[NURSE]", "[CARD-REGISTRATION]" */
export type UserRole = string;

export interface Session {
  user: User;
  clinicCode: string;
  clinicName: string;
  clinicDefault: string;
  priceDefault: string;
  departmentCode: string;
}

// --- Queue ---
export interface QueueEntry {
  id: number;
  patientId: string;
  patientName: string;
  companyCode: string;
  companyName: string;
  status: QueueStatus;
  queueNumber: number;
  priorityLevel: number;
  createdAt: string;
  updatedAt: string;
}

export type QueueStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

// --- Patient ---
export interface Patient {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthdate: string;
  gender: "M" | "F";
  contactNumber?: string;
  email?: string;
  address?: string;
}

// --- Card Enrollment ---
export interface CardEnrollment {
  id: number;
  cardNumber: string;
  patientId: string;
  status: CardStatus;
  registeredBy: string;
  registeredAt: string;
  receivedBy?: string;
  receivedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type CardStatus =
  | "REGISTERED"
  | "RECEIVED"
  | "VERIFIED"
  | "TRANSFERRED"
  | "CANCELLED";

// --- Payment ---
export interface Payment {
  id: number;
  patientId: string;
  queueId: number;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionNo: string;
  orNo: string;
  createdAt: string;
}

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

// --- Company ---
export interface Company {
  id: number;
  erosCode: string;
  name: string;
  address?: string;
  contactPerson?: string;
  contactNumber?: string;
  status: "ACTIVE" | "INACTIVE";
}

// --- Item / Pricing ---
export interface ItemMaster {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  department: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ItemPrice {
  id: number;
  itemCode: string;
  companyCode: string;
  price: number;
  priceGroup: string;
  status: "ACTIVE" | "INACTIVE";
}

// --- Physician ---
export interface Physician {
  id: number;
  code: string;
  name: string;
  licenseNo: string;
  specialty: string;
  status: "ACTIVE" | "INACTIVE";
}

// --- HL7 ---
export interface HL7Message {
  id: number;
  facilityCode: string;
  messageType: string;
  accessionNo: string;
  patientId: string;
  status: "PENDING" | "SENT" | "ACKNOWLEDGED" | "ERROR";
  rawMessage: string;
  createdAt: string;
}

// --- Business Unit / Facility ---
export interface Facility {
  code: string;
  name: string;
  address: string;
  ipRange: string;
  oracleConnection: string;
  mysqlConnection: string;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Table ---
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}
