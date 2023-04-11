import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  MenuItem,
  Pagination,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Fuse from 'fuse.js';
import {
  ArtistContext,
  ArtistCategory,
  ArtistData,
  ImageContext,
  StatusContext,
  defaultStatusState,
} from '@/context';
import { ArtistCard } from '@/components';

type ArtistCardGridProps = {
  navigate: () => void;
};

export const ArtistCardGrid = ({ navigate }: ArtistCardGridProps) => {
  const { artistState: artists } = useContext(ArtistContext);
  const { setImageArtist } = useContext(ImageContext);
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueStyles, setUniqueStyles] = useState<string[]>([]);

  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStyle, setSearchStyle] = useState('');

  // useEffect(() => {
  //   console.log('artist style', artists, artists.length);
  //   if (artists.length > 0) {
  //     const styles = new Set<string>();
  //     artists.forEach((artist) => {
  //       artist.style.split(',').forEach((style) => {
  //         styles.add(style.trim());
  //       });
  //     });
  //     setUniqueStyles(Array.from(styles));
  //   }
  // }, [artists]);

  useEffect(() => {
    console.log('artist tags', artists, artists.length);
    if (artists.length > 0) {
      const tags = new Set<string>();
      artists.forEach((artist) => {
        artist.tags.forEach((tag) => {
          if (Boolean(tag)) tags.add(tag.trim());
        });
      });
      setUniqueStyles(Array.from(tags));
    }
  }, [artists]);

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const xl = useMediaQuery(theme.breakpoints.up('xl'));

  let itemsPerPage = xl ? 5 : lg ? 4 : md ? 3 : 2;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter the data based on the search text
  const fuseName = new Fuse(artists, { keys: ['name'] });
  const fuseCategory = new Fuse(artists, { keys: ['category'] });
  const fuseStyle = new Fuse(artists, { keys: ['tags'] });

  //To do fix filtering
  const filteredData = artists.filter((artist: ArtistData) => {
    const nameResult = fuseName.search(searchName);
    const styleResult = fuseStyle.search(searchStyle);
    return (
      (searchName === '' || nameResult.find((r) => r.item === artist)) &&
      (searchCategory === '' || artist.category === searchCategory) &&
      (searchStyle === '' || styleResult.find((r) => r.item === artist))
    );
  });

  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // useEffect(() => {
  //   console.log('artists', artists);
  // }, [artists]);

  // useEffect(() => {
  //   console.log('filteredData', filteredData);
  // }, [filteredData]);

  useEffect(() => {
    console.log('currentData', currentData, currentData.length);
  }, [currentData]);

  const handlePageChange = (event: any, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  const handleNameSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchName(event.target.value);
    setCurrentPage(1);
  };

  const handleCategorySearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleStyleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchStyle(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ paddingTop: '1rem' }}>
      {/* TO DO search input no responsive to screen sizes aka should stack */}
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item>
          <TextField
            label="Search by name"
            value={searchName}
            onChange={handleNameSearchChange}
            sx={{ margin: '0 1rem' }}
          />
        </Grid>
        <Grid item>
          <TextField
            select
            label="Category"
            value={searchCategory}
            onChange={handleCategorySearchChange}
            sx={{ margin: '0 1rem', minWidth: '10rem' }}
            size="medium"
          >
            <MenuItem value="">All Categories</MenuItem>
            {Object.keys(ArtistCategory).map((key) => (
              <MenuItem
                key={key}
                value={ArtistCategory[key as keyof typeof ArtistCategory]}
              >
                {ArtistCategory[key as keyof typeof ArtistCategory]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Style"
            value={searchStyle}
            onChange={handleStyleSearchChange}
            sx={{ margin: '0 1rem', minWidth: '10rem' }}
          >
            <MenuItem value="">All Styles</MenuItem>
            {uniqueStyles.map((style) => (
              <MenuItem key={style} value={style}>
                {style}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        {currentData.length > 0 &&
          artists.length > 0 &&
          currentData.map((item: ArtistData) => (
            <Grid
              item
              key={item.artistId}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2.4}
            >
              <ArtistCard
                artist={item}
                disabled={statusState.isLoading ? true : false}
                onClick={() => {
                  setImageArtist({
                    name: item.name,
                    key: item.artistId || '',
                    style: item.style,
                  });
                  navigate();
                }}
              />
            </Grid>
          ))}
      </Grid>
      <Box
        sx={{ display: 'flex', padding: '0 2rem', justifyContent: 'flex-end' }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
          size="large"
          color="primary"
        />
      </Box>
    </Box>
  );
};
