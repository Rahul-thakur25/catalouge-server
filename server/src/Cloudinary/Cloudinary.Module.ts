import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './Cloudinary.provider';

@Module({
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
