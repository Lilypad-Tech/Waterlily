export interface ArtistType {
  artistId: string;
  name: string;
  style: string;
  description: string;
  portfolio: string;
  image: {
    link: string;
    alt: string;
  };
}

export const artists: ArtistType[] = [
  {
    artistId: 'mckhallstyle',
    name: 'McKenney and Hall',
    style: 'Oil Works 1836-1844',
    description:
      'Aya N.I. Thomas McKenney and James Hall are the authors of The History of the Indian Tribes of North America, a three-volume collection of Native American biographies and accompanying lithograph portraits. It was originally published in the United States from 1836 to 1844.',
    portfolio: 'http://www.mckenneyandhallprints.com/',
    image: {
      link: 'https://ai-art-files.cluster.world/artist_thumbnails/mckhallstyle.png',
      alt: 'McKenney and Hall',
    },
  },
  {
    artistId: 'SARAH_RICHTER',
    name: 'Sarah Richter',
    style: 'Digital',
    description:
      'Sarah Richter is an American visual artist who specializes in figurative oil paintings. Her artwork often features realistic depictions of human figures, animals, and surreal landscapes, and she draws inspiration from personal experiences and the world around her',
    portfolio: 'https://www.facebook.com/SarahRichterArt/',
    image: {
      link: 'https://ai-art-files.cluster.world/artist_thumbnails/sarah-richter.png',
      alt: 'Sarah Richter',
    },
  },
  {
    artistId: 'bcistyle',
    name: 'Umberto Boccioni',
    style: 'Futurism',
    description:
      'Umberto Boccioni was an Italian painter and sculptor who played a prominent role in the Futurist movement in the early 20th century. He is known for his dynamic and abstract depictions of modern life and technology, which aimed to capture the speed and energy of the modern world.',
    portfolio: 'https://dombonanni.myportfolio.com/time-the-canvas-of-umberto-boccioni',
    image: {
      link: 'https://ai-art-files.cluster.world/artist_thumbnails/bcistyle.png',
      alt: 'Umberto Boccioni',
    },
  },
  {
    artistId: 'mntstyle',
    name: 'Edouard Manet',
    style: 'Modern',
    description: 'Edouard Manet was a 19th-century French artist who played a pivotal role in the development of modern art. He is considered a pivotal figure in the transition from Realism to Impressionism and is known for his innovative use of color and brushwork. His paintings often depict contemporary life in Paris, including cafes, boulevards, and social gatherings.',
    portfolio: 'https://www.manet.org/paintings.jsp',
    image: {
      link: 'https://ai-art-files.cluster.world/artist_thumbnails/manet.png',
      alt: 'Edouard Manet',
    },
  },
  {
    artistId: 'btzstyle',
    name: 'Charles Balthazar Julien Févret de Saint-Mémin',
    style: 'Portrait Miniatures',
    description:
      'Charles Balthazar Julien Févret de Saint-Mémin was an 18th-century French-American artist who is famous for his detailed portrait miniatures. He moved to the United States in 1793 and began creating portraits of notable American figures such as George Washington, Thomas Jefferson, and James Madison.',
    portfolio: 'https://en.wikipedia.org/wiki/Charles_Balthazar_Julien_F%C3%A9vret_de_Saint-M%C3%A9min',
    image: {
      link: 'https://ai-art-files.cluster.world/artist_thumbnails/btzstyle.png',
      alt: 'Charles Balthazar Julien Févret de Saint-Mémin',
    },
  },
];
