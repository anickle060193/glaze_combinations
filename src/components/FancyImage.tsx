import React from 'react';
import { Skeleton, styled, type SkeletonProps, type SxProps, type Theme } from '@mui/material';

const ImageSkeleton = styled( ( props: SkeletonProps<'img'> ) => <Skeleton {...props} /> )( {
  display: 'unset',
  height: 'unset',
} );

type RequiredImageProps = Required<Pick<React.JSX.IntrinsicElements[ 'img' ], 'src' | 'alt'>>;
type OptionalImageProps = Pick<React.JSX.IntrinsicElements[ 'img' ], 'loading'>;

interface Props extends RequiredImageProps, OptionalImageProps
{
  sx?: SxProps<Theme>;
  className?: string;
}

export const FancyImage: React.FC<Props> = ( props ) =>
{
  const [ loaded, setLoaded ] = React.useState( false );

  const onLoadStart = React.useCallback( () =>
  {
    setLoaded( false );
  }, [] );

  const onLoad = React.useCallback( () =>
  {
    setLoaded( true );
  }, [] );

  return (
    <ImageSkeleton
      loading="lazy"
      {...props}
      component="img"
      variant="rectangular"
      animation={loaded ? false : 'pulse'}
      onLoadStart={onLoadStart}
      onLoad={onLoad}
      onError={onLoad}
    />
  );
};
