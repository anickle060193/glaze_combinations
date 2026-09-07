import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Skeleton, styled, useTheme, type SkeletonProps } from '@mui/material';

import QRCode from 'qrcode';

const SquareSkeleton = styled( ( props: SkeletonProps<'div'> ) => (
  <Skeleton
    {...props}
    component="div"
    variant="rectangular"
  />
) )( {
  display: 'block',
  width: '100%',
  height: 'auto',
  aspectRatio: 1,
} );

const SquareImage = styled( 'img' )( {
  display: 'block',
  width: '100%',
  aspectRatio: 1,
  imageRendering: 'crisp-edges',
} );

interface Props
{
  open: boolean;
  onClose: () => void;
  content: string;
}

export const QrCodeDialog: React.FC<Props> = ( { open, onClose, content } ) =>
{
  const theme = useTheme();

  const [ loading, setLoading ] = React.useState( false );
  const [ dataUrl, setDataUrl ] = React.useState( '' );

  React.useEffect( () =>
  {
    if( !open )
    {
      return;
    }

    let cancel = false as boolean;

    void ( async () =>
    {
      setLoading( true );
      setDataUrl( '' );

      try
      {
        const dataUrl = await QRCode.toDataURL( content, {
          margin: 0,
          color: {
            dark: theme.palette.secondary.dark,
            light: '#00000000',
          },
        } );
        if( cancel )
        {
          return;
        }
        setDataUrl( dataUrl );
        setLoading( false );
      }
      catch( e )
      {
        if( cancel )
        {
          return;
        }
        console.warn( 'Failed to generate QR code:', content, e );
        setDataUrl( '' );
      }
    } )();

    return () =>
    {
      cancel = true;
    };
  }, [ open, content, theme.palette.secondary.dark ] );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogContent
        sx={{
          paddingBottom: 0,
        }}
      >
        <DialogContentText
          sx={{
            textAlign: 'center',
          }}
        >
          Scan this QR code to import the list of available glazes:
        </DialogContentText>
        <Box
          sx={{
            margin: 1,
            padding: 3,
            borderWidth: 2,
            borderStyle: 'solid',
            borderRadius: 2,
            borderColor: 'divider',
          }}
        >
          {( loading || !dataUrl )
            ? (
                <SquareSkeleton />
              )
            : (
                <SquareImage src={dataUrl} />
              )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};
