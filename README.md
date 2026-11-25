# ReelTone Stream

ReelTone’s Next.js viewer app. Use Node.js 24. Run commands from this directory.

```sh
npm ci
npm run dev
```

`npm run lint`, `npm run typecheck`, and `npm run build` check the app. Use `npm run dev -- --port 3102` to run it beside ReelTone Server on port 3000.

## Docker

The [shared Compose stack](../reeltone-util/README.md#local-development) runs Stream on port 3102 with Reviews and the NestJS server. To run Stream on its own from this repository, use the bundled catalog and manifest URLs.

```sh
docker compose up --build -d --wait
```

For development with Fast Refresh, use the development target and its source mounts.

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d --wait
```

Set `STREAM_LOCAL_PORT` to override the host port. Set `REELTONE_SERVER_URL` to a backend URL reachable from the container to resolve manifests through NestJS.

## Pages and source layout

| Area | Contents |
| --- | --- |
| `src/app/(browse)/` | Home, Movies, TV Shows, Documentaries, collections, Search, My List, and Settings |
| `src/app/(browse)/titles/[slug]/` | Shareable title details with title-specific metadata |
| `src/app/(browse)/@modal/` | Title dialogs opened from browsing while the underlying page stays in place |
| `src/app/(playback)/watch/[playableId]/` | One watch route for movies, episodes, and CSV video IDs with DASH manifests, with Cinema Mode and Standard view |
| `src/features/catalog/` | CSV import, editorial metadata, collections, filtering, cards, and title details |
| `src/features/library/` | Browser-local My List, viewing progress, and recent searches |
| `src/features/playback/` | dash.js integration, timeline, controls, and track settings |
| `src/features/account/` | Local profile and viewing preferences |
| `src/components/` and `src/styles/` | Shared navigation, actions, design tokens, and global styles |
| `public/` | Local brand and catalog artwork |

App Router Server Components render the public catalog. Client Components handle interactivity. CSS Modules keep styles with their features. Inter and Manrope are served with the app.

## Catalog and playback

The source export is `data/mock_data.csv`, copied from `references/data/mock_data.csv`. Set the server-only `REELTONE_SERVER_URL=http://127.0.0.1:3000` to resolve playback manifests from ReelTone Server. The local snapshot supports standalone use. The app uses the supplied video IDs, import dates, encoding resolutions, catalog images, and DASH manifest URLs. Select public artwork is mirrored locally, and label-free alternate frames are used where helpful. `src/features/catalog/editorial.ts` joins the source assets to viewer-facing sample titles, copy, categories, and seasons.

Set `mpd_url` for the matching `video_id` to connect a title or episode to its DASH stream. Older exports may use `manifest_url`. After changing the app’s CSV, restart the development server or rebuild for production. For remote sources, the browser must be able to access the manifest and segments, including any required CORS headers. Optional `intro_end_seconds` and `recap_end_seconds` values enable the respective skip controls. The player reads available quality levels, audio tracks, subtitles, and timeline thumbnails from the attached DASH stream.

When a row has no usable manifest URL, the watch page labels playback as a demo and streams [Big Buck Bunny](https://peach.blender.org/) by the Blender Foundation through a [public DASH manifest](https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd). My List, resume progress, preferences, and playback reports stay in this browser. Demo and catalog playback have separate resume positions.

## Featured artwork

The Quiet Tide backdrop is `public/artwork/editorial-quiet-tide.jpg`. It was created with the built-in image generation tool using this prompt.

> Use case: photorealistic-natural. Asset type: wide cinematic backdrop for the featured film The Quiet Tide, displayed in an understated premium streaming service. Make an original atmospheric 2.35:1 widescreen film still of a lone woman in a weathered dark rust raincoat standing on a grass-covered rocky promontory on the right third of the frame, looking toward a small distant lighthouse on the far right coast at late blue hour. A little warm beacon light in drifting sea fog, giant deep slate turquoise ocean, damp dark emerald coastal grasses, low low-key clouds, a dim silvery strip of water. Wide realistic 35mm anamorphic photography, grounded natural textures, premium independent cinematic drama, believable scale and understated cool grading. Keep the left half visually quiet with dark mist and subdued low-contrast ocean to support white interface copy. Put the principal silhouette between 65 and 78 percent of the image width so mobile cropping also works. The image is artwork only, no text, logo, watermark, graphic layout or decorative borders. Use a widescreen landscape output.

See the [Product UI & Design System Specification](references/docs/Product%20UI%20%26%20Design%20System%20Specification.pdf) for the viewer experience and visual design.
