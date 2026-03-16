import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

export interface PrescriptionPdfData {
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
  };
  doctorName: string;
  notes:      string | null;
  items: {
    medication:   string;
    dosage:       string | null;
    frequency:    string | null;
    duration:     string | null;
    quantity:     number | null;
    instructions: string | null;
  }[];
  generatedAt: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 40,
    color: "#1e293b",
  },
  header: {
    borderBottom: "2 solid #1e40af",
    paddingBottom: 8,
    marginBottom: 14,
  },
  clinicName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
  },
  clinicAddress: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  rxTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
    marginTop: 10,
    marginBottom: 4,
  },
  patientRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1 dashed #cbd5e1",
  },
  patientField: {
    flex: 1,
  },
  label: {
    fontSize: 7,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: "Helvetica-Bold",
  },
  doctorBlock: {
    marginBottom: 14,
  },
  doctorName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
  },
  itemRow: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeft: "2 solid #3b82f6",
  },
  medication: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  itemDetail: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
  },
  instructions: {
    fontSize: 9,
    fontFamily: "Helvetica-Oblique",
    color: "#64748b",
    marginTop: 2,
  },
  notes: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    marginBottom: 3,
  },
  notesText: {
    fontSize: 9,
    color: "#334155",
  },
  signatureLine: {
    marginTop: 30,
    borderTop: "1 solid #1e293b",
    width: 200,
    alignSelf: "flex-end",
    paddingTop: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "1 solid #e2e8f0",
    paddingTop: 4,
  },
});

export function PrescriptionDocument({ data }: { data: PrescriptionPdfData }) {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Clinic Header */}
        <View style={styles.header}>
          <Text style={styles.clinicName}>{data.clinic.name}</Text>
          <Text style={styles.clinicAddress}>{data.clinic.address}</Text>
        </View>

        {/* Rx Symbol */}
        <Text style={styles.rxTitle}>Rx</Text>

        {/* Doctor */}
        <View style={styles.doctorBlock}>
          <Text style={[styles.label, { marginBottom: 2 }]}>Prescribing Physician</Text>
          <Text style={styles.doctorName}>{data.doctorName || "—"}</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.patientRow}>
          <View style={styles.patientField}>
            <Text style={styles.label}>Patient Name</Text>
            <Text style={styles.value}>{data.queue.patientName}</Text>
          </View>
          <View style={[styles.patientField, { flex: 0.4 }]}>
            <Text style={styles.label}>Age / Sex</Text>
            <Text style={styles.value}>
              {data.queue.age ?? "—"} / {data.queue.gender || "—"}
            </Text>
          </View>
          <View style={[styles.patientField, { flex: 0.5 }]}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{data.queue.date}</Text>
          </View>
        </View>

        {/* Prescription Items */}
        {data.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.medication}>{item.medication}</Text>
            {(item.dosage || item.frequency || item.duration || item.quantity) && (
              <Text style={styles.itemDetail}>
                {[
                  item.dosage,
                  item.frequency,
                  item.duration,
                  item.quantity ? `Qty: ${item.quantity}` : null,
                ].filter(Boolean).join(" · ")}
              </Text>
            )}
            {item.instructions && (
              <Text style={styles.instructions}>Sig: {item.instructions}</Text>
            )}
          </View>
        ))}

        {/* Notes */}
        {data.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signatureLine}>
          <Text style={styles.signatureLabel}>Physician Signature over Printed Name</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Queue: {data.queue.code} · Generated: {data.generatedAt} · {data.clinic.name}
        </Text>
      </Page>
    </Document>
  );
}
