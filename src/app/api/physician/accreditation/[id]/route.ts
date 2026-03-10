import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "erosui", "physician");
  void session;
  const { id } = await params;

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT
       p.id, p.fullname, p.lastname, p.firstname, p.middlename, p.suffix,
       p.dob, p.prcno, p.prcvalidity, p."Degree", p."Group", p.subgroup,
       p.branchcode, p.email, p.mobile, p.status, p.declinereason,
       p.requestorby, p.approveby, p.approvallogs, p.inputdate, p.inputby,
       p.updateby, p.updatedate,
       p.pcp, p.specialist, p.regular, p.reliever, p.visiting, p.referring, p.resigndoctor,
       p.schedule, p.timestart, p.timeend, p.nwdbranch, p.byappointment,
       p.applicationletter, p.curriculumvitae, p.diploma, p.prcid,
       p.residencycertificate, p.diplomatecertificate, p.philhealth,
       p.ptr, p.bir, p.moa
     FROM physician p WHERE p.id = $1`,
    BigInt(id)
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const r = rows[0];
  return NextResponse.json({
    id:                  Number(r.id),
    fullname:            r.fullname,
    lastname:            r.lastname,
    firstname:           r.firstname,
    middlename:          r.middlename,
    suffix:              r.suffix,
    dob:                 r.dob,
    prcno:               r.prcno,
    prcvalidity:         r.prcvalidity,
    degree:              r.Degree,
    group:               r.Group,
    subgroup:            r.subgroup,
    branchcode:          r.branchcode,
    email:               r.email,
    mobile:              r.mobile,
    status:              r.status,
    declinereason:       r.declinereason,
    requestorby:         r.requestorby,
    approveby:           r.approveby,
    approvallogs:        r.approvallogs,
    inputdate:           r.inputdate,
    inputby:             r.inputby,
    updateby:            r.updateby,
    updatedate:          r.updatedate,
    pcp:                 r.pcp,
    specialist:          r.specialist,
    regular:             r.regular,
    reliever:            r.reliever,
    visiting:            r.visiting,
    referring:           r.referring,
    resigndoctor:        r.resigndoctor,
    schedule:            r.schedule,
    timestart:           r.timestart,
    timeend:             r.timeend,
    nwdbranch:           r.nwdbranch,
    byappointment:       r.byappointment,
    applicationletter:   r.applicationletter,
    curriculumvitae:     r.curriculumvitae,
    diploma:             r.diploma,
    prcid:               r.prcid,
    residencycertificate: r.residencycertificate,
    diplomatecertificate: r.diplomatecertificate,
    philhealth:          r.philhealth,
    ptr:                 r.ptr,
    bir:                 r.bir,
    moa:                 r.moa,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "erosui", "physician");
  const { id } = await params;
  const body = await request.json();

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const by    = session.user.name ?? session.user.username ?? "unknown";

  // Guard: PRC No must be unique (excluding this record)
  if (body.prcno) {
    const dup = await prisma.$queryRawUnsafe<Array<{ id: bigint }>>(
      `SELECT id FROM physician WHERE prcno = $1 AND id <> $2 LIMIT 1`,
      body.prcno, BigInt(id)
    );
    if (dup.length > 0) {
      return NextResponse.json(
        { error: `PRC No. "${body.prcno}" is already registered to another physician.` },
        { status: 409 }
      );
    }
  }

  // Full-replace update — the form always sends all fields
  const fullname = [body.firstname, body.middlename, body.lastname, body.suffix]
    .filter(Boolean).join(" ") || null;

  await prisma.$executeRawUnsafe(
    `UPDATE physician SET
       fullname     = $1,
       lastname     = $2,
       firstname    = $3,
       middlename   = $4,
       suffix       = $5,
       dob          = $6,
       prcno        = $7,
       prcvalidity  = $8,
       "Degree"     = $9,
       "Group"      = $10,
       subgroup     = $11,
       branchcode   = $12,
       email        = $13,
       mobile       = $14,
       pcp          = $15,
       specialist   = $16,
       regular      = $17,
       reliever     = $18,
       visiting     = $19,
       referring    = $20,
       resigndoctor = $21,
       schedule     = $22,
       timestart    = $23,
       timeend      = $24,
       nwdbranch    = $25,
       byappointment= $26,
       applicationletter    = $27,
       curriculumvitae      = $28,
       diploma              = $29,
       prcid                = $30,
       residencycertificate = $31,
       diplomatecertificate = $32,
       philhealth           = $33,
       ptr                  = $34,
       bir                  = $35,
       moa                  = $36,
       updateby         = $37,
       updatedate       = $38,
       systemupdatetime = $39
     WHERE id = $40`,
    fullname,
    body.lastname    || null,
    body.firstname   || null,
    body.middlename  || null,
    body.suffix      || null,
    body.dob        ? new Date(body.dob) : null,
    body.prcno      || null,
    body.prcvalidity ? new Date(body.prcvalidity) : null,
    body.degree     || null,
    body.group      || null,
    body.subgroup   || null,
    body.branchcode || null,
    body.email      || null,
    body.mobile     || null,
    body.pcp          ? "Y" : "N",
    body.specialist   ? "Y" : "N",
    body.regular      ? "Y" : "N",
    body.reliever     ? "Y" : "N",
    body.visiting     ? "Y" : "N",
    body.referring    ? "Y" : "N",
    body.resigndoctor ? "Y" : "N",
    body.schedule    || null,
    body.timestart   || null,
    body.timeend     || null,
    body.nwdbranch   || null,
    body.byappointment ? "Y" : "N",
    body.applicationletter    ? "Y" : "N",
    body.curriculumvitae      ? "Y" : "N",
    body.diploma              ? "Y" : "N",
    body.prcid                ? "Y" : "N",
    body.residencycertificate ? "Y" : "N",
    body.diplomatecertificate ? "Y" : "N",
    body.philhealth           ? "Y" : "N",
    body.ptr                  ? "Y" : "N",
    body.bir                  ? "Y" : "N",
    body.moa                  ? "Y" : "N",
    by,
    today,
    now,
    BigInt(id)
  );

  return NextResponse.json({ ok: true });
}
