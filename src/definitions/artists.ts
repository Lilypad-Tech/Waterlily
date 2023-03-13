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
    portfolio: 'https://americanart.si.edu/art',
    image: {
      link: 'https://bafybeif75wwnmix624lh4szhg6jjmexdctpni5chk5tfw3cmc4yk5eblau.ipfs.nftstorage.link/blob',
      alt: 'McKenney and Hall',
    },
  },
  {
    artistId: 'mckhallstyle',
    name: 'Kai',
    style: 'Cartoon',
    description:
      'Kai started cartooning when he was 5 years old and wrote the Avengers!',
    portfolio: 'https://www.docs.bacalhau.org',
    image: {
      link: 'https://bafybeihdwkt6zmbx3vp6w2ccnghkpa5rzbbh4ffazrgfdcyhxfbam6m3by.ipfs.nftstorage.link/blob',
      alt: 'Rainbow Duocorn',
    },
  },
  {
    artistId: 'mckhallstyle',
    name: 'EricVan',
    style: 'Anime',
    description:
      'Having lived in Tokyo, this artist has bought anime to Canada',
    portfolio: 'https://www.docs.bacalhau.org',
    image: {
      link: 'https://bafybeiaxfbvxoflivhnsrowgq4av4ztr4erfci36ckchjo6s32x5p7suoq.ipfs.nftstorage.link/blob',
      alt: 'Rainbow Unicorn',
    },
  },
  {
    artistId: 'mckhallstyle',
    name: 'Caroline McKenna',
    style: 'Digital Art',
    description: 'PainLys has been designing art since the turn of the century',
    portfolio: 'https://www.docs.bacalhau.org',
    image: {
      link: 'https://bafybeifna5v2ozkxlifhoyv3jlwenmavzmaqiku4n5a3j5kh5vwnkyy724.ipfs.nftstorage.link/blob',
      alt: 'Monet Water Lilies',
    },
  },
  {
    artistId: 'mckhallstyle',
    name: 'Banksy',
    style: 'Graffiti',
    description:
      'Kai started cartooning when he was 5 years old and wrote the Avengers!',
    portfolio: 'https://www.docs.bacalhau.org',
    image: {
      link: 'https://bafybeiazxihafq2dwgbewvdfaod6rmby7rixxarcwaxum5koq6flddvm4e.ipfs.nftstorage.link/blob',
      alt: 'Rainbow Duocorn',
    },
  },
  {
    artistId: 'mckhallstyle',
    name: 'Monet',
    style: 'Impressionist',
    description:
      'Having lived in Tokyo, this artist has bought anime to Canada',
    portfolio: 'https://www.docs.bacalhau.org',
    image: {
      link: 'https://bafybeihovp7kymcgmt25a766sk4pmf375kb2iln5lypec5d77xqmjc7j5q.ipfs.nftstorage.link/blob',
      alt: 'Rainbow Unicorn',
    },
  },
];
