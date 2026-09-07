import React from 'react';

function readValue<T>( key: string, defaultValue: T ): T
{
  try
  {
    const valueString = localStorage.getItem( key );
    if( typeof valueString === 'string' )
    {
      const value: unknown = JSON.parse( valueString );

      if( Array.isArray( defaultValue ) && Array.isArray( value ) )
      {
        return value as T;
      }
      else if( typeof defaultValue === typeof value )
      {
        return value as T;
      }
    }
  }
  catch( e )
  {
    console.warn( 'Failed to read value from localStorage:', key, e );
  }
  return defaultValue;
}

export function useLocalStorage<T>( key: string, defaultValue: Readonly<T> ): [ value: T, saveValue: ( value: T ) => void ]
{
  const [ value, setValue ] = React.useState( () => readValue( key, defaultValue ) );

  const previousKey = React.useRef( key );
  const defaultValueRef = React.useRef( defaultValue );

  React.useEffect( () =>
  {
    defaultValueRef.current = defaultValue;
  }, [ defaultValue ] );

  React.useEffect( () =>
  {
    function onChange( e: StorageEvent )
    {
      if( e.key === key )
      {
        setValue( readValue( key, defaultValueRef.current ) );
      }
    }

    if( previousKey.current !== key )
    {
      previousKey.current = key;

      setValue( readValue( key, defaultValueRef.current ) );
    }

    window.addEventListener( 'storage', onChange );

    return () =>
    {
      window.removeEventListener( 'storage', onChange );
    };
  }, [ key ] );

  const saveValue = React.useCallback( ( newValue: T ) =>
  {
    const newValueString = JSON.stringify( newValue );
    setValue( ( oldValue ) =>
    {
      if( JSON.stringify( oldValue ) !== newValueString )
      {
        return newValue;
      }
      else
      {
        return oldValue;
      }
    } );

    try
    {
      localStorage.setItem( key, newValueString );
    }
    catch( e )
    {
      console.warn( 'Failed to save value to local storage:', key, '=', newValue, e );
    }
  }, [ key ] );

  return [ value, saveValue ];
}
