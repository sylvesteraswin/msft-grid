import { type NextRequest } from "next/server";
import { createCorsResponse, handleOptions } from "@/lib/cors";

// https://placehold.co/600x400?text=Hello+World

export const OPTIONS = (request: NextRequest) => handleOptions(request);

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return createCorsResponse({ error: "ID is required" }, request, 400);
  }

  return createCorsResponse(
    {
      url: `https://placehold.co/1200x800?text=${id}`,
    },
    request
  );
};
