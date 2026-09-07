import React from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import GlazeIcon from '@mui/icons-material/InvertColors';
import TemperatureIcon from '@mui/icons-material/Thermostat';
import QrCodeIcon from '@mui/icons-material/QrCode2';

import { FilterButton } from '../components/FilterButton';
import { GlazeComboGrid } from '../components/GlazeComboGrid';
import { AttributionFooter } from '../components/AttributionFooter';
import { QrCodeDialog } from '../components/QrCodeDialog';

import { useAsyncData } from '../hooks/useAsyncData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLocation } from '../hooks/useLocation';

import { fetchGlazesData } from '../utilities/glaze_data';

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
  const [ requiredGlazeIds, setRequiredGlazeIds ] = React.useState<string[]>( [] );

  const availableGlazes = glazesData.data?.glazes.filter( ( g ) => availableGlazeIds.includes( g.id ) ) ?? EMPTY;
  const selectedFireTemps = glazesData.data?.fireTemps.filter( ( t ) => selectedFireTempIds.includes( t ) ) ?? selectedFireTempIds;
  const requiredGlazes = glazesData.data?.glazes.filter( ( g ) => requiredGlazeIds.includes( g.id ) ) ?? EMPTY;

  const filteredCombos = glazesData.data?.combos.filter( ( combo ) =>
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

    if( requiredGlazes.length > 0 )
    {
      for( const requiredGlaze of requiredGlazes )
      {
        if( !combo.glazeIds.includes( requiredGlaze.id ) )
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

    return true;
  } ) ?? EMPTY;

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
      <Box
        sx={( theme ) => ( {
          [ theme.breakpoints.up( 'sm' ) ]: {
            position: 'sticky',
            top: 0,
          },
          backgroundColor: 'background.default',
          paddingY: 1,
          display: 'flex',
          flexDirection: 'row',
          flexFlow: 'row',
          flexWrap: 'wrap',
          gap: 1,
        } )}
      >
        <FilterButton
          sx={{
            flex: 1,
            minWidth: 275,
            maxWidth: '100%',
          }}
          label="Select Available Glazes"
          showAll={false}
          placeholder="Filter glazes"
          startIcon={<GlazeIcon />}
          options={glazesData.data?.glazes ?? EMPTY}
          value={availableGlazes}
          onChange={( value ) => saveAvailableGlazeIds( value.map( ( g ) => g.id ) )}
          getOptionKey={( o ) => o.id}
          getOptionLabel={( o ) => o.name}
          getOptionIcon={( o ) => (
            <ListImage
              loading="lazy"
              src={Object.values( o.imageUrls )[ 0 ]}
              alt={o.name}
            />
          )}
        />
        <FilterButton
          sx={{
            flex: 1,
            minWidth: 275,
            maxWidth: '100%',
          }}
          label="Select Firing Temps"
          placeholder="Filter firing temps"
          startIcon={<TemperatureIcon />}
          options={glazesData.data?.fireTemps ?? EMPTY}
          value={selectedFireTemps}
          onChange={( value ) => saveSelectedFireTempIds( value )}
          getOptionKey={( o ) => o}
          getOptionLabel={( o ) => `Cone ${o}`}
        />
        <FilterButton
          sx={{
            flex: 1,
            minWidth: 275,
            maxWidth: '100%',
          }}
          label="Select Required Glazes"
          showAll={false}
          placeholder="Filter required glazes"
          startIcon={<GlazeIcon />}
          options={availableGlazes}
          value={requiredGlazes}
          onChange={( value ) => setRequiredGlazeIds( value.map( ( g ) => g.id ) )}
          getOptionKey={( o ) => o.id}
          getOptionLabel={( o ) => o.name}
          getOptionIcon={( o ) => (
            <ListImage
              loading="lazy"
              src={Object.values( o.imageUrls )[ 0 ]}
              alt={o.name}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          paddingBottom: 1,
        }}
      >
        {availableGlazes.length < 2
          ? (
              <InfoText>Select at least two glazes to find combinations</InfoText>
            )
          : (
              filteredCombos.length === 0
                ? (
                    <InfoText>No glaze combinations found for selected glazes/firing temperatures</InfoText>
                  )
                : (
                    <GlazeComboGrid
                      glazeCombos={filteredCombos}
                      glazes={glazesData.data?.glazes ?? EMPTY}
                    />
                  )
            )}
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
      <QrCodeDialog
        open={shareAvailableGlazesOpen}
        onClose={() => setShareAvailableGlazesOpen( false )}
        content={importAvailableGlazesUrl}
      />
      <AttributionFooter />
    </Box>
  );
};
