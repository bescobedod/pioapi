export function BYTE(mb:number = 0):number {
    return mb * 1024 * 1024
} 

export function reviveFiles(files: any): any {
  if (!files) return files;

  const reviveFile = (file: any) => {
    if (
      file?.data &&
      file.data.type === "Buffer" &&
      Array.isArray(file.data.data)
    ) {
      return {
        ...file,
        data: Buffer.from(file.data.data)
      };
    }
    return file;
  };

  const revived: any = {};

  for (const key in files) {
    const value = files[key];

    if (Array.isArray(value)) {
      revived[key] = value.map(reviveFile);
    } else {
      revived[key] = reviveFile(value);
    }
  }

  return revived;
}
