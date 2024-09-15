import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateClassDto } from '../dtos/create-class.dto';
import { Class } from '../models/class.model';
import { ClassesService } from '../services/classes.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  create(@Body() CreateClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.create(CreateClassDto);
  }

  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Return all classes.' })
  @Get()
  findAll(): Promise<Class[]> {
    return this.classesService.findAll();
  }

  @ApiOperation({ summary: 'Get a class by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Return the class.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Class> {
    return this.classesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a class by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class updated successfully.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() CreateClassDto: CreateClassDto,
  ): Promise<Class> {
    return this.classesService.update(id, CreateClassDto);
  }

  @ApiOperation({ summary: 'Delete a class by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.classesService.remove(id);
  }
}
