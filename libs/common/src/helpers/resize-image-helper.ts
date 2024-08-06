import * as sharp from 'sharp';

export async function resizeAndOptimizeImage(buffer: Buffer): Promise<Buffer> {
  const resizedImageBuffer = await sharp(buffer)
    .resize({ width: 300 }) 
    .toFormat('jpeg') 
    .jpeg({ quality: 80 }) 
    .toBuffer();

  return resizedImageBuffer;
}