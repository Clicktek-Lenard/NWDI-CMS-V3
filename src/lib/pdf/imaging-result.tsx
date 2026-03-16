import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

export interface ImagingResultData {
  clinic: {
    code:    string;
    name:    string;
    address: string;
  };
  queue: {
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
  doctor:  string;
  studies: {
    accessionNo:      string;
    itemCode:         string;
    itemDescription:  string;
    interpretation:   string;
    impression:       string;
    radiologistName:  string;
    status:           string;
  }[];
  generatedAt: string;
}

const s = StyleSheet.create({
  page: {
    fontFamily:        "Helvetica",
    fontSize:          9,
    paddingTop:        30,
    paddingBottom:     40,
    paddingHorizontal: 40,
    color:             "#1e293b",
  },
  header: {
    borderBottom:       "2 solid #0f172a",
    paddingBottom:      8,
    marginBottom:       12,
    flexDirection:      "row",
    justifyContent:     "space-between",
    alignItems:         "flex-end",
  },
  clinicName: {
    fontSize:   13,
    fontFamily: "Helvetica-Bold",
  },
  clinicAddress: {
    fontSize:  7,
    color:     "#64748b",
    marginTop: 2,
  },
  title: {
    fontSize:   11,
    fontFamily: "Helvetica-Bold",
    textAlign:  "right",
    color:      "#0f172a",
  },
  subtitle: {
    fontSize:  8,
    color:     "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize:      7,
    fontFamily:    "Helvetica-Bold",
    color:         "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom:  4,
    borderBottom:  "1 solid #e2e8f0",
    paddingBottom: 2,
  },
  row: {
    flexDirection: "row",
    gap:           16,
    marginBottom:  4,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 7,
    color:    "#94a3b8",
  },
  value: {
    fontSize:   9,
    fontFamily: "Helvetica-Bold",
    marginTop:  1,
  },
  studyCard: {
    marginBottom:    12,
    borderRadius:    4,
    border:          "1 solid #e2e8f0",
    padding:         10,
    backgroundColor: "#f8fafc",
  },
  studyHeader: {
    flexDirection:  "row",
    justifyContent: "space-between",
    marginBottom:   6,
  },
  studyTitle: {
    fontSize:   10,
    fontFamily: "Helvetica-Bold",
    color:      "#0f172a",
  },
  studyAccession: {
    fontSize: 7,
    color:    "#64748b",
    fontFamily: "Helvetica-Oblique",
  },
  blockLabel: {
    fontSize:      7,
    fontFamily:    "Helvetica-Bold",
    color:         "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom:  2,
    marginTop:     6,
  },
  blockText: {
    fontSize:        9,
    lineHeight:      1.5,
    color:           "#1e293b",
    backgroundColor: "#fff",
    padding:         6,
    borderRadius:    3,
    border:          "1 solid #e2e8f0",
    minHeight:       24,
  },
  impressionText: {
    fontSize:        9,
    fontFamily:      "Helvetica-Bold",
    lineHeight:      1.5,
    color:           "#0f172a",
    backgroundColor: "#eff6ff",
    padding:         6,
    borderRadius:    3,
    border:          "1 solid #bfdbfe",
    minHeight:       24,
  },
  radiologistRow: {
    flexDirection:  "row",
    justifyContent: "flex-end",
    marginTop:      8,
  },
  radiologistLabel: {
    fontSize: 7,
    color:    "#94a3b8",
    marginRight: 4,
  },
  radiologistName: {
    fontSize:   8,
    fontFamily: "Helvetica-Bold",
    color:      "#1e293b",
  },
  signatureArea: {
    marginTop:      24,
    flexDirection:  "row",
    justifyContent: "flex-end",
  },
  signLine: {
    width:      200,
    borderTop:  "1 solid #0f172a",
    paddingTop: 4,
    fontSize:   7,
    color:      "#64748b",
    textAlign:  "center",
  },
  footer: {
    position:   "absolute",
    bottom:     15,
    left:       40,
    right:      40,
    fontSize:   6,
    color:      "#94a3b8",
    textAlign:  "center",
    borderTop:  "1 solid #e2e8f0",
    paddingTop: 3,
  },
});

export function ImagingResultDocument({ data }: { data: ImagingResultData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.clinicName}>{data.clinic.name}</Text>
            <Text style={s.clinicAddress}>{data.clinic.address}</Text>
          </View>
          <View>
            <Text style={s.title}>IMAGING / RADIOLOGY REPORT</Text>
            <Text style={s.subtitle}>
              Queue: {data.queue.code} · {data.queue.date}
            </Text>
          </View>
        </View>

        {/* Patient Info */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Patient Information</Text>
          <View style={s.row}>
            <View style={[s.field, { flex: 2 }]}>
              <Text style={s.label}>Patient Name</Text>
              <Text style={s.value}>{data.queue.patientName}</Text>
            </View>
            <View style={[s.field, { flex: 0.4 }]}>
              <Text style={s.label}>Age</Text>
              <Text style={s.value}>{data.queue.age ?? "—"}</Text>
            </View>
            <View style={[s.field, { flex: 0.4 }]}>
              <Text style={s.label}>Sex</Text>
              <Text style={s.value}>{data.queue.gender || "—"}</Text>
            </View>
            <View style={[s.field, { flex: 0.6 }]}>
              <Text style={s.label}>Type</Text>
              <Text style={s.value}>{data.queue.patientType || "—"}</Text>
            </View>
            <View style={[s.field, { flex: 1 }]}>
              <Text style={s.label}>Requesting Physician</Text>
              <Text style={s.value}>{data.doctor || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Studies */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Imaging Studies</Text>

          {data.studies.length === 0 && (
            <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 4 }}>
              No imaging results recorded.
            </Text>
          )}

          {data.studies.map((study, i) => (
            <View key={i} style={s.studyCard}>
              <View style={s.studyHeader}>
                <Text style={s.studyTitle}>{study.itemDescription || study.itemCode}</Text>
                <Text style={s.studyAccession}>Accession: {study.accessionNo}</Text>
              </View>

              <Text style={s.blockLabel}>Findings / Interpretation</Text>
              <Text style={s.blockText}>
                {study.interpretation || "—"}
              </Text>

              <Text style={s.blockLabel}>Impression</Text>
              <Text style={s.impressionText}>
                {study.impression || "—"}
              </Text>

              {study.radiologistName && (
                <View style={s.radiologistRow}>
                  <Text style={s.radiologistLabel}>Radiologist:</Text>
                  <Text style={s.radiologistName}>{study.radiologistName}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Signature */}
        <View style={s.signatureArea}>
          <Text style={s.signLine}>
            {data.studies[0]?.radiologistName
              ? data.studies[0].radiologistName + "\nRadiologist / Physician"
              : "Radiologist / Physician"}
          </Text>
        </View>

        <Text style={s.footer}>
          Generated: {data.generatedAt} · {data.clinic.name} · IMAGING / RADIOLOGY REPORT
        </Text>
      </Page>
    </Document>
  );
}
