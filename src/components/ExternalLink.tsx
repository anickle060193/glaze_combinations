import React from 'react';
import { Link, type LinkProps } from '@mui/material';

export const ExternalLink: React.FC<LinkProps> = ( props: LinkProps ) =>
{
  return (
    <Link
      {...props}
      target="_blank"
      rel="noreferrer noopener"
    />
  );
};
