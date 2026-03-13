import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ────────────────────────────────────────────────────────

export interface DrfData {
  clinic: {
    code:    string;
    name:    string;
    address: string;
    tin:     string;
  };
  queue: {
    id:          number;
    code:        string;
    date:        string;
    accessionNo: string;
    patientName: string;
    dob:         string | null;
    gender:      string;
    age:         number | null;
    patientType: string;
    inputBy:     string;
  };
  doctor: string;
  items: Array<{
    code:        string;
    description: string;
    type:        string;
    quantity:    number;
    unit:        string;
    remarks:     string;
  }>;
  generatedAt: string;
}

// ── Styles ───────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontSize:   9,
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
    borderBottom: "2pt solid #0f766e",
  },
  clinicName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#134e4a",
  },
  clinicSub: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#134e4a",
    textAlign: "right",
  },
  reportSubtitle: {
    fontSize: 7.5,
    color: "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f0fdfa",
    borderRadius: 3,
    padding: 6,
    border: "0.5pt solid #99f6e4",
  },
  infoLabel: {
    fontSize: 7,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  infoValueNormal: {
    fontSize: 8.5,
    color: "#334155",
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: 8,
  },
  table: {
    width: "100%",
    border: "0.5pt solid #e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#0f766e",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeadCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: "0.5pt solid #f1f5f9",
    minHeight: 22,
  },
  tableRowAlt: {
    backgroundColor: "#f0fdfa",
  },
  tableCell: {
    fontSize: 8,
    color: "#334155",
  },
  colNo:   { width: "5%" },
  colCode: { width: "12%" },
  colDesc: { width: "35%" },
  colType: { width: "15%" },
  colQty:  { width: "8%", textAlign: "center" },
  colUnit: { width: "10%", textAlign: "center" },
  colRemarks: { width: "15%" },
  // Receiving section
  receivingBox: {
    marginTop: 16,
    border: "0.5pt solid #99f6e4",
    borderRadius: 3,
    padding: 8,
    backgroundColor: "#f0fdfa",
  },
  receivingTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f766e",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  receivingRow: {
    flexDirection: "row",
    gap: 16,
  },
  receivingField: {
    flex: 1,
  },
  receivingLine: {
    borderBottom: "0.5pt solid #94a3b8",
    marginBottom: 2,
    height: 14,
  },
  receivingLabel: {
    fontSize: 7,
    color: "#64748b",
  },
  signatureArea: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderTop: "0.5pt solid #64748b",
    paddingTop: 3,
  },
  signatureLabel: {
    fontSize: 7,
    color: "#64748b",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    paddingTop: 5,
    borderTop: "0.5pt solid #e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },
});

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return d; }
}

// ── Document Component ───────────────────────────────────────────

export function DrfDocument({ data }: { data: DrfData }) {
  const { clinic, queue, doctor, items, generatedAt } = data;

  return (
    <Document title={`DRF – ${queue.code}`} author="CMS v3">
      <Page size="A4" style={S.page}>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={S.header}>
          <View>
            <Text style={S.clinicName}>{clinic.name || `NWDI ${clinic.code}`}</Text>
            {clinic.address ? <Text style={S.clinicSub}>{clinic.address}</Text> : null}
            {clinic.tin ? <Text style={S.clinicSub}>TIN: {clinic.tin}</Text> : null}
          </View>
          <View>
            <Text style={S.reportTitle}>DIAGNOSTIC REQUEST FORM</Text>
            <Text style={S.reportSubtitle}>Queue No: {queue.code}</Text>
            <Text style={S.reportSubtitle}>Date: {fmtDate(queue.date)}</Text>
          </View>
        </View>

        {/* ── Patient Info ─────────────────────────────────── */}
        <View style={S.infoRow}>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Patient Name</Text>
            <Text style={S.infoValue}>{queue.patientName || "—"}</Text>
          </View>
          <View style={[S.infoBox, { flex: 0.5 }]}>
            <Text style={S.infoLabel}>Date of Birth</Text>
            <Text style={S.infoValue}>{fmtDate(queue.dob)}</Text>
          </View>
          <View style={[S.infoBox, { flex: 0.35 }]}>
            <Text style={S.infoLabel}>Age / Sex</Text>
            <Text style={S.infoValue}>{queue.age ?? "—"} / {queue.gender || "—"}</Text>
          </View>
        </View>
        <View style={S.infoRow}>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Requesting Physician</Text>
            <Text style={S.infoValueNormal}>{doctor || "—"}</Text>
          </View>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Patient Type</Text>
            <Text style={S.infoValueNormal}>{queue.patientType || "—"}</Text>
          </View>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Accession No.</Text>
            <Text style={S.infoValueNormal}>{queue.accessionNo || queue.code}</Text>
          </View>
        </View>

        {/* ── Items Table ──────────────────────────────────── */}
        <Text style={S.sectionTitle}>Requested Diagnostics / Services</Text>
        <View style={S.table}>
          <View style={S.tableHead}>
            <Text style={[S.tableHeadCell, S.colNo]}>#</Text>
            <Text style={[S.tableHeadCell, S.colCode]}>Code</Text>
            <Text style={[S.tableHeadCell, S.colDesc]}>Description</Text>
            <Text style={[S.tableHeadCell, S.colType]}>Type</Text>
            <Text style={[S.tableHeadCell, S.colQty]}>Qty</Text>
            <Text style={[S.tableHeadCell, S.colUnit]}>Unit</Text>
            <Text style={[S.tableHeadCell, S.colRemarks]}>Remarks</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
              <Text style={[S.tableCell, S.colNo]}>{i + 1}</Text>
              <Text style={[S.tableCell, S.colCode]}>{item.code}</Text>
              <Text style={[S.tableCell, S.colDesc]}>{item.description}</Text>
              <Text style={[S.tableCell, S.colType]}>{item.type || "—"}</Text>
              <Text style={[S.tableCell, S.colQty]}>{item.quantity}</Text>
              <Text style={[S.tableCell, S.colUnit]}>{item.unit || "pc"}</Text>
              <Text style={[S.tableCell, S.colRemarks]}>{item.remarks || ""}</Text>
            </View>
          ))}
          {items.length === 0 && (
            <View style={S.tableRow}>
              <Text style={[S.tableCell, { flex: 1, textAlign: "center", color: "#94a3b8" }]}>
                No items
              </Text>
            </View>
          )}
        </View>

        {/* ── Receiving Section ────────────────────────────── */}
        <View style={S.receivingBox}>
          <Text style={S.receivingTitle}>For Receiving Use Only</Text>
          <View style={S.receivingRow}>
            <View style={S.receivingField}>
              <View style={S.receivingLine} />
              <Text style={S.receivingLabel}>Received By</Text>
            </View>
            <View style={S.receivingField}>
              <View style={S.receivingLine} />
              <Text style={S.receivingLabel}>Date &amp; Time Received</Text>
            </View>
            <View style={S.receivingField}>
              <View style={S.receivingLine} />
              <Text style={S.receivingLabel}>Section / Department</Text>
            </View>
          </View>
        </View>

        {/* ── Signatures ──────────────────────────────────── */}
        <View style={S.signatureArea}>
          <View style={S.signatureBlock}>
            <Text style={{ fontSize: 7.5, color: "#334155", textAlign: "center", marginBottom: 2 }}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Requesting Physician / Authorized Staff</Text>
          </View>
          <View style={S.signatureBlock}>
            <Text style={{ fontSize: 7.5, color: "#334155", textAlign: "center", marginBottom: 2 }}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Patient / Authorized Representative</Text>
          </View>
        </View>

        {/* ── Footer ─────────────────────────────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>CMS v3 — {clinic.name || clinic.code} — DIAGNOSTIC REQUEST FORM</Text>
          <Text style={S.footerText}>Generated: {generatedAt}</Text>
        </View>

      </Page>
    </Document>
  );
}
