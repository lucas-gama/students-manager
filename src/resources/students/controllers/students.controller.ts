import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../models/student.model';
import { StudentsService } from '../services/students.service';
import { Class } from '../../classes/models/class.model';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post()
  create(@Body() CreateStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(CreateStudentDto);
  }

  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'Return all students.' })
  @Get()
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Return the student.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student updated successfully.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() CreateStudentDto: CreateStudentDto,
  ): Promise<Student> {
    return this.studentsService.update(id, CreateStudentDto);
  }

  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  @ApiResponse({ status: 204, description: 'Student deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.studentsService.remove(id);
  }

  @ApiOperation({ summary: 'Enroll a student in a class' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student ID' })
  @ApiParam({ name: 'classId', type: 'string', description: 'Class ID' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully.' })
  @ApiResponse({ status: 404, description: 'Student or Class not found.' })
  @ApiResponse({
    status: 409,
    description: 'Student is already enrolled in this class.',
  })
  @Post(':studentId/enroll/:classId')
  enroll(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
  ): Promise<void> {
    return this.studentsService.enroll(studentId, classId);
  }

  @ApiOperation({ summary: 'Unenroll a student from a class' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student ID' })
  @ApiParam({ name: 'classId', type: 'string', description: 'Class ID' })
  @ApiResponse({ status: 204, description: 'Student unenrolled successfully.' })
  @ApiResponse({ status: 404, description: 'Student or Class not found.' })
  @ApiResponse({
    status: 409,
    description: 'The student is not enrolled in the specified class.',
  })
  @Delete(':studentId/enroll/:classId')
  unenroll(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
  ): Promise<void> {
    return this.studentsService.unenroll(studentId, classId);
  }

  @ApiOperation({ summary: 'Get all classes of a student' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all classes of the student.',
  })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @Get(':id/classes')
  getClasses(@Param('id') id: string): Promise<Class[]> {
    return this.studentsService.getClasses(id);
  }
}
