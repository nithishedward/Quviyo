const ALLOWED_RESOURCES = new Set(["search", "videos", "channels"]);

export default async function handler(request, response) {
  const resource = request.query.resource;

  if (!ALLOWED_RESOURCES.has(resource)) {
    return response.status(404).json({ error: { message: "Unsupported YouTube resource" } });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: { message: "YouTube API is not configured on the server" } });
  }

  const params = new URLSearchParams(request.query);
  params.delete("resource");
  params.set("key", apiKey);

  try {
    const upstream = await fetch(`https://www.googleapis.com/youtube/v3/${resource}?${params}`);
    const body = await upstream.text();

    response.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return response.status(upstream.status).send(body);
  } catch {
    return response.status(502).json({ error: { message: "Unable to reach YouTube" } });
  }
}
