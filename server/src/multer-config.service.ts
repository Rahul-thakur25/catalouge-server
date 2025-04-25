import { Injectable } from '@nestjs/common';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MulterConfigService {
  getConfig() {
    return {
      storage: new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => ({
          folder: 'catalogue_items',
          allowed_formats: ['jpg', 'png', 'jpeg'],
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
        }),
      }),
    };
  }
}
