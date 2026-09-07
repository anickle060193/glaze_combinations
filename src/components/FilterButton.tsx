import React from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Tooltip,
  type SxProps,
  type Theme,
} from '@mui/material';
import DropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearFilterIcon from '@mui/icons-material/FilterAltOff';
import { List as VirtualizedList, type RowComponentProps } from 'react-window';

interface Props<T>
{
  sx?: SxProps<Theme>;
  label: React.ReactNode;
  startIcon?: React.ReactNode;
  showAll?: boolean;
  placeholder: string;
  options: readonly T[];
  value: T[];
  onChange: ( value: T[] ) => void;
  getOptionKey: ( option: T ) => string | number;
  getOptionLabel: ( option: T ) => string;
  getOptionIcon?: ( option: T ) => React.ReactNode;
}

export function FilterButton<T>( {
  sx,
  label,
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
  const buttonRef = React.useRef<HTMLButtonElement | null>( null );
  const [ anchorEl, setAnchorEl ] = React.useState<HTMLElement | null>( null );

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
        ref={buttonRef}
        sx={sx}
        variant="outlined"
        size="small"
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
            setInputValue( '' );
          }
        }}
      >
        {label} ({ showAll && value.length === 0 ? 'All' : value.length})
      </Button>
      <Popper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={( e ) =>
          {
            if( e.target instanceof HTMLElement
              && buttonRef.current?.contains( e.target ) )
            {
              return;
            }
            setAnchorEl( null );
          }}
        >
          <Paper
            sx={{
              minWidth: anchorEl?.clientWidth,
              maxHeight: 'min( 600px, 90vh )',
              display: 'flex',
              flexDirection: 'column',
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
                autoFocus={true}
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
          </Paper>
        </ClickAwayListener>
      </Popper>
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
  value: T[];
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
