import { type NextRequest } from "next/server";
import { createCorsResponse, handleOptions } from "@/lib/cors";

export const OPTIONS = (request: NextRequest) => handleOptions(request);

export const GET = (request: NextRequest) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("continuation");
  const tokenNum = token ? parseInt(token) : null;

  const count = Math.max(
    1,
    Math.round(Math.random() * (tokenNum ? Math.min(tokenNum, 50) : 50))
  );
  const shouldSendToken = count % 2 === 0;

  console.log("Token:", token);

  return createCorsResponse(
    {
      items: Array.from(
        {
          length: count,
        },
        (_, index) => index + (tokenNum || 0) + 1
      ),
      token: shouldSendToken ? count + (tokenNum || 0) : null,
    },
    request
  );
};
