import { NextRequest } from "next/server";

const mockResults = [
  "Hello World",
  "Hello Next.js",
  "Hello Vercel",
  "Hello AI",
  "Hello ChatGPT",
  "Hello OpenAI",
  "Hello JavaScript",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);

  const query = url.searchParams.get("q") || "";

  const lowerQuery = query.toLowerCase();

  const filteredResults = mockResults.filter((item) =>
    item.toLowerCase().includes(lowerQuery)
  );

  await sleep(2000);

  return new Response(JSON.stringify({ results: filteredResults }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
