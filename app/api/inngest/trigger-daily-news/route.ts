import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

export async function POST() {
  await inngest.send({
    name: "app/send.daily.news",
    data: { source: "manual" },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  await inngest.send({
    name: "app/send.daily.news",
    data: { source: "manual-get" },
  });

  return NextResponse.json({ ok: true });
}