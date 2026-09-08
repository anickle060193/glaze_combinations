import React from 'react';
import { Grid } from '@mui/material';

import { GlazeComboCard } from './GlazeComboCard';

import type { Glaze, GlazeCombo } from '../utilities/glaze_types';

interface Props
{
  glazeCombos: readonly GlazeCombo[];
  glazes: readonly Glaze[];
  favoriteComboIds: readonly string[];
  onFavoriteChange: ( combo: GlazeCombo, favorite: boolean ) => void;
  markedComboIds: readonly string[];
  onMarkedChange: ( combo: GlazeCombo, marked: boolean ) => void;
}

export const GlazeComboGrid: React.FC<Props> = ( {
  glazeCombos, glazes,
  favoriteComboIds, onFavoriteChange,
  markedComboIds, onMarkedChange,
} ) =>
{
  return (
    <Grid container={true} spacing={2}>
      {glazeCombos.map( ( combo ) => (
        <Grid
          key={combo.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
          component={GlazeComboCard}
          combo={combo}
          glazes={glazes}
          favorite={favoriteComboIds.includes( combo.id )}
          onFavoriteChange={( favorite: boolean ) => onFavoriteChange( combo, favorite )}
          marked={markedComboIds.includes( combo.id )}
          onMarkedChange={( marked: boolean ) => onMarkedChange( combo, marked )}
        />
      ) )}
    </Grid>
  );
};
