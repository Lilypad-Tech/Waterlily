//can an artist have multiple categories? = yes = these are tags
export const ArtStyleTags = [
  'Surrealism',
  'Abstract',
  'Figurative',
  'Landscape',
  'Japanese',
  'Mythology',
  'Comic Book',
  'Anime',
  'Manga',
  'Vintage',
  'Photography',
  'Illustration',
  'Digital Art',
  'Pop Art',
  'Posters',
  'Indigenous',
  'Classicism',
  'Modern',
  'Oil Painting',
  'Art Deco',
  'Art Nouveau',
  'Cubism',
  'Renaissance',
  'Impressionism',
  'Street Art',
  'Minimalism',
  'Neoclassicism',
  'Neo-Impressionism',
  'Post-Impressionism',
  'Realism',
  'Avant-garde',
  'Baroque',
  'Bauhaus',
  'Conceptual Art',
  'Constructivism',
  'Cubism',
  'Expressionism',
  'Fauvism',
  'Futurism',
  'Sci-fi',
  'Op-Art',
  'Rococo',
  'Precisionism',
  'Space',
  'Pixel Art',
  'Watercolour',
  'Conceptual',
]; //string of available styles - should be generated from current

export const ArtPeriods = ['Classical', 'Modern', 'Digital'];

export const ArtStyles = [
  'Realism',
  'Photorealism',
  'Expressionism',
  'Impressionism',
  'Abstract',
  'Surrealism',
  'Pop Art',
  'Modernism',
  'Cubism',
  'Digital',
  'Sketching',
  'Indigenous',
];

export const ArtMediums = [
  'Oil',
  'Watercolour',
  'Acrylic',
  'Gouache',
  'Pastel',
  'Encaustic',
  'Fresco',
  'Spray Paint',
  'Digital',
  'Photography',
];

export enum ArtistCategory {
  Classical = 'Classical Art',
  Modern = 'Modern Art',
  Digital = 'Digital Art',
}

export enum ArtistType {
  Private = 'private',
  Public = 'public',
}

export type ArtistThumbnail = {
  link: string;
  alt: string;
};

export interface ArtistData {
  artistId: string; //how do we keep this hidden...
  artistType: ArtistType;
  name: string;
  category: ArtistCategory;
  style: string;
  period: string;
  tags: string[];
  nationality: string;
  description: string;
  portfolio: string;
  thumbnails: ArtistThumbnail[]; //art thumbnails for the artist
}

export const artists: ArtistData[] = [
  {
    artistId: 'cecnstyle',
    artistType: ArtistType.Private,
    name: 'Carrie Chen',
    category: ArtistCategory.Modern,
    period: '2023',
    style: 'Algorithmic Noise',
    tags: [],
    nationality: 'American',
    description:
      'Carrie Chen is an artist and educator based in Los Angeles (Gabrielino-Tongva Land). Working with CGI animation, simulation and projection installation, she explores how digital figuration can be a poetic and multidimensional means to express ideas about identity, presence, and memory.',
    portfolio: 'https://www.carriechen.net',
    thumbnails: [
      {
        link: 'https://ai-art-files.cluster.world/artist_thumbnails/cecnstyle.png',
        alt: 'Carrie Chen',
      },
    ],
  },
  {
    artistId: 'mckhallstyle',
    artistType: ArtistType.Public,
    name: 'McKenney and Hall',
    period: '1836-1844',
    style: 'Oil Works',
    category: ArtistCategory.Classical,
    tags: [],
    nationality: 'American',
    description:
      'Aya N.I. Thomas McKenney and James Hall are the authors of The History of the Indian Tribes of North America, a three-volume collection of Native American biographies and accompanying lithograph portraits. It was originally published in the United States from 1836 to 1844.',
    portfolio: 'http://www.mckenneyandhallprints.com/',
    thumbnails: [
      {
        link: 'https://ai-art-files.cluster.world/artist_thumbnails/mckhallstyle.png',
        alt: 'McKenney and Hall',
      },
    ],
  },
  {
    artistId: 'SARAH_RICHTER',
    artistType: ArtistType.Private,
    name: 'Sarah Richter',
    category: ArtistCategory.Modern,
    period: '2023',
    style: 'Digital',
    tags: [],
    nationality: 'German',
    description:
      'Sarah Richter is a visual artist who specializes in figurative oil paintings. Her artwork often features realistic depictions of human figures, animals, and surreal landscapes, and she draws inspiration from personal experiences and the world around her',
    portfolio: 'https://www.sarah-richter-illustration.de/',
    thumbnails: [
      {
        link: 'https://ai-art-files.cluster.world/artist_thumbnails/sarah-richter.png',
        alt: 'Sarah Richter',
      },
    ],
  },
  {
    artistId: 'bcistyle',
    artistType: ArtistType.Public,
    name: 'Umberto Boccioni',
    category: ArtistCategory.Classical,
    period: '1882-1916',
    style: 'Futurism',
    tags: [],
    nationality: '',
    description:
      'Umberto Boccioni was an Italian painter and sculptor who played a prominent role in the Futurist movement in the early 20th century. He is known for his dynamic and abstract depictions of modern life and technology, which aimed to capture the speed and energy of the modern world.',
    portfolio:
      'https://dombonanni.myportfolio.com/time-the-canvas-of-umberto-boccioni',
    thumbnails: [
      {
        link: 'https://ai-art-files.cluster.world/artist_thumbnails/bcistyle.png',
        alt: 'Umberto Boccioni',
      },
    ],
  },
  {
    artistId: 'mntstyle',
    artistType: ArtistType.Public,
    name: 'Edouard Manet',
    category: ArtistCategory.Classical,
    period: '1832 - 1882',
    style: 'Modernist',
    tags: [],
    nationality: '',
    description:
      'Edouard Manet was a 19th-century French artist who played a pivotal role in the development of modern art. He is considered a pivotal figure in the transition from Realism to Impressionism and is known for his innovative use of color and brushwork. His paintings often depict contemporary life in Paris, including cafes, boulevards, and social gatherings.',
    portfolio: 'https://www.manet.org/paintings.jsp',
    thumbnails: [
      {
        link: 'https://ai-art-files.cluster.world/artist_thumbnails/manet.png',
        alt: 'Edouard Manet',
      },
    ],
  },
  {
    artistId: 'btzstyle',
    artistType: ArtistType.Public,
    name: 'Charles Balthazar Julien Févret de Saint-Mémin',
    category: ArtistCategory.Classical,
    period: '',
    style: 'Portrait Miniatures',
    tags: [],
    nationality: '',
    description:
      'Charles Balthazar Julien Févret de Saint-Mémin was an 18th-century French-American artist who is famous for his detailed portrait miniatures. He moved to the United States in 1793 and began creating portraits of notable American figures such as George Washington, Thomas Jefferson, and James Madison.',
    portfolio:
      'https://en.wikipedia.org/wiki/Charles_Balthazar_Julien_F%C3%A9vret_de_Saint-M%C3%A9min',
    thumbnails: [
      {
        link: 'https://ai-art-files.cluster.world/artist_thumbnails/btzstyle.png',
        alt: 'Charles Balthazar Julien Févret de Saint-Mémin',
      },
    ],
  },
  // {
  //TODO add new artists
  // }
];
