import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ────────────────────────────────────────────────────────

export interface ToComebackData {
  clinicName:      string;   // top-right header (e.g. "NWDI")
  doctorName:      string;   // center name line
  transactionDate: string;   // human-readable (e.g. "11-Mar-2026 12:52:39")
  printedAt:       string;   // top-left (e.g. "3/11/26, 10:07 PM")
  qrDataUrl:       string;   // base64 PNG data URL from qrcode library
}

// ── Styles ───────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily:  "Helvetica",
    padding:     30,
    fontSize:    10,
    color:       "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    fontSize: 9,
    color: "#333",
  },
  headerRight: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#e67e22",
  },
  doctorName: {
    textAlign:   "center",
    fontSize:    12,
    fontFamily:  "Helvetica-Bold",
    color:       "#2f6496",
    marginBottom: 14,
  },
  labelBox: {
    border:        "2pt solid #000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 40,
    marginBottom: 16,
  },
  labelText: {
    fontFamily: "Helvetica-Bold",
    fontSize:   22,
    textAlign:  "center",
  },
  qrWrap: {
    alignItems:   "center",
    marginBottom: 16,
  },
  qrImage: {
    width:  130,
    height: 130,
  },
  instrRed: {
    textAlign:  "center",
    fontSize:   9,
    color:      "#c0392b",
    marginBottom: 3,
  },
  instrBlue: {
    textAlign: "center",
    fontSize:  9,
    color:     "#2980b9",
  },
});

// ── Document ─────────────────────────────────────────────────────

export function ToComebackDocument({ data }: { data: ToComebackData }) {
  return (
    <Document>
      <Page size="A5" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerLeft}>{data.printedAt}</Text>
          <Text style={s.headerRight}>{data.clinicName}</Text>
        </View>

        {/* Doctor / name */}
        <Text style={s.doctorName}>{data.doctorName}</Text>

        {/* Label box */}
        <View style={s.labelBox}>
          <Text style={s.labelText}>To Comeback</Text>
        </View>

        {/* QR code */}
        <View style={s.qrWrap}>
          <Image src={data.qrDataUrl} style={s.qrImage} />
        </View>

        {/* Instructions */}
        <Text style={s.instrRed}>
          This slip is for <Text style={{ fontFamily: "Helvetica-Bold" }}>To Comeback</Text>.
        </Text>
        <Text style={s.instrRed}>
          Please scan the barcode when you return to the branch.
        </Text>
        <Text style={s.instrBlue}>
          Transaction Date: {data.transactionDate}
        </Text>

      </Page>
    </Document>
  );
}
