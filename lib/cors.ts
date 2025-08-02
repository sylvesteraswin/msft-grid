import { NextRequest, NextResponse } from "next/server";

export function corsHeaders(origin?: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin") || undefined;

  // Add CORS headers to the response
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function createCorsResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  request: NextRequest,
  status = 200
) {
  const response = NextResponse.json(data, { status });
  return handleCors(request, response);
}

// Handle preflight OPTIONS requests
export function handleOptions(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(request.headers.get("origin") || undefined),
  });
}
