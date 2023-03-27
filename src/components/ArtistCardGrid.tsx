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
  ArtistData,
  ImageContext,
  StatusContext,
  defaultStatusState,
} from '@/context';
import { ArtistCard } from '.';

type ArtistCardGridProps = {
  navigate: () => void;
};

export const ArtistCardGrid = ({ navigate }: ArtistCardGridProps) => {
  const { artistState: artists } = useContext(ArtistContext);
  const { setImageArtist } = useContext(ImageContext);
  const { statusState = defaultStatusState.statusState } =
    useContext(StatusContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueStyles, setUniqueStyles] = useState<string[]>([]);

  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStyle, setSearchStyle] = useState('');

  useEffect(() => {
    const categories = new Set<string>();
    const styles = new Set<string>();
    artists.forEach((artist) => {
      artist.category.split(',').forEach((category) => {
        categories.add(category.trim());
      });
      artist.style.split(',').forEach((style) => {
        styles.add(style.trim());
      });
    });
    setUniqueCategories(Array.from(categories));
    setUniqueStyles(Array.from(styles));
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
  const fuseStyle = new Fuse(artists, { keys: ['style'] });

  //To do fix filtering
  const filteredData = artists.filter((artist: ArtistData) => {
    const nameResult = fuseName.search(searchName);
    const categoryResult = fuseCategory.search(searchCategory);
    const styleResult = fuseStyle.search(searchStyle);
    return (
      (searchName === '' || nameResult.find((r) => r.item === artist)) &&
      (searchCategory === '' ||
        categoryResult.find((r) => r.item === artist)) &&
      (searchStyle === '' || styleResult.find((r) => r.item === artist))
    );
  });

  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    console.log('filteredData', filteredData);
  }, [filteredData]);

  useEffect(() => {
    console.log('currentData', currentData);
  }, [currentData]);

  const handlePageChange = (event: any, value: number) => {
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
    <Box>
      <Box>
        <TextField
          label="Search by name"
          value={searchName}
          onChange={handleNameSearchChange}
          sx={{ margin: '0 1rem' }}
        />
        <TextField
          select
          label="Category"
          value={searchCategory}
          onChange={handleCategorySearchChange}
          sx={{ margin: '0 1rem', minWidth: '10rem' }}
          size="medium"
        >
          <MenuItem value="">All Categories</MenuItem>
          {uniqueCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
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
      </Box>
      <Grid container>
        {currentData.map((item: any) => (
          <Grid item key={item?.name} xs={12} sm={6} md={4} lg={3} xl={2.4}>
            <ArtistCard
              artist={item}
              disabled={statusState.isLoading ? true : false}
              onClick={() => {
                setImageArtist({
                  name: item.name,
                  key: item.artistId,
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
