import React from 'react';

export function useLocation(): URL
{
  const [ href, setHref ] = React.useState( location.href );
  const url = React.useMemo( () => new URL( href ), [ href ] );

  React.useEffect( () =>
  {
    function onLocationChange()
    {
      setHref( location.href );
    }

    window.addEventListener( 'popstate', onLocationChange );
    window.addEventListener( 'hashchange', onLocationChange );

    if( typeof window.navigation !== 'undefined' )
    {
      navigation.addEventListener( 'navigatesuccess', onLocationChange );
      navigation.addEventListener( 'currententrychange', onLocationChange );
    }

    return () =>
    {
      window.removeEventListener( 'popstate', onLocationChange );
      window.removeEventListener( 'hashchange', onLocationChange );

      if( typeof window.navigation !== 'undefined' )
      {
        navigation.removeEventListener( 'navigatesuccess', onLocationChange );
        navigation.removeEventListener( 'currententrychange', onLocationChange );
      }
    };
  }, [] );

  return url;
}
