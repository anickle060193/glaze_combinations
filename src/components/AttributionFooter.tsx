import React from 'react';
import { Divider, styled, Typography, type SxProps, type Theme } from '@mui/material';

import { ExternalLink } from './ExternalLink';

const Footer = styled( 'footer' )( ( { theme } ) => ( {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: theme.spacing( 1 ),
  gap: theme.spacing( 0.25 ),
  textAlign: 'center',
} ) );

const FooterDivider = styled( Divider )( ( { theme } ) => ( {
  alignSelf: 'stretch',
  marginBottom: theme.spacing( 0.5 ),
} ) );

const FooterLine = styled( 'span' )( {
  whiteSpace: 'nowrap',
} );

interface Props
{
  sx?: SxProps<Theme>;
}

export const AttributionFooter: React.FC<Props> = ( { sx } ) =>
{
  return (
    <Footer sx={sx}>
      <FooterDivider variant="middle" />
      <Typography variant="caption" color="textSecondary">
        <FooterLine>
          All glaze names and images provided by <ExternalLink href="https://www.maycocolors.com">Mayco</ExternalLink>.
        </FooterLine>
        {' '}
        <FooterLine>
          Main icon created by <ExternalLink href="https://www.flaticon.com/free-icons/vase">itim2101 - Flaticon</ExternalLink>.
        </FooterLine>
      </Typography>
    </Footer>
  );
};
