import React from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Popover,
  Tooltip,
  type SxProps,
  type Theme,
} from '@mui/material';
import DropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearFilterIcon from '@mui/icons-material/FilterAltOff';
import { List as VirtualizedList, type RowComponentProps } from 'react-window';

import { mergeSx } from '../utilities/mergeSx';

interface Props<T>
{
  sx?: SxProps<Theme>;
  label: React.ReactNode;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  showAll?: boolean;
  placeholder: string;
  options: readonly T[];
  value: readonly T[];
  onChange: ( value: T[] ) => void;
  getOptionKey: ( option: T ) => string | number;
  getOptionLabel: ( option: T ) => string;
  getOptionIcon?: ( option: T ) => React.ReactNode;
}

export function FilterButton<T>( {
  sx,
  label,
  fullWidth,
  startIcon,
  showAll = true,
  placeholder,
  options,
  value,
  onChange,
  getOptionKey,
  getOptionLabel,
  getOptionIcon,
}: Props<T> ): React.ReactNode
{
  const [ anchorEl, setAnchorEl ] = React.useState<HTMLElement | null>( null );
  const [ popupMinWidth, setPopupMinWidth ] = React.useState( 0 );

  const [ inputValue, setInputValue ] = React.useState( '' );

  const filteredOptions = React.useMemo( () =>
  {
    const filterWords = inputValue.trim().toLocaleLowerCase().split( /\W+/g );
    if( filterWords.length <= 0 )
    {
      return options;
    }

    return options.filter( ( o ) =>
    {
      const optionLabel = getOptionLabel( o ).toLocaleLowerCase();
      return filterWords.every( ( w ) => optionLabel.includes( w ) );
    } );
  }, [ options, getOptionLabel, inputValue ] );

  return (
    <>
      <Button
        sx={mergeSx( sx, {
          paddingY: 1,
          whiteSpace: 'nowrap',
        } )}
        variant="outlined"
        fullWidth={fullWidth}
        startIcon={startIcon}
        endIcon={<DropDownIcon />}
        onClick={( e ) =>
        {
          if( anchorEl )
          {
            setAnchorEl( null );
          }
          else
          {
            setAnchorEl( e.currentTarget );
            setPopupMinWidth( e.currentTarget.clientWidth );
            setInputValue( '' );
          }
        }}
      >
        {label} ({ showAll && value.length === 0 ? 'All' : value.length})
      </Button>
      <Popover
        open={!!anchorEl}
        onClose={() => setAnchorEl( null )}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        marginThreshold={0}
        slotProps={{
          paper: {
            sx: {
              marginTop: 1,
              minWidth: popupMinWidth,
              maxHeight: 'min( 600px, 90vh )',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box
          sx={{
            paddingX: 1,
            paddingTop: 1,
            paddingBottom: 0.5,
          }}
        >
          <OutlinedInput
            size="small"
            fullWidth={true}
            placeholder={placeholder}
            value={inputValue}
            onChange={( e ) => setInputValue( e.currentTarget.value )}
            onKeyDown={( e ) =>
            {
              if( e.key === 'Escape' )
              {
                setAnchorEl( null );
              }
            }}
            endAdornment={(
              <InputAdornment position="end">
                <Tooltip title="Clear filter">
                  <span>
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={value.length === 0}
                      onClick={( e ) =>
                      {
                        e.preventDefault();

                        onChange( [] );
                      }}
                    >
                      <ClearFilterIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            )}
          />
        </Box>
        <List
          sx={{
            paddingTop: 0,
          }}
          dense={true}
          component={ListComponent<T>}
          options={filteredOptions}
          getOptionKey={getOptionKey}
          getOptionLabel={getOptionLabel}
          getOptionIcon={getOptionIcon}
          value={value}
          onOptionClick={( option ) =>
          {
            if( value.includes( option ) )
            {
              onChange( value.filter( ( o ) => o !== option ) );
            }
            else
            {
              onChange( [ ...value, option ] );
            }
          }}
        />
      </Popover>
    </>
  );
}

interface ListComponentProps<T> extends OptionRowProps<T>, React.HTMLAttributes<HTMLUListElement>
{
}

function ListComponent<T>( {
  options, getOptionKey, getOptionLabel, getOptionIcon,
  value, onOptionClick,
  ...ulProps
}: ListComponentProps<T> ): React.ReactNode
{
  return (
    <VirtualizedList
      tagName="ul"
      {...ulProps as React.HTMLAttributes<HTMLDivElement>}
      rowComponent={RowComponent}
      rowCount={options.length}
      rowHeight={36}
      overscanCount={10}
      rowProps={{
        options,
        getOptionKey,
        getOptionLabel,
        getOptionIcon,
        value,
        onOptionClick,
      }}
    />
  );
}

interface OptionRowProps<T>
{
  options: readonly T[];
  getOptionKey: ( option: T ) => string | number;
  getOptionLabel: ( option: T ) => string;
  getOptionIcon: ( ( option: T ) => React.ReactNode ) | undefined;
  value: readonly T[];
  onOptionClick: ( option: T ) => void;
}

function RowComponent<T>( {
  ariaAttributes, index, style,
  options, getOptionKey, getOptionLabel, getOptionIcon,
  value, onOptionClick,
}: RowComponentProps<OptionRowProps<T>> ): React.ReactElement | null
{
  const option = options[ index ];
  const label = getOptionLabel( option );
  const selected = value.includes( option );

  return (
    <ListItem
      key={getOptionKey( option )}
      {...ariaAttributes}
      sx={{
        whiteSpace: 'nowrap',
      }}
      style={style}
      disableGutters={true}
      disablePadding={true}
      title={label}
    >
      <ListItemButton
        selected={selected}
        onClick={() => onOptionClick( option )}
      >
        {!!getOptionIcon && (
          <ListItemIcon>
            {getOptionIcon( option )}
          </ListItemIcon>
        )}
        <ListItemText
          slotProps={{
            primary: {
              sx: {
                overflowX: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
          }}
          primary={label}
        />
      </ListItemButton>
    </ListItem>
  );
}
