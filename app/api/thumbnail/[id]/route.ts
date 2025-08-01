import { type NextRequest, NextResponse } from "next/server";

// https://placehold.co/600x400?text=Hello+World

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  return NextResponse.json({
    url: `https://placehold.co/600x400?text=${id}`,
  });
};
