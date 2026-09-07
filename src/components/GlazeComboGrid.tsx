import React from 'react';
import { Box, Card, Grid, styled, Typography } from '@mui/material';

import { GlazeLink } from './GlazeLink';
import { ExternalLink } from './ExternalLink';

import type { Glaze, GlazeCombo } from '../utilities/glazes';

const ComboImage = styled( 'img' )( () => ( {
  display: 'block',
  width: '100%',
  height: '100%',
} ) );

const ComboGlazeImage = styled( 'img' )( () => ( {
  display: 'block',
  width: '100%',
  flex: 1,
} ) );

interface Props
{
  glazeCombos: readonly GlazeCombo[];
  glazes: readonly Glaze[];
}

export const GlazeComboGrid: React.FC<Props> = ( { glazeCombos, glazes } ) =>
{
  return (
    <Grid container={true} spacing={2}>
      {glazeCombos.map( ( combo ) =>
      {
        const comboGlazes = combo.glazeIds.map( ( gid ) => glazes.find( ( g ) => g.id === gid ) );
        return (
          <Grid
            key={combo.id}
            component={Card}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
              xl: 1,
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            tabIndex={-1}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Box
                sx={{
                  flex: 2,
                  overflow: 'clip',
                }}
              >
                <ExternalLink
                  href={combo.imageUrls[ 0 ]}
                >
                  <ComboImage
                    src={combo.imageUrls[ 0 ]}
                    loading="lazy"
                  />
                </ExternalLink>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {comboGlazes.map( ( g ) => g && (
                  <GlazeLink
                    key={g.id}
                    glaze={g}
                  >
                    <ComboGlazeImage
                      src={g.imageUrls[ combo.fireTemp ]}
                      alt={g.name}
                    />
                  </GlazeLink>
                ) )}
              </Box>
            </Box>
            <Box
              sx={{
                paddingY: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {comboGlazes.map( ( g, i ) => (
                <React.Fragment key={g?.id}>
                  <Typography
                    component="span"
                    sx={{
                      lineHeight: 1,
                    }}
                    variant="overline"
                  >
                    {g?.name}
                  </Typography>
                  {i < comboGlazes.length - 1 && (
                    <Typography
                      sx={{
                        lineHeight: 1,
                        fontStyle: 'italic',
                        marginTop: 0.5,
                        marginBottom: 0.75,
                      }}
                      component="span"
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {i === 1 ? 'on' : 'over'}
                    </Typography>
                  )}
                </React.Fragment>
              ) )}
            </Box>
          </Grid>
        );
      } )}
    </Grid>
  );
};
