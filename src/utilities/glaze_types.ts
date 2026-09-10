export interface Glaze
{
  id: string;
  name: string;
  imageUrls: Record<string, string>;
}

export interface GlazeCombo
{
  id: string;
  glazeIds: string[];
  fireTemp: string;
  imageUrls: string[];
}

export interface GlazeData
{
  glazes: Glaze[];
  combos: GlazeCombo[];
  fireTemps: string[];
}

export type GlazeOrder = 'under' | 'over';
