import imgConvert from 'image-convert';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ConvertResult {
  buffer: Buffer;
  file: {
    size: number;
    format: string;
  };
}

interface ConvertOptions {
  url: string;
  quality?: number;
  output_format?: 'jpg' | 'png' | 'webp';
  size?: number;
}

async function convertImage(options: ConvertOptions): Promise<ConvertResult> {
  return new Promise((resolve, reject) => {
    imgConvert.fromURL(options, (err: Error | null, buffer: Buffer, file: any) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          buffer,
          file: {
            size: file.size,
            format: file.format
          }
        });
      }
    });
  });
}

const options: ConvertOptions = {
  url: "https://cdn.weread.qq.com/weread/cover/37/YueWen_924389/t6_YueWen_924389.jpg",
  quality: 90,
  output_format: "jpg",
  size: 1080
};

convertImage(options)
  .then(async (result) => {
    const outputDir = path.join(__dirname, 'output');
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && err.code !== 'EEXIST') {
        throw err;
      }
    }
    const outputPath = path.join(outputDir, `converted.${options.output_format}`);
    await fs.writeFile(outputPath, result.buffer);
    console.log(`File saved to: ${outputPath}`);
  })
  .catch(console.error);
