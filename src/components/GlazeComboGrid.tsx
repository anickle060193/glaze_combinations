import React from 'react';
import { Box, Card, Grid, styled, Typography } from '@mui/material';

import type { Glaze, GlazeCombo } from '../utilities/glazes';

const ComboImage = styled( 'img' )( ( { theme } ) => ( {
  width: '100%',
  height: '100%',
  transformOrigin: 'center',
  transition: theme.transitions.create( [ 'transform' ] ),
  '&:hover, &:focus': {
    transform: 'scale( 2.0 )',
  },
} ) );

const ComboGlazeImage = styled( 'img' )( () => ( {
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
                <a
                  href={combo.imageUrls[ 0 ]}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ComboImage
                    src={combo.imageUrls[ 0 ]}
                    loading="lazy"
                    tabIndex={-1}
                  />
                </a>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {comboGlazes.map( ( g ) => (
                  <ComboGlazeImage
                    key={g?.id}
                    src={g?.imageUrls[ combo.fireTemp ]}
                    alt={g?.name}
                  />
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
