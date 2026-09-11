import React from 'react';
import { IconButton, Tooltip, type IconButtonProps } from '@mui/material';
import {
  SortAscending as GlazeOrderUnderIcon,
  SortDescending as GlazeOrderOverIcon,
} from 'mdi-material-ui';

import type { GlazeOrder } from '../utilities/glaze_types';

interface Props extends Omit<IconButtonProps, 'onChange' | 'onClick' | 'children'>
{
  glazeOrder: GlazeOrder;
  onChange: ( glazeOrder: GlazeOrder ) => void;
}

export const GlazeOrderToggle: React.FC<Props> = ( { glazeOrder, onChange, ...buttonProps } ) =>
{
  return (
    <Tooltip title="Toggle Glaze Order">
      <IconButton
        color="primary"
        {...buttonProps}
        onClick={() => onChange( glazeOrder === 'over' ? 'under' : 'over' )}
      >
        {glazeOrder === 'over'
          ? (
              <GlazeOrderOverIcon />
            )
          : (
              <GlazeOrderUnderIcon />
            )}
      </IconButton>
    </Tooltip>
  );
};
