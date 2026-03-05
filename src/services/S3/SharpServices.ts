import { UploadedFile } from "express-fileupload";
import { injectable } from "tsyringe";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

ffmpeg.setFfmpegPath(ffmpegPath.path);

@injectable()
export default class SharpServices {
  constructor() {}

  async optimizedFileBuffer(file: UploadedFile): Promise<any> {
    let dataOptimized = file.data;

    // if(!file.mimetype.startsWith("image/")) return dataOptimized

    if (file.mimetype === "image/png")
      dataOptimized = await sharp(file.data)
        .rotate()
        .resize({ width: 2000, withoutEnlargement: true })
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
        })
        .toBuffer();

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg")
      dataOptimized = await sharp(file.data)
        .rotate()
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({
          quality: 85, //95
          mozjpeg: true,
          chromaSubsampling: "4:2:0",
        })
        .toBuffer();

    // 🎬 VIDEOS
    if (file.mimetype.startsWith("video/")) {
      const tempVideosDir = path.join(
        process.cwd(),
        "src",
        "storage",
        "tempVideos",
      );
      if (!fs.existsSync(tempVideosDir)) {
        fs.mkdirSync(tempVideosDir, { recursive: true });
      }

      // const tempInput = path.join(__dirname, `${uuidv4()}-input.mp4`);
      // const tempOutput = path.join(__dirname, `${uuid()}-output.mp4`);
      const tempInput = path.join(tempVideosDir, `${uuidv4()}-input.mp4`);
      const tempOutput = path.join(tempVideosDir, `${uuidv4()}-output.mp4`);

      await fs.promises.writeFile(tempInput, file.data);

      await new Promise((resolve, reject) => {
        ffmpeg(tempInput)
          .videoCodec("libx264")
          .size("1280x?") // reescala manteniendo proporción
          .outputOptions([
            "-preset fast",
            "-crf 28", // 23 mejor calidad, 28 más comprimido
            "-movflags +faststart",
          ])
          .save(tempOutput)
          .on("end", resolve)
          .on("error", reject);
      });

      dataOptimized = await fs.promises.readFile(tempOutput);

      await fs.promises.unlink(tempInput);
      await fs.promises.unlink(tempOutput);
    }

    return dataOptimized;
  }
}
