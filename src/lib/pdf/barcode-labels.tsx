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

export interface BarcodeLabelItem {
  accessionNo:     string;
  barcodeDataUrl:  string;   // base64 PNG from bwip-js
  itemCode:        string;
  itemDescription: string;
  itemGroup:       string;
  type:            string;   // LAB | IMAGING
  queueCode:       string;
  patientName:     string;
  dob:             string | null;
  gender:          string;
  date:            string;
  clinicCode:      string;
}

export interface BarcodeLabelsData {
  labels:      BarcodeLabelItem[];
  generatedAt: string;
}

// ── Styles ───────────────────────────────────────────────────────
// Each label: 2-up on A4, ~85mm × 45mm

const LABEL_W = 247; // ~87mm in pts
const LABEL_H = 128; // ~45mm in pts

const S = StyleSheet.create({
  page: {
    fontSize:      8,
    fontFamily:    "Helvetica",
    padding:       18,
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           6,
  },
  label: {
    width:           LABEL_W,
    height:          LABEL_H,
    border:          "1.5pt solid #0f172a",
    borderRadius:    4,
    padding:         7,
    flexDirection:   "column",
    backgroundColor: "#ffffff",
  },
  topRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   3,
  },
  clinicBadge: {
    fontSize:         7,
    fontFamily:       "Helvetica-Bold",
    color:            "#1e40af",
    backgroundColor:  "#dbeafe",
    paddingHorizontal: 5,
    paddingVertical:  2,
    borderRadius:     3,
  },
  typeBadge: {
    fontSize:         7,
    fontFamily:       "Helvetica-Bold",
    paddingHorizontal: 5,
    paddingVertical:  2,
    borderRadius:     3,
  },
  barcodeRow: {
    alignItems:     "center",
    marginBottom:   2,
  },
  barcodeImg: {
    width:  200,
    height: 36,
  },
  accessionText: {
    fontSize:    9,
    fontFamily:  "Helvetica-Bold",
    color:       "#0f172a",
    textAlign:   "center",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  patientName: {
    fontSize:   9,
    fontFamily: "Helvetica-Bold",
    color:      "#0f172a",
  },
  metaRow: {
    flexDirection: "row",
    gap:           8,
    marginTop:     1,
  },
  meta: {
    fontSize: 7,
    color:    "#475569",
  },
  itemRow: {
    marginTop:      3,
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "flex-end",
  },
  itemDesc: {
    fontSize:  7,
    color:     "#334155",
    flex:      1,
    flexWrap:  "wrap",
  },
  queueCode: {
    fontSize:   7,
    fontFamily: "Helvetica-Bold",
    color:      "#64748b",
    marginLeft: 4,
  },
  dateText: {
    fontSize:  6,
    color:     "#94a3b8",
    marginTop: 2,
  },
});

function typeBadgeStyle(type: string) {
  if (type === "LAB")     return { color: "#065f46", backgroundColor: "#d1fae5" };
  if (type === "IMAGING") return { color: "#1e40af", backgroundColor: "#dbeafe" };
  return { color: "#374151", backgroundColor: "#f3f4f6" };
}

// ── Document ─────────────────────────────────────────────────────

export function BarcodeLabelsDocument({ data }: { data: BarcodeLabelsData }) {
  const { labels } = data;

  return (
    <Document>
      <Page size="A4" style={S.page} orientation="portrait">
        {labels.map((label, idx) => {
          const tbStyle = typeBadgeStyle(label.type);
          return (
            <View key={idx} style={S.label}>
              {/* Top row: clinic badge + type badge */}
              <View style={S.topRow}>
                <Text style={S.clinicBadge}>{label.clinicCode}</Text>
                <Text style={[S.typeBadge, tbStyle]}>
                  {label.type || label.itemGroup}
                </Text>
              </View>

              {/* Barcode image */}
              {label.barcodeDataUrl ? (
                <View style={S.barcodeRow}>
                  <Image src={label.barcodeDataUrl} style={S.barcodeImg} />
                </View>
              ) : null}

              {/* Accession number text below barcode */}
              <Text style={S.accessionText}>{label.accessionNo}</Text>

              {/* Patient info */}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-expect-error numberOfLines is valid in @react-pdf/renderer */}
              <Text style={S.patientName} numberOfLines={1}>
                {label.patientName}
              </Text>
              <View style={S.metaRow}>
                {label.dob    ? <Text style={S.meta}>DOB: {label.dob}</Text>  : null}
                {label.gender ? <Text style={S.meta}>{label.gender}</Text>    : null}
              </View>

              {/* Item */}
              <View style={S.itemRow}>
                {/* @ts-expect-error numberOfLines is valid in @react-pdf/renderer */}
                <Text style={S.itemDesc} numberOfLines={1}>
                  {label.itemCode} — {label.itemDescription}
                </Text>
                <Text style={S.queueCode}>{label.queueCode}</Text>
              </View>

              {/* Date */}
              <Text style={S.dateText}>{label.date}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
