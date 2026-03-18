"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  X, Activity, ClipboardList, Stethoscope, Save, CheckCircle,
  Loader2, AlertTriangle, Heart, Thermometer, Wind, Droplets,
  Scale, Ruler, Eye, FileText, FlaskConical, Plus, Trash2,
  ChevronDown, ChevronUp, UserCheck, Search,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
export interface ClinicalQueueEntry {
  id: number;
  queueNumber: number;
  patientId: string;
  patientName: string;
  companyCode: string | null;
  companyName: string | null;
  status: string;
  priority: number;
  clinicCode: string | null;
  createdAt: string;
  consultation: {
    status: string;
    pcp_doctor: string | null;
    diagnosis: string | null;
    is_draft: number;
  } | null;
}

interface VitalsData {
  chief_complaint: string;
  pcp_id: string;
  pcp_name: string;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  bp_systolic_2: number | null;
  bp_diastolic_2: number | null;
  bp_systolic_3: number | null;
  bp_diastolic_3: number | null;
  heart_rate: number | null;
  temperature: number | null;
  respiratory_rate: number | null;
  o2_saturation: number | null;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  uncorrected_od: string;
  uncorrected_os: string;
  corrected_od: string;
  corrected_os: string;
  uncorrected_near_od: string;
  uncorrected_near_os: string;
  corrected_near_od: string;
  corrected_near_os: string;
  with_contact_lens: number;
  with_eyeglass: number;
  color_vision: string;
}

interface SoapData {
  chief_complaint: string;
  history_illness: string;
  past_history: string;
  family_history: string;
  pe_findings: string;
  diagnosis: string;
  icd_code: string;
  treatment_plan: string;
  orders: string;
  pcp_doctor: string;
}

interface PeData {
  // fitness class
  fitness_class: string;
  checked_by: string;
  // Medical History
  liver_gallbladder: number; heart_disease: number; asthma_allergy: number;
  tuberculosis: number; ent_disorder: number; eye_disorder: number;
  diabetes_mellitus: number; chronic_headache: number; hypertension: number;
  kidney_disease: number; cancer: number; std: number;
  past_med_others: string;
  // Social History
  present_smoker: number; smoker_sticks_per_day: string; smoker_years: string;
  previous_smoker: number; prev_smoker_sticks: string; prev_smoker_years: string;
  alcohol_drinker: number; prev_alcohol_drinker: number; social_others: string;
  // OB-GYN
  menarche: string; menopausal_age: string; last_menstruation: string;
  menstrual_period: string; obgyn_others: string;
  // Family History
  fam_asthma: number; fam_diabetes: number; fam_goiter: number;
  fam_ptb: number; fam_heart_disease: number; fam_hypertension: number;
  fam_kidney: number; fam_others: string;
  // PE findings
  skin: string; head_scalp: string; eyes: string; ears_hearing: string;
  nose_sinuses: string; mouth_throat: string; neck_thyroid: string;
  chest_breast: string; lungs: string; heart: string; abdomen: string;
  back_flanks: string; extremities: string; neurological: string;
  genitals_urinary: string; anus_rectum: string;
}

interface MedItem { item_code: string; item_name: string; findings: string; assessment: string; recommendation: string; class_value: string; }
interface MedEvalData { items: MedItem[] }

// ── Shared styles ─────────────────────────────────────────────
const INP = "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500";
const TEXTAREA = `${INP} resize-none`;
const LBL = "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400";
const CHK = "flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200";

// ── Mini helpers ──────────────────────────────────────────────
function VitalBadge({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string | null; unit: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-700">
      <span className="text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {value ?? <span className="font-normal text-slate-300">—</span>}
          {value && <span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
      >
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function CheckRow({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <label className={CHK + " cursor-pointer"}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-blue-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked ? 1 : 0)}
        disabled={disabled}
      />
      {label}
    </label>
  );
}

// ── Assessment Code Types & Picker ───────────────────────────
interface AssessmentCode {
  id: number;
  code: string | null;
  findings: string | null;
  assesment: string | null;
  recommendation: string | null;
  Class: string | null;
  testgroup: string | null;
  testcode: string | null;
}

function AssessmentCodePicker({
  codes,
  onSelect,
  disabled,
}: {
  codes: AssessmentCode[];
  onSelect: (code: AssessmentCode) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = query.length < 1
    ? []
    : codes.filter(
        (c) =>
          c.findings?.toLowerCase().includes(query.toLowerCase()) ||
          c.assesment?.toLowerCase().includes(query.toLowerCase()) ||
          c.code?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 20);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 1 && setOpen(true)}
          placeholder="Search assessment codes..."
          disabled={disabled}
          className={`${INP} pl-8 text-xs`}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onSelect(c); setQuery(""); setOpen(false); }}
              className="flex w-full flex-col px-3 py-2 text-left text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 last:border-0 dark:border-slate-700"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {c.code && <span className="text-blue-600 dark:text-blue-400 mr-1">[{c.code}]</span>}
                {c.findings}
              </span>
              <span className="text-slate-400 truncate">{c.assesment}</span>
              {c.Class && (
                <span className={`mt-0.5 inline-block w-fit rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  c.Class === "A" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : c.Class === "B" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : c.Class === "C" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : c.Class === "D" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                  Class {c.Class}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Drawer ────────────────────────────────────────────────────
interface Props { patient: ClinicalQueueEntry | null; onClose: () => void; onCompleted: () => void; }
type Tab = "vitals" | "soap" | "pe" | "medeval" | "prescription";

export function EvaluationDrawer({ patient, onClose, onCompleted }: Props) {
  const [tab, setTab] = useState<Tab>("vitals");
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedTabs, setSavedTabs] = useState<Set<Tab>>(new Set());
  const [pcpSearch, setPcpSearch] = useState("");
  const [pcpResults, setPcpResults] = useState<{ id: number; code: string; name: string; specialty: string | null }[]>([]);
  const [physicians, setPhysicians] = useState<{ id: number; name: string }[]>([]);
  const [overallClass, setOverallClass] = useState<string | null>(null);
  const [assessmentCodes, setAssessmentCodes] = useState<AssessmentCode[]>([]);

  const vitalsForm = useForm<VitalsData>({
    defaultValues: {
      chief_complaint: "", pcp_id: "", pcp_name: "",
      bp_systolic: null, bp_diastolic: null, bp_systolic_2: null, bp_diastolic_2: null,
      bp_systolic_3: null, bp_diastolic_3: null, heart_rate: null, temperature: null,
      respiratory_rate: null, o2_saturation: null, weight: null, height: null, bmi: null,
      uncorrected_od: "", uncorrected_os: "", corrected_od: "", corrected_os: "",
      uncorrected_near_od: "", uncorrected_near_os: "", corrected_near_od: "", corrected_near_os: "",
      with_contact_lens: 0, with_eyeglass: 0, color_vision: "",
    },
  });

  const soapForm = useForm<SoapData>({
    defaultValues: {
      chief_complaint: "", history_illness: "", past_history: "", family_history: "",
      pe_findings: "", diagnosis: "", icd_code: "", treatment_plan: "", orders: "", pcp_doctor: "",
    },
  });

  const peForm = useForm<PeData>({
    defaultValues: {
      fitness_class: "", checked_by: "",
      liver_gallbladder: 0, heart_disease: 0, asthma_allergy: 0, tuberculosis: 0,
      ent_disorder: 0, eye_disorder: 0, diabetes_mellitus: 0, chronic_headache: 0,
      hypertension: 0, kidney_disease: 0, cancer: 0, std: 0, past_med_others: "",
      present_smoker: 0, smoker_sticks_per_day: "", smoker_years: "",
      previous_smoker: 0, prev_smoker_sticks: "", prev_smoker_years: "",
      alcohol_drinker: 0, prev_alcohol_drinker: 0, social_others: "",
      menarche: "", menopausal_age: "", last_menstruation: "", menstrual_period: "", obgyn_others: "",
      fam_asthma: 0, fam_diabetes: 0, fam_goiter: 0, fam_ptb: 0, fam_heart_disease: 0,
      fam_hypertension: 0, fam_kidney: 0, fam_others: "",
      skin: "", head_scalp: "", eyes: "", ears_hearing: "", nose_sinuses: "",
      mouth_throat: "", neck_thyroid: "", chest_breast: "", lungs: "", heart: "",
      abdomen: "", back_flanks: "", extremities: "", neurological: "", genitals_urinary: "", anus_rectum: "",
    },
  });

  const medEvalForm = useForm<MedEvalData>({ defaultValues: { items: [] } });
  const { fields, append, remove } = useFieldArray({ control: medEvalForm.control, name: "items" });

  // Prescription state
  const [rxDoctorName, setRxDoctorName] = useState("");
  const [rxNotes, setRxNotes] = useState("");
  const [rxItems, setRxItems] = useState<{ medication: string; dosage: string; frequency: string; duration: string; quantity: string; instructions: string }[]>([]);
  function addRxItem() {
    setRxItems((prev) => [...prev, { medication: "", dosage: "", frequency: "", duration: "", quantity: "", instructions: "" }]);
  }
  function removeRxItem(idx: number) {
    setRxItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateRxItem(idx: number, field: string, value: string) {
    setRxItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  // Auto-calc BMI
  const weight = vitalsForm.watch("weight");
  const height = vitalsForm.watch("height");
  useEffect(() => {
    if (weight && height && height > 0) {
      const h = height / 100;
      vitalsForm.setValue("bmi", parseFloat((weight / (h * h)).toFixed(1)));
    } else {
      vitalsForm.setValue("bmi", null);
    }
  }, [weight, height, vitalsForm]);

  // PCP physician search
  useEffect(() => {
    if (!pcpSearch || pcpSearch.length < 2) { setPcpResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/clinical/physicians?q=${encodeURIComponent(pcpSearch)}`);
        const json = await res.json();
        if (json.success) setPcpResults(json.data);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(t);
  }, [pcpSearch]);

  // Load physician list and assessment codes once on mount
  useEffect(() => {
    fetch("/api/clinical/physicians")
      .then(r => r.json())
      .then(j => { if (j.success) setPhysicians(j.data); })
      .catch(() => { /* ignore */ });
    fetch("/api/assessment-codes")
      .then(r => r.json())
      .then(j => { if (j.success) setAssessmentCodes(j.data); })
      .catch(() => { /* ignore */ });
  }, []);

  const loadData = useCallback(async (qid: number) => {
    const [vRes, eRes, peRes, meRes, rxRes] = await Promise.all([
      fetch(`/api/clinical/${qid}/vitals`),
      fetch(`/api/clinical/${qid}/evaluation`),
      fetch(`/api/clinical/${qid}/pe`),
      fetch(`/api/clinical/${qid}/medical-eval`),
      fetch(`/api/clinical/${qid}/prescription`),
    ]);
    const [vJson, eJson, peJson, meJson, rxJson] = await Promise.all([
      vRes.json(), eRes.json(), peRes.json(), meRes.json(), rxRes.json(),
    ]);

    if (vJson.success && vJson.data) {
      const v = vJson.data;
      vitalsForm.reset({
        chief_complaint: v.chief_complaint ?? "",
        pcp_id: v.pcp_id ?? "", pcp_name: v.pcp_name ?? "",
        bp_systolic: v.bp_systolic, bp_diastolic: v.bp_diastolic,
        bp_systolic_2: v.bp_systolic_2, bp_diastolic_2: v.bp_diastolic_2,
        bp_systolic_3: v.bp_systolic_3, bp_diastolic_3: v.bp_diastolic_3,
        heart_rate: v.heart_rate, temperature: v.temperature ? Number(v.temperature) : null,
        respiratory_rate: v.respiratory_rate, o2_saturation: v.o2_saturation,
        weight: v.weight ? Number(v.weight) : null, height: v.height ? Number(v.height) : null,
        bmi: v.bmi ? Number(v.bmi) : null,
        uncorrected_od: v.uncorrected_od ?? "", uncorrected_os: v.uncorrected_os ?? "",
        corrected_od: v.corrected_od ?? "", corrected_os: v.corrected_os ?? "",
        uncorrected_near_od: v.uncorrected_near_od ?? "", uncorrected_near_os: v.uncorrected_near_os ?? "",
        corrected_near_od: v.corrected_near_od ?? "", corrected_near_os: v.corrected_near_os ?? "",
        with_contact_lens: v.with_contact_lens ?? 0, with_eyeglass: v.with_eyeglass ?? 0,
        color_vision: v.color_vision ?? "",
      });
      if (v.pcp_name) setPcpSearch(v.pcp_name);
    }
    if (eJson.success && eJson.data) {
      const e = eJson.data;
      soapForm.reset({
        chief_complaint: e.chief_complaint ?? "", history_illness: e.history_illness ?? "",
        past_history: e.past_history ?? "", family_history: e.family_history ?? "",
        pe_findings: e.pe_findings ?? "", diagnosis: e.diagnosis ?? "",
        icd_code: e.icd_code ?? "", treatment_plan: e.treatment_plan ?? "",
        orders: e.orders ?? "", pcp_doctor: e.pcp_doctor ?? "",
      });
    }
    if (peJson.success && peJson.data) {
      const p = peJson.data;
      peForm.reset({
        fitness_class: p.fitness_class ?? "", checked_by: p.checked_by ?? "",
        liver_gallbladder: p.liver_gallbladder, heart_disease: p.heart_disease,
        asthma_allergy: p.asthma_allergy, tuberculosis: p.tuberculosis,
        ent_disorder: p.ent_disorder, eye_disorder: p.eye_disorder,
        diabetes_mellitus: p.diabetes_mellitus, chronic_headache: p.chronic_headache,
        hypertension: p.hypertension, kidney_disease: p.kidney_disease,
        cancer: p.cancer, std: p.std, past_med_others: p.past_med_others ?? "",
        present_smoker: p.present_smoker, smoker_sticks_per_day: p.smoker_sticks_per_day ?? "",
        smoker_years: p.smoker_years ?? "", previous_smoker: p.previous_smoker,
        prev_smoker_sticks: p.prev_smoker_sticks ?? "", prev_smoker_years: p.prev_smoker_years ?? "",
        alcohol_drinker: p.alcohol_drinker, prev_alcohol_drinker: p.prev_alcohol_drinker,
        social_others: p.social_others ?? "", menarche: p.menarche ?? "",
        menopausal_age: p.menopausal_age ?? "", last_menstruation: p.last_menstruation ?? "",
        menstrual_period: p.menstrual_period ?? "", obgyn_others: p.obgyn_others ?? "",
        fam_asthma: p.fam_asthma, fam_diabetes: p.fam_diabetes, fam_goiter: p.fam_goiter,
        fam_ptb: p.fam_ptb, fam_heart_disease: p.fam_heart_disease, fam_hypertension: p.fam_hypertension,
        fam_kidney: p.fam_kidney, fam_others: p.fam_others ?? "",
        skin: p.skin ?? "", head_scalp: p.head_scalp ?? "", eyes: p.eyes ?? "",
        ears_hearing: p.ears_hearing ?? "", nose_sinuses: p.nose_sinuses ?? "",
        mouth_throat: p.mouth_throat ?? "", neck_thyroid: p.neck_thyroid ?? "",
        chest_breast: p.chest_breast ?? "", lungs: p.lungs ?? "", heart: p.heart ?? "",
        abdomen: p.abdomen ?? "", back_flanks: p.back_flanks ?? "", extremities: p.extremities ?? "",
        neurological: p.neurological ?? "", genitals_urinary: p.genitals_urinary ?? "",
        anus_rectum: p.anus_rectum ?? "",
      });
      if (p.fitness_class) setOverallClass(p.fitness_class);
    }
    if (meJson.success && meJson.data && meJson.data.length > 0) {
      medEvalForm.reset({
        items: meJson.data.map((i: { item_code: string; item_name: string | null; findings: string | null; assessment: string | null; recommendation: string | null; class_value: string | null }) => ({
          item_code: i.item_code, item_name: i.item_name ?? "",
          findings: i.findings ?? "", assessment: i.assessment ?? "",
          recommendation: i.recommendation ?? "", class_value: i.class_value ?? "Pending",
        })),
      });
    }
    if (rxJson.success && rxJson.data) {
      const rx = rxJson.data;
      setRxDoctorName(rx.doctorName ?? "");
      setRxNotes(rx.notes ?? "");
      setRxItems((rx.items ?? []).map((i: { medication: string; dosage: string | null; frequency: string | null; duration: string | null; quantity: number | null; instructions: string | null }) => ({
        medication: i.medication, dosage: i.dosage ?? "", frequency: i.frequency ?? "",
        duration: i.duration ?? "", quantity: i.quantity != null ? String(i.quantity) : "", instructions: i.instructions ?? "",
      })));
    }
  }, [vitalsForm, soapForm, peForm, medEvalForm]);

  useEffect(() => {
    if (patient) {
      setTab("vitals");
      setSavedTabs(new Set());
      setSaveError("");
      setOverallClass(null);
      setPcpSearch("");
      setPcpResults([]);
      loadData(patient.id);
    }
  }, [patient, loadData]);

  async function saveVitals() {
    if (!patient) return;
    setSaving(true); setSaveError("");
    try {
      const data = vitalsForm.getValues();
      const res = await fetch(`/api/clinical/${patient.id}/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.patientId, ...data }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSavedTabs((s) => new Set([...s, "vitals"]));
    } catch (e) { setSaveError(e instanceof Error ? e.message : "Failed to save vitals"); }
    finally { setSaving(false); }
  }

  async function saveSoap(isDraft = true) {
    if (!patient) return;
    setSaving(true); setSaveError("");
    try {
      const data = soapForm.getValues();
      const res = await fetch(`/api/clinical/${patient.id}/evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.patientId, is_draft: isDraft ? 1 : 0, ...data }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSavedTabs((s) => new Set([...s, "soap"]));
    } catch (e) { setSaveError(e instanceof Error ? e.message : "Failed to save SOAP"); }
    finally { setSaving(false); }
  }

  async function savePe() {
    if (!patient) return;
    setSaving(true); setSaveError("");
    try {
      const data = peForm.getValues();
      const res = await fetch(`/api/clinical/${patient.id}/pe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.patientId, ...data }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSavedTabs((s) => new Set([...s, "pe"]));
    } catch (e) { setSaveError(e instanceof Error ? e.message : "Failed to save PE"); }
    finally { setSaving(false); }
  }

  async function saveMedEval() {
    if (!patient) return;
    setSaving(true); setSaveError("");
    try {
      const data = medEvalForm.getValues();
      const res = await fetch(`/api/clinical/${patient.id}/medical-eval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.patientId, items: data.items }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      if (json.overall_class) setOverallClass(json.overall_class);
      setSavedTabs((s) => new Set([...s, "medeval"]));
    } catch (e) { setSaveError(e instanceof Error ? e.message : "Failed to save evaluation"); }
    finally { setSaving(false); }
  }

  async function savePrescription() {
    if (!patient) return;
    const validItems = rxItems.filter((i) => i.medication.trim());
    if (validItems.length === 0) { setSaveError("Add at least one medication."); return; }
    setSaving(true); setSaveError("");
    try {
      const res = await fetch(`/api/clinical/${patient.id}/prescription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_name: rxDoctorName || null,
          notes:       rxNotes || null,
          items: validItems.map((i) => ({
            medication:   i.medication,
            dosage:       i.dosage || null,
            frequency:    i.frequency || null,
            duration:     i.duration || null,
            quantity:     i.quantity ? parseInt(i.quantity) : null,
            instructions: i.instructions || null,
          })),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSavedTabs((s) => new Set([...s, "prescription"]));
    } catch (e) { setSaveError(e instanceof Error ? e.message : "Failed to save prescription"); }
    finally { setSaving(false); }
  }

  async function handleComplete() {
    if (!patient) return;
    setCompleting(true); setSaveError("");
    await saveSoap(false); // finalize SOAP
    try {
      const res = await fetch(`/api/clinical/${patient.id}/complete`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      onCompleted(); onClose();
    } catch (e) { setSaveError(e instanceof Error ? e.message : "Failed to complete"); }
    finally { setCompleting(false); }
  }

  if (!patient) return null;

  const vitals = vitalsForm.watch();
  const bpStr = vitals.bp_systolic && vitals.bp_diastolic
    ? `${vitals.bp_systolic}/${vitals.bp_diastolic}` : null;
  const isCompleted = patient.status === "COMPLETED";

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "vitals",       label: "Vitals",       icon: <Activity     className="h-3.5 w-3.5" /> },
    { id: "soap",         label: "SOAP Notes",   icon: <ClipboardList className="h-3.5 w-3.5" /> },
    { id: "pe",           label: "Physical Exam",icon: <Stethoscope  className="h-3.5 w-3.5" /> },
    { id: "medeval",      label: "Med Eval",     icon: <FlaskConical className="h-3.5 w-3.5" /> },
    { id: "prescription", label: "Prescription", icon: <FileText     className="h-3.5 w-3.5" /> },
  ];

  const classColor = (c: string | null) => {
    if (!c) return "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400";
    if (c === "A") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (c === "B") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (c === "C") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (c === "D") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    return "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400";
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col bg-white shadow-2xl dark:bg-slate-800">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-sm px-2 dark:bg-blue-900/40 dark:text-blue-400">
              #{patient.queueNumber.toString()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{patient.patientName}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400">{patient.patientId}</span>
                {patient.companyName && (
                  <><span className="text-slate-200 dark:text-slate-600">·</span><span className="text-xs text-slate-400">{patient.companyName}</span></>
                )}
                {patient.priority === 1 && (
                  <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">Priority</span>
                )}
                {overallClass && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${classColor(overallClass)}`}>
                    Class {overallClass}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Vitals summary bar */}
        {(vitals.bp_systolic || vitals.heart_rate || vitals.temperature) && (
          <div className="grid grid-cols-4 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 shrink-0 dark:border-slate-700 dark:bg-slate-700">
            <VitalBadge icon={<Heart className="h-3.5 w-3.5" />} label="BP" value={bpStr} unit="mmHg" />
            <VitalBadge icon={<Activity className="h-3.5 w-3.5" />} label="HR" value={vitals.heart_rate?.toString() ?? null} unit="bpm" />
            <VitalBadge icon={<Thermometer className="h-3.5 w-3.5" />} label="Temp" value={vitals.temperature?.toString() ?? null} unit="°C" />
            <VitalBadge icon={<Droplets className="h-3.5 w-3.5" />} label="SpO2" value={vitals.o2_saturation?.toString() ?? null} unit="%" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-100 px-4 pt-3 shrink-0 overflow-x-auto dark:border-slate-700">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-medium transition-colors relative ${
                tab === t.id
                  ? "bg-white text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {t.icon}{t.label}
              {savedTabs.has(t.id) && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>
          ))}
        </div>

        {/* Error */}
        {saveError && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 shrink-0 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />{saveError}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── VITALS ── */}
          {tab === "vitals" && (
            <div className="space-y-4">

              {/* Chief Complaint */}
              <div>
                <p className={LBL}>Chief Complaint</p>
                <textarea
                  {...vitalsForm.register("chief_complaint")}
                  rows={2}
                  placeholder="Patient's main complaint..."
                  className={TEXTAREA}
                  disabled={isCompleted}
                />
              </div>

              {/* PCP Assignment */}
              <div className="relative">
                <p className={LBL}>PCP / Physician Assignment</p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <UserCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Search physician by name..."
                      value={pcpSearch}
                      onChange={(e) => setPcpSearch(e.target.value)}
                      className={`${INP} pl-9`}
                      disabled={isCompleted}
                    />
                  </div>
                  {vitalsForm.watch("pcp_name") && (
                    <span className="text-xs text-emerald-600 font-medium">✓ Assigned</span>
                  )}
                </div>
                {pcpResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {pcpResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => {
                          vitalsForm.setValue("pcp_id", p.code);
                          vitalsForm.setValue("pcp_name", p.name);
                          setPcpSearch(p.name);
                          setPcpResults([]);
                        }}
                      >
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{p.name}</p>
                          {p.specialty && <p className="text-xs text-slate-400">{p.specialty}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Blood Pressure — 3 readings */}
              <div>
                <p className={LBL}>Blood Pressure (Up to 3 readings)</p>
                <div className="space-y-2">
                  {([1, 2, 3] as const).map((n) => {
                    const sysKey = n === 1 ? "bp_systolic" : `bp_systolic_${n}` as keyof VitalsData;
                    const diaKey = n === 1 ? "bp_diastolic" : `bp_diastolic_${n}` as keyof VitalsData;
                    return (
                      <div key={n} className="flex items-center gap-2">
                        <span className="w-16 text-xs text-slate-400 shrink-0">Reading {n}</span>
                        <div className="relative flex-1">
                          <Heart className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                          <input
                            {...vitalsForm.register(sysKey, { valueAsNumber: true })}
                            type="number" placeholder="Systolic"
                            className={`${INP} pl-8 text-sm`}
                            disabled={isCompleted}
                          />
                        </div>
                        <span className="text-slate-400">/</span>
                        <input
                          {...vitalsForm.register(diaKey, { valueAsNumber: true })}
                          type="number" placeholder="Diastolic"
                          className={`${INP} flex-1 text-sm`}
                          disabled={isCompleted}
                        />
                        <span className="text-xs text-slate-400 w-12 shrink-0">mmHg</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Basic Vitals grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={LBL}>Heart Rate</p>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                    <input {...vitalsForm.register("heart_rate", { valueAsNumber: true })}
                      type="number" placeholder="0" className={`${INP} pl-8`} disabled={isCompleted} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">bpm</span>
                  </div>
                </div>
                <div>
                  <p className={LBL}>Temperature</p>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                    <input {...vitalsForm.register("temperature", { valueAsNumber: true })}
                      type="number" step="0.1" placeholder="36.5" className={`${INP} pl-8`} disabled={isCompleted} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">°C</span>
                  </div>
                </div>
                <div>
                  <p className={LBL}>Respiratory Rate</p>
                  <div className="relative">
                    <Wind className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                    <input {...vitalsForm.register("respiratory_rate", { valueAsNumber: true })}
                      type="number" placeholder="0" className={`${INP} pl-8`} disabled={isCompleted} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">br/min</span>
                  </div>
                </div>
                <div>
                  <p className={LBL}>O₂ Saturation</p>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                    <input {...vitalsForm.register("o2_saturation", { valueAsNumber: true })}
                      type="number" min="0" max="100" placeholder="98" className={`${INP} pl-8`} disabled={isCompleted} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                </div>
                <div>
                  <p className={LBL}>Weight</p>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                    <input {...vitalsForm.register("weight", { valueAsNumber: true })}
                      type="number" step="0.1" placeholder="0.0" className={`${INP} pl-8`} disabled={isCompleted} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">kg</span>
                  </div>
                </div>
                <div>
                  <p className={LBL}>Height</p>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
                    <input {...vitalsForm.register("height", { valueAsNumber: true })}
                      type="number" step="0.1" placeholder="0.0" className={`${INP} pl-8`} disabled={isCompleted} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">cm</span>
                  </div>
                </div>
              </div>

              {/* BMI */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">BMI (Auto)</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{vitals.bmi ?? "—"}</p>
                </div>
                {vitals.bmi && (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    vitals.bmi < 18.5 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    vitals.bmi < 25 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    vitals.bmi < 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {vitals.bmi < 18.5 ? "Underweight" : vitals.bmi < 25 ? "Normal" : vitals.bmi < 30 ? "Overweight" : "Obese"}
                  </span>
                )}
              </div>

              {/* Vision */}
              <Section title="Vision Assessment" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <label className={CHK}>
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300"
                      checked={vitalsForm.watch("with_contact_lens") === 1}
                      onChange={(e) => vitalsForm.setValue("with_contact_lens", e.target.checked ? 1 : 0)}
                      disabled={isCompleted} />
                    With Contact Lens
                  </label>
                  <label className={CHK}>
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300"
                      checked={vitalsForm.watch("with_eyeglass") === 1}
                      onChange={(e) => vitalsForm.setValue("with_eyeglass", e.target.checked ? 1 : 0)}
                      disabled={isCompleted} />
                    With Eyeglass
                  </label>
                </div>
                <div>
                  <p className={LBL}>Color Vision</p>
                  <input {...vitalsForm.register("color_vision")} type="text" placeholder="Normal / Deficient" className={INP} disabled={isCompleted} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400">
                        <th className="py-1 text-left font-medium"></th>
                        <th className="py-1 text-center font-medium">OD (Right)</th>
                        <th className="py-1 text-center font-medium">OS (Left)</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      {[
                        { label: "Far Uncorrected", od: "uncorrected_od" as keyof VitalsData, os: "uncorrected_os" as keyof VitalsData },
                        { label: "Far Corrected", od: "corrected_od" as keyof VitalsData, os: "corrected_os" as keyof VitalsData },
                        { label: "Near Uncorrected", od: "uncorrected_near_od" as keyof VitalsData, os: "uncorrected_near_os" as keyof VitalsData },
                        { label: "Near Corrected", od: "corrected_near_od" as keyof VitalsData, os: "corrected_near_os" as keyof VitalsData },
                      ].map((row) => (
                        <tr key={row.label}>
                          <td className="py-1 pr-3 text-slate-500 whitespace-nowrap dark:text-slate-400">{row.label}</td>
                          <td className="py-1 px-1">
                            <input {...vitalsForm.register(row.od)} type="text" placeholder="20/20"
                              className="block w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                              disabled={isCompleted} />
                          </td>
                          <td className="py-1 px-1">
                            <input {...vitalsForm.register(row.os)} type="text" placeholder="20/20"
                              className="block w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                              disabled={isCompleted} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}

          {/* ── SOAP NOTES ── */}
          {tab === "soap" && (
            <div className="space-y-4">
              {patient.consultation?.is_draft === 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4 shrink-0" /> SOAP note finalized
                </div>
              )}
              {patient.consultation?.is_draft === 1 && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                  <FileText className="h-4 w-4 shrink-0" /> Draft — not yet finalized
                </div>
              )}

              <Section title="S — Subjective">
                <div>
                  <p className={LBL}>Chief Complaint</p>
                  <textarea {...soapForm.register("chief_complaint")} rows={2}
                    placeholder="Patient's main complaint..." className={TEXTAREA} disabled={isCompleted} />
                </div>
                <div>
                  <p className={LBL}>History of Present Illness</p>
                  <textarea {...soapForm.register("history_illness")} rows={4}
                    placeholder="Onset, duration, character, associated symptoms..." className={TEXTAREA} disabled={isCompleted} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={LBL}>Past Medical History</p>
                    <textarea {...soapForm.register("past_history")} rows={3}
                      placeholder="Previous illnesses, surgeries..." className={TEXTAREA} disabled={isCompleted} />
                  </div>
                  <div>
                    <p className={LBL}>Family History</p>
                    <textarea {...soapForm.register("family_history")} rows={3}
                      placeholder="Relevant family conditions..." className={TEXTAREA} disabled={isCompleted} />
                  </div>
                </div>
              </Section>

              <Section title="O — Objective">
                <div>
                  <p className={LBL}>Physical Examination Findings</p>
                  <textarea {...soapForm.register("pe_findings")} rows={5}
                    placeholder={"General: alert, conscious\nHEENT: normocephalic\nChest/Lungs: clear\nCVS: regular rate\nAbdomen: soft, non-tender"}
                    className={TEXTAREA} disabled={isCompleted} />
                </div>
              </Section>

              <Section title="A — Assessment">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <p className={LBL}>Diagnosis / Impression</p>
                    <textarea {...soapForm.register("diagnosis")} rows={2}
                      placeholder="Primary and secondary diagnoses..." className={TEXTAREA} disabled={isCompleted} />
                  </div>
                  <div>
                    <p className={LBL}>ICD-10 Code</p>
                    <input {...soapForm.register("icd_code")} type="text"
                      placeholder="e.g. J06.9" className={INP} disabled={isCompleted} />
                  </div>
                </div>
              </Section>

              <Section title="P — Plan">
                <div>
                  <p className={LBL}>Treatment Plan</p>
                  <textarea {...soapForm.register("treatment_plan")} rows={3}
                    placeholder="Medications, procedures, referrals..." className={TEXTAREA} disabled={isCompleted} />
                </div>
                <div>
                  <p className={LBL}>Doctor&apos;s Orders</p>
                  <textarea {...soapForm.register("orders")} rows={4}
                    placeholder={"1. CBC\n2. Urinalysis\n3. ECG"} className={TEXTAREA} disabled={isCompleted} />
                </div>
                <div>
                  <p className={LBL}>Assigned PCP Doctor</p>
                  <input {...soapForm.register("pcp_doctor")} type="text"
                    placeholder="Dr. Juan Dela Cruz" className={INP} disabled={isCompleted} />
                </div>
              </Section>
            </div>
          )}

          {/* ── PHYSICAL EXAMINATION ── */}
          {tab === "pe" && (
            <div className="space-y-4">
              {/* Overall Class */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700">
                <div className="flex-1">
                  <p className={LBL}>Overall Fitness Class</p>
                  <div className="flex gap-2 mt-1">
                    {["A", "B", "C", "D", "Pending"].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => !isCompleted && peForm.setValue("fitness_class", cls)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${
                          peForm.watch("fitness_class") === cls
                            ? cls === "A" ? "bg-emerald-600 text-white"
                              : cls === "B" ? "bg-blue-600 text-white"
                              : cls === "C" ? "bg-amber-500 text-white"
                              : cls === "D" ? "bg-red-600 text-white"
                              : "bg-slate-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-52">
                  <p className={LBL}>Checked By</p>
                  <select
                    {...peForm.register("checked_by")}
                    className={INP}
                    disabled={isCompleted}
                  >
                    <option value="">— Select physician —</option>
                    {physicians.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Section title="Medical History (Past)">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "liver_gallbladder", label: "Liver / Gallbladder Disease" },
                    { key: "heart_disease", label: "Heart Disease" },
                    { key: "asthma_allergy", label: "Asthma / Allergy" },
                    { key: "tuberculosis", label: "Tuberculosis" },
                    { key: "ent_disorder", label: "Ear, Nose & Throat Disorder" },
                    { key: "eye_disorder", label: "Eye Disorder" },
                    { key: "diabetes_mellitus", label: "Diabetes Mellitus" },
                    { key: "chronic_headache", label: "Chronic Headache / Migraine" },
                    { key: "hypertension", label: "Hypertension" },
                    { key: "kidney_disease", label: "Kidney Disease" },
                    { key: "cancer", label: "Cancer" },
                    { key: "std", label: "Sexually Transmitted Disease" },
                  ].map(({ key, label }) => (
                    <CheckRow key={key} label={label}
                      checked={peForm.watch(key as keyof PeData) === 1}
                      onChange={(v) => peForm.setValue(key as keyof PeData, v as never)}
                      disabled={isCompleted} />
                  ))}
                </div>
                <div>
                  <p className={LBL}>Others</p>
                  <textarea {...peForm.register("past_med_others")} rows={2} className={TEXTAREA} disabled={isCompleted} />
                </div>
              </Section>

              <Section title="Social History" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <CheckRow label="Present Smoker" checked={peForm.watch("present_smoker") === 1}
                      onChange={(v) => peForm.setValue("present_smoker", v)} disabled={isCompleted} />
                    {peForm.watch("present_smoker") === 1 && (
                      <div className="ml-6 mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className={LBL}>Sticks/day</p>
                          <input {...peForm.register("smoker_sticks_per_day")} type="text" className={INP} disabled={isCompleted} />
                        </div>
                        <div>
                          <p className={LBL}>Years</p>
                          <input {...peForm.register("smoker_years")} type="text" className={INP} disabled={isCompleted} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <CheckRow label="Previous Smoker" checked={peForm.watch("previous_smoker") === 1}
                      onChange={(v) => peForm.setValue("previous_smoker", v)} disabled={isCompleted} />
                    {peForm.watch("previous_smoker") === 1 && (
                      <div className="ml-6 mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className={LBL}>Sticks/day</p>
                          <input {...peForm.register("prev_smoker_sticks")} type="text" className={INP} disabled={isCompleted} />
                        </div>
                        <div>
                          <p className={LBL}>Years</p>
                          <input {...peForm.register("prev_smoker_years")} type="text" className={INP} disabled={isCompleted} />
                        </div>
                      </div>
                    )}
                  </div>
                  <CheckRow label="Alcohol Drinker" checked={peForm.watch("alcohol_drinker") === 1}
                    onChange={(v) => peForm.setValue("alcohol_drinker", v)} disabled={isCompleted} />
                  <CheckRow label="Previous Alcohol Drinker" checked={peForm.watch("prev_alcohol_drinker") === 1}
                    onChange={(v) => peForm.setValue("prev_alcohol_drinker", v)} disabled={isCompleted} />
                </div>
                <div>
                  <p className={LBL}>Others</p>
                  <textarea {...peForm.register("social_others")} rows={2} className={TEXTAREA} disabled={isCompleted} />
                </div>
              </Section>

              <Section title="OB-GYN (Female)" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className={LBL}>Menarche</p><input {...peForm.register("menarche")} type="text" placeholder="Age" className={INP} disabled={isCompleted} /></div>
                  <div><p className={LBL}>Menopausal Age</p><input {...peForm.register("menopausal_age")} type="text" className={INP} disabled={isCompleted} /></div>
                  <div><p className={LBL}>Last Menstruation</p><input {...peForm.register("last_menstruation")} type="date" className={INP} disabled={isCompleted} /></div>
                  <div><p className={LBL}>Menstrual Period</p><input {...peForm.register("menstrual_period")} type="text" placeholder="e.g. 5/28" className={INP} disabled={isCompleted} /></div>
                </div>
                <div><p className={LBL}>Others</p><textarea {...peForm.register("obgyn_others")} rows={2} className={TEXTAREA} disabled={isCompleted} /></div>
              </Section>

              <Section title="Family History" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "fam_asthma", label: "Bronchial Asthma" },
                    { key: "fam_diabetes", label: "Diabetes Mellitus" },
                    { key: "fam_goiter", label: "Goiter" },
                    { key: "fam_ptb", label: "PTB" },
                    { key: "fam_heart_disease", label: "Heart Disease" },
                    { key: "fam_hypertension", label: "Hypertension" },
                    { key: "fam_kidney", label: "Kidney Disease" },
                  ].map(({ key, label }) => (
                    <CheckRow key={key} label={label}
                      checked={peForm.watch(key as keyof PeData) === 1}
                      onChange={(v) => peForm.setValue(key as keyof PeData, v as never)}
                      disabled={isCompleted} />
                  ))}
                </div>
                <div><p className={LBL}>Others</p><textarea {...peForm.register("fam_others")} rows={2} className={TEXTAREA} disabled={isCompleted} /></div>
              </Section>

              <Section title="Physical Examination Findings (Per Body System)">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: "skin", label: "Skin" },
                    { key: "head_scalp", label: "Head / Scalp" },
                    { key: "eyes", label: "Eyes" },
                    { key: "ears_hearing", label: "Ears / Hearing" },
                    { key: "nose_sinuses", label: "Nose / Sinuses" },
                    { key: "mouth_throat", label: "Mouth / Throat" },
                    { key: "neck_thyroid", label: "Neck / Thyroid" },
                    { key: "chest_breast", label: "Chest / Breast / Axilla" },
                    { key: "lungs", label: "Lungs" },
                    { key: "heart", label: "Heart" },
                    { key: "abdomen", label: "Abdomen" },
                    { key: "back_flanks", label: "Back / Flanks" },
                    { key: "extremities", label: "Extremities" },
                    { key: "neurological", label: "Neurological" },
                    { key: "genitals_urinary", label: "Genitals / Urinary" },
                    { key: "anus_rectum", label: "Anus / Rectum" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <p className={LBL}>{label}</p>
                      <input {...peForm.register(key as keyof PeData)}
                        type="text" placeholder="Normal" className={INP} disabled={isCompleted} />
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* ── MEDICAL EVALUATION ── */}
          {tab === "medeval" && (
            <div className="space-y-4">
              {/* Overall class display */}
              {overallClass && (
                <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${classColor(overallClass)}`}>
                  <FlaskConical className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-semibold">Overall Class: {overallClass}</span>
                  <span className="text-xs opacity-70">Priority: Pending &gt; D &gt; C &gt; B &gt; A</span>
                </div>
              )}

              {/* Item list */}
              {fields.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
                  <Eye className="mx-auto h-8 w-8 text-slate-200 mb-2 dark:text-slate-600" />
                  <p className="text-sm text-slate-400">No evaluation items yet. Add an item below.</p>
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div key={field.id} className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <p className={LBL}>Item Code</p>
                          <input {...medEvalForm.register(`items.${idx}.item_code`)}
                            type="text" placeholder="e.g. CBC" className={INP} disabled={isCompleted} />
                        </div>
                        <div>
                          <p className={LBL}>Item Name</p>
                          <input {...medEvalForm.register(`items.${idx}.item_name`)}
                            type="text" placeholder="Complete Blood Count" className={INP} disabled={isCompleted} />
                        </div>
                      </div>
                      {!isCompleted && (
                        <button type="button" onClick={() => remove(idx)}
                          className="mt-4 rounded-lg p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {/* Assessment Code Picker — auto-fills fields like v1 datalist */}
                    {!isCompleted && assessmentCodes.length > 0 && (
                      <div>
                        <p className={LBL}>Quick Fill from Assessment Codes</p>
                        <AssessmentCodePicker
                          codes={assessmentCodes}
                          disabled={isCompleted}
                          onSelect={(ac) => {
                            medEvalForm.setValue(`items.${idx}.findings`, ac.findings ?? "");
                            medEvalForm.setValue(`items.${idx}.assessment`, ac.assesment ?? "");
                            medEvalForm.setValue(`items.${idx}.recommendation`, ac.recommendation ?? "");
                            medEvalForm.setValue(`items.${idx}.class_value`, ac.Class ?? "Pending");
                          }}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className={LBL}>Findings</p>
                        <textarea {...medEvalForm.register(`items.${idx}.findings`)}
                          rows={3} placeholder="Lab results..." className={TEXTAREA} disabled={isCompleted} />
                      </div>
                      <div>
                        <p className={LBL}>Assessment</p>
                        <textarea {...medEvalForm.register(`items.${idx}.assessment`)}
                          rows={3} placeholder="Clinical interpretation..." className={TEXTAREA} disabled={isCompleted} />
                      </div>
                      <div>
                        <p className={LBL}>Recommendation</p>
                        <textarea {...medEvalForm.register(`items.${idx}.recommendation`)}
                          rows={3} placeholder="Follow-up, treatment..." className={TEXTAREA} disabled={isCompleted} />
                      </div>
                    </div>
                    <div>
                      <p className={LBL}>Class</p>
                      <div className="flex gap-2">
                        {["A", "B", "C", "D", "Pending"].map((cls) => (
                          <button key={cls} type="button"
                            onClick={() => !isCompleted && medEvalForm.setValue(`items.${idx}.class_value`, cls)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                              medEvalForm.watch(`items.${idx}.class_value`) === cls
                                ? cls === "A" ? "bg-emerald-600 text-white"
                                  : cls === "B" ? "bg-blue-600 text-white"
                                  : cls === "C" ? "bg-amber-500 text-white"
                                  : cls === "D" ? "bg-red-600 text-white"
                                  : "bg-slate-600 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}>
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => append({ item_code: "", item_name: "", findings: "", assessment: "", recommendation: "", class_value: "Pending" })}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-blue-300 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 w-full justify-center dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Plus className="h-4 w-4" /> Add Evaluation Item
                </button>
              )}
            </div>
          )}

          {tab === "prescription" && (
            <div className="space-y-4">
              {/* Doctor name */}
              <div>
                <p className={LBL}>Prescribing Physician</p>
                <input
                  type="text"
                  value={rxDoctorName}
                  onChange={(e) => setRxDoctorName(e.target.value)}
                  placeholder="Doctor name"
                  className={INP}
                  disabled={isCompleted}
                />
              </div>

              {/* Drug list */}
              {rxItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-slate-200 dark:text-slate-600" />
                  <p className="text-sm text-slate-400">No medications added yet.</p>
                </div>
              )}

              {rxItems.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-4 space-y-2 dark:border-slate-700">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <p className={LBL}>Medication *</p>
                        <input type="text" value={item.medication}
                          onChange={(e) => updateRxItem(idx, "medication", e.target.value)}
                          placeholder="e.g. Amoxicillin 500mg" className={INP} disabled={isCompleted} />
                      </div>
                      <div>
                        <p className={LBL}>Dosage</p>
                        <input type="text" value={item.dosage}
                          onChange={(e) => updateRxItem(idx, "dosage", e.target.value)}
                          placeholder="500mg" className={INP} disabled={isCompleted} />
                      </div>
                      <div>
                        <p className={LBL}>Frequency</p>
                        <input type="text" value={item.frequency}
                          onChange={(e) => updateRxItem(idx, "frequency", e.target.value)}
                          placeholder="3x daily" className={INP} disabled={isCompleted} />
                      </div>
                      <div>
                        <p className={LBL}>Duration</p>
                        <input type="text" value={item.duration}
                          onChange={(e) => updateRxItem(idx, "duration", e.target.value)}
                          placeholder="7 days" className={INP} disabled={isCompleted} />
                      </div>
                      <div>
                        <p className={LBL}>Qty</p>
                        <input type="number" value={item.quantity}
                          onChange={(e) => updateRxItem(idx, "quantity", e.target.value)}
                          placeholder="21" className={INP} disabled={isCompleted} />
                      </div>
                      <div className="col-span-2">
                        <p className={LBL}>Instructions (Sig)</p>
                        <input type="text" value={item.instructions}
                          onChange={(e) => updateRxItem(idx, "instructions", e.target.value)}
                          placeholder="Take after meals" className={INP} disabled={isCompleted} />
                      </div>
                    </div>
                    {!isCompleted && (
                      <button type="button" onClick={() => removeRxItem(idx)}
                        className="mt-5 rounded-lg p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!isCompleted && (
                <button type="button" onClick={addRxItem}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20">
                  <Plus className="h-4 w-4" /> Add Medication
                </button>
              )}

              {/* Notes */}
              <div>
                <p className={LBL}>Notes</p>
                <textarea
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  rows={2}
                  placeholder="Additional instructions..."
                  className={TEXTAREA}
                  disabled={isCompleted}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <button onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
            Close
          </button>

          <div className="flex items-center gap-2">
            {!isCompleted && (
              <>
                {/* Tab-specific save */}
                {tab === "vitals" && (
                  <button onClick={saveVitals} disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Vitals
                  </button>
                )}
                {tab === "soap" && (
                  <>
                    <button onClick={() => saveSoap(true)} disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Draft
                    </button>
                    <button onClick={() => saveSoap(false)} disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Finalize SOAP
                    </button>
                  </>
                )}
                {tab === "pe" && (
                  <button onClick={savePe} disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save PE
                  </button>
                )}
                {tab === "medeval" && (
                  <button onClick={saveMedEval} disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Eval
                  </button>
                )}
                {tab === "prescription" && (
                  <button onClick={savePrescription} disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Rx
                  </button>
                )}

                {/* Complete */}
                <button onClick={handleComplete} disabled={completing || saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50">
                  {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Complete
                </button>
              </>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" /> Consultation Completed
              </span>
            )}

            {/* Print Rx — show on prescription tab */}
            {patient && tab === "prescription" && (
              <a
                href={`/api/queue/${patient.id}/pdf?type=prescription`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                <FileText className="h-4 w-4" />
                Print Rx
              </a>
            )}
            {/* Print Summary — available once clinical data is saved */}
            {patient && tab !== "prescription" && (
              <a
                href={`/api/queue/${patient.id}/pdf?type=summary`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                </svg>
                Print Summary
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
