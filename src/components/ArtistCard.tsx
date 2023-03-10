import { FC, ReactElement, useState } from 'react';
import { Watermark } from '@hirohe/react-watermark';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Typography,
} from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

const imageStyle = {
  width: '100%',
  fontWeight: 'bold',
  whiteSpace: 'pre-line',
};

interface ArtistCardProps {
  name: string;
  style: string;
  description: string;
  image?: { link: string; alt: string };
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ArtistCard: FC<ArtistCardProps> = ({
  name = 'ArtistName',
  style = 'ArtistStyle',
  description = 'Artist Portfolio description',
  image,
}): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Box sx={boxStyle}>
      <Card sx={{ maxWidth: 280 }}>
        <CardActionArea onClick={() => console.log('visit artist portfolio?')}>
          <CardHeader title={name} subheader={style} />
          <Watermark text="artistname">
            <CardMedia
              component="img"
              height="194"
              image="https://lh3.googleusercontent.com/ci/AEwo86ckKPeuZCWNi-HnGaRuv859NM6FYVkFrj9M-76Y_m08ICrdhy7ThPuetWx8HPNo81RfXLpf9xY" //{image.link}
              alt="Monet Waterlilies" //{image.alt}
              sx={{
                pointerEvents: 'none',
              }}
            />
          </Watermark>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Water Lilies by Claude Monet is an oil on canvas painting created
              in France in 1916 in the small village of Giverny down stream on
              the Seine from Paris.
              {/* description */}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>
                Monet began work in 1883 in the small village of Giverny down
                stream on the Seine from Paris.
              </Typography>
              <Typography paragraph>
                Then in 1893 he bought the land in front of his home and built a
                Japanese style garden in the space. Monet used a small stream
                that ran through his property to build a huge pond which he
                filled with water lilies and crossed with a humpbacked bridge.
                He lined the banks with willows and shrubbery and retired to
                this watery realm isolated from the outside world to create his
                final series, "The Water Lilies".
              </Typography>
              <Typography paragraph>
                He built a glasswalled studio on the side of the garden and set
                up a wheeled easel that he could freely roll around the room.
                There he created painting after painting of the changing images
                of the pond, its water lilies and the reflecting light at all
                hours of morning, day and evening.
              </Typography>
              <Typography>
                In different works of the series he included images of the
                willows on the shore, the humpback bridge and the evening sky.
                But he finally concentrated solely on the pond itself. He filled
                the entire surface of the work with an image of the pond, giving
                the viewer the strong impression of standing in the center of
                the pond. The brushstrokes and pigments depicting flowers and
                water differ considerably from early Impressionist techniques;
                at times they reach the passionate intensity of Expressionism in
                their evocation of the beauty of the water's surface. This work
                is one of the finest of these late "Water Lilies" paintings.
              </Typography>
            </CardContent>
          </Collapse>
        </CardActionArea>
      </Card>
    </Box>
  );
};
