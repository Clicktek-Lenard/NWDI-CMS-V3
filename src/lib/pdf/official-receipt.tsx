import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ───────────────────────────────────────────────────────

export interface OfficialReceiptData {
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
  transactions: Array<{
    codeItemPrice:        string;
    descriptionItemPrice: string;
    nameDoctor:           string;
    nameCompany:          string;
    transactionType:      string;
    amount:               number;
    orNumber:             string;  // HCardNumber used as OR number
  }>;
  total:       number;
  generatedAt: string;
}

// ── Styles ──────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontSize:   9,
    fontFamily: "Helvetica",
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    color: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1.5pt solid #064e3b",
  },
  clinicName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#064e3b",
  },
  clinicSub: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#064e3b",
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
    marginBottom: 8,
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    borderRadius: 3,
    padding: 7,
    border: "0.5pt solid #bbf7d0",
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
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: 6,
  },
  table: {
    width: "100%",
    border: "0.5pt solid #e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#064e3b",
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
    backgroundColor: "#f0fdf4",
  },
  tableCell: {
    fontSize: 8,
    color: "#334155",
  },
  colNo:     { width: "5%" },
  colCode:   { width: "10%" },
  colDesc:   { width: "30%" },
  colDoctor: { width: "20%" },
  colType:   { width: "12%" },
  colOR:     { width: "13%" },
  colAmt:    { width: "10%", textAlign: "right" },
  totalsSection: {
    marginTop: 6,
    borderTop: "1pt solid #064e3b",
    paddingTop: 6,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  totalsLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginRight: 16,
    minWidth: 120,
    textAlign: "right",
  },
  totalsValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#064e3b",
    minWidth: 80,
    textAlign: "right",
  },
  signatureArea: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "35%",
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
  signatureName: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    textAlign: "center",
    marginBottom: 2,
  },
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
  notice: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "#f0fdf4",
    border: "0.5pt solid #bbf7d0",
    borderRadius: 3,
  },
  noticeText: {
    fontSize: 7,
    color: "#166534",
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

export function OfficialReceiptDocument({ data }: { data: OfficialReceiptData }) {
  const { clinic, queue, transactions, total, generatedAt } = data;

  return (
    <Document title={`Official Receipt – ${queue.code}`} author="CMS v3">
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
            <Text style={S.reportTitle}>OFFICIAL RECEIPT</Text>
            <Text style={S.reportSubtitle}>Queue No: {queue.code}</Text>
            <Text style={S.reportSubtitle}>Date: {fmtDate(queue.date)}</Text>
          </View>
        </View>

        {/* ── Patient Info ────────────────────────────────────── */}
        <View style={S.infoRow}>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Received from</Text>
            <Text style={S.infoValue}>{queue.patientName || "—"}</Text>
          </View>
          <View style={[S.infoBox, { flex: 0.5 }]}>
            <Text style={S.infoLabel}>Date of Birth</Text>
            <Text style={S.infoValue}>{fmtDate(queue.dob)}</Text>
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
            <Text style={S.infoLabel}>Served By</Text>
            <Text style={S.infoValueNormal}>{queue.inputBy || "—"}</Text>
          </View>
        </View>

        {/* ── Transactions Table ──────────────────────────────── */}
        <Text style={S.sectionTitle}>Services Rendered</Text>
        <View style={S.table}>
          <View style={S.tableHead}>
            <Text style={[S.tableHeadCell, S.colNo]}>#</Text>
            <Text style={[S.tableHeadCell, S.colCode]}>Code</Text>
            <Text style={[S.tableHeadCell, S.colDesc]}>Description</Text>
            <Text style={[S.tableHeadCell, S.colDoctor]}>Doctor</Text>
            <Text style={[S.tableHeadCell, S.colType]}>Type</Text>
            <Text style={[S.tableHeadCell, S.colOR]}>O.R. No.</Text>
            <Text style={[S.tableHeadCell, S.colAmt]}>Amount</Text>
          </View>
          {transactions.map((tx, i) => (
            <View key={i} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
              <Text style={[S.tableCell, S.colNo]}>{i + 1}</Text>
              <Text style={[S.tableCell, S.colCode]}>{tx.codeItemPrice}</Text>
              <Text style={[S.tableCell, S.colDesc]}>{tx.descriptionItemPrice}</Text>
              <Text style={[S.tableCell, S.colDoctor]}>{tx.nameDoctor || "—"}</Text>
              <Text style={[S.tableCell, S.colType]}>{tx.transactionType || "—"}</Text>
              <Text style={[S.tableCell, S.colOR]}>{tx.orNumber || "—"}</Text>
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

        {/* ── Totals ──────────────────────────────────────────── */}
        <View style={S.totalsSection}>
          <View style={S.totalsRow}>
            <Text style={S.totalsLabel}>TOTAL AMOUNT RECEIVED</Text>
            <Text style={S.totalsValue}>{fmtAmt(total)}</Text>
          </View>
        </View>

        {/* ── Official Notice ─────────────────────────────────── */}
        <View style={S.notice}>
          <Text style={S.noticeText}>
            This official receipt acknowledges payment for the services listed above.
          </Text>
        </View>

        {/* ── Signature Lines ─────────────────────────────────── */}
        <View style={S.signatureArea}>
          <View style={S.signatureBlock}>
            <Text style={S.signatureName}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Patient Signature</Text>
          </View>
          <View style={S.signatureBlock}>
            <Text style={S.signatureName}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Cashier / Billing Officer</Text>
          </View>
          <View style={S.signatureBlock}>
            <Text style={S.signatureName}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Authorized Signatory</Text>
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
