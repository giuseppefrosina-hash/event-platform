import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result: any =
      await this.cloudinaryService.uploadImage(file);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}