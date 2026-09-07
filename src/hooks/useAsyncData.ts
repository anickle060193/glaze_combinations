import React from 'react';

interface AsyncDataResult<T>
{
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncData<T>( name: string, fetcher: () => Promise<T> ): AsyncDataResult<T>
{
  const [ data, setData ] = React.useState<T | null>( null );
  const [ loading, setLoading ] = React.useState( false );
  const [ error, setError ] = React.useState<Error | null>( null );

  const nameRef = React.useRef( name );

  React.useEffect( () =>
  {
    nameRef.current = name;
  }, [ name ] );

  React.useEffect( () =>
  {
    let cancel = false as boolean;

    void ( async () =>
    {
      try
      {
        setLoading( true );

        const data = await fetcher();
        if( cancel )
        {
          return;
        }
        setData( data );
      }
      catch( e )
      {
        if( cancel )
        {
          return;
        }

        console.warn( 'Failed to retrieve async data:', nameRef.current, e );

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        setError( e instanceof Error ? e : new Error( `${e}` ) );
      }

      setLoading( false );
    } )();

    return () =>
    {
      cancel = true;
    };
  }, [ fetcher ] );

  const result: AsyncDataResult<T> = React.useMemo( () => ( {
    data, loading, error,
  } ), [ data, loading, error ] );

  return result;
}
