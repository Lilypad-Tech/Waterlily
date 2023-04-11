import { Link, Box, Typography } from '@mui/material';
import { ArrowRightAltOutlined } from '@mui/icons-material';

export const LinkTo: React.FC<{
  text: string;
  href?: string;
  icon?: any;
}> = ({ text, href, icon = <ArrowRightAltOutlined /> }) => {
  return (
    <Link
      href={
        href
          ? href
          : 'https://luck-muscle-f89.notion.site/Waterlily-ai-FAQs-e920ff00040d411eab93538525abaa3c'
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '0.5rem',
        }}
      >
        <Typography>{text}</Typography>
        {icon}
      </Box>
    </Link>
  );
};
