import Type from '#models/type';

export type TypeAttributes = Pick<Type, 'name' | 'slug' | 'description'>;

export const types: TypeAttributes[] = [
  {
    name: 'Movie',
    slug: 'movie',
    description: 'A collection of feature-length films and their details',
  },
  {
    name: 'TV Show',
    slug: 'tv',
    description: 'Series of television episodes and related metadata',
  },
  {
    name: 'Book',
    slug: 'book',
    description: 'Catalog of various scanned written works, including digital editions',
  },
  {
    name: 'Audiobook',
    slug: 'audiobook',
    description: 'Recordings of spoken word for literary audio content',
  },
  {
    name: 'Comic',
    slug: 'comic',
    description:
      'Catalog of graphic novels and comic books with their issue numbers and series information',
  },
  {
    name: 'Photo',
    slug: 'photo',
    description: 'Collection of photographs with metadata tagging and information',
  },
  {
    name: 'Music',
    slug: 'music',
    description: 'Tracks of sound recordings, playlists, and artist/album details',
  },
  {
    name: 'Video',
    slug: 'video',
    description: 'Archive of various personal video content',
  },
];
