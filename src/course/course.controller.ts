import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { resizeAndOptimizeImage } from 'libs/common/src/helpers/resize-image-helper';
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCourseDto: Prisma.CourseCreateInput,
    @UploadedFile() image: Express.Multer.File,
  ) {
    let newCourse = createCourseDto;

    if (image) {
      const imageDir = path.join(__dirname, '..', '..', '..', 'images');
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      const optimizedImageBuffer = await resizeAndOptimizeImage(image.buffer);
      const fileExt = path.extname(image.originalname);
      const courseImageName = `courseImage_${Date.now()}${fileExt}`;
      const courseImagePath = path.join(imageDir, courseImageName);

      fs.writeFileSync(courseImagePath, optimizedImageBuffer);
      newCourse.courseImageUrl =courseImageName
    }
    return this.courseService.create(newCourse);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: Prisma.CourseUpdateInput,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
