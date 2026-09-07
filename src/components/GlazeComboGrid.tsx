import React from 'react';
import { Grid } from '@mui/material';

import { GlazeComboCard } from './GlazeComboCard';

import type { Glaze, GlazeCombo } from '../utilities/glazes';

interface Props
{
  glazeCombos: readonly GlazeCombo[];
  glazes: readonly Glaze[];
}

export const GlazeComboGrid: React.FC<Props> = ( { glazeCombos, glazes } ) =>
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
            xl: 1,
          }}
          component={GlazeComboCard}
          combo={combo}
          glazes={glazes}
        />
      ) )}
    </Grid>
  );
};
