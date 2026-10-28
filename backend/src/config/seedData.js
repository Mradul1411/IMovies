const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Notification = require('../models/Notification');

const moviesData = [
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    poster: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMjY5YTlhYmYtNjdhNy00YmY5LWExNDMtZGNmOWI1NDAxNTlmXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    genres: ["Sci-Fi", "Action", "Adventure", "Drama"],
    languages: ["English", "Hindi"],
    duration: 166,
    releaseDate: new Date("2024-03-01"),
    rating: 9.2,
    votesCount: 38400,
    formats: ["IMAX 2D", "IMAX 3D", "2D", "4DX"],
    certificate: "U/A",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Zendaya", role: "Chani", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Austin Butler", role: "Feyd-Rautha", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Denis Villeneuve",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Deadpool & Wolverine",
    description: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy in a high-octane multiversal romp filled with humor, adrenaline, and chaos.",
    poster: "https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGY1LThiYzItZThiNjFiNDM4MTM3XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BZmRmMWY3NTgtMTNiNy00MjM2LWI3ZmUtM2Y1MDlhZGVhYTVjXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=73_1biulkYk",
    genres: ["Action", "Comedy", "Sci-Fi"],
    languages: ["English", "Hindi", "Telugu"],
    duration: 128,
    releaseDate: new Date("2024-07-26"),
    rating: 8.9,
    votesCount: 42100,
    formats: ["3D", "IMAX 3D", "2D", "4DX"],
    certificate: "A",
    cast: [
      { name: "Ryan Reynolds", role: "Wade Wilson / Deadpool", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Hugh Jackman", role: "Logan / Wolverine", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
      { name: "Emma Corrin", role: "Cassandra Nova", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Shawn Levy",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Kalki 2898 AD",
    description: "A modern avatar of the Hindu god Vishnu, who is believed to have descended to earth in the dystopian city of Kasi in the year 2898 AD to protect the world from evil forces in a high-tech battle for humanity.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTM3ZGUwYTEtZTI5NS00ZmMyLTk2YmQtMWU4YjlhZTI3NjRjXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BYzA4ZWVjYjEtMGJmYi00YjBhLTkxY2YtNmRjYWEwMWVmMGYyXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=kQDd1AhGIHk",
    genres: ["Sci-Fi", "Action", "Mythology"],
    languages: ["Telugu", "Hindi", "Tamil", "English"],
    duration: 181,
    releaseDate: new Date("2024-06-27"),
    rating: 8.7,
    votesCount: 51200,
    formats: ["IMAX 3D", "3D", "2D"],
    certificate: "U/A",
    cast: [
      { name: "Prabhas", role: "Bhairava", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Amitabh Bachchan", role: "Ashwatthama", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
      { name: "Deepika Padukone", role: "SUM-80", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Kamal Haasan", role: "Supreme Yaskin", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Nag Ashwin",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Pushpa 2: The Rule",
    description: "The clash between Pushpa Raj and SP Bhanwar Singh Shekhawat escalates into an all-out war for supremacy. Pushpa expands his red sandalwood empire while navigating political and law enforcement crosshairs.",
    poster: "https://m.media-amazon.com/images/M/MV5BNDM3N2UzM2UtMjEwMC00NGUzLThmMmQtNGMyM2VmMDA0ZWEwXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BNDM3N2UzM2UtMjEwMC00NGUzLThmMmQtNGMyM2VmMDA0ZWEwXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=1kVK0MZlbI4",
    genres: ["Action", "Crime", "Thriller", "Drama"],
    languages: ["Telugu", "Hindi", "Tamil", "Malayalam"],
    duration: 175,
    releaseDate: new Date("2024-12-05"),
    rating: 9.3,
    votesCount: 78500,
    formats: ["2D", "IMAX 2D", "4DX"],
    certificate: "A",
    cast: [
      { name: "Allu Arjun", role: "Pushpa Raj", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Rashmika Mandanna", role: "Srivalli", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Fahadh Faasil", role: "Bhanwar Singh Shekhawat", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Sukumar",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Spider-Man: Beyond the Spider-Verse",
    description: "Miles Morales journeys across the multiverse to rescue his alternate self and reunite with Gwen Stacy, confronting the ultimate destiny of what it truly means to be Spider-Man.",
    poster: "https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ZmJhLWEwN2EtOTBlYTA4Y2E0M2ZmXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BNDYzNmE4YTUtMDM1NC00YWE0LWFmMDItZDg1MDdiNWYzNTFkXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    genres: ["Animation", "Action", "Sci-Fi", "Adventure"],
    languages: ["English", "Hindi", "Tamil"],
    duration: 140,
    releaseDate: new Date("2025-03-29"),
    rating: 9.4,
    votesCount: 56000,
    formats: ["IMAX 3D", "3D", "2D", "4DX"],
    certificate: "U/A",
    cast: [
      { name: "Shameik Moore", role: "Miles Morales", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Hailee Steinfeld", role: "Gwen Stacy", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Oscar Isaac", role: "Miguel O'Hara", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Joaquim Dos Santos",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Avatar: Fire and Ash",
    description: "Jake Sully and Neytiri encounter the Ash People, a volcanic clan of Na'vi who demonstrate a darker side to Pandora's balance, plunging the planet into unprecedented peril.",
    poster: "https://m.media-amazon.com/images/M/MV5BNWI0Y2NkOWEtMmM2OC00MjQ3LWI1YzItZGQxYzQ3NzI4NWZmXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BYzc3M2Q0MWItMWRkMS00OGQ3LWIwY2EtOGNmNDg5NzA1OTk0XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    genres: ["Sci-Fi", "Action", "Adventure", "Fantasy"],
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    duration: 192,
    releaseDate: new Date("2025-12-19"),
    rating: 9.1,
    votesCount: 47000,
    formats: ["IMAX 3D", "3D", "4DX", "2D"],
    certificate: "U/A",
    cast: [
      { name: "Sam Worthington", role: "Jake Sully", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Zoe Saldana", role: "Neytiri", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Sigourney Weaver", role: "Kiri", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "James Cameron",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Interstellar",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans through an uncharted wormhole.",
    poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMjIxNTU4MzY4MF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    languages: ["English", "Hindi"],
    duration: 169,
    releaseDate: new Date("2014-11-07"),
    rating: 9.4,
    votesCount: 65000,
    formats: ["IMAX 2D", "2D"],
    certificate: "U/A",
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Anne Hathaway", role: "Brand", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Jessica Chastain", role: "Murph", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Christopher Nolan",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Gladiator II",
    description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
    poster: "https://m.media-amazon.com/images/M/MV5BMWYzZTM5ZGQtOGE5My00NmM2LWFlMDEtMGNjYjdmOWM1MzA1XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BNTNkM2I3NzEtMjJjOC00N2IxLWJiMjItMWFjYmFkMjA4NmY4XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo",
    genres: ["Action", "Adventure", "Drama"],
    languages: ["English", "Hindi"],
    duration: 148,
    releaseDate: new Date("2024-11-15"),
    rating: 8.6,
    votesCount: 22400,
    formats: ["IMAX 2D", "2D", "4DX"],
    certificate: "A",
    cast: [
      { name: "Paul Mescal", role: "Lucius", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Pedro Pascal", role: "General Acacius", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
      { name: "Denzel Washington", role: "Macrinus", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Ridley Scott",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Stree 2: Sarkate Ka Aatank",
    description: "The town of Chanderi is being haunted again! This time by a headless entity named 'Sarkata' who is abducting independent women. Vicky and his loyal gang must unite with the mysterious Stree to defeat the terrifying evil.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTA1NmUxYzItZmVmNy00YmQxLTk4Y2UtZjVkMWUwMWQ5N2IxXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMTA1NmUxYzItZmVmNy00YmQxLTk4Y2UtZjVkMWUwMWQ5N2IxXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=KVnhe4xQ_54",
    genres: ["Comedy", "Horror"],
    languages: ["Hindi"],
    duration: 147,
    releaseDate: new Date("2024-08-15"),
    rating: 8.8,
    votesCount: 46700,
    formats: ["2D"],
    certificate: "U/A",
    cast: [
      { name: "Rajkummar Rao", role: "Vicky", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Shraddha Kapoor", role: "The Girl", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Pankaj Tripathi", role: "Rudra", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Amar Kaushik",
    isFeatured: false,
    isActive: true
  },
  {
    title: "The Batman: Part II",
    description: "Batman ventures deeper into the criminal underworld of Gotham City to unravel a conspiracy reaching into the city's highest corridors of power while facing ruthless new adversaries.",
    poster: "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BYTFiYjc4ZDYtM2FhNi00NGQ2LTgxNWUtN2E3NzdmOTBhMmkwXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    genres: ["Action", "Crime", "Mystery", "Thriller"],
    languages: ["English", "Hindi"],
    duration: 165,
    releaseDate: new Date("2026-10-02"),
    rating: 9.0,
    votesCount: 39500,
    formats: ["IMAX 2D", "2D"],
    certificate: "A",
    cast: [
      { name: "Robert Pattinson", role: "Bruce Wayne / Batman", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Zoë Kravitz", role: "Selina Kyle / Catwoman", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Colin Farrell", role: "Oswald Cobblepot / Penguin", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Matt Reeves",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Leo: Bloody Sweet",
    description: "A mild-mannered café owner in Kashmir becomes a local hero after thwarting an armed attack, but his sudden fame attracts violent cartel bosses who claim he was once their deadliest enforcer.",
    poster: "https://m.media-amazon.com/images/M/MV5BZTE3NmFjMGItZjliMy00ZDEwLTk2MDMtZmZiYTBjMDJjODI3XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BZTE3NmFjMGItZjliMy00ZDEwLTk2MDMtZmZiYTBjMDJjODI3XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Po3jStA673E",
    genres: ["Action", "Thriller", "Crime"],
    languages: ["Tamil", "Telugu", "Hindi", "Malayalam"],
    duration: 164,
    releaseDate: new Date("2023-10-19"),
    rating: 8.6,
    votesCount: 61000,
    formats: ["2D", "IMAX 2D"],
    certificate: "A",
    cast: [
      { name: "Thalapathy Vijay", role: "Parthiban / Leo Das", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Trisha Krishnan", role: "Sathya", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Sanjay Dutt", role: "Antony Das", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Lokesh Kanagaraj",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Kung Fu Panda 4",
    description: "Po must train a new Dragon Warrior before assuming the mantle of Spiritual Leader of the Valley of Peace, but a wicked shape-shifting sorceress named Chameleon threatens everything.",
    poster: "https://m.media-amazon.com/images/M/MV5BMzJlNGYxYzQtOTg4MC00OTMyLTkwYzMtZDRlNTgwY2YwOWYxXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BN2ZkYmViMTgtZTc5YS00YWI0LWI1YjgtZmQ5NmVmMWRlNmIyXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=_inKs4eeHiI",
    genres: ["Animation", "Action", "Adventure", "Comedy"],
    languages: ["English", "Hindi"],
    duration: 94,
    releaseDate: new Date("2024-03-08"),
    rating: 8.4,
    votesCount: 31000,
    formats: ["3D", "2D"],
    certificate: "U",
    cast: [
      { name: "Jack Black", role: "Po (Voice)", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Awkwafina", role: "Zhen (Voice)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Mike Mitchell",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Bhool Bhulaiyaa 3",
    description: "Ruhaan, known as Rooh Baba, is hired to perform an exorcism at an ancient palace in West Bengal. Things spiral wildly out of hand when two terrifying spirits claim to be the real Manjulika.",
    poster: "https://m.media-amazon.com/images/M/MV5BMGFhMDQ4MzMtMTUxOC00NDE0LTkzZWMtMzhhMGNiMDlhNDNmXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMGFhMDQ4MzMtMTUxOC00NDE0LTkzZWMtMzhhMGNiMDlhNDNmXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=p3392k_r6s8",
    genres: ["Comedy", "Horror"],
    languages: ["Hindi"],
    duration: 158,
    releaseDate: new Date("2024-11-01"),
    rating: 8.5,
    votesCount: 42000,
    formats: ["2D"],
    certificate: "U/A",
    cast: [
      { name: "Kartik Aaryan", role: "Ruhaan / Rooh Baba", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Vidya Balan", role: "Mallika / Manjulika", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Madhuri Dixit", role: "Mandira", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Anees Bazmee",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Jawan",
    description: "A high-octane emotional action thriller outlining the journey of a man who is set out to correct the wrongs in society against a backdrop of justice, rebellion, and fatherly love.",
    poster: "https://m.media-amazon.com/images/M/MV5BMGExNGI1NDktOWI2Mi00NDM3LWIxMmQtNTQxYTgzMzI0MTA1XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMTY3NTY0MTk3N15BMl5BanBnXkFtZTgwNTU5NTA3MjE@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=MWOlnZSnXJo",
    genres: ["Action", "Thriller"],
    languages: ["Hindi", "Tamil", "Telugu"],
    duration: 169,
    releaseDate: new Date("2023-09-07"),
    rating: 8.4,
    votesCount: 89000,
    formats: ["2D", "IMAX 2D", "4DX"],
    certificate: "U/A",
    cast: [
      { name: "Shah Rukh Khan", role: "Vikram Rathore / Azad", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Nayanthara", role: "Narmada Rai", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Vijay Sethupathi", role: "Kaalie Gaikwad", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Atlee",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Salaar: Part 1 – Ceasefire",
    description: "In the violent and lawless city-state of Khansaar, a hardened mercenary must uphold a blood-soaked promise to defend his exiled childhood friend who returns to claim his rightful throne.",
    poster: "https://m.media-amazon.com/images/M/MV5BYzU2MzZiOTEtZTgwOS00MTdlLWJmMDQtNjdjOGIxYTA0NTYxXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BYzU2MzZiOTEtZTgwOS00MTdlLWJmMDQtNjdjOGIxYTA0NTYxXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=4GPvYMKtrtI",
    genres: ["Action", "Crime", "Drama"],
    languages: ["Telugu", "Hindi", "Tamil", "Malayalam", "Kannada"],
    duration: 175,
    releaseDate: new Date("2023-12-22"),
    rating: 8.7,
    votesCount: 74000,
    formats: ["2D", "IMAX 2D"],
    certificate: "A",
    cast: [
      { name: "Prabhas", role: "Deva / Salaar", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Prithviraj Sukumaran", role: "Varadharaja Mannaar", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
      { name: "Shruti Haasan", role: "Aadhya", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Prashanth Neel",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his historic role in the development of the atomic bomb during the Manhattan Project, forever altering the destiny of human civilization.",
    poster: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    genres: ["Biography", "Drama", "History"],
    languages: ["English", "Hindi"],
    duration: 180,
    releaseDate: new Date("2023-07-21"),
    rating: 9.3,
    votesCount: 95000,
    formats: ["IMAX 2D", "2D"],
    certificate: "A",
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Emily Blunt", role: "Kitty Oppenheimer", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Christopher Nolan",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Animal",
    description: "A fiercely obsessive son learns about an assassination attempt on his distant father, embarking on a merciless, blood-soaked path of vengeance against underworld syndicates.",
    poster: "https://m.media-amazon.com/images/M/MV5BZThmNDg1NjUtNWJhMC00YjA3LWJiMjItNmM4ZDQ5ZGZiN2Y2XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BZThmNDg1NjUtNWJhMC00YjA3LWJiMjItNmM4ZDQ5ZGZiN2Y2XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Dydmpfo68DA",
    genres: ["Action", "Crime", "Drama"],
    languages: ["Hindi", "Telugu", "Tamil"],
    duration: 201,
    releaseDate: new Date("2023-12-01"),
    rating: 8.5,
    votesCount: 67000,
    formats: ["2D"],
    certificate: "A",
    cast: [
      { name: "Ranbir Kapoor", role: "Ranvijay Singh / Aziz", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Anil Kapoor", role: "Balbir Singh", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
      { name: "Bobby Deol", role: "Abrar Haque", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Sandeep Reddy Vanga",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Fighter",
    description: "Top Indian Air Force aviators come together to form the elite Air Dragons unit, facing intense combat missions, national peril, and personal sacrifices in high-altitude dogfights.",
    poster: "https://m.media-amazon.com/images/M/MV5BMzlmOGU5MDYtODVhZC00ZGEzLThjNmEtNTgyYjQ2ZTQwNWYzXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMzlmOGU5MDYtODVhZC00ZGEzLThjNmEtNTgyYjQ2ZTQwNWYzXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6amIq_mP4xM",
    genres: ["Action", "Thriller", "War"],
    languages: ["Hindi"],
    duration: 166,
    releaseDate: new Date("2024-01-25"),
    rating: 8.3,
    votesCount: 34000,
    formats: ["3D", "IMAX 3D", "2D"],
    certificate: "U/A",
    cast: [
      { name: "Hrithik Roshan", role: "Squadron Leader Shamsher Pathania", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Deepika Padukone", role: "Squadron Leader Minal Rathore", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Anil Kapoor", role: "Group Captain Rakesh Jai Singh", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Siddharth Anand",
    isFeatured: false,
    isActive: true
  },
  {
    title: "RRR: Rise Roar Revolt",
    description: "A fearless revolutionary and an upright British-Indian officer forge a legendary brotherhood before discovering each other's secret identities in 1920s colonial India.",
    poster: "https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=NgBoAM8d30Q",
    genres: ["Action", "Drama", "History"],
    languages: ["Telugu", "Hindi", "Tamil", "Malayalam"],
    duration: 187,
    releaseDate: new Date("2022-03-25"),
    rating: 9.2,
    votesCount: 98000,
    formats: ["IMAX 3D", "3D", "2D"],
    certificate: "U/A",
    cast: [
      { name: "N. T. Rama Rao Jr.", role: "Komaram Bheem", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Ram Charan", role: "Alluri Sitarama Raju", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Alia Bhatt", role: "Sita", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "S. S. Rajamouli",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Demon Slayer: Infinity Castle",
    description: "Tanjiro Kamado, the Hashira, and the Demon Slayer Corps are drawn directly into Muzan Kibutsuji's reality-bending Infinity Castle for the definitive war for humanity.",
    poster: "https://m.media-amazon.com/images/M/MV5BZDhhYzIxMDEtZmNlMi00YjBiLTg5OGYtMDRkMjRkYjA3OTRhXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BZDhhYzIxMDEtZmNlMi00YjBiLTg5OGYtMDRkMjRkYjA3OTRhXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=0kQ8wZZb2eU",
    genres: ["Animation", "Action", "Fantasy"],
    languages: ["Japanese", "English", "Hindi"],
    duration: 135,
    releaseDate: new Date("2025-05-15"),
    rating: 9.5,
    votesCount: 52000,
    formats: ["IMAX 2D", "2D", "4DX"],
    certificate: "U/A",
    cast: [
      { name: "Natsuki Hanae", role: "Tanjiro Kamado", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Akari Kito", role: "Nezuko Kamado", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Hiro Shimono", role: "Zenitsu Agatsuma", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Haruo Sotozaki",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Devara: Part 1",
    description: "Set in a rugged coastal realm, a fearless chieftain battles internal corruption, sea pirates, and perilous conspiracies to safeguard his clan's honor and destiny.",
    poster: "https://m.media-amazon.com/images/M/MV5BYmI5NTljYWItMDhjMC00NDQwLWFhMjQtNWNjNDYzYzkwNGQ0XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BYmI5NTljYWItMDhjMC00NDQwLWFhMjQtNWNjNDYzYzkwNGQ0XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=LmrEaH_0f5g",
    genres: ["Action", "Drama", "Thriller"],
    languages: ["Telugu", "Hindi", "Tamil", "Malayalam", "Kannada"],
    duration: 178,
    releaseDate: new Date("2024-09-27"),
    rating: 8.6,
    votesCount: 44000,
    formats: ["2D", "IMAX 2D", "4DX"],
    certificate: "U/A",
    cast: [
      { name: "N. T. Rama Rao Jr.", role: "Devara / Vara", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Janhvi Kapoor", role: "Thangam", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Saif Ali Khan", role: "Bhaira", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Koratala Siva",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Inside Out 2",
    description: "Joy, Sadness, Anger, Fear, and Disgust must navigate headquarters as teenager Riley welcomes new emotions, led by the neurotic and ambitious Anxiety.",
    poster: "https://m.media-amazon.com/images/M/MV5BYWY3MDE2Y2UtOTE3Zi00MGUzLTg2MTItZjE1ZWVkMGVlODRmXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BOGJmMGNhYmEtZjcwNi00MTQxLWEwNWMtZTZkYTlhZDU5NGE4XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=LEjhY15eCx0",
    genres: ["Animation", "Adventure", "Comedy"],
    languages: ["English", "Hindi"],
    duration: 96,
    releaseDate: new Date("2024-06-14"),
    rating: 8.9,
    votesCount: 41000,
    formats: ["3D", "2D"],
    certificate: "U",
    cast: [
      { name: "Amy Poehler", role: "Joy (Voice)", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Maya Hawke", role: "Anxiety (Voice)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Kelsey Mann",
    isFeatured: false,
    isActive: true
  },
  {
    title: "12th Fail",
    description: "Based on the inspiring true story of IPS officer Manoj Kumar Sharma, who rose from extreme poverty and Chambal dacoity terrain to conquer the world's toughest UPSC exam.",
    poster: "https://m.media-amazon.com/images/M/MV5BNTE3OTIxZDYtNjA0NC00N2YxLTg1NGQtOTYxNmZkMDkwOWNjXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BNTE3OTIxZDYtNjA0NC00N2YxLTg1NGQtOTYxNmZkMDkwOWNjXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=weS8A3_q8g0",
    genres: ["Biography", "Drama"],
    languages: ["Hindi", "Tamil", "Telugu"],
    duration: 147,
    releaseDate: new Date("2023-10-27"),
    rating: 9.3,
    votesCount: 86000,
    formats: ["2D"],
    certificate: "U",
    cast: [
      { name: "Vikrant Massey", role: "Manoj Kumar Sharma", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Medha Shankr", role: "Shraddha Joshi", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Vidhu Vinod Chopra",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Kantara: A Legend Chapter 1",
    description: "An ancient divine folklore saga exploring the sacred origins of the demigods Panjurli and Guliga, and the primeval conflict between nature, divine justice, and mortal arrogance.",
    poster: "https://m.media-amazon.com/images/M/MV5BY2VkZjk5ZjMtM2ExOS00ZDA1LTg1ZDEtYTliNGZiYTc4ZWZiXkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BY2VkZjk5ZjMtM2ExOS00ZDA1LTg1ZDEtYTliNGZiYTc4ZWZiXkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=i9Y1kO69s1M",
    genres: ["Action", "Drama", "Thriller", "Mythology"],
    languages: ["Kannada", "Hindi", "Telugu", "Tamil", "Malayalam"],
    duration: 155,
    releaseDate: new Date("2025-10-02"),
    rating: 9.1,
    votesCount: 59000,
    formats: ["2D", "IMAX 2D"],
    certificate: "U/A",
    cast: [
      { name: "Rishab Shetty", role: "Shiva / Demigod", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Sapthami Gowda", role: "Leela", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Rishab Shetty",
    isFeatured: false,
    isActive: true
  },
  {
    title: "Mission: Impossible – The Final Reckoning",
    description: "Ethan Hunt and his IMF team embark on their most dangerous mission yet, hunting the mysterious AI known as The Entity across the globe before it gains control of world superpowers.",
    poster: "https://m.media-amazon.com/images/M/MV5BN2U4OTdmM2QtZTkxYy00ZmQyLTg2N2UtMDdmMGJmNDhlZDU1XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BZDU1ODAyM2MtYmU4OC00ZTY0LTk0MWQtOWE0N2M2OGZhMjY2XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=NOhDyUmT9z0",
    genres: ["Action", "Adventure", "Thriller"],
    languages: ["English", "Hindi"],
    duration: 168,
    releaseDate: new Date("2025-05-23"),
    rating: 9.0,
    votesCount: 48000,
    formats: ["IMAX 2D", "2D", "4DX"],
    certificate: "U/A",
    cast: [
      { name: "Tom Cruise", role: "Ethan Hunt", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Hayley Atwell", role: "Grace", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Simon Pegg", role: "Benji Dunn", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Christopher McQuarrie",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Manjummel Boys",
    description: "A group of adventurous friends from Kochi visit the Guna Caves in Kodaikanal, where an unexpected tragedy tests the limits of courage, human brotherhood, and survival.",
    poster: "https://m.media-amazon.com/images/M/MV5BMDVkOGEzZDgtYWU4Yi00MDA3LWE4YmQtYjQxNDgwNDYxNGU4XkEyXkFqcGc@._V1_SX800.jpg",
    banner: "https://m.media-amazon.com/images/M/MV5BMDVkOGEzZDgtYWU4Yi00MDA3LWE4YmQtYjQxNDgwNDYxNGU4XkEyXkFqcGc@._V1_SX1600.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=kYJmI4H9mN8",
    genres: ["Adventure", "Drama", "Thriller"],
    languages: ["Malayalam", "Tamil", "Telugu", "Hindi"],
    duration: 135,
    releaseDate: new Date("2024-02-22"),
    rating: 8.9,
    votesCount: 38000,
    formats: ["2D"],
    certificate: "U",
    cast: [
      { name: "Soubin Shahir", role: "Kuttan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Sreenath Bhasi", role: "Subhash", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    director: "Chidambaram",
    isFeatured: false,
    isActive: true
  }
];

const theatresData = [
  // ----------------- MUMBAI (6) -----------------
  {
    name: "PVR INOX: Phoenix Palladium",
    chain: "PVR INOX",
    city: "Mumbai",
    address: "Level 3, High Street Phoenix, 462, Senapati Bapat Marg, Lower Parel",
    amenities: ["Dolby Atmos", "Laser Projection", "Recliner Seats", "Valet Parking", "Food Lounge", "Wheelchair Accessible"],
    screens: [
      { screenNumber: 1, name: "Audi 1 - IMAX Laser", format: "IMAX 3D", seatCapacity: 96 },
      { screenNumber: 2, name: "Audi 2 - P[XL] Atmos", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Cinépolis: Viviana Mall",
    chain: "Cinepolis",
    city: "Mumbai",
    address: "2nd Floor, Viviana Mall, Eastern Express Highway, Thane West",
    amenities: ["4DX", "Dolby 7.1", "Gourmet Concessions", "VIP Lounge", "Parking"],
    screens: [
      { screenNumber: 1, name: "Screen 1 - 4DX", format: "4DX", seatCapacity: 96 },
      { screenNumber: 2, name: "Screen 2 - VIP", format: "3D", seatCapacity: 96 }
    ]
  },
  {
    name: "INOX: Megaplex, Inorbit Mall",
    chain: "PVR INOX",
    city: "Mumbai",
    address: "Link Road, Malad West",
    amenities: ["IMAX with Laser", "Dolby Atmos", "MX4D", "Insignia Gourmet", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Audi 1 - Insignia", format: "2D", seatCapacity: 96 },
      { screenNumber: 2, name: "Audi 2 - IMAX", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Maison INOX: Jio World Drive",
    chain: "PVR INOX",
    city: "Mumbai",
    address: "Bandra Kurla Complex, Bandra East",
    amenities: ["IMAX Laser", "Luxe Suites", "Rooftop Open Air", "Dolby Atmos", "Chef Curated Dining"],
    screens: [
      { screenNumber: 1, name: "Luxe Screen 1", format: "IMAX 2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Carnival IMAX: Wadala",
    chain: "Carnival",
    city: "Mumbai",
    address: "Bhakti Park, Anik Wadala Link Road, Wadala East",
    amenities: ["Dome IMAX Screen", "Dolby Digital", "Food Court", "Ample Parking"],
    screens: [
      { screenNumber: 1, name: "Grand Dome Screen", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Dynamix Mall: Juhu",
    chain: "PVR INOX",
    city: "Mumbai",
    address: "Gulmohar Cross Road 9, JVPD Scheme, Juhu",
    amenities: ["Dolby Atmos", "Gold Class Recliners", "Bollywood Premiere Lounge"],
    screens: [
      { screenNumber: 1, name: "Gold Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- DELHI-NCR (6) -----------------
  {
    name: "PVR Director's Cut: Ambience Mall",
    chain: "PVR",
    city: "Delhi-NCR",
    address: "3rd Floor, Ambience Mall, Nelson Mandela Marg, Vasant Kunj",
    amenities: ["Ultra Luxury Recliners", "In-seat Dining", "Dolby Atmos", "Concierge Service", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Director's Lounge 1", format: "2D", seatCapacity: 96 },
      { screenNumber: 2, name: "Director's Lounge 2", format: "3D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Superplex: Mall of India",
    chain: "PVR INOX",
    city: "Delhi-NCR",
    address: "Sector 18, Noida, Uttar Pradesh",
    amenities: ["IMAX with Laser", "4DX", "Gold Class", "Dolby Atmos", "Playhouse"],
    screens: [
      { screenNumber: 1, name: "IMAX Hall 1", format: "IMAX 3D", seatCapacity: 96 },
      { screenNumber: 2, name: "Audi 2 - Atmos", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Cinépolis: DLF Avenue, Saket",
    chain: "Cinepolis",
    city: "Delhi-NCR",
    address: "DLF Avenue Mall, Press Enclave Road, Saket",
    amenities: ["Macro XE", "Dolby Atmos", "VIP Club", "Gourmet Popcorn"],
    screens: [
      { screenNumber: 1, name: "Macro XE Hall", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Plaza: Connaught Place",
    chain: "PVR INOX",
    city: "Delhi-NCR",
    address: "H-Block, Connaught Circus, New Delhi",
    amenities: ["Heritage Architecture", "Dolby Atmos", "4K Laser Projection", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Plaza Heritage Hall", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Vegas Mall: Dwarka",
    chain: "PVR INOX",
    city: "Delhi-NCR",
    address: "Sector 14, Dwarka, New Delhi",
    amenities: ["12-Screen Megaplex", "IMAX Laser", "4DX", "Luxe", "Playhouse for Kids"],
    screens: [
      { screenNumber: 1, name: "Screen 1 - IMAX", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },
  {
    name: "INOX Insignia: Nehru Place",
    chain: "PVR INOX",
    city: "Delhi-NCR",
    address: "Epicuria Food Mall, Nehru Place Metro Station, New Delhi",
    amenities: ["Ultra Luxury Insignia", "Dolby Atmos", "Five-Star Gourmet Dining"],
    screens: [
      { screenNumber: 1, name: "Insignia Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- BENGALURU (5) -----------------
  {
    name: "PVR: Forum South Bangalore",
    chain: "PVR INOX",
    city: "Bengaluru",
    address: "Konanakunte Cross, Kanakapura Road",
    amenities: ["IMAX with Laser", "Dolby Atmos", "Recliners", "Food Court", "Parking"],
    screens: [
      { screenNumber: 1, name: "IMAX Laser Hall", format: "IMAX 3D", seatCapacity: 96 },
      { screenNumber: 2, name: "Audi 2", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "INOX: Garuda Mall, Magrath Road",
    chain: "PVR INOX",
    city: "Bengaluru",
    address: "Magrath Road, Ashok Nagar",
    amenities: ["Dolby Atmos", "Insignia", "Laser Projection", "Parking"],
    screens: [
      { screenNumber: 1, name: "Audi 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Orion Mall: Brigade Gateway",
    chain: "PVR INOX",
    city: "Bengaluru",
    address: "Dr Rajkumar Road, Rajajinagar",
    amenities: ["P[XL] Large Screen", "Dolby Atmos", "Gold Class", "Lakeside Promenade"],
    screens: [
      { screenNumber: 1, name: "P[XL] Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Cinépolis: Nexus Shantiniketan",
    chain: "Cinepolis",
    city: "Bengaluru",
    address: "Thigalarapalya, Hoodi, Whitefield",
    amenities: ["Macro XE", "VIP Recliner", "Dolby 7.1", "Coffee House"],
    screens: [
      { screenNumber: 1, name: "Macro XE Hall", format: "3D", seatCapacity: 96 }
    ]
  },
  {
    name: "INOX: Mantri Square, Malleswaram",
    chain: "PVR INOX",
    city: "Bengaluru",
    address: "Sampige Road, Malleswaram",
    amenities: ["Laser Projection", "Dolby Atmos", "Food Lounge", "Direct Metro Access"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- HYDERABAD (5) -----------------
  {
    name: "Prasads Multiplex: Necklace Road",
    chain: "Prasads",
    city: "Hyderabad",
    address: "NTR Gardens, Khairatabad, Necklace Road",
    amenities: ["Giant Screen", "Dolby Atmos", "Gaming Zone", "Food Court", "Spacious Parking"],
    screens: [
      { screenNumber: 1, name: "Prasads Large Screen", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR: Inorbit Mall, Cyberabad",
    chain: "PVR INOX",
    city: "Hyderabad",
    address: "Inorbit Mall, Mindspace, Hitec City",
    amenities: ["4DX", "Dolby Atmos", "Recliners", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Audi 1 - 4DX", format: "4DX", seatCapacity: 96 }
    ]
  },
  {
    name: "AMB Cinemas: Gachibowli",
    chain: "AMB",
    city: "Hyderabad",
    address: "Sarath City Capital Mall, Gachibowli - Miyapur Road, Kondapur",
    amenities: ["Laser Dolby Atmos", "VIP M-Lounge", "Super Luxury Recliners", "Curated Concessions"],
    screens: [
      { screenNumber: 1, name: "Screen 1 - AMB Laser", format: "IMAX 2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Cinépolis: DSL Virtue Mall, Uppal",
    chain: "Cinepolis",
    city: "Hyderabad",
    address: "Industrial Development Area, Uppal",
    amenities: ["Dolby Atmos", "RealD 3D", "VIP Lounge", "Food Court"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Miraj Cinemas: Shalini Shivani",
    chain: "Miraj",
    city: "Hyderabad",
    address: "Chaitanyapuri Main Road, Kothapet",
    amenities: ["Dolby 7.1", "Plush Pushback Chairs", "Affordable Concessions"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- CHENNAI (5) -----------------
  {
    name: "SPI Cinemas: Sathyam, Royapettah",
    chain: "PVR INOX",
    city: "Chennai",
    address: "8, Thiru-vi-ka Road, Royapettah",
    amenities: ["Dolby Atmos", "RDX 4K", "Famous Popcorn & Seasonings", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Sathyam Main Screen", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "SPI Cinemas: Palazzo, Nexus Vijaya Mall",
    chain: "PVR INOX",
    city: "Chennai",
    address: "182, Arcot Road, Vadapalani",
    amenities: ["Palatial Italian Architecture", "IMAX with Laser", "Dolby Atmos", "Gourmet Kitchen"],
    screens: [
      { screenNumber: 1, name: "Palazzo IMAX", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },
  {
    name: "AGS Cinemas: OMR Navallur",
    chain: "AGS",
    city: "Chennai",
    address: "OMR IT Highway, Navallur",
    amenities: ["Barco 4K Laser", "Dolby Atmos", "Stadium Seating", "Food Court"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR Grand Mall: Velachery",
    chain: "PVR INOX",
    city: "Chennai",
    address: "137, Velachery - Tambaram Main Road, Velachery",
    amenities: ["4DX", "Dolby 7.1", "Luxury Recliners", "Ample Parking"],
    screens: [
      { screenNumber: 1, name: "Screen 1 - 4DX", format: "4DX", seatCapacity: 96 }
    ]
  },
  {
    name: "Vettri Theatres: Chromepet",
    chain: "Independent",
    city: "Chennai",
    address: "522, GST Road, Chromepet",
    amenities: ["RGB Laser Projection", "Dolby Atmos", "Fan Frenzy Destination", "Affordable Snacks"],
    screens: [
      { screenNumber: 1, name: "Vettri Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- KOLKATA (3) -----------------
  {
    name: "PVR INOX: South City Mall",
    chain: "PVR INOX",
    city: "Kolkata",
    address: "375, Prince Anwar Shah Road, South City Complex",
    amenities: ["IMAX Laser", "Dolby Atmos", "Insignia Recliners", "Food Lounge"],
    screens: [
      { screenNumber: 1, name: "IMAX Hall 1", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },
  {
    name: "INOX: Quest Mall, Park Circus",
    chain: "PVR INOX",
    city: "Kolkata",
    address: "33, Syed Amir Ali Avenue, Park Circus",
    amenities: ["Insignia Seven Star", "Dolby Atmos", "Chef Curated Kitchen", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Insignia Screen", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Miraj Cinemas: Salt Lake",
    chain: "Miraj",
    city: "Kolkata",
    address: "Block EP & GP, Sector V, Bidhannagar, Salt Lake",
    amenities: ["Laser 4K", "Dolby 7.1", "Tech Hub Favorite", "Cozy Seating"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- PUNE (3) -----------------
  {
    name: "Cinépolis: Westend Mall, Aundh",
    chain: "Cinepolis",
    city: "Pune",
    address: "Westend Mall, Harmony Society, Ward 8, Aundh",
    amenities: ["VIP Recliner", "Dolby Atmos", "4K Projection", "Gourmet Cafe"],
    screens: [
      { screenNumber: 1, name: "VIP Hall 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "PVR: Phoenix Marketcity, Viman Nagar",
    chain: "PVR INOX",
    city: "Pune",
    address: "S. No. 207, Viman Nagar Road, Clover Park",
    amenities: ["IMAX with Laser", "4DX", "Dolby Atmos", "Gold Class", "Extensive Food Court"],
    screens: [
      { screenNumber: 1, name: "Screen 1 - IMAX", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },
  {
    name: "INOX: Bund Garden, Camp",
    chain: "PVR INOX",
    city: "Pune",
    address: "Hermes Waves, Kalyani Nagar / Bund Garden Road, Camp",
    amenities: ["Dolby 7.1", "Laser Projection", "Central Location"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- AHMEDABAD (2) -----------------
  {
    name: "PVR INOX: Acropolis Mall",
    chain: "PVR INOX",
    city: "Ahmedabad",
    address: "Thaltej Cross Road, SG Highway",
    amenities: ["Laser Projection", "Dolby 7.1", "Luxury Seating", "Food Court"],
    screens: [
      { screenNumber: 1, name: "Audi 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Cinépolis: Ahmedabad One Mall",
    chain: "Cinepolis",
    city: "Ahmedabad",
    address: "Near Vastrapur Lake, Vastrapur",
    amenities: ["Macro XE", "Dolby Atmos", "VIP Lounge", "Gourmet Popcorn"],
    screens: [
      { screenNumber: 1, name: "Macro XE Hall", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- JAIPUR (2) -----------------
  {
    name: "INOX: Crystal Palm, C-Scheme",
    chain: "PVR INOX",
    city: "Jaipur",
    address: "Sahkar Marg, C-Scheme, 22 Godam Circle",
    amenities: ["Dolby Atmos", "Insignia Recliners", "4K Projection"],
    screens: [
      { screenNumber: 1, name: "Audi 1", format: "2D", seatCapacity: 96 }
    ]
  },
  {
    name: "Raj Mandir Cinema: Bhagwan Das Road",
    chain: "Heritage Independent",
    city: "Jaipur",
    address: "Bhagwan Das Road, Panch Batti, Ashok Nagar",
    amenities: ["Pride of Asia Heritage Architecture", "Crystal Chandeliers", "Dolby Surround", "Royal Experience"],
    screens: [
      { screenNumber: 1, name: "The Grand Royal Hall", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- CHANDIGARH (2) -----------------
  {
    name: "PVR: Elante Mall",
    chain: "PVR INOX",
    city: "Chandigarh",
    address: "Plot No. 178, Industrial Area Phase 1",
    amenities: ["8 Screens", "IMAX with Laser", "Gold Class", "Dolby Atmos", "Luxury Dining"],
    screens: [
      { screenNumber: 1, name: "IMAX Screen", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },
  {
    name: "Cinépolis: Jagat Mall",
    chain: "Cinepolis",
    city: "Chandigarh",
    address: "Sector 17, Bridge Market, Chandigarh",
    amenities: ["Dolby 7.1", "City Center Convenience", "VIP Comfort"],
    screens: [
      { screenNumber: 1, name: "Screen 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- KOCHI (2) -----------------
  {
    name: "PVR: LuLu International Shopping Mall",
    chain: "PVR INOX",
    city: "Kochi",
    address: "34/1000, Old NH 47, Edappally",
    amenities: ["9 Screens", "4DX", "Dolby Atmos", "Gold Class", "Largest in Kerala"],
    screens: [
      { screenNumber: 1, name: "Screen 1 - 4DX", format: "4DX", seatCapacity: 96 }
    ]
  },
  {
    name: "Shenoys Cinema: MG Road",
    chain: "Independent",
    city: "Kochi",
    address: "Shenoys Junction, Mahatma Gandhi Road, Ernakulam",
    amenities: ["Historic Landmark", "Barco 4K RGB Laser", "Dolby Atmos", "Ultra Comfortable Recliners"],
    screens: [
      { screenNumber: 1, name: "Shenoys Main Audi", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- GOA (1) -----------------
  {
    name: "INOX: Mall de Goa",
    chain: "PVR INOX",
    city: "Goa",
    address: "NH 17, Porvorim, Panaji",
    amenities: ["Dolby Atmos", "Laser Projection", "Food Court", "Convenient Parking"],
    screens: [
      { screenNumber: 1, name: "Audi 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- LUCKNOW (1) -----------------
  {
    name: "PVR INOX: Phoenix Palassio",
    chain: "PVR INOX",
    city: "Lucknow",
    address: "Sector 7, Gomti Nagar Extension, Amar Shaheed Path",
    amenities: ["10 Screens", "IMAX with Laser", "MX4D", "Insignia Lounge", "Gourmet Dining"],
    screens: [
      { screenNumber: 1, name: "IMAX Hall", format: "IMAX 3D", seatCapacity: 96 }
    ]
  },

  // ----------------- INDORE (1) -----------------
  {
    name: "PVR: Treasure Island Mall",
    chain: "PVR INOX",
    city: "Indore",
    address: "11, MG Road, South Tukoganj",
    amenities: ["Dolby Atmos", "Central India Multiplex", "Gold Class", "Valet Parking"],
    screens: [
      { screenNumber: 1, name: "Audi 1", format: "2D", seatCapacity: 96 }
    ]
  },

  // ----------------- COIMBATORE (1) -----------------
  {
    name: "Broadway Cinemas: EPIQ Screen",
    chain: "Broadway",
    city: "Coimbatore",
    address: "Avinashi Road, Civil Aerodrome Post",
    amenities: ["India's Largest EPIQ Screen", "Barco 4K Laser", "Dolby Atmos", "Luxury Loungers"],
    screens: [
      { screenNumber: 1, name: "EPIQ Giant Screen", format: "2D", seatCapacity: 96 }
    ]
  }
];

// Helper to format date strings: YYYY-MM-DD
function getDateString(dayOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
}

async function seedDatabase() {
  try {
    await ensureDefaultUsers();

    // 1. Check and seed/update movies
    for (const movieItem of moviesData) {
      const exists = await Movie.findOne({ title: movieItem.title });
      if (!exists) {
        await Movie.create(movieItem);
        console.log(`🎬 Added movie: ${movieItem.title}`);
      } else {
        // Keep active and updated
        await Movie.updateOne({ _id: exists._id }, { $set: movieItem });
      }
    }

    // 2. Check and seed/update theatres
    for (const theatreItem of theatresData) {
      const exists = await Theatre.findOne({ name: theatreItem.name });
      if (!exists) {
        await Theatre.create(theatreItem);
        console.log(`🏛️ Added theatre: ${theatreItem.name} (${theatreItem.city})`);
      } else {
        await Theatre.updateOne({ _id: exists._id }, { $set: theatreItem });
      }
    }

    // 3. Ensure shows exist for all theatres and movies for the next 4 days
    const allTheatres = await Theatre.find();
    const allMovies = await Movie.find({ isActive: true });

    const showTimes = [
      { time: "09:30 AM", format: "2D" },
      { time: "12:45 PM", format: "IMAX 3D" },
      { time: "04:00 PM", format: "2D" },
      { time: "07:15 PM", format: "3D" },
      { time: "10:30 PM", format: "2D" }
    ];

    const showsToInsert = [];

    for (let day = 0; day <= 3; day++) {
      const showDate = getDateString(day);

      for (let tIdx = 0; tIdx < allTheatres.length; tIdx++) {
        const theatre = allTheatres[tIdx];

        // Check if shows already exist for this theatre and date
        const count = await Show.countDocuments({ theatreId: theatre._id, showDate });
        if (count >= 4) continue; // Theatre already well-scheduled for this date

        // Schedule 3-4 movies per theatre
        for (let mIdx = 0; mIdx < Math.min(allMovies.length, 4); mIdx++) {
          const movie = allMovies[(tIdx * 2 + mIdx + day * 3) % allMovies.length];
          const t1 = showTimes[mIdx % showTimes.length];

          // Check if this specific show already exists
          const showExists = await Show.findOne({
            theatreId: theatre._id,
            showDate,
            showTime: t1.time
          });

          if (!showExists) {
            showsToInsert.push({
              movieId: movie._id,
              theatreId: theatre._id,
              screenName: theatre.screens[0]?.name || "Audi 1",
              showDate,
              showTime: t1.time,
              format: movie.formats.includes(t1.format) ? t1.format : (movie.formats[0] || "2D"),
              language: movie.languages[0] || "Hindi",
              pricing: {
                vip: 450,
                prime: 280,
                classic: 180
              },
              totalSeats: 96,
              bookedSeats: day === 0 ? ["D-5", "D-6", "E-4", "E-5", "F-7"] : [],
              lockedSeats: []
            });
          }
        }
      }
    }

    if (showsToInsert.length > 0) {
      await Show.insertMany(showsToInsert);
      console.log(`🎟️ Scheduled ${showsToInsert.length} new shows across theatres and dates.`);
    }

    console.log('✅ Catalog synchronized successfully!');
    return {
      moviesCount: allMovies.length,
      theatresCount: allTheatres.length,
      showsAdded: showsToInsert.length
    };
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
}

async function ensureDefaultUsers() {
  const existingAdmin = await User.findOne({ email: 'admin@imovies.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: 'admin@imovies.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      city: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    console.log('👤 Admin user created: admin@imovies.com / admin123');
  } else if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    await existingAdmin.save();
  }

  const existingDemoUser = await User.findOne({ email: 'user@imovies.com' });
  if (!existingDemoUser) {
    const user = await User.create({
      name: 'Alex Johnson',
      email: 'user@imovies.com',
      password: 'user123',
      role: 'user',
      phone: '+91 9123456780',
      city: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    });

    await Notification.create({
      userId: user._id,
      title: 'Welcome to IMovies! 🍿',
      message: 'Get ready for seamless cinema booking. Enjoy exclusive offers and real-time seat selection.',
      type: 'system'
    });
    console.log('👤 Demo user created: user@imovies.com / user123');
  }

  // Ensure Mradul Balani account has admin privileges
  const personalAdmin = await User.findOne({ email: 'balanimradul@gmail.com' });
  if (personalAdmin && personalAdmin.role !== 'admin') {
    personalAdmin.role = 'admin';
    await personalAdmin.save();
    console.log('👤 Promoted balanimradul@gmail.com to admin role');
  }
}

module.exports = { seedDatabase, getDateString, moviesData, theatresData };
