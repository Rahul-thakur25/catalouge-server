import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: 'daqyeoxpd',
      api_key: '271845684643982',
      api_secret: 'H50wEdoa2FjK0sNVCjk_g2jKF_o',
    });
    return cloudinary;
  },
};
