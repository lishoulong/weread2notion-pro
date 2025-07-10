declare module 'image-convert' {
  interface FileInfo {
    size: number;
    format: string;
  }

  export function fromURL(
    options: {
      url: string;
      quality?: number;
      output_format?: string;
      size?: number;
    },
    callback: (err: Error | null, buffer: Buffer, file: FileInfo) => void
  ): void;
}
