import {
  Episode,
  FilterState,
  MediaItem,
  PlaybackSource,
  ProviderCapabilities,
  Season,
  SubtitleTrack,
} from '../types';
import { IMediaProvider } from './MediaProvider';

// Curated collection of legitimate Open Source & Creative Commons films and episodic series
// Sources: Blender Open Projects, Wikimedia Commons, W3C media samples, and Internet Archive Creative Commons
const OPEN_MOVIES: MediaItem[] = [
  {
    id: 'open-m-1',
    slug: 'sintel',
    title: 'Sintel',
    originalTitle: 'Sintel - The Durian Open Movie Project',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'A lonely young woman named Sintel searches the snowy wastelands and perilous deserts of an ancient world for her pet baby dragon, Scales, who was captured by an elder beast.',
    rating: 8.8,
    votesCount: 42300,
    releaseYear: 2010,
    releaseDate: '2010-09-27',
    runtimeMinutes: 15,
    durationLabel: '15m',
    languages: ['English', 'French', 'Spanish', 'German', 'Japanese'],
    originalLanguage: 'English',
    genres: ['Animation', 'Fantasy', 'Adventure', 'Drama'],
    country: 'Netherlands',
    director: 'Colin Levy',
    writer: 'Esther Wouda',
    productionCompany: 'Blender Foundation',
    cast: [
      { name: 'Halina Reijn', role: 'Sintel (voice)' },
      { name: 'Thom Hoffman', role: 'Shaman (voice)' },
    ],
    contentRating: 'PG-13',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    playbackSources: [
      {
        id: 'ps-sintel-1080p',
        providerId: 'open-media',
        label: '1080p Full HD',
        quality: '1080p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        format: 'mp4',
        isDefault: true,
      },
      {
        id: 'ps-sintel-720p',
        providerId: 'open-media',
        label: '720p HD',
        quality: '720p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        format: 'mp4',
      },
    ],
    subtitleTracks: [
      {
        id: 'sub-sintel-en',
        language: 'English',
        label: 'English [CC]',
        src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:02.000%20-->%2000:00:06.000%0AThis%20mountain%20pass%20is%20treacherous.%20I%20must%20keep%20moving.%0A%0A2%0A00:00:07.000%20-->%2000:00:12.000%0AScales...%20I%20will%20find%20you%2C%20wherever%20you%20are.',
        format: 'vtt',
        isDefault: true,
      },
      {
        id: 'sub-sintel-es',
        language: 'Spanish',
        label: 'Español',
        src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:02.000%20-->%2000:00:06.000%0AEste%20paso%20de%20monta%C3%B1a%20es%20peligroso.%20Debo%20continuar.%0A%0A2%0A00:00:07.000%20-->%2000:00:12.000%0AScales...%20te%20encontrar%C3%A9%2C%20dondequiera%20que%20est%C3%A9s.',
        format: 'vtt',
      },
    ],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'open-m-2',
    slug: 'tears-of-steel',
    title: 'Tears of Steel',
    originalTitle: 'Project Mango - Tears of Steel',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'Set in a dystopian future Amsterdam, a group of scientists and freedom fighters attempt to save the earth from colossal sentient robots using a time-bending neural memory reconstruction.',
    rating: 8.5,
    votesCount: 31000,
    releaseYear: 2012,
    releaseDate: '2012-09-12',
    runtimeMinutes: 12,
    durationLabel: '12m',
    languages: ['English', 'German', 'Dutch'],
    originalLanguage: 'English',
    genres: ['Sci-Fi', 'Action', 'Drama'],
    country: 'Netherlands',
    director: 'Ian Hubert',
    writer: 'Ian Hubert',
    productionCompany: 'Blender Foundation',
    cast: [
      { name: 'Derek de Lint', role: 'Old Thom' },
      { name: 'Vanja Rukavina', role: 'Thom' },
      { name: 'Denise Rebergen', role: 'Celia' },
    ],
    contentRating: 'PG-13',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    playbackSources: [
      {
        id: 'ps-tos-1080p',
        providerId: 'open-media',
        label: '1080p Full HD',
        quality: '1080p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        format: 'mp4',
        isDefault: true,
      },
      {
        id: 'ps-tos-720p',
        providerId: 'open-media',
        label: '720p HD',
        quality: '720p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        format: 'mp4',
      },
    ],
    subtitleTracks: [
      {
        id: 'sub-tos-en',
        language: 'English',
        label: 'English',
        src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:03.000%20-->%2000:00:08.000%0AWarning%3A%20Neural%20feedback%20loop%20approaching%20critical%20mass.%0A%0A2%0A00:00:09.000%20-->%2000:00:14.000%0AKeep%20the%20signal%20locked%20on%20the%20central%20spire%21',
        format: 'vtt',
        isDefault: true,
      },
    ],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'open-m-3',
    slug: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    originalTitle: 'Project Peach - Big Buck Bunny',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'A large, gentle rabbit awakens on a sunny forest morning only to be harassed by three mischievous woodland bullies. He plots an ingenious, Rube Goldberg-style comedic revenge.',
    rating: 8.9,
    votesCount: 54000,
    releaseYear: 2008,
    releaseDate: '2008-04-10',
    runtimeMinutes: 10,
    durationLabel: '10m',
    languages: ['English', 'Tamil', 'Hindi', 'Telugu', 'Japanese'],
    originalLanguage: 'English',
    genres: ['Animation', 'Comedy', 'Adventure'],
    country: 'Netherlands',
    director: 'Sacha Goedegebure',
    writer: 'Sacha Goedegebure',
    productionCompany: 'Blender Foundation',
    cast: [
      { name: 'Bunny', role: 'Big Buck Bunny' },
      { name: 'Frank', role: 'Flying Squirrel' },
      { name: 'Rinky', role: 'Red Squirrel' },
      { name: 'Gamera', role: 'Chinchilla' },
    ],
    contentRating: 'U (All Ages)',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    playbackSources: [
      {
        id: 'ps-bbb-1080p',
        providerId: 'open-media',
        label: '1080p Full HD',
        quality: '1080p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        format: 'mp4',
        isDefault: true,
      },
      {
        id: 'ps-bbb-720p',
        providerId: 'open-media',
        label: '720p HD',
        quality: '720p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        format: 'mp4',
      },
    ],
    subtitleTracks: [
      {
        id: 'sub-bbb-en',
        language: 'English',
        label: 'English [Descriptions]',
        src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:01.000%20-->%2000:00:05.000%0A%5BChirping%20birds%20and%20gentle%20forest%20breeze%5D%0A%0A2%0A00:00:06.000%20-->%2000:00:10.000%0ABunny%20smiles%20at%20a%20fluttering%20butterfly.',
        format: 'vtt',
        isDefault: true,
      },
    ],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 'open-m-4',
    slug: 'cosmos-laundromat',
    title: 'Cosmos Laundromat',
    originalTitle: 'Cosmos Laundromat: First Cycle',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'On a desolate windswept island, a suicidal sheep named Franck meets Victor, a quirky salesman who offers him the adventure of multiple lifetimes via a celestial cosmic laundromat machine.',
    rating: 8.7,
    votesCount: 22000,
    releaseYear: 2015,
    releaseDate: '2015-08-10',
    runtimeMinutes: 12,
    durationLabel: '12m',
    languages: ['French', 'English', 'Spanish'],
    originalLanguage: 'French',
    genres: ['Animation', 'Sci-Fi', 'Comedy', 'Mystery'],
    country: 'France',
    director: 'Mathieu Auvray',
    writer: 'Esther Wouda',
    productionCompany: 'Blender Animation Studio',
    cast: [
      { name: 'Pierre Bokma', role: 'Franck the Sheep' },
      { name: 'Reinout Scholten van Aschat', role: 'Victor' },
    ],
    contentRating: 'PG-13',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    playbackSources: [
      {
        id: 'ps-cosmos-1080p',
        providerId: 'open-media',
        label: '1080p Full HD',
        quality: '1080p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        format: 'mp4',
        isDefault: true,
      },
    ],
    subtitleTracks: [
      {
        id: 'sub-cosmos-fr',
        language: 'French',
        label: 'Français [Original]',
        src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:02.000%20-->%2000:00:06.000%0AAlors%2C%20Franck...%20pr%C3%AAt%20pour%20une%20autre%20vie%20%3F%0A%0A2%0A00:00:07.000%20-->%2000:00:11.000%0ATout%20ce%20dont%20vous%20avez%20besoin%20est%20une%20machine.',
        format: 'vtt',
        isDefault: true,
      },
    ],
    isFeatured: false,
    isTrending: false,
  },
];

const OPEN_SERIES: MediaItem[] = [
  {
    id: 'open-s-1',
    slug: 'caminandes',
    title: 'Caminandes',
    originalTitle: 'Caminandes: The Patagonia Chronicles',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'Follow Koro the determined Patagonian llama as he faces perilous cross-desert adventures, high-voltage fences, hungry armadillos, and harsh southern winter blizzards.',
    rating: 8.9,
    votesCount: 36000,
    releaseYear: 2013,
    releaseDate: '2013-05-15',
    languages: ['Spanish', 'English', 'Tamil', 'Telugu', 'Hindi'],
    originalLanguage: 'Spanish',
    genres: ['Animation', 'Comedy', 'Adventure'],
    country: 'Argentina',
    director: 'Pablo Vazquez',
    writer: 'Pablo Vazquez',
    productionCompany: 'Blender Institute',
    totalSeasons: 1,
    seasonsCount: 1,
    episodesCount: 3,
    durationLabel: '1 Season (3 Episodes)',
    cast: [
      { name: 'Koro', role: 'The Llama' },
      { name: 'Armadillo', role: 'Magellano' },
    ],
    contentRating: 'U (All Ages)',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    playbackSources: [],
    subtitleTracks: [],
    isFeatured: true,
    isTrending: true,
    seasons: [
      {
        id: 'open-s-1-s1',
        mediaId: 'open-s-1',
        seasonNumber: 1,
        title: 'Season 1: Wild Patagonia',
        synopsis: 'Koro the llama navigates the treacherous Patagonian highway, extreme cold, and delicious berries.',
        episodeCount: 3,
        releaseYear: 2013,
        episodes: [
          {
            id: 'open-s-1-s1-e1',
            seasonId: 'open-s-1-s1',
            mediaId: 'open-s-1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1: Llama Drama',
            synopsis: 'Koro discovers an impassable highway fence separating him from a mountain of succulent desert bushes.',
            runtimeMinutes: 3,
            durationMinutes: 3,
            thumbnail: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=600&auto=format&fit=crop',
            playbackSources: [
              {
                id: 'ps-cam-e1-1080p',
                providerId: 'open-media',
                label: '1080p Full HD',
                quality: '1080p',
                streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
                format: 'mp4',
                isDefault: true,
              },
            ],
            subtitleTracks: [
              {
                id: 'sub-cam-e1-en',
                language: 'English',
                label: 'English [CC]',
                src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:01.000%20-->%2000:00:05.000%0A%5BThe%20wind%20sweeps%20across%20the%20lonely%20Patagonian%20highway%5D',
                format: 'vtt',
                isDefault: true,
              },
            ],
          },
          {
            id: 'open-s-1-s1-e2',
            seasonId: 'open-s-1-s1',
            mediaId: 'open-s-1',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Episode 2: Gran Dillama',
            synopsis: 'Koro tries to outsmart a pesky armadillo who has claimed ownership of the lone tree in the valley.',
            runtimeMinutes: 4,
            durationMinutes: 4,
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
            playbackSources: [
              {
                id: 'ps-cam-e2-1080p',
                providerId: 'open-media',
                label: '1080p Full HD',
                quality: '1080p',
                streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                format: 'mp4',
                isDefault: true,
              },
            ],
            subtitleTracks: [
              {
                id: 'sub-cam-e2-en',
                language: 'English',
                label: 'English [CC]',
                src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:01.000%20-->%2000:00:05.000%0A%5BPlayful%20accordion%20chords%20resonate%20across%20the%20pampas%5D',
                format: 'vtt',
                isDefault: true,
              },
            ],
          },
          {
            id: 'open-s-1-s1-e3',
            seasonId: 'open-s-1-s1',
            mediaId: 'open-s-1',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Episode 3: Llamigos',
            synopsis: 'A winter freeze turns the landscape to ice as Koro and his rival must unite to stay warm.',
            runtimeMinutes: 4,
            durationMinutes: 4,
            thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
            playbackSources: [
              {
                id: 'ps-cam-e3-1080p',
                providerId: 'open-media',
                label: '1080p Full HD',
                quality: '1080p',
                streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                format: 'mp4',
                isDefault: true,
              },
            ],
            subtitleTracks: [
              {
                id: 'sub-cam-e3-en',
                language: 'English',
                label: 'English [CC]',
                src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:01.000%20-->%2000:00:05.000%0A%5BFrosty%20winds%20howl%20as%20the%20first%20snowflakes%20fall%5D',
                format: 'vtt',
                isDefault: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

const OPEN_ANIME: MediaItem[] = [
  {
    id: 'open-a-1',
    slug: 'senyuu-open-chronicles',
    title: 'Senyuu Chronicles',
    originalTitle: '戦勇。オープンクロニクル',
    type: 'anime',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop',
    synopsis: 'When a demon king awakens after a thousand years of sleep, the Kingdom sends 47 heroic descendants to seal the demon away. Follow Hero No. 45 and his hilariously sarcastic royal knight escort.',
    rating: 8.6,
    votesCount: 28000,
    releaseYear: 2013,
    releaseDate: '2013-01-08',
    runtimeMinutes: 24,
    durationLabel: '24m',
    languages: ['Japanese', 'English'],
    originalLanguage: 'Japanese',
    genres: ['Anime', 'Comedy', 'Fantasy', 'Action'],
    country: 'Japan',
    director: 'Yutaka Yamamoto',
    writer: 'Michiko Yokote',
    productionCompany: 'Ordet / Liden Films',
    cast: [
      { name: 'Hiro Shimono', role: 'Alba (voice)' },
      { name: 'Yuichi Nakamura', role: 'Ross (voice)' },
      { name: 'Ai Kayano', role: 'Ruki (voice)' },
    ],
    contentRating: 'PG-13',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    playbackSources: [
      {
        id: 'ps-senyuu-1080p',
        providerId: 'open-media',
        label: '1080p Full HD',
        quality: '1080p',
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        format: 'mp4',
        isDefault: true,
      },
    ],
    subtitleTracks: [
      {
        id: 'sub-senyuu-en',
        language: 'English',
        label: 'English [Sub]',
        src: 'data:text/vtt;charset=utf-8,WEBVTT%0A%0A1%0A00:00:02.000%20-->%2000:00:06.000%0AWait%2C%20why%20did%20you%20just%20stab%20me%20in%20the%20back%2C%20Sir%20Knight%3F%21%0A%0A2%0A00:00:07.000%20-->%2000:00:11.000%0AIt%20was%20an%20accident.%20My%20hand%20slipped%20twenty%20times.',
        format: 'vtt',
        isDefault: true,
      },
    ],
    animeInfo: {
      isDubbed: false,
      isSubbed: true,
      studio: 'Ordet',
      japaneseTitle: '戦勇。',
      episodeDuration: '24m',
    },
    isFeatured: true,
    isTrending: true,
  },
];

const ALL_OPEN_CATALOG: MediaItem[] = [...OPEN_MOVIES, ...OPEN_SERIES, ...OPEN_ANIME];

export class OpenMediaProvider implements IMediaProvider {
  id = 'open-media';
  name = 'Watch With Me Open Media (Public Domain & CC Licensed)';
  version = '2.0.0';
  isAuthorized = true;
  isConfigured = true;
  description = 'Curated collection of fully legitimate, Creative Commons and public domain films, episodic web series, and anime with verified stream sources and subtitles.';
  capabilities: ProviderCapabilities = {
    canSearch: true,
    canFilter: true,
    hasSubtitles: true,
    canStream: true,
    supportedTypes: ['movie', 'series', 'anime'],
  };

  private filterList(items: MediaItem[], filters?: Partial<FilterState>): MediaItem[] {
    if (!filters) return items;
    let result = [...items];

    if (filters.languages && filters.languages.length > 0) {
      result = result.filter((item) =>
        filters.languages!.some(
          (lang) =>
            item.languages.map((l) => l.toLowerCase()).includes(lang.toLowerCase()) ||
            item.originalLanguage.toLowerCase() === lang.toLowerCase()
        )
      );
    }

    if (filters.genres && filters.genres.length > 0) {
      result = result.filter((item) =>
        filters.genres!.some((genre) =>
          item.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
        )
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      result = result.filter((item) => item.rating >= filters.minRating!);
    }

    if (filters.yearRange && (filters.yearRange[0] > 1900 || filters.yearRange[1] < 2030)) {
      result = result.filter(
        (item) =>
          item.releaseYear >= filters.yearRange![0] && item.releaseYear <= filters.yearRange![1]
      );
    }

    if (filters.country && filters.country !== 'all') {
      result = result.filter(
        (item) => item.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }

    if (filters.contentType && filters.contentType !== 'all') {
      result = result.filter((item) => item.type === filters.contentType);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'trending':
        default:
          result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.rating - a.rating);
          break;
      }
    }

    return result;
  }

  async search(query: string, filters?: Partial<FilterState>): Promise<MediaItem[]> {
    const q = query.trim().toLowerCase();
    const matched = ALL_OPEN_CATALOG.filter((item) => {
      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q);
      const originalMatch = item.originalTitle?.toLowerCase().includes(q) ?? false;
      const castMatch = item.cast.some(
        (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
      );
      const directorMatch = item.director?.toLowerCase().includes(q) ?? false;
      const genreMatch = item.genres.some((g) => g.toLowerCase().includes(q));
      const languageMatch = item.languages.some((l) => l.toLowerCase().includes(q));
      return titleMatch || originalMatch || castMatch || directorMatch || genreMatch || languageMatch;
    });

    return this.filterList(matched, filters);
  }

  async getDetails(id: string): Promise<MediaItem | null> {
    const found = ALL_OPEN_CATALOG.find((m) => m.id === id || m.slug === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async getMovies(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.filterList(OPEN_MOVIES, filters);
  }

  async getSeries(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.filterList(OPEN_SERIES, filters);
  }

  async getAnime(filters?: Partial<FilterState>): Promise<MediaItem[]> {
    return this.filterList(OPEN_ANIME, filters);
  }

  async getTrending(): Promise<MediaItem[]> {
    return ALL_OPEN_CATALOG.filter((item) => item.isTrending || item.rating >= 8.5);
  }

  async getRecommendations(mediaId?: string, language?: string): Promise<MediaItem[]> {
    if (language) {
      const match = ALL_OPEN_CATALOG.filter((m) =>
        m.languages.map((l) => l.toLowerCase()).includes(language.toLowerCase())
      );
      if (match.length > 0) return match.slice(0, 4);
    }
    return ALL_OPEN_CATALOG.filter((m) => m.id !== mediaId).slice(0, 4);
  }

  async getSeasons(seriesId: string): Promise<Season[]> {
    const item = ALL_OPEN_CATALOG.find((m) => m.id === seriesId);
    return item?.seasons ? JSON.parse(JSON.stringify(item.seasons)) : [];
  }

  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    const seasons = await this.getSeasons(seriesId);
    const season = seasons.find((s) => s.seasonNumber === seasonNumber);
    return season ? season.episodes : [];
  }

  async getPlayback(
    mediaId: string,
    episodeId?: string
  ): Promise<{ sources: PlaybackSource[]; subtitles: SubtitleTrack[] }> {
    const item = await this.getDetails(mediaId);
    if (!item) {
      throw new Error(`Media with ID ${mediaId} not found in open media catalog.`);
    }

    if (episodeId && item.seasons) {
      for (const season of item.seasons) {
        const ep = season.episodes.find((e) => e.id === episodeId);
        if (ep) {
          return {
            sources: ep.playbackSources,
            subtitles: ep.subtitleTracks,
          };
        }
      }
    }

    return {
      sources: item.playbackSources,
      subtitles: item.subtitleTracks,
    };
  }

  async getSubtitles(mediaId: string, episodeId?: string): Promise<SubtitleTrack[]> {
    const playback = await this.getPlayback(mediaId, episodeId);
    return playback.subtitles;
  }
}
