import React from 'react';
import { Box, Card, styled, Typography, type CardProps } from '@mui/material';

import { ExternalLink } from './ExternalLink';
import { GlazeLink } from './GlazeLink';

import type { Glaze, GlazeCombo } from '../utilities/glazes';
import { mergeSx } from '../utilities/mergeSx';

const ComboImage = styled( 'img' )( () => ( {
  display: 'block',
  width: '100%',
  aspectRatio: 1,
} ) );

const ComboGlazeImage = styled( 'img' )( () => ( {
  display: 'block',
  width: '100%',
  flex: 1,
} ) );

interface Props extends CardProps
{
  combo: GlazeCombo;
  glazes: readonly Glaze[];
}

export const GlazeComboCard: React.FC<Props> = ( { combo, glazes, ...cardProps } ) =>
{
  const comboGlazes = combo.glazeIds.map( ( gid ) => glazes.find( ( g ) => g.id === gid ) );

  return (
    <Card
      {...cardProps}
      sx={mergeSx(
        cardProps.sx,
        {
          display: 'flex',
          flexDirection: 'column',
        },
      )}
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
              alt={comboGlazes.map( ( g ) => g?.name ).join( ' over ' )}
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
    </Card>
  );
};
