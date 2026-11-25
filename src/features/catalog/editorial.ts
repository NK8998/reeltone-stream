import type { Title, TitleKind } from "./types";

type CreditFields = Pick<Title, "year" | "runtime" | "rating" | "language" | "director" | "cast" | "advisory" | "credits">;

type EditorialEpisode = {
  id: string;
  name: string;
  synopsis: string;
  artwork?: string;
  runtime?: number;
};

type EditorialTitle = CreditFields & {
  slug: string;
  name: string;
  kind: TitleKind;
  synopsis: string;
  genres: string[];
  id: string;
  artwork?: string;
  seasons?: { number: number; episodes: EditorialEpisode[] }[];
};

// The source export contains media assets but no title or program metadata.
export const editorial: EditorialTitle[] = [
  {
    slug: "the-quiet-tide",
    name: "The Quiet Tide",
    kind: "movie",
    id: "BOxEbOGta6t",
    year: 2025,
    runtime: 108,
    rating: "PG-13",
    language: "English",
    genres: ["Drama", "Independent"],
    synopsis: "A marine researcher returns to her childhood coast to trace a signal in the sea. As the winter storms close in, the work leads her back to the family she left behind.",
  },
  {
    slug: "northbound",
    name: "Northbound",
    kind: "movie",
    id: "9tVaE75Y2mP",
    year: 2024,
    runtime: 97,
    genres: ["Thriller", "Drama"],
    language: "English",
    synopsis: "With dawn a few hours away, a driver takes a delivery up an isolated mountain road. A stranger at the final stop knows what is in the trunk.",
  },
  {
    slug: "after-the-orbit",
    name: "After the Orbit",
    kind: "documentary",
    id: "Od7PbjTYPJi",
    artwork: "/artwork/Od7PbjTYPJi-alt0.jpg",
    year: 2024,
    runtime: 52,
    genres: ["Science", "Space"],
    language: "English",
    synopsis: "From the first light of a dying star to the weather on distant worlds, a journey through the forces that shape the objects we see in the night sky.",
  },
  {
    slug: "ember-line",
    name: "Ember Line",
    kind: "animation",
    id: "qyCRPfq5dqN",
    year: 2025,
    runtime: 91,
    genres: ["Fantasy", "Adventure"],
    language: "Japanese",
    synopsis: "Two rivals cross a valley where flames remember every promise. When the last safe road closes, each must decide which memory they can afford to lose.",
  },
  {
    slug: "blackwater",
    name: "Blackwater",
    kind: "movie",
    id: "Fg_thw1-uqU",
    artwork: "/artwork/Fg_thw1-uqU-alt1.jpg",
    year: 2024,
    runtime: 114,
    genres: ["Fantasy", "Adventure"],
    synopsis: "An apprentice cartographer follows a river beyond the edge of her map and finds an old kingdom that has spent centuries trying to stay forgotten.",
  },
  {
    slug: "flight-path",
    name: "Flight Path",
    kind: "documentary",
    id: "KEP9F44suKL",
    year: 2024,
    runtime: 49,
    genres: ["Engineering", "Travel"],
    language: "English",
    synopsis: "From the first sketches to a flight at sunrise, follow the engineers, pilots, and ground crews who bring a wide-body aircraft into service.",
  },
  {
    slug: "summer-between-worlds",
    name: "Summer Between Worlds",
    kind: "series",
    id: "6IoJ5awsxE0",
    artwork: "/artwork/6IoJ5awsxE0-alt0.jpg",
    year: 2024,
    genres: ["Animation", "Coming of Age"],
    language: "Japanese",
    synopsis: "During a summer in the countryside, two classmates find a footpath that leads somewhere new each time they take it.",
    seasons: [
      { number: 1, episodes: [
        { id: "6IoJ5awsxE0", name: "The Road Past the Village", runtime: 24, artwork: "/artwork/6IoJ5awsxE0-alt0.jpg", synopsis: "A visit to a remote village takes an unexpected turn when the road home disappears." },
        { id: "9jYSgkCgJZb", name: "Someone at the Window", runtime: 23, artwork: "/artwork/9jYSgkCgJZb-alt1.jpg", synopsis: "A familiar face offers a surprising explanation for the path through the hills." },
      ] },
    ],
  },
  {
    slug: "signal-lost",
    name: "Signal Lost",
    kind: "movie",
    id: "09FzuIegOe1",
    year: 2024,
    runtime: 92,
    genres: ["Science Fiction", "Mystery"],
    synopsis: "An engineer makes contact with an abandoned station, only to find its emergency system has been waiting for her by name.",
  },
  {
    slug: "the-projection-room",
    name: "The Projection Room",
    kind: "documentary",
    id: "MWUgTyw7BkJ",
    year: 2024,
    runtime: 57,
    genres: ["Arts", "Independent"],
    language: "English",
    synopsis: "In the booths of surviving repertory cinemas, projectionists talk about the craft of putting light on a screen and keeping a local film culture alive.",
  },
  {
    slug: "a-minute-of-sun",
    name: "A Minute of Sun",
    kind: "short",
    id: "hfGA5kRN0A7",
    year: 2024,
    runtime: 8,
    genres: ["Drama", "Independent"],
    synopsis: "At the end of a long day, a small exchange between strangers turns into a memory neither expected to keep.",
  },
  {
    slug: "small-worlds",
    name: "Small Worlds",
    kind: "documentary",
    id: "qj4awgAXvz9",
    year: 2024,
    runtime: 43,
    genres: ["Science", "Space"],
    synopsis: "A close look at the rocks and dust that tell the story of the solar system, from the edges of craters to the fragments that fall to Earth.",
  },
  {
    slug: "city-of-echoes",
    name: "City of Echoes",
    kind: "series",
    id: "HLQKrW-rqrf",
    year: 2024,
    genres: ["Animation", "Science Fiction"],
    language: "English",
    synopsis: "A small team searches for the source of a transmission playing through every radio in the city. The message sounds like a recording of tomorrow.",
    seasons: [
      { number: 1, episodes: [
        { id: "HLQKrW-rqrf", name: "The First Echo", runtime: 25, synopsis: "An unexpected signal interrupts the evening commute." },
        { id: "C2o6Fh4wCy5", name: "Frequency Shift", runtime: 24, artwork: "/artwork/C2o6Fh4wCy5-alt1.jpg", synopsis: "A stranger recognizes the voice buried in the transmission." },
      ] },
      { number: 2, episodes: [
        { id: "n0nOWSuZ4UC", name: "An Open Channel", runtime: 26, artwork: "/artwork/n0nOWSuZ4UC-alt1.jpg", synopsis: "The team takes the signal underground and finds that it travels further than they thought." },
      ] },
    ],
  },
  {
    slug: "common-ground",
    name: "Common Ground",
    kind: "short",
    id: "SVvBDHy8JRr",
    artwork: "/artwork/SVvBDHy8JRr-alt1.jpg",
    year: 2024,
    runtime: 13,
    genres: ["Community", "Independent"],
    language: "English",
    synopsis: "A small group of neighbors spends one Saturday gathering supplies for people across town. The journey changes how they see their own neighborhood.",
  },
];
