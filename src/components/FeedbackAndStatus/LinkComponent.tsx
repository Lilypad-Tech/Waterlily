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
          : 'https://www.notion.so/lilypadnetwork/Waterlily-ai-FAQs-d89f329c33304a7d8bb8ff8d6ef6e5ac'
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
