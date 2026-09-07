import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import GlazeIcon from '@mui/icons-material/InvertColors';
import TemperatureIcon from '@mui/icons-material/Thermostat';

import { FilterButton } from '../components/FilterButton';
import { GlazeComboGrid } from '../components/GlazeComboGrid';
import { MaycoFooter } from '../components/MaycoFooter';

import { useAsyncData } from '../hooks/useAsyncData';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { fetchGlazesData } from '../utilities/glazes';

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

  const [ selectedGlazeIds, saveSelectedGlazeIds ] = useLocalStorage<string[]>( 'selected-glazes', EMPTY );

  const [ selectedFireTemps, saveSelectedFireTemps ] = useLocalStorage<string[]>( 'selected-fire-temps', EMPTY );

  const selectedGlazes = glazesData.data?.glazes.filter( ( g ) => selectedGlazeIds.includes( g.id ) ) ?? [];

  const filteredCombos = glazesData.data?.combos.filter( ( combo ) =>
  {
    if( selectedGlazes.length > 0 )
    {
      for( const glazeId of combo.glazeIds )
      {
        if( !selectedGlazes.find( ( g ) => g.id === glazeId ) )
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

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingX: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          paddingY: 1,
          display: 'flex',
          flexDirection: 'row',
          flexFlow: 'row',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <FilterButton
          sx={{
            flex: 1,
            minWidth: 275,
            maxWidth: '100%',
          }}
          label="Select Glazes"
          showAll={false}
          placeholder="Filter glazes"
          startIcon={<GlazeIcon />}
          options={glazesData.data?.glazes ?? EMPTY}
          value={selectedGlazes}
          onChange={( value ) => saveSelectedGlazeIds( value.map( ( g ) => g.id ) )}
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
          onChange={( value ) => saveSelectedFireTemps( value )}
          getOptionKey={( o ) => o}
          getOptionLabel={( o ) => o}
        />
      </Box>
      <Box
        sx={{
          paddingBottom: 1,
          flex: 1,
          flexShrink: 1,
          minHeight: 0,
          overflowY: 'scroll',
        }}
      >
        {selectedGlazes.length < 2
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
      <MaycoFooter />
    </Box>
  );
};
