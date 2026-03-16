import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

export interface ReferralSlipData {
  clinic: {
    code:    string;
    name:    string;
    address: string;
  };
  queue: {
    code:        string;
    date:        string;
    patientName: string;
    age:         number | null;
    gender:      string;
    patientType: string;
  };
  referredTo:   string;   // target branch / lab
  referredBy:   string;   // requesting physician
  tests: {
    code:        string;
    description: string;
    type:        string;
  }[];
  notes:       string;
  generatedAt: string;
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
    color: "#1e293b",
  },
  header: {
    borderBottom: "2 solid #0f172a",
    paddingBottom: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  clinicName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  clinicAddress: {
    fontSize: 7,
    color: "#64748b",
    marginTop: 2,
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 2,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 4,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 7,
    color: "#94a3b8",
  },
  value: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  table: {
    marginTop: 4,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottom: "1 solid #f1f5f9",
  },
  colCode: { width: 60, fontSize: 8, fontFamily: "Helvetica-Bold" },
  colDesc: { flex: 1, fontSize: 8 },
  colType: { width: 80, fontSize: 8, color: "#64748b" },
  notes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#fffbeb",
    borderRadius: 4,
    borderLeft: "3 solid #fbbf24",
  },
  notesText: { fontSize: 8, color: "#92400e" },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signLine: {
    width: 160,
    borderTop: "1 solid #1e293b",
    paddingTop: 4,
    fontSize: 7,
    color: "#64748b",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 40,
    right: 40,
    fontSize: 6,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "1 solid #e2e8f0",
    paddingTop: 3,
  },
});

export function ReferralSlipDocument({ data }: { data: ReferralSlipData }) {
  return (
    <Document>
      <Page size="A5" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.clinicName}>{data.clinic.name}</Text>
            <Text style={s.clinicAddress}>{data.clinic.address}</Text>
          </View>
          <View>
            <Text style={s.title}>BRANCH SENDOUT / REFERRAL</Text>
            <Text style={s.subtitle}>Queue: {data.queue.code} · {data.queue.date}</Text>
          </View>
        </View>

        {/* Patient */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Patient Information</Text>
          <View style={s.row}>
            <View style={s.field}>
              <Text style={s.label}>Patient Name</Text>
              <Text style={s.value}>{data.queue.patientName}</Text>
            </View>
            <View style={[s.field, { flex: 0.3 }]}>
              <Text style={s.label}>Age</Text>
              <Text style={s.value}>{data.queue.age ?? "—"}</Text>
            </View>
            <View style={[s.field, { flex: 0.3 }]}>
              <Text style={s.label}>Sex</Text>
              <Text style={s.value}>{data.queue.gender || "—"}</Text>
            </View>
            <View style={[s.field, { flex: 0.4 }]}>
              <Text style={s.label}>Type</Text>
              <Text style={s.value}>{data.queue.patientType || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Referral details */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Referral Details</Text>
          <View style={s.row}>
            <View style={s.field}>
              <Text style={s.label}>Referred To</Text>
              <Text style={s.value}>{data.referredTo || "—"}</Text>
            </View>
            <View style={s.field}>
              <Text style={s.label}>Referred By</Text>
              <Text style={s.value}>{data.referredBy || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Tests */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Tests / Procedures for Sendout</Text>
          <View style={s.table}>
            <View style={s.tableHead}>
              <Text style={s.colCode}>Code</Text>
              <Text style={s.colDesc}>Description</Text>
              <Text style={s.colType}>Type</Text>
            </View>
            {data.tests.map((t, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={s.colCode}>{t.code}</Text>
                <Text style={s.colDesc}>{t.description}</Text>
                <Text style={s.colType}>{t.type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={s.notes}>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={s.signatures}>
          <Text style={s.signLine}>Requesting Physician / Nurse</Text>
          <Text style={s.signLine}>Received By (Sendout Branch)</Text>
        </View>

        <Text style={s.footer}>
          Generated: {data.generatedAt} · {data.clinic.name} · BRANCH SENDOUT REFERRAL
        </Text>
      </Page>
    </Document>
  );
}
