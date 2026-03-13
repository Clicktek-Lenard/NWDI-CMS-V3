import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ───────────────────────────────────────────────────────

export interface ChargeSlipData {
  clinic: {
    code:    string;
    name:    string;
    address: string;
    tin:     string;
  };
  queue: {
    id:          number;
    code:        string;
    date:        string;   // "YYYY-MM-DD"
    accessionNo: string;
    patientName: string;
    dob:         string | null;
    gender:      string;
    age:         number | null;
    patientType: string;
    inputBy:     string;
  };
  transactions: Array<{
    codeItemPrice:        string;
    descriptionItemPrice: string;
    nameDoctor:           string;
    nameCompany:          string;
    transactionType:      string;
    amount:               number;
  }>;
  total:       number;
  generatedAt: string;
}

// ── Styles ──────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontSize:    9,
    fontFamily:  "Helvetica",
    paddingTop:  28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    color: "#1e293b",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1.5pt solid #1e3a5f",
  },
  clinicName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  clinicSub: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textAlign: "right",
  },
  reportSubtitle: {
    fontSize: 7.5,
    color: "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  // Info grid
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 3,
    padding: 7,
    border: "0.5pt solid #e2e8f0",
  },
  infoLabel: {
    fontSize: 7,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
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
  // Section
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: 6,
  },
  // Table
  table: {
    width: "100%",
    border: "0.5pt solid #e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#1e3a5f",
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
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottom: "0.5pt solid #f1f5f9",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 8,
    color: "#334155",
  },
  // Column widths
  colNo:   { width: "5%" },
  colCode: { width: "10%" },
  colDesc: { width: "28%" },
  colDoctor: { width: "20%" },
  colCompany: { width: "20%" },
  colType: { width: "9%" },
  colAmt:  { width: "8%", textAlign: "right" },
  // Totals
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 6,
    paddingRight: 6,
    marginTop: 4,
  },
  totalsLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginRight: 16,
  },
  totalsValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    minWidth: 70,
    textAlign: "right",
  },
  // Footer
  footer: {
    marginTop: 12,
    paddingTop: 6,
    borderTop: "0.5pt solid #e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
  // Signature area
  signatureArea: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    width: "35%",
    borderTop: "0.5pt solid #64748b",
    paddingTop: 3,
  },
  signatureLabel: {
    fontSize: 7,
    color: "#64748b",
    textAlign: "center",
  },
});

// ── Helpers ─────────────────────────────────────────────────────

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return d; }
}

function fmtAmt(n: number): string {
  return `PHP ${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Document Component ──────────────────────────────────────────

export function ChargeSlipDocument({ data }: { data: ChargeSlipData }) {
  const { clinic, queue, transactions, total, generatedAt } = data;

  return (
    <Document title={`Charge Slip – ${queue.code}`} author="CMS v3">
      <Page size="A4" style={S.page}>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={S.header}>
          <View>
            <Text style={S.clinicName}>
              {clinic.name || `NWDI ${clinic.code}`}
            </Text>
            {clinic.address ? (
              <Text style={S.clinicSub}>{clinic.address}</Text>
            ) : null}
            {clinic.tin ? (
              <Text style={S.clinicSub}>TIN: {clinic.tin}</Text>
            ) : null}
          </View>
          <View>
            <Text style={S.reportTitle}>CHARGE SLIP</Text>
            <Text style={S.reportSubtitle}>Queue No: {queue.code}</Text>
            <Text style={S.reportSubtitle}>Date: {fmtDate(queue.date)}</Text>
          </View>
        </View>

        {/* ── Patient / Queue Info ────────────────────────────── */}
        <View style={S.infoRow}>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Patient Name</Text>
            <Text style={S.infoValue}>{queue.patientName || "—"}</Text>
          </View>
          <View style={[S.infoBox, { flex: 0.5 }]}>
            <Text style={S.infoLabel}>Date of Birth</Text>
            <Text style={S.infoValue}>{fmtDate(queue.dob)}</Text>
          </View>
          <View style={[S.infoBox, { flex: 0.4 }]}>
            <Text style={S.infoLabel}>Gender</Text>
            <Text style={S.infoValue}>{queue.gender || "—"}</Text>
          </View>
          <View style={[S.infoBox, { flex: 0.35 }]}>
            <Text style={S.infoLabel}>Age</Text>
            <Text style={S.infoValue}>{queue.age ?? "—"}</Text>
          </View>
        </View>

        <View style={S.infoRow}>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Patient Type</Text>
            <Text style={S.infoValueNormal}>{queue.patientType || "—"}</Text>
          </View>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Accession No.</Text>
            <Text style={S.infoValueNormal}>{queue.accessionNo || "—"}</Text>
          </View>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Input By</Text>
            <Text style={S.infoValueNormal}>{queue.inputBy || "—"}</Text>
          </View>
        </View>

        {/* ── Transactions Table ──────────────────────────────── */}
        <Text style={S.sectionTitle}>Transactions</Text>
        <View style={S.table}>
          {/* Head */}
          <View style={S.tableHead}>
            <Text style={[S.tableHeadCell, S.colNo]}>#</Text>
            <Text style={[S.tableHeadCell, S.colCode]}>Code</Text>
            <Text style={[S.tableHeadCell, S.colDesc]}>Description</Text>
            <Text style={[S.tableHeadCell, S.colDoctor]}>Doctor</Text>
            <Text style={[S.tableHeadCell, S.colCompany]}>Company</Text>
            <Text style={[S.tableHeadCell, S.colType]}>Type</Text>
            <Text style={[S.tableHeadCell, S.colAmt]}>Amount</Text>
          </View>
          {/* Rows */}
          {transactions.map((tx, i) => (
            <View key={i} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
              <Text style={[S.tableCell, S.colNo]}>{i + 1}</Text>
              <Text style={[S.tableCell, S.colCode]}>{tx.codeItemPrice}</Text>
              <Text style={[S.tableCell, S.colDesc]}>{tx.descriptionItemPrice}</Text>
              <Text style={[S.tableCell, S.colDoctor]}>{tx.nameDoctor || "—"}</Text>
              <Text style={[S.tableCell, S.colCompany]}>{tx.nameCompany || "—"}</Text>
              <Text style={[S.tableCell, S.colType]}>{tx.transactionType || "—"}</Text>
              <Text style={[S.tableCell, S.colAmt]}>
                {tx.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
          {transactions.length === 0 && (
            <View style={S.tableRow}>
              <Text style={[S.tableCell, { flex: 1, textAlign: "center", color: "#94a3b8" }]}>
                No transactions
              </Text>
            </View>
          )}
        </View>

        {/* ── Total ───────────────────────────────────────────── */}
        <View style={S.totalsRow}>
          <Text style={S.totalsLabel}>TOTAL AMOUNT DUE</Text>
          <Text style={S.totalsValue}>{fmtAmt(total)}</Text>
        </View>

        {/* ── Signature Lines ─────────────────────────────────── */}
        <View style={S.signatureArea}>
          <View style={S.signatureLine}>
            <Text style={S.signatureLabel}>Patient / Authorized Representative</Text>
          </View>
          <View style={S.signatureLine}>
            <Text style={S.signatureLabel}>Cashier / Billing Officer</Text>
          </View>
        </View>

        {/* ── Footer ─────────────────────────────────────────── */}
        <View style={S.footer}>
          <Text style={S.footerText}>CMS v3 — {clinic.name || clinic.code}</Text>
          <Text style={S.footerText}>Generated: {generatedAt}</Text>
        </View>

      </Page>
    </Document>
  );
}
