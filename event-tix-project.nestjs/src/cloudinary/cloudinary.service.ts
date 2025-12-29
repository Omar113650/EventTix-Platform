// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

const upload_id = randomUUID();
import * as streamifier from 'streamifier';

export interface CloudinaryResponse {
  url: string;
  public_id: string;
  upload_id?: string;
  [key: string]: any;
}

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    uploadId?: string, // 👈 لو حصل retry
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // 👇 أول مرة يتولد – بعد كده نبعته تاني
      const upload_id = uploadId || randomUUID();

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          chunk_size: 5_000_000, // 5MB
          resource_type: 'auto',
          upload_id, // ⭐ السطر المهم
        },
        (error, result) => {
          if (error) {
            return reject({ error, upload_id });
          }
          resolve({
            ...(result as CloudinaryResponse),
            upload_id, // نرجّعه للفرونت
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // رفع ملفات متعددة
  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<CloudinaryResponse[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}
