/**
 * HL7 v2 Message Builder
 *
 * Replaces the PHP aranyasen/hl7 library.
 * Builds HL7 v2.x messages for sending to facility systems.
 *
 * NOTE: For production, install a proper HL7 library:
 *   npm install hl7-standard
 */

const SEGMENT_SEPARATOR = "\r";
const FIELD_SEPARATOR = "|";
const COMPONENT_SEPARATOR = "^";

interface HL7MessageConfig {
  sendingApp: string;
  sendingFacility: string;
  receivingApp: string;
  receivingFacility: string;
  messageType: string;
  triggerEvent: string;
}

interface PatientData {
  patientId: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  birthdate: string;
  gender: string;
  address?: string;
}

interface OrderData {
  accessionNo: string;
  orderDate: string;
  itemCode: string;
  itemName: string;
  physicianCode: string;
  physicianName: string;
  priority?: string;
}

/**
 * Build a complete HL7 ORM (Order) message.
 */
export function buildOrmMessage(
  config: HL7MessageConfig,
  patient: PatientData,
  order: OrderData
): string {
  const timestamp = formatHL7Timestamp(new Date());
  const messageControlId = generateControlId();

  const segments = [
    buildMSH(config, timestamp, messageControlId),
    buildPID(patient),
    buildORC(order),
    buildOBR(order),
  ];

  return segments.join(SEGMENT_SEPARATOR) + SEGMENT_SEPARATOR;
}

/**
 * Build MSH (Message Header) segment.
 */
function buildMSH(config: HL7MessageConfig, timestamp: string, controlId: string): string {
  const fields = [
    "MSH",
    "^~\\&", // Encoding characters
    config.sendingApp,
    config.sendingFacility,
    config.receivingApp,
    config.receivingFacility,
    timestamp,
    "", // Security
    `${config.messageType}${COMPONENT_SEPARATOR}${config.triggerEvent}`,
    controlId,
    "P", // Processing ID (Production)
    "2.3", // Version
  ];
  return fields.join(FIELD_SEPARATOR);
}

/**
 * Build PID (Patient Identification) segment.
 */
function buildPID(patient: PatientData): string {
  const patientName = [patient.lastName, patient.firstName, patient.middleName || ""]
    .join(COMPONENT_SEPARATOR);

  const fields = [
    "PID",
    "1", // Set ID
    "", // External ID
    patient.patientId, // Patient ID
    "", // Alternate ID
    patientName,
    "", // Mother's maiden name
    formatHL7Date(patient.birthdate),
    patient.gender,
    "", // Patient alias
    "", // Race
    patient.address || "",
  ];
  return fields.join(FIELD_SEPARATOR);
}

/**
 * Build ORC (Common Order) segment.
 */
function buildORC(order: OrderData): string {
  const fields = [
    "ORC",
    "NW", // Order control (New order)
    order.accessionNo,
    "", // Filler order number
    "", // Placer group number
    "SC", // Order status (Scheduled)
  ];
  return fields.join(FIELD_SEPARATOR);
}

/**
 * Build OBR (Observation Request) segment.
 */
function buildOBR(order: OrderData): string {
  const physician = `${order.physicianCode}${COMPONENT_SEPARATOR}${order.physicianName}`;

  const fields = [
    "OBR",
    "1", // Set ID
    order.accessionNo,
    "", // Filler order number
    `${order.itemCode}${COMPONENT_SEPARATOR}${order.itemName}`,
    order.priority || "R", // Priority (Routine)
    formatHL7Timestamp(new Date(order.orderDate)),
    "", // Observation date
    "", // Observation end date
    "", // Collection volume
    "", // Collector identifier
    "", // Specimen action code
    "", // Danger code
    "", // Relevant clinical info
    "", // Specimen received date
    "", // Specimen source
    physician,
  ];
  return fields.join(FIELD_SEPARATOR);
}

function formatHL7Timestamp(date: Date): string {
  return date.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

function formatHL7Date(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function generateControlId(): string {
  return `CMS${Date.now()}`;
}
