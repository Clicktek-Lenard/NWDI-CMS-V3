import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ────────────────────────────────────────────────────────

export interface RoutingSlipData {
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
  stations: Array<{
    department: string;
    procedures: string[];   // list of procedure descriptions for this station
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
    borderBottom: "2pt solid #0369a1",
  },
  clinicName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0c4a6e",
  },
  clinicSub: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0c4a6e",
    textAlign: "right",
  },
  reportSubtitle: {
    fontSize: 7.5,
    color: "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  // Patient banner
  patientBanner: {
    backgroundColor: "#0369a1",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  patientMeta: {
    fontSize: 8,
    color: "#bae6fd",
    marginTop: 2,
  },
  badgeBox: {
    alignItems: "flex-end",
  },
  badge: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 3,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0c4a6e",
  },
  // Stations
  stationsTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0369a1",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  stationCard: {
    border: "0.5pt solid #bae6fd",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  stationHeader: {
    flexDirection: "row",
    backgroundColor: "#e0f2fe",
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  stationNum: {
    width: 18,
    height: 18,
    backgroundColor: "#0369a1",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  stationNumText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },
  stationName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0c4a6e",
    flex: 1,
  },
  stationBody: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  procedureList: {
    flex: 1,
    paddingRight: 8,
  },
  procedureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  bulletDot: {
    width: 4,
    height: 4,
    backgroundColor: "#0369a1",
    borderRadius: 2,
    marginRight: 5,
  },
  procedureText: {
    fontSize: 8,
    color: "#334155",
  },
  signBox: {
    width: "35%",
    borderLeft: "0.5pt solid #e2e8f0",
    paddingLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  signArea: {
    width: "100%",
    height: 36,
    borderBottom: "0.5pt solid #94a3b8",
    marginBottom: 3,
  },
  signLabel: {
    fontSize: 7,
    color: "#64748b",
    textAlign: "center",
  },
  signDateLabel: {
    fontSize: 6.5,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 2,
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
  instruction: {
    marginTop: 6,
    padding: 5,
    backgroundColor: "#eff6ff",
    border: "0.5pt solid #bfdbfe",
    borderRadius: 3,
  },
  instructionText: {
    fontSize: 7,
    color: "#1d4ed8",
    textAlign: "center",
  },
});

// ── Helpers ──────────────────────────────────────────────────────

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return d; }
}

// ── Document Component ───────────────────────────────────────────

export function RoutingSlipDocument({ data }: { data: RoutingSlipData }) {
  const { clinic, queue, doctor, stations, generatedAt } = data;

  return (
    <Document title={`Routing Slip – ${queue.code}`} author="CMS v3">
      <Page size="A4" style={S.page}>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={S.header}>
          <View>
            <Text style={S.clinicName}>{clinic.name || `NWDI ${clinic.code}`}</Text>
            {clinic.address ? <Text style={S.clinicSub}>{clinic.address}</Text> : null}
            {clinic.tin ? <Text style={S.clinicSub}>TIN: {clinic.tin}</Text> : null}
          </View>
          <View>
            <Text style={S.reportTitle}>ROUTING SLIP</Text>
            <Text style={S.reportSubtitle}>Date: {fmtDate(queue.date)}</Text>
          </View>
        </View>

        {/* ── Patient Banner ───────────────────────────────── */}
        <View style={S.patientBanner}>
          <View>
            <Text style={S.patientName}>{queue.patientName || "—"}</Text>
            <Text style={S.patientMeta}>
              {queue.age ?? "—"} yrs · {queue.gender || "—"} · DOB: {fmtDate(queue.dob)}
            </Text>
            <Text style={S.patientMeta}>
              Physician: {doctor || "—"}  ·  Encoded by: {queue.inputBy || "—"}
            </Text>
          </View>
          <View style={S.badgeBox}>
            <View style={S.badge}>
              <Text style={S.badgeText}>{queue.code}</Text>
            </View>
            <View style={S.badge}>
              <Text style={S.badgeText}>{queue.patientType || "OUT-PATIENT"}</Text>
            </View>
            {queue.accessionNo ? (
              <View style={S.badge}>
                <Text style={S.badgeText}>ACC: {queue.accessionNo}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── Station Cards ────────────────────────────────── */}
        <Text style={S.stationsTitle}>Stations / Departments</Text>
        {stations.map((station, i) => (
          <View key={i} style={S.stationCard}>
            <View style={S.stationHeader}>
              <View style={S.stationNum}>
                <Text style={S.stationNumText}>{i + 1}</Text>
              </View>
              <Text style={S.stationName}>{station.department}</Text>
            </View>
            <View style={S.stationBody}>
              <View style={S.procedureList}>
                {station.procedures.map((proc, j) => (
                  <View key={j} style={S.procedureItem}>
                    <View style={S.bulletDot} />
                    <Text style={S.procedureText}>{proc}</Text>
                  </View>
                ))}
                {station.procedures.length === 0 && (
                  <Text style={[S.procedureText, { color: "#94a3b8" }]}>No procedures listed</Text>
                )}
              </View>
              <View style={S.signBox}>
                <View style={S.signArea} />
                <Text style={S.signLabel}>Staff Signature / Stamp</Text>
                <Text style={S.signDateLabel}>Date &amp; Time</Text>
              </View>
            </View>
          </View>
        ))}

        {stations.length === 0 && (
          <View style={[S.stationCard, { padding: 10 }]}>
            <Text style={{ fontSize: 8, color: "#94a3b8", textAlign: "center" }}>
              No stations assigned
            </Text>
          </View>
        )}

        <View style={S.instruction}>
          <Text style={S.instructionText}>
            Please present this routing slip at each station listed above. Keep this slip until all procedures are completed.
          </Text>
        </View>

        {/* ── Footer ─────────────────────────────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>CMS v3 — {clinic.name || clinic.code} — ROUTING SLIP</Text>
          <Text style={S.footerText}>Generated: {generatedAt}</Text>
        </View>

      </Page>
    </Document>
  );
}
