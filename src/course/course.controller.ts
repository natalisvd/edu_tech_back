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
  BadRequestException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
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
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    let newCourse = createCourseDto;

    // Handle image if provided
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
      newCourse.courseImageUrl = courseImageName;
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    let updatedCourse = updateCourseDto;
    const currentCourse = await this.courseService.findOne(id);
    if (!currentCourse) {
      throw new BadRequestException('Course not found');
    }

    // Handle image update if provided
    if (image) {
      const imageDir = path.join(__dirname, '..', '..', '..', 'images');
      try {
        // Delete old image if it exists
        const oldImagePath = path.join(imageDir, currentCourse.courseImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Create and save new image
        const optimizedImageBuffer = await resizeAndOptimizeImage(image.buffer);
        const fileExt = path.extname(image.originalname);
        const courseImageName = `courseImage_${Date.now()}${fileExt}`;
        const courseImagePath = path.join(imageDir, courseImageName);

        fs.writeFileSync(courseImagePath, optimizedImageBuffer);
        updatedCourse.courseImageUrl = courseImageName;
      } catch (error) {
        console.error('Error updating image:', error);
      }
    }

    return this.courseService.update(id, updatedCourse);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const currentCourse = await this.courseService.findOne(id);
    if (!currentCourse) {
      throw new BadRequestException('Course not found');
    }

    // Delete image associated with the course if it exists
    const imageDir = path.join(__dirname, '..', '..', '..', 'images');
    const courseImagePath = path.join(imageDir, currentCourse.courseImageUrl);
    if (fs.existsSync(courseImagePath)) {
      fs.unlinkSync(courseImagePath);
    }

    return this.courseService.remove(id);
  }
}
