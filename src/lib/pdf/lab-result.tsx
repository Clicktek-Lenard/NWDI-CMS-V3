import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ────────────────────────────────────────────────────────

export interface LabResultData {
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
  doctor:   string;
  tests: Array<{
    category:    string;
    name:        string;
    result:      string;
    unit:        string;
    normalRange: string;
    flag:        "" | "H" | "L" | "C";  // High / Low / Critical
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
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "2pt solid #7c3aed",
  },
  clinicName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#4c1d95",
  },
  clinicSub: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#4c1d95",
    textAlign: "right",
  },
  reportSubtitle: {
    fontSize: 7.5,
    color: "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  // Patient info
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#faf5ff",
    borderRadius: 3,
    padding: 6,
    border: "0.5pt solid #e9d5ff",
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
  // Section header
  categoryRow: {
    flexDirection: "row",
    backgroundColor: "#4c1d95",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  // Table
  table: {
    width: "100%",
    border: "0.5pt solid #e2e8f0",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#ede9fe",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottom: "0.5pt solid #c4b5fd",
  },
  tableHeadCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#4c1d95",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderBottom: "0.5pt solid #f1f5f9",
  },
  tableRowAlt: {
    backgroundColor: "#faf5ff",
  },
  tableCell: {
    fontSize: 8,
    color: "#334155",
  },
  flagH: { color: "#dc2626", fontFamily: "Helvetica-Bold" },
  flagL: { color: "#2563eb", fontFamily: "Helvetica-Bold" },
  flagC: { color: "#7c3aed", fontFamily: "Helvetica-Bold" },
  // Column widths
  colTest:   { flex: 3 },
  colResult: { flex: 1.5, textAlign: "right" },
  colUnit:   { flex: 1, textAlign: "center" },
  colRange:  { flex: 2, textAlign: "center" },
  colFlag:   { width: 20, textAlign: "center" },
  // Signature
  signatureArea: {
    marginTop: 28,
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
  signatureName: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    textAlign: "center",
    marginBottom: 2,
  },
  // Footer
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
  notice: {
    marginTop: 10,
    padding: 5,
    backgroundColor: "#faf5ff",
    border: "0.5pt solid #e9d5ff",
    borderRadius: 3,
  },
  noticeText: {
    fontSize: 7,
    color: "#6d28d9",
    textAlign: "center",
  },
});

// ── Helpers ──────────────────────────────────────────────────────

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PH", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return d; }
}

// ── Document Component ───────────────────────────────────────────

export function LabResultDocument({ data }: { data: LabResultData }) {
  const { clinic, queue, doctor, tests, generatedAt } = data;

  // Group tests by category
  const grouped = new Map<string, typeof tests>();
  for (const t of tests) {
    const cat = t.category || "General";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(t);
  }

  return (
    <Document title={`Lab Result – ${queue.code}`} author="CMS v3">
      <Page size="A4" style={S.page}>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={S.header}>
          <View>
            <Text style={S.clinicName}>{clinic.name || `NWDI ${clinic.code}`}</Text>
            {clinic.address ? <Text style={S.clinicSub}>{clinic.address}</Text> : null}
            {clinic.tin ? <Text style={S.clinicSub}>TIN: {clinic.tin}</Text> : null}
          </View>
          <View>
            <Text style={S.reportTitle}>LABORATORY RESULT</Text>
            <Text style={S.reportSubtitle}>Accession No: {queue.accessionNo || queue.code}</Text>
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
            <Text style={S.infoLabel}>Referring Physician</Text>
            <Text style={S.infoValueNormal}>{doctor || "—"}</Text>
          </View>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Patient Type</Text>
            <Text style={S.infoValueNormal}>{queue.patientType || "—"}</Text>
          </View>
          <View style={S.infoBox}>
            <Text style={S.infoLabel}>Queue No.</Text>
            <Text style={S.infoValueNormal}>{queue.code}</Text>
          </View>
        </View>

        {/* ── Results Table ────────────────────────────────── */}
        {Array.from(grouped.entries()).map(([category, rows]) => (
          <View key={category}>
            <View style={S.categoryRow}>
              <Text style={S.categoryText}>{category}</Text>
            </View>
            <View style={S.table}>
              <View style={S.tableHead}>
                <Text style={[S.tableHeadCell, S.colTest]}>Test / Analyte</Text>
                <Text style={[S.tableHeadCell, S.colResult]}>Result</Text>
                <Text style={[S.tableHeadCell, S.colUnit]}>Unit</Text>
                <Text style={[S.tableHeadCell, S.colRange]}>Normal Range</Text>
                <Text style={[S.tableHeadCell, S.colFlag]}>Flag</Text>
              </View>
              {rows.map((row, i) => (
                <View key={i} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
                  <Text style={[S.tableCell, S.colTest]}>{row.name}</Text>
                  <Text style={[S.tableCell, S.colResult,
                    row.flag === "H" ? S.flagH :
                    row.flag === "L" ? S.flagL :
                    row.flag === "C" ? S.flagC : {}
                  ]}>{row.result}</Text>
                  <Text style={[S.tableCell, S.colUnit]}>{row.unit || "—"}</Text>
                  <Text style={[S.tableCell, S.colRange]}>{row.normalRange || "—"}</Text>
                  <Text style={[S.tableCell, S.colFlag,
                    row.flag === "H" ? S.flagH :
                    row.flag === "L" ? S.flagL :
                    row.flag === "C" ? S.flagC : {}
                  ]}>{row.flag || ""}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={S.notice}>
          <Text style={S.noticeText}>
            H = Above Normal  ·  L = Below Normal  ·  C = Critical Value — Please contact physician immediately
          </Text>
        </View>

        {/* ── Signatures ──────────────────────────────────── */}
        <View style={S.signatureArea}>
          <View style={S.signatureBlock}>
            <Text style={S.signatureName}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Medical Technologist</Text>
          </View>
          <View style={S.signatureBlock}>
            <Text style={S.signatureName}> </Text>
            <View style={S.signatureLine} />
            <Text style={S.signatureLabel}>Pathologist / Laboratory Director</Text>
          </View>
        </View>

        {/* ── Footer ─────────────────────────────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>CMS v3 — {clinic.name || clinic.code} — LABORATORY RESULT</Text>
          <Text style={S.footerText}>Generated: {generatedAt}</Text>
        </View>

      </Page>
    </Document>
  );
}
