export type CarpetasS3Type = "visitas" | "perfiles" | 'devoluciones' | (string & {});

export type fileUploadSingleType = {
  nameFileKey?: string;
  urlS3?: string;
};
