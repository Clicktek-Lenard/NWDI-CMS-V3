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

  const fullname = [body.firstname, body.middlename, body.lastname, body.suffix]
    .filter(Boolean).join(" ") || null;

  await prisma.$executeRawUnsafe(
    `UPDATE physician SET
       fullname    = COALESCE($1, fullname),
       lastname    = COALESCE($2, lastname),
       firstname   = COALESCE($3, firstname),
       middlename  = COALESCE($4, middlename),
       suffix      = COALESCE($5, suffix),
       dob         = COALESCE($6, dob),
       prcno       = COALESCE($7, prcno),
       prcvalidity = COALESCE($8, prcvalidity),
       "Degree"    = COALESCE($9, "Degree"),
       "Group"     = COALESCE($10, "Group"),
       subgroup    = COALESCE($11, subgroup),
       branchcode  = COALESCE($12, branchcode),
       email       = COALESCE($13, email),
       mobile      = COALESCE($14, mobile),
       pcp         = COALESCE($15, pcp),
       specialist  = COALESCE($16, specialist),
       regular     = COALESCE($17, regular),
       reliever    = COALESCE($18, reliever),
       visiting    = COALESCE($19, visiting),
       referring   = COALESCE($20, referring),
       resigndoctor= COALESCE($21, resigndoctor),
       schedule    = COALESCE($22, schedule),
       timestart   = COALESCE($23, timestart),
       timeend     = COALESCE($24, timeend),
       nwdbranch   = COALESCE($25, nwdbranch),
       byappointment= COALESCE($26, byappointment),
       applicationletter    = COALESCE($27, applicationletter),
       curriculumvitae      = COALESCE($28, curriculumvitae),
       diploma              = COALESCE($29, diploma),
       prcid                = COALESCE($30, prcid),
       residencycertificate = COALESCE($31, residencycertificate),
       diplomatecertificate = COALESCE($32, diplomatecertificate),
       philhealth           = COALESCE($33, philhealth),
       ptr                  = COALESCE($34, ptr),
       bir                  = COALESCE($35, bir),
       moa                  = COALESCE($36, moa),
       updateby    = $37,
       updatedate  = $38,
       systemupdatetime = $39
     WHERE id = $40`,
    fullname,
    body.lastname    ?? null,
    body.firstname   ?? null,
    body.middlename  ?? null,
    body.suffix      ?? null,
    body.dob        ? new Date(body.dob) : null,
    body.prcno      ?? null,
    body.prcvalidity ? new Date(body.prcvalidity) : null,
    body.degree     ?? null,
    body.group      ?? null,
    body.subgroup   ?? null,
    body.branchcode ?? null,
    body.email      ?? null,
    body.mobile     ?? null,
    body.pcp         !== undefined ? (body.pcp ? "Y" : "N") : null,
    body.specialist  !== undefined ? (body.specialist ? "Y" : "N") : null,
    body.regular     !== undefined ? (body.regular ? "Y" : "N") : null,
    body.reliever    !== undefined ? (body.reliever ? "Y" : "N") : null,
    body.visiting    !== undefined ? (body.visiting ? "Y" : "N") : null,
    body.referring   !== undefined ? (body.referring ? "Y" : "N") : null,
    body.resigndoctor !== undefined ? (body.resigndoctor ? "Y" : "N") : null,
    body.schedule    ?? null,
    body.timestart   ?? null,
    body.timeend     ?? null,
    body.nwdbranch   ?? null,
    body.byappointment ?? null,
    body.applicationletter    !== undefined ? (body.applicationletter ? "Y" : "N") : null,
    body.curriculumvitae      !== undefined ? (body.curriculumvitae ? "Y" : "N") : null,
    body.diploma              !== undefined ? (body.diploma ? "Y" : "N") : null,
    body.prcid                !== undefined ? (body.prcid ? "Y" : "N") : null,
    body.residencycertificate !== undefined ? (body.residencycertificate ? "Y" : "N") : null,
    body.diplomatecertificate !== undefined ? (body.diplomatecertificate ? "Y" : "N") : null,
    body.philhealth           !== undefined ? (body.philhealth ? "Y" : "N") : null,
    body.ptr                  !== undefined ? (body.ptr ? "Y" : "N") : null,
    body.bir                  !== undefined ? (body.bir ? "Y" : "N") : null,
    body.moa                  !== undefined ? (body.moa ? "Y" : "N") : null,
    by,
    today,
    now,
    BigInt(id)
  );

  return NextResponse.json({ ok: true });
}
