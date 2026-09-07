import React from 'react';

import { ExternalLink } from './ExternalLink';

import type { Glaze } from '../utilities/glazes';

interface Props
{
  glaze: Glaze;
  children?: NonNullable<React.ReactNode>;
}

export const GlazeLink: React.FC<Props> = ( { glaze, children } ) =>
{
  return (
    <ExternalLink
      href={`https://www.maycocolors.com/product/${glaze.id}/`}
    >
      {children ?? glaze.name}
    </ExternalLink>
  );
};
