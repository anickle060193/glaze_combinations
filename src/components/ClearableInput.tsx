import React from 'react';
import { IconButton, InputAdornment, OutlinedInput, outlinedInputClasses, styled, type OutlinedInputProps } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ClearButton = styled( IconButton )( ( { theme } ) => ( {
  marginRight: theme.spacing( -1 ),
  transition: theme.transitions.create( 'opacity', { duration: theme.transitions.duration.shortest } ),
  opacity: 0,
  [ `.${outlinedInputClasses.root}:hover &, .${outlinedInputClasses.root}:focus-within &` ]: {
    opacity: 1,
  },
} ) );

export const ClearableInput: React.FC<OutlinedInputProps> = ( props ) =>
{
  const inputRef = React.useRef<HTMLInputElement | null>( null );

  const onMouseDown = React.useCallback( ( e: React.MouseEvent ) =>
  {
    e.preventDefault();
  }, [] );

  const onClear = React.useCallback( () =>
  {
    if( inputRef.current )
    {
      const valueProp = Object.getOwnPropertyDescriptor( window.HTMLInputElement.prototype, 'value' );
      valueProp?.set?.call( inputRef.current, '' );
      inputRef.current.dispatchEvent( new Event( 'change', { bubbles: true } ) );

      inputRef.current.focus();
    }
  }, [] );

  return (
    <OutlinedInput
      {...props}
      inputRef={inputRef}
      endAdornment={(
        <InputAdornment position="end">
          <ClearButton
            edge="end"
            size="small"
            tabIndex={-1}
            onMouseDown={onMouseDown}
            onClick={onClear}
          >
            <ClearIcon fontSize="small" />
          </ClearButton>
        </InputAdornment>
      )}
    />
  );
};
