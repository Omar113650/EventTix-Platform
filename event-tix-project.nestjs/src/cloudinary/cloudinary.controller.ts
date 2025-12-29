import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Body } from '@nestjs/common';

@Controller('upload')
export class AppController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10000000, files: 1 } }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('uploadId') uploadId?: string,
  ) {
    return this.cloudinaryService.uploadFile(file, uploadId);
  }
  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 5, { limits: { fileSize: 10000000 } }),
  ) // 5 ملفات كحد أقصى
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadFiles(files);
  }
}
