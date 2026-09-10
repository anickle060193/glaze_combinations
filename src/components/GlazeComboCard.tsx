import React from 'react';
import { Box, Card, Checkbox, styled, Typography, type CardProps } from '@mui/material';
import ConeIcon from '@mui/icons-material/ChangeHistory';
import FavoriteIcon from '@mui/icons-material/Star';
import FavoriteOutlineIcon from '@mui/icons-material/StarBorder';

import { ExternalLink } from './ExternalLink';
import { GlazeLink } from './GlazeLink';
import { FancyImage } from './FancyImage';

import type { Glaze, GlazeCombo, GlazeOrder } from '../utilities/glaze_types';
import { mergeSx } from '../utilities/mergeSx';

const ComboImage = styled( FancyImage )( () => ( {
  display: 'block',
  width: '100%',
  height: '100%',
  aspectRatio: 1,
} ) );

const ComboGlazeImage = styled( FancyImage )( () => ( {
  display: 'block',
  width: '100%',
  height: '100%',
} ) );

const FireTempText = styled( 'div' )( ( { theme } ) => ( {
  position: 'absolute',
  bottom: 0,
  left: 0,
  margin: theme.spacing( 0.5 ),
  color: '#000',
  lineHeight: 1,
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
} ) );

interface Props extends CardProps
{
  combo: GlazeCombo;
  glazes: readonly Glaze[];
  glazeOrder: GlazeOrder;
  favorite: boolean;
  onFavoriteChange: ( favorite: boolean ) => void;
  marked: boolean;
  onMarkedChange: ( marked: boolean ) => void;
}

export const GlazeComboCard: React.FC<Props> = ( {
  combo, glazes, glazeOrder, favorite, onFavoriteChange, marked, onMarkedChange,
  ...cardProps
} ) =>
{
  const comboImageUrl = combo.imageUrls[ 0 ];

  const comboGlazes = combo.glazeIds
    .map( ( gid ) => glazes.find( ( g ) => g.id === gid ) );

  let glazeOrderText = 'over';

  if( glazeOrder === 'under' )
  {
    comboGlazes.reverse();
    glazeOrderText = 'under';
  }

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
            position: 'relative',
          }}
        >
          <ExternalLink
            sx={{
              display: 'block',
            }}
            href={comboImageUrl}
          >
            <ComboImage
              src={comboImageUrl}
              loading="lazy"
              alt={comboGlazes.map( ( g ) => g?.name ).join( ' over ' )}
            />
          </ExternalLink>
          <FireTempText>
            <ConeIcon fontSize="inherit" color="inherit" /> {combo.fireTemp}
          </FireTempText>
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
              sx={{
                display: 'block',
                flex: 1,
              }}
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
          paddingX: 0.75,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Checkbox
          color="secondary"
          icon={<FavoriteOutlineIcon />}
          checkedIcon={<FavoriteIcon />}
          checked={favorite}
          onChange={( _e, checked ) => onFavoriteChange( checked )}
        />
        <Box
          sx={{
            flex: 1,
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
                  {glazeOrderText}
                </Typography>
              )}
            </React.Fragment>
          ) )}
        </Box>
        <Checkbox
          color="success"
          checked={marked}
          onChange={( _e, checked ) => onMarkedChange( checked )}
        />
      </Box>
    </Card>
  );
};
