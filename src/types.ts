export type RemoteImage = { id: number; url: string };
export type LocalImage = { id: string; file: File; src: string };
export type ColumnMeta = {
  width?: number | string;
  truncate?: boolean;
};
