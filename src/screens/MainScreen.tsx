import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  OutlinedInput,
  styled,
  Typography,
} from '@mui/material';
import GlazeIcon from '@mui/icons-material/InvertColors';
import TemperatureIcon from '@mui/icons-material/Thermostat';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import SearchIcon from '@mui/icons-material/Search';

import { FilterButton } from '../components/FilterButton';
import { GlazeComboFilters, type FavoritesFilter, type MarkedFilter } from '../components/GlazeComboFilters';
import { GlazeComboGrid } from '../components/GlazeComboGrid';
import { AttributionFooter } from '../components/AttributionFooter';
import { ShareDialog } from '../components/ShareDialog';
import { ClearInputAdornment } from '../components/ClearInputAdornment';

import { useAsyncData } from '../hooks/useAsyncData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLocation } from '../hooks/useLocation';

import { compareGlazeCombos, fetchGlazesData, getGlazeImageUrl } from '../utilities/glaze_data';
import type { GlazeOrder } from '../utilities/glaze_types';
import { GlazeOrderToggle } from '../components/GlazeOrderToggle';

const IMPORT_AVAILABLE_GLAZE_IDS_PARAM = 'import-available-glazes';

const ListImage = styled( 'img' )( ( { theme } ) => ( {
  display: 'block',
  width: 24,
  height: 24,
  borderRadius: theme.shape.borderRadius,
} ) );

const InfoText: React.FC<{ children?: React.ReactNode }> = ( { children } ) =>
{
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 2,
      }}
    >
      <Typography
        color="textSecondary"
        component="span"
      >
        {children}
      </Typography>
    </Box>
  );
};

const EMPTY: readonly [] = [];

export const MainScreen: React.FC = () =>
{
  const glazesData = useAsyncData( 'glazes data', fetchGlazesData );

  const [ availableGlazeIds, saveAvailableGlazeIds ] = useLocalStorage<string[]>( 'selected-available-glazes', EMPTY );
  const [ selectedFireTempIds, saveSelectedFireTempIds ] = useLocalStorage<string[]>( 'selected-fire-temps', EMPTY );
  const [ glazeSearchText, setGlazeSearchText ] = React.useState( '' );

  const availableGlazes = glazesData.data?.glazes.filter( ( g ) => availableGlazeIds.includes( g.id ) ) ?? EMPTY;
  const selectedFireTemps = glazesData.data?.fireTemps.filter( ( t ) => selectedFireTempIds.includes( t ) ) ?? selectedFireTempIds;

  const [ favoriteComboIds, saveFavoriteComboIds ] = useLocalStorage<string[]>( 'favorite-combos', EMPTY );
  const [ markedComboIds, saveMarkedComboIds ] = useLocalStorage<string[]>( 'marked-combos', EMPTY );

  const [ favoritesFilter, setFavoritesFilter ] = React.useState<FavoritesFilter>( 'all' );
  const [ markedFilter, setMarkedFilter ] = React.useState<MarkedFilter>( 'all' );

  const [ glazeOrder, saveGlazeOrder ] = useLocalStorage<GlazeOrder>( 'glaze-order', 'over' );

  const glazeSearchTerms = glazeSearchText.trim().toLocaleLowerCase().split( /[^a-zA-Z0-9]+/g );
  const filteredCombos = glazesData.data?.combos
    .filter( ( combo ) =>
    {
      if( availableGlazes.length > 0 )
      {
        for( const glazeId of combo.glazeIds )
        {
          if( !availableGlazes.find( ( g ) => g.id === glazeId ) )
          {
            return false;
          }
        }
      }

      if( selectedFireTemps.length > 0 )
      {
        if( !selectedFireTemps.includes( combo.fireTemp ) )
        {
          return false;
        }
      }

      if( glazeSearchTerms.length > 0 )
      {
        const glazeNames = glazesData.data?.glazes
          .filter( ( g ) => combo.glazeIds.includes( g.id ) )
          .map( ( g ) => g.name )
          .join( ' ' )
          .toLocaleLowerCase();
        if( glazeNames )
        {
          if( !glazeSearchTerms.every( ( t ) => glazeNames.includes( t ) ) )
          {
            return false;
          }
        }
      }

      const favorite = favoriteComboIds.includes( combo.id );
      if( favoritesFilter === 'favorites' )
      {
        if( !favorite )
        {
          return false;
        }
      }
      else if( favoritesFilter === 'nonfavorites' )
      {
        if( favorite )
        {
          return false;
        }
      }

      const marked = markedComboIds.includes( combo.id );
      if( markedFilter === 'marked' )
      {
        if( !marked )
        {
          return false;
        }
      }
      else if( markedFilter === 'nonmarked' )
      {
        if( marked )
        {
          return false;
        }
      }

      return true;
    } )
    .sort( ( a, b ) => compareGlazeCombos( a, b, glazeOrder ) )
    ?? EMPTY;

  const location = useLocation();

  const [ shareAvailableGlazesOpen, setShareAvailableGlazesOpen ] = React.useState( false );
  const importAvailableGlazesUrl = React.useMemo( () =>
  {
    const url = new URL( location.href );
    url.hash = '';
    url.search = '';

    url.searchParams.set( IMPORT_AVAILABLE_GLAZE_IDS_PARAM, availableGlazes.map( ( g ) => g.id ).join( ',' ) );

    return url.href;
  }, [ location.href, availableGlazes ] );

  React.useEffect( () =>
  {
    const availableGlazeIdsImport = location.searchParams.get( IMPORT_AVAILABLE_GLAZE_IDS_PARAM );
    if( !availableGlazeIdsImport )
    {
      return;
    }

    const glazeIds = availableGlazeIdsImport.toLowerCase().split( ',' ).filter( ( gid ) => /^\w+-\d+$/.test( gid ) );
    saveAvailableGlazeIds( glazeIds );

    const newUrl = new URL( location.href );
    newUrl.searchParams.delete( IMPORT_AVAILABLE_GLAZE_IDS_PARAM );

    history.replaceState( null, '', newUrl );
  }, [ location, saveAvailableGlazeIds ] );

  let combosContent: NonNullable<React.ReactNode>;
  if( glazesData.loading )
  {
    combosContent = (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          variant="indeterminate"
          size={80}
        />
      </Box>
    );
  }
  else if( glazesData.error )
  {
    combosContent = (
      <Alert variant="outlined" severity="error">
        <AlertTitle>Failed to load glaze combinations data!</AlertTitle>
        {glazesData.error.message}
      </Alert>
    );
  }
  else if( availableGlazes.length < 2 )
  {
    combosContent = (
      <InfoText>Select at least two glazes to find combinations.</InfoText>
    );
  }
  else if( filteredCombos.length === 0 )
  {
    combosContent = (
      <InfoText>No glaze combinations found for selected glazes, firing temperatures, and filters.</InfoText>
    );
  }
  else
  {
    combosContent = (
      <GlazeComboGrid
        glazeCombos={filteredCombos}
        glazes={glazesData.data?.glazes ?? EMPTY}
        glazeOrder={glazeOrder}
        favoriteComboIds={favoriteComboIds}
        onFavoriteChange={( combo, favorite ) =>
        {
          if( favorite )
          {
            saveFavoriteComboIds( [ ...favoriteComboIds, combo.id ] );
          }
          else
          {
            saveFavoriteComboIds( favoriteComboIds.filter( ( c ) => c !== combo.id ) );
          }
        }}
        markedComboIds={markedComboIds}
        onMarkedChange={( combo, marked ) =>
        {
          if( marked )
          {
            saveMarkedComboIds( [ ...markedComboIds, combo.id ] );
          }
          else
          {
            saveMarkedComboIds( markedComboIds.filter( ( c ) => c !== combo.id ) );
          }
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingX: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
      }}
    >
      <Grid
        sx={( theme ) => ( {
          [ theme.breakpoints.up( 'sm' ) ]: {
            position: 'sticky',
            top: 0,
          },
          zIndex: 1,
          backgroundColor: 'background.default',
          paddingY: 1,
        } )}
        container={true}
        spacing={1}
      >
        <Grid
          size={{
            xs: 6,
            sm: 4,
          }}
          container={true}
          sx={{
            alignItems: 'stretch',
          }}
        >
          <FilterButton
            label="Glazes"
            fullWidth={true}
            showAll={false}
            placeholder="Filter glazes"
            startIcon={<GlazeIcon />}
            noOptionsText="No matching glazes"
            options={glazesData.data?.glazes ?? EMPTY}
            value={availableGlazes}
            onChange={( value ) => saveAvailableGlazeIds( value.map( ( g ) => g.id ) )}
            getOptionKey={( o ) => o.id}
            getOptionLabel={( o ) => o.name}
            getOptionIcon={( o ) => (
              <ListImage
                loading="lazy"
                src={getGlazeImageUrl( o, selectedFireTemps )}
                alt={o.name}
              />
            )}
          />
        </Grid>
        <Grid
          size={{
            xs: 6,
            sm: 4,
          }}
          container={true}
          sx={{
            alignItems: 'stretch',
          }}
        >
          <FilterButton
            label="Firing Temps"
            fullWidth={true}
            placeholder="Filter firing temps"
            startIcon={<TemperatureIcon />}
            noOptionsText="No matching firing temperatures"
            options={glazesData.data?.fireTemps ?? EMPTY}
            value={selectedFireTemps}
            onChange={( value ) => saveSelectedFireTempIds( value )}
            getOptionKey={( o ) => o}
            getOptionLabel={( o ) => `Cone ${o}`}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4,
          }}
          container={true}
          spacing={0}
          sx={{
            alignItems: 'stretch',
          }}
        >
          <OutlinedInput
            sx={{
              flex: 1,
              marginRight: 1,
            }}
            size="small"
            color="primary"
            notched={false}
            label={false}
            placeholder="Search..."
            startAdornment={(
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )}
            endAdornment={(
              <ClearInputAdornment
                size="small"
                onClear={() => setGlazeSearchText( '' )}
              />
            )}
            value={glazeSearchText}
            onChange={( e ) => setGlazeSearchText( e.currentTarget.value )}
          />
          <GlazeOrderToggle
            sx={{
              alignSelf: 'center',
            }}
            glazeOrder={glazeOrder}
            onChange={saveGlazeOrder}
          />
          <GlazeComboFilters
            sx={{
              alignSelf: 'center',
            }}
            favoritesFilter={favoritesFilter}
            onFavoritesFilterChange={setFavoritesFilter}
            markedFilter={markedFilter}
            onMarkedFilterChange={setMarkedFilter}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          paddingBottom: 1,
          flex: 1,
          flexShrink: 0,
        }}
      >
        {combosContent}
      </Box>
      <Button
        sx={{
          alignSelf: 'center',
          marginBottom: 0.5,
        }}
        variant="text"
        color="secondary"
        startIcon={<QrCodeIcon />}
        disabled={availableGlazes.length <= 0}
        onClick={() => setShareAvailableGlazesOpen( true )}
      >
        Share Available Glazes
      </Button>
      <ShareDialog
        open={shareAvailableGlazesOpen}
        onClose={() => setShareAvailableGlazesOpen( false )}
        content={importAvailableGlazesUrl}
      />
      <AttributionFooter />
    </Box>
  );
};
