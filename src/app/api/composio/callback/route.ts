/**
 * GET /api/composio/callback
 * OAuth callback handler — Composio redirects here after user approves connection.
 * Closes the popup and sends a postMessage to the parent window.
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const app    = searchParams.get("app")    || "unknown";
  const status = searchParams.get("status") || "success"; // Composio may pass status
  const error  = searchParams.get("error");

  // Return an HTML page that posts a message to the opener and closes itself
  const html = `<!DOCTYPE html>
<html>
<head><title>Connecting ${app}...</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f2d0f;color:white;">
  <div style="text-align:center;">
    ${error
      ? `<div style="font-size:40px;margin-bottom:16px;">❌</div>
         <h2 style="color:#FCA5A5;">Connection failed</h2>
         <p style="color:#9CA3AF;font-size:14px;">${error}</p>`
      : `<div style="font-size:40px;margin-bottom:16px;">✅</div>
         <h2 style="color:#4ADE80;">${app.charAt(0).toUpperCase() + app.slice(1)} connected!</h2>
         <p style="color:#9CA3AF;font-size:14px;">Closing window...</p>`
    }
  </div>
  <script>
    try {
      window.opener?.postMessage(
        { type: 'composio_callback', app: '${app}', success: ${!error}, error: ${error ? `'${error}'` : 'null'} },
        '*'
      );
    } catch(e) {}
    setTimeout(() => window.close(), 1500);
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
