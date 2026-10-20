import { NextRequest, NextResponse } from "next/server";
import { getSurahDetailFull } from "@/lib/quran-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const num = parseInt(id, 10);

  if (isNaN(num) || num < 1 || num > 114) {
    return NextResponse.json(
      { error: "Nomor surah tidak valid (harus antara 1 dan 114)" },
      { status: 400 }
    );
  }

  try {
    const data = await getSurahDetailFull(num);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data surah", details: String(error) },
      { status: 500 }
    );
  }
}
