const TINKER_BASE = "https://tinker.thinkingmachines.dev/services/tinker-prod/oai/api/v1";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request) {
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    // Forward the request to Tinker
    const url = new URL(request.url);
    const tinkerUrl = TINKER_BASE + url.pathname;

    const tinkerResponse = await fetch(tinkerUrl, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "Authorization": request.headers.get("Authorization") || "",
      },
      body: request.body,
    });

    // Clone response and add CORS headers
    const responseHeaders = new Headers(tinkerResponse.headers);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value);
    }

    return new Response(tinkerResponse.body, {
      status: tinkerResponse.status,
      headers: responseHeaders,
    });
  },
};
