export type CarpetasS3Type = "visitas" | "perfiles" | (string & {});

export type fileUploadSingleType = {
  nameFileKey?: string;
  urlS3?: string;
};
