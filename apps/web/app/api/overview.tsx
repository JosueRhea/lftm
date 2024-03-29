import { NextResponse } from "next/server";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  return NextResponse.json({
    hola: "hi",
  });
}
