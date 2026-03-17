import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "patients");
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// POST /api/patients/[id]/photo — upload patient photo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const patientId = BigInt(id);

  const patient = await prisma.patient.findUnique({ where: { Id: patientId } });
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("photo");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No photo file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 422 });
  }

  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 413 });
  }

  try {
    // Ensure upload dir exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Resize + convert to JPEG via sharp
    const resized = await sharp(Buffer.from(bytes))
      .resize(400, 400, { fit: "cover", position: "attention" })
      .jpeg({ quality: 85 })
      .toBuffer();

    const filename = `${id}.jpg`;
    await writeFile(join(UPLOAD_DIR, filename), resized);

    const picturePath = `/uploads/patients/${filename}`;

    await prisma.patient.update({
      where: { Id: patientId },
      data: { PictureLink: picturePath },
    });

    return NextResponse.json({ success: true, pictureLink: picturePath });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
}

// DELETE /api/patients/[id]/photo — remove patient photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const patientId = BigInt(id);

  try {
    await prisma.patient.update({
      where: { Id: patientId },
      data: { PictureLink: null },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove photo" }, { status: 500 });
  }
}
