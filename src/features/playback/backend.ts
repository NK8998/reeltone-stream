export async function getServerManifest(id: string) {
  const server = process.env.REELTONE_SERVER_URL;
  if (!server) return undefined;

  const url = new URL(`/api/stream/videos/${encodeURIComponent(id)}`, server);
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("The streaming backend could not load this video.");
  const video: { manifestUrl: string | null } = await response.json();
  return video.manifestUrl;
}
