import React from 'react';
import {
  Button,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import FilterIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Star';
import NonFavoriteIcon from '@mui/icons-material/StarBorder';
import IndeterminateFavoriteIcon from '@mui/icons-material/StarHalf';
import MarkedIcon from '@mui/icons-material/CheckBox';
import NonMarkedIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateMarkedIcon from '@mui/icons-material/IndeterminateCheckBox';

export type FavoritesFilter = 'favorites' | 'nonfavorites' | 'all';
export type MarkedFilter = 'marked' | 'nonmarked' | 'all';

interface FilterOption<F>
{
  value: F;
  title: string;
  icon: SvgIconComponent;
}

const FAVORITE_FILTER_OPTIONS: { [ F in FavoritesFilter ]: FilterOption<F> } = {
  favorites: { value: 'favorites', title: 'Favorites only', icon: FavoriteIcon },
  nonfavorites: { value: 'nonfavorites', title: 'Non-favorites only', icon: NonFavoriteIcon },
  all: { value: 'all', title: 'All', icon: IndeterminateFavoriteIcon },
};

const MARKED_FILTER_OPTIONS: { [ F in MarkedFilter ]: FilterOption<F> } = {
  marked: { value: 'marked', title: 'Marked only', icon: MarkedIcon },
  nonmarked: { value: 'nonmarked', title: 'Non-marked only', icon: NonMarkedIcon },
  all: { value: 'all', title: 'All', icon: IndeterminateMarkedIcon },
};

interface Props
{
  favoritesFilter: FavoritesFilter;
  onFavoritesFilterChange: ( favoritesFilter: FavoritesFilter ) => void;
  markedFilter: MarkedFilter;
  onMarkedFilterChange: ( markedFilter: MarkedFilter ) => void;
}

export const GlazeComboFilters: React.FC<Props> = ( {
  favoritesFilter, onFavoritesFilterChange,
  markedFilter, onMarkedFilterChange,
} ) =>
{
  const [ anchorEl, setAnchorEl ] = React.useState<HTMLElement | null>( null );

  return (
    <>
      <IconButton
        color="primary"
        onClick={( e ) => setAnchorEl( e.currentTarget )}
      >
        <FilterIcon />
      </IconButton>
      <Popper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={() => setAnchorEl( null )}
        >
          <Paper
            sx={{
              padding: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Button
              color="secondary"
              size="small"
              variant="outlined"
              onClick={() =>
              {
                onFavoritesFilterChange( 'all' );
                onMarkedFilterChange( 'all' );
              }}
            >
              Clear Filter
            </Button>
            <ToggleButtonGroup
              size="small"
              color="secondary"
              exclusive={true}
              value={favoritesFilter}
              onChange={( _e, value: FavoritesFilter ) => onFavoritesFilterChange( value )}
            >
              {Object.values( FAVORITE_FILTER_OPTIONS ).map( ( { value, title, icon: Icon } ) => (
                <Tooltip
                  key={value}
                  disableInteractive={true}
                  title={title}
                >
                  <ToggleButton value={value}>
                    <Icon />
                  </ToggleButton>
                </Tooltip>
              ) )}
            </ToggleButtonGroup>
            <ToggleButtonGroup
              size="small"
              color="success"
              exclusive={true}
              value={markedFilter}
              onChange={( _e, value: MarkedFilter ) => onMarkedFilterChange( value )}
            >
              {Object.values( MARKED_FILTER_OPTIONS ).map( ( { value, title, icon: Icon } ) => (
                <Tooltip
                  key={value}
                  disableInteractive={true}
                  title={title}
                >
                  <ToggleButton value={value}>
                    <Icon />
                  </ToggleButton>
                </Tooltip>
              ) )}
            </ToggleButtonGroup>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};
