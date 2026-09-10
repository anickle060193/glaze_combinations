import React from 'react';
import { IconButton, InputAdornment, inputBaseClasses, styled, type IconButtonProps, type SvgIconProps } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ClearButton = styled( IconButton )( ( { theme } ) => ( {
  marginRight: theme.spacing( -1 ),
  transition: theme.transitions.create( 'opacity', { duration: theme.transitions.duration.shortest } ),
  opacity: 0,
  [ `.${inputBaseClasses.root}:hover &, .${inputBaseClasses.root}:focus-within &` ]: {
    opacity: 1,
  },
} ) );

interface Props
{
  onClear: () => void;
  size?: IconButtonProps[ 'size' ] & SvgIconProps[ 'fontSize' ];
}

export const ClearInputAdornment: React.FC<Props> = ( { onClear, size } ) =>
{
  const onClearMouseDown = React.useCallback( ( e: React.MouseEvent ) =>
  {
    e.preventDefault();
  }, [] );

  const onClearClick = React.useCallback( () =>
  {
    onClear();
  }, [ onClear ] );

  return (
    <InputAdornment position="end">
      <ClearButton
        edge="end"
        size={size}
        onMouseDown={onClearMouseDown}
        onClick={onClearClick}
      >
        <ClearIcon fontSize={size} />
      </ClearButton>
    </InputAdornment>
  );
};
