import { serve, file } from "bun";
import { join } from "path";
import { existsSync } from "fs";

const PORT = parseInt(process.env.PORT || "3000");
const BUILD_DIR = "/app/apps/mail/build/client";

console.log(`Starting static file server on port ${PORT}...`);
console.log(`Serving files from: ${BUILD_DIR}`);

serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Remove leading slash and handle root
    let filePath = pathname === "/" ? "index.html" : pathname.slice(1);
    let fullPath = join(BUILD_DIR, filePath);

    // Try the exact file first
    if (existsSync(fullPath)) {
      const fileResponse = file(fullPath);
      const contentType = getContentType(filePath);
      return new Response(fileResponse, {
        headers: { "Content-Type": contentType },
      });
    }

    // For SPA routing, try index.html for non-asset paths
    if (!filePath.includes(".") || !existsSync(fullPath)) {
      const indexPath = join(BUILD_DIR, "index.html");
      if (existsSync(indexPath)) {
        return new Response(file(indexPath), {
          headers: { "Content-Type": "text/html" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

function getContentType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    html: "text/html",
    js: "application/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
    webmanifest: "application/manifest+json",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

console.log(`Server running at http://0.0.0.0:${PORT}`);
