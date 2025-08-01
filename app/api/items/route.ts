import { type NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("continuation");
  const tokenNum = token ? parseInt(token) : null;

  const count = Math.round(
    typeof tokenNum === "number" ? tokenNum : Math.random() * 50
  );
  const shouldSendToken = count % 2 === 0;

  return NextResponse.json({
    items: Array.from(
      {
        length: count,
      },
      (_, index) => index
    ),
    token: shouldSendToken ? Math.random() : null,
  });
};
