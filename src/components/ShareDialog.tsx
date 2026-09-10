import React from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Skeleton, Snackbar, styled, useTheme, type AlertColor, type SkeletonProps } from '@mui/material';

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

export const ShareDialog: React.FC<Props> = ( { open, onClose, content } ) =>
{
  const theme = useTheme();

  const [ loading, setLoading ] = React.useState( false );
  const [ dataUrl, setDataUrl ] = React.useState( '' );

  const [ copyResult, setCopyResult ] = React.useState<{ severity: AlertColor; text: string } | null>( null );
  const [ copyResultOpen, setCopyResultOpen ] = React.useState( false );

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

  const supportsClipboard = (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    typeof window.navigator?.clipboard?.writeText === 'function'
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
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
          {supportsClipboard && (
            <Button
              variant="outlined"
              fullWidth={true}
              onClick={async () =>
              {
                try
                {
                  await navigator.clipboard.writeText( content );
                  setCopyResult( { severity: 'success', text: 'Copied link!' } );
                  setCopyResultOpen( true );
                }
                catch( e )
                {
                  console.warn( 'Failed to copy share content to clipboard:', e );
                  setCopyResult( { severity: 'error', text: 'Failed to copy link' } );
                  setCopyResultOpen( true );
                }
              }}
            >
              Copy Link
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={copyResultOpen && !!copyResult}
        autoHideDuration={1500}
        onClose={() => setCopyResultOpen( false )}
      >
        <Alert
          severity={copyResult?.severity}
          onClose={() => setCopyResultOpen( false )}
        >
          {copyResult?.text}
        </Alert>
      </Snackbar>
    </>
  );
};
