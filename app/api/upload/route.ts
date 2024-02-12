import { NextRequest, NextResponse } from "next/server";
import database, { FoldersNames } from "@/lib/db";

export async function POST(req: NextRequest) {
  const blob = await req.blob();
  // If the blob is null, just return
  if (blob === null) {
    console.log("blob is null");
    return NextResponse.json(
      { error: "blob is null", fileName: null },
      { status: 500 }
    );
  }

  try {
    const res = await database.uploadFile(blob, FoldersNames.profilePictures);
    return NextResponse.json({ fileName: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, fileName: null }, { status: 500 });
  }
}
