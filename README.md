# Watch With Me

Watch With Me is a high-performance modern cinema and episodic streaming application built with React, Vite, Tailwind CSS, TypeScript, and an Express API architecture.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     React Client                        │
│   (Single-page UI, HTML5 Player, Context, State Store) │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / JSON
┌────────────────────────────▼────────────────────────────┐
│                    Express API Layer                    │
│      (/api/media, /api/user, /api/system routes)       │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    ProviderManager                      │
│       (Capability checks, strict mode routing)         │
├─────────────────────┬───────────────────┬───────────────┤
│  OpenMediaProvider  │   MockProvider    │ TmdbProvider  │
│  (Verified Streams) │ (Dev Simulation)  │ (Live TMDB)   │
└─────────────────────┴───────────────────┴───────────────┘
```

- **Client Separation**: The browser UI never accesses provider classes, database tokens, or upstream API keys directly. All communication routes through `/api/*` endpoints.
- **ProviderManager**: Implements a unified `IMediaProvider` contract. Dispatches requests to the configured active provider while routing playback via explicit capability checks.
- **Strict Mode by Default**: Does not silently mask missing upstream configurations or network failures with fake data. Unconfigured providers return clean, descriptive errors unless `ENABLE_MOCK_FALLBACK=true` is explicitly requested.

---

## 2. Media Providers & Capability Model

Each provider implements the `IMediaProvider` interface with granular capabilities:

| Capability | `OpenMediaProvider` | `MockProvider` | `TmdbProvider` |
|---|---|---|---|
| **ID** | `open-media` | `mock-cinema-provider` (alias `mock`) | `tmdb` |
| **Catalog Metadata** | Yes (Curated Open Cinema) | Yes (Sample Studio Content) | Yes (The Movie Database) |
| **Episodic Series** | Yes (Multi-season) | Yes | Yes (Full Seasons & Episodes) |
| **Playable Streams** | Yes (Verified Open / CC) | Yes (Sample Streams) | No (Metadata Only) |
| **Subtitles (VTT)** | Yes | Yes | No |
| **Trailers** | Yes | Yes | Yes (YouTube studio trailers) |
| **Live API Key Needed**| None (Self-contained) | None (Offline) | Optional (`TMDB_API_KEY`) |

### Honest Playback Policy
Watch With Me strictly observes an **Honest Playback Policy**:
- Titles from `OpenMediaProvider` offer verified streaming endpoints with multi-quality selection (1080p, 720p, 480p) and subtitles.
- TMDB titles are provided for discovery, search, cast exploration, and trailer previewing. Commercial titles without authorized open streams do not play fake or misleading video streams. The UI informs users with clean capability badges, and the playback controller returns `404 (PLAYBACK_UNAVAILABLE)`.
- Verified open-source titles (e.g. Blender Foundation films) automatically cross-route to verified stream assets when browsed through TMDB.

---

## 3. Environment Variables

Configure environment variables in your environment or `.env` file (see `.env.example`):

```env
# MEDIA_PROVIDER: Selects the active media catalog provider.
# Options: "open-media" (default), "mock", "tmdb"
MEDIA_PROVIDER="open-media"

# PLAYBACK_PROVIDER: Selects the active playback provider.
# Options: "open-media" (default), "mock"
PLAYBACK_PROVIDER="open-media"

# ENABLE_MOCK_FALLBACK: When false (default), unconfigured providers or upstream failures
# return honest error status codes. When true, falls back to MockProvider for offline dev.
ENABLE_MOCK_FALLBACK="false"

# TMDB_API_KEY: Optional API key for live TMDB metadata integration.
# Required only if MEDIA_PROVIDER is set to "tmdb".
TMDB_API_KEY=
```

---

## 4. Development & Testing

### Running Tests
Execute unit and integration tests covering provider contracts, capabilities, routing, and user storage:
```bash
npm test
```

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
Build the client application and bundle the Express server into `dist/server.cjs`:
```bash
npm run build
```

### Running in Production
```bash
npm start
```
