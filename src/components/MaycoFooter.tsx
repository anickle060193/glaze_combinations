import React from 'react';
import { Divider, styled, Typography, type SxProps, type Theme } from '@mui/material';

import { ExternalLink } from './ExternalLink';

const Footer = styled( 'footer' )( ( { theme } ) => ( {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: theme.spacing( 1 ),
  gap: theme.spacing( 1 ),
} ) );

interface Props
{
  sx?: SxProps<Theme>;
}

export const MaycoFooter: React.FC<Props> = ( { sx } ) =>
{
  return (
    <Footer sx={sx}>
      <Divider
        sx={{
          alignSelf: 'stretch',
        }}
        variant="middle"
      />
      <Typography variant="caption" color="textSecondary">
        All glaze names and images provided by <ExternalLink href="https://www.maycocolors.com">Mayco</ExternalLink>.
      </Typography>
    </Footer>
  );
};
