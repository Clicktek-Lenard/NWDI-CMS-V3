import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ────────────────────────────────────────────────────────

export interface ConsultationSummaryData {
  clinic: {
    code:    string;
    name:    string;
    address: string;
  };
  queue: {
    code:        string;
    date:        string;
    patientName: string;
    dob:         string | null;
    gender:      string;
    age:         number | null;
    patientType: string;
  };
  vitals: {
    bpSystolic:    number | null;
    bpDiastolic:   number | null;
    bpSystolic2:   number | null;
    bpDiastolic2:  number | null;
    bpSystolic3:   number | null;
    bpDiastolic3:  number | null;
    heartRate:     number | null;
    temperature:   number | null;
    respiratoryRate: number | null;
    weightKg:      number | null;
    heightCm:      number | null;
    bmi:           number | null;
    visionRightOd: string | null;
    visionLeftOs:  string | null;
    colorVision:   string | null;
  } | null;
  evaluation: {
    chiefComplaint: string | null;
    historyIllness: string | null;
    pastHistory:    string | null;
    familyHistory:  string | null;
    peFindings:     string | null;
    diagnosis:      string | null;
    icdCode:        string | null;
    treatmentPlan:  string | null;
    orders:         string | null;
    doctorName:     string | null;
  } | null;
  transactions: string[];
  generatedAt: string;
}

// ── Styles ───────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Helvetica",
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 36,
    color: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "2pt solid #1e40af",
  },
  clinicName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e40af" },
  clinicAddress: { fontSize: 8, color: "#64748b", marginTop: 2 },
  docTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1e293b", textAlign: "right" },
  docSub: { fontSize: 8, color: "#64748b", textAlign: "right", marginTop: 2 },

  patientBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  patientField: { width: "30%", marginBottom: 2 },
  fieldLabel: { fontSize: 7, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  fieldValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a", marginTop: 1 },

  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottom: "1pt solid #bfdbfe",
  },

  vitalsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 4 },
  vitalCell: { width: "22%", backgroundColor: "#fff", border: "1pt solid #e2e8f0", borderRadius: 3, padding: 4 },
  vitalLabel: { fontSize: 7, color: "#64748b" },
  vitalValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0f172a", marginTop: 2 },

  noteBlock: { marginBottom: 6 },
  noteLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#475569", marginBottom: 2 },
  noteValue: { fontSize: 9, color: "#1e293b", lineHeight: 1.4, paddingLeft: 4 },
  noteEmpty: { fontSize: 9, color: "#94a3b8", fontStyle: "italic", paddingLeft: 4 },

  txList: { marginLeft: 8 },
  txItem: { fontSize: 8, color: "#334155", marginBottom: 2 },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1pt solid #e2e8f0",
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: "#94a3b8" },
  sigBox: { width: 140, borderTop: "1pt solid #1e293b", paddingTop: 4, marginTop: 20 },
  sigLabel: { fontSize: 8, color: "#475569", textAlign: "center" },
});

// ── Helpers ──────────────────────────────────────────────────────

function bp(sys: number | null, dia: number | null) {
  if (!sys && !dia) return "—";
  return `${sys ?? "?"}/${dia ?? "?"} mmHg`;
}
function val(v: number | null, unit = "") {
  return v != null ? `${v}${unit}` : "—";
}
function str(s: string | null | undefined) {
  return s?.trim() || null;
}

// ── Document ─────────────────────────────────────────────────────

export function ConsultationSummaryDocument({ data }: { data: ConsultationSummaryData }) {
  const { clinic, queue, vitals, evaluation, transactions, generatedAt } = data;
  const v = vitals;
  const e = evaluation;

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* ── Header ── */}
        <View style={S.header}>
          <View>
            <Text style={S.clinicName}>{clinic.name}</Text>
            <Text style={S.clinicAddress}>{clinic.address}</Text>
          </View>
          <View>
            <Text style={S.docTitle}>CONSULTATION SUMMARY</Text>
            <Text style={S.docSub}>Queue: {queue.code}</Text>
            <Text style={S.docSub}>{queue.date}</Text>
          </View>
        </View>

        {/* ── Patient Info ── */}
        <View style={S.patientBox}>
          <View style={S.patientField}>
            <Text style={S.fieldLabel}>Patient Name</Text>
            <Text style={S.fieldValue}>{queue.patientName}</Text>
          </View>
          <View style={S.patientField}>
            <Text style={S.fieldLabel}>Date of Birth</Text>
            <Text style={S.fieldValue}>{queue.dob ?? "—"}</Text>
          </View>
          <View style={S.patientField}>
            <Text style={S.fieldLabel}>Age / Gender</Text>
            <Text style={S.fieldValue}>{queue.age ? `${queue.age}y` : "—"} / {queue.gender || "—"}</Text>
          </View>
          <View style={S.patientField}>
            <Text style={S.fieldLabel}>Patient Type</Text>
            <Text style={S.fieldValue}>{queue.patientType}</Text>
          </View>
          <View style={S.patientField}>
            <Text style={S.fieldLabel}>Attending Physician</Text>
            <Text style={S.fieldValue}>{e?.doctorName ?? "—"}</Text>
          </View>
          {e?.icdCode ? (
            <View style={S.patientField}>
              <Text style={S.fieldLabel}>ICD Code</Text>
              <Text style={S.fieldValue}>{e.icdCode}</Text>
            </View>
          ) : null}
        </View>

        {/* ── Vital Signs ── */}
        {v && (
          <>
            <Text style={S.sectionTitle}>Vital Signs</Text>
            <View style={S.vitalsRow}>
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>BP (1st)</Text>
                <Text style={S.vitalValue}>{bp(v.bpSystolic, v.bpDiastolic)}</Text>
              </View>
              {(v.bpSystolic2 || v.bpDiastolic2) ? (
                <View style={S.vitalCell}>
                  <Text style={S.vitalLabel}>BP (2nd)</Text>
                  <Text style={S.vitalValue}>{bp(v.bpSystolic2, v.bpDiastolic2)}</Text>
                </View>
              ) : null}
              {(v.bpSystolic3 || v.bpDiastolic3) ? (
                <View style={S.vitalCell}>
                  <Text style={S.vitalLabel}>BP (3rd)</Text>
                  <Text style={S.vitalValue}>{bp(v.bpSystolic3, v.bpDiastolic3)}</Text>
                </View>
              ) : null}
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>Heart Rate</Text>
                <Text style={S.vitalValue}>{val(v.heartRate, " bpm")}</Text>
              </View>
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>Temperature</Text>
                <Text style={S.vitalValue}>{val(v.temperature, " °C")}</Text>
              </View>
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>RR</Text>
                <Text style={S.vitalValue}>{val(v.respiratoryRate, " cpm")}</Text>
              </View>
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>Weight</Text>
                <Text style={S.vitalValue}>{val(v.weightKg, " kg")}</Text>
              </View>
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>Height</Text>
                <Text style={S.vitalValue}>{val(v.heightCm, " cm")}</Text>
              </View>
              <View style={S.vitalCell}>
                <Text style={S.vitalLabel}>BMI</Text>
                <Text style={S.vitalValue}>{val(v.bmi)}</Text>
              </View>
              {v.visionRightOd ? (
                <View style={S.vitalCell}>
                  <Text style={S.vitalLabel}>Vision OD</Text>
                  <Text style={S.vitalValue}>{v.visionRightOd}</Text>
                </View>
              ) : null}
              {v.visionLeftOs ? (
                <View style={S.vitalCell}>
                  <Text style={S.vitalLabel}>Vision OS</Text>
                  <Text style={S.vitalValue}>{v.visionLeftOs}</Text>
                </View>
              ) : null}
              {v.colorVision ? (
                <View style={S.vitalCell}>
                  <Text style={S.vitalLabel}>Color Vision</Text>
                  <Text style={S.vitalValue}>{v.colorVision}</Text>
                </View>
              ) : null}
            </View>
          </>
        )}

        {/* ── Clinical Notes ── */}
        <Text style={S.sectionTitle}>Clinical Notes</Text>

        {[
          ["Chief Complaint",           e?.chiefComplaint],
          ["History of Present Illness", e?.historyIllness],
          ["Past Medical / Social History", e?.pastHistory],
          ["Family History",            e?.familyHistory],
          ["Physical Examination Findings", e?.peFindings],
          ["Diagnosis",                 e?.diagnosis],
          ["Treatment Plan",            e?.treatmentPlan],
          ["Orders / Instructions",     e?.orders],
        ].map(([label, value]) => (
          <View key={label as string} style={S.noteBlock}>
            <Text style={S.noteLabel}>{label as string}</Text>
            {str(value as string)
              ? <Text style={S.noteValue}>{str(value as string)}</Text>
              : <Text style={S.noteEmpty}>—</Text>
            }
          </View>
        ))}

        {/* ── Procedures Ordered ── */}
        {transactions.length > 0 && (
          <>
            <Text style={S.sectionTitle}>Procedures / Tests Ordered</Text>
            <View style={S.txList}>
              {transactions.map((t, i) => (
                <Text key={i} style={S.txItem}>• {t}</Text>
              ))}
            </View>
          </>
        )}

        {/* ── Signature ── */}
        <View style={{ marginTop: 30, alignItems: "flex-end" }}>
          <View style={S.sigBox}>
            <Text style={S.sigLabel}>{e?.doctorName ?? "Attending Physician"}</Text>
            <Text style={[S.sigLabel, { marginTop: 2, color: "#94a3b8" }]}>Signature over Printed Name</Text>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>{clinic.name} — Consultation Summary — {queue.code}</Text>
          <Text style={S.footerText}>Printed: {generatedAt}</Text>
        </View>

      </Page>
    </Document>
  );
}
