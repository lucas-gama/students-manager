import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getModelToken } from '@nestjs/sequelize';
import { Student } from '../models/student.model';
import { Class } from '../../classes/models/class.model';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';

describe('StudentsService', () => {
  let studentService: StudentsService;
  let studentModel: typeof Student;
  let classModel: typeof Class;

  const mockStudent = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    date_of_birth: '2024-09-10',
    created_at: '2024-08-10',
    updated_at: '2024-08-10',
  };

  const mockStudentDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2024-09-10',
  };

  const mockStudentService = {
    findAll: jest.fn(() => [mockStudent]),
    findOne: jest.fn(() => mockStudent),
    create: jest.fn(() => mockStudent),
    update: jest.fn(() => mockStudent),
  };

  const mockClass = {
    id: '1',
    name: 'English',
    description: 'English class',
    start_date: '2024-09-10',
    end_date: '2024-10-10',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(Student),
          useValue: mockStudentService,
        },
        {
          provide: getModelToken(Class),
          useValue: {
            findByPk: jest.fn().mockResolvedValue(mockClass),
          },
        },
      ],
    }).compile();

    studentService = module.get<StudentsService>(StudentsService);
    studentModel = module.get<typeof Student>(getModelToken(Student));

    studentModel.findByPk = jest.fn().mockResolvedValue(mockClass);
    // @ts-ignore
    studentModel.getClasses = jest.fn().mockResolvedValue([mockClass]);

    classModel = module.get<typeof Class>(getModelToken(Class));
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const result = await studentService.findAll();
      expect(result).toEqual([mockStudent]);
      expect(studentModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single student by ID', async () => {
      const result = await studentService.findOne('1');
      expect(result).toEqual(mockStudent);
      expect(studentModel.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw a NotFoundException if student is not found', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(null);

      await expect(studentService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const result = await studentService.create(mockStudentDto);
      expect(result).toEqual(mockStudent);
      expect(studentModel.create).toHaveBeenCalledWith({
        first_name: mockStudentDto.firstName,
        last_name: mockStudentDto.lastName,
        email: mockStudentDto.email,
        date_of_birth: mockStudentDto.dateOfBirth,
      });
    });

    it('should throw a ConflictException if email already exists', async () => {
      jest
        .spyOn(studentModel, 'create')
        .mockRejectedValue(new UniqueConstraintError({}));

      await expect(studentService.create(mockStudentDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing student', async () => {
      const updateStudentDto = {
        firstName: 'Lucas',
        lastName: 'Gama',
        email: 'lucas@gmail.com',
        dateOfBirth: '1997-08-15',
      };

      const studentInstance = {
        ...mockStudent,
        save: jest.fn().mockResolvedValue(mockStudent),
      };
      jest
        .spyOn(studentModel, 'findOne')
        .mockResolvedValue(studentInstance as any);

      const result = await studentService.update('1', updateStudentDto);

      expect(studentModel.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(studentInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockStudent);
    });

    it('should throw a NotFoundException if student is not found', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(null);

      await expect(studentService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing student', async () => {
      const studentInstance = {
        ...mockStudent,
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      jest
        .spyOn(studentModel, 'findByPk')
        .mockResolvedValue(studentInstance as any);

      await studentService.remove('1');

      expect(studentModel.findByPk).toHaveBeenCalledWith('1');
      expect(studentInstance.destroy).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if student is not found', async () => {
      jest.spyOn(studentModel, 'findByPk').mockResolvedValue(null);
      await expect(studentService.remove('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('enroll', () => {
    it('should enroll a student in a class', async () => {
      const studentInstance = {
        ...mockStudent,
        getClasses: jest.fn().mockResolvedValue([]),
        addClass: jest.fn().mockResolvedValue(undefined),
      };

      jest
        .spyOn(studentModel, 'findByPk')
        .mockResolvedValue(studentInstance as any);

      jest.spyOn(classModel, 'findByPk').mockResolvedValue(mockClass as any);

      await studentService.enroll('1', '1');

      expect(studentInstance.addClass).toHaveBeenCalledWith(mockClass);
      expect(studentInstance.getClasses).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw a NotFoundException if student is not found', async () => {
      jest.spyOn(studentModel, 'findByPk').mockResolvedValue(null);

      await expect(studentService.enroll('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException if class is not found', async () => {
      jest.spyOn(classModel, 'findByPk').mockResolvedValue(null);

      await expect(studentService.enroll('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if the student is already enrolled', async () => {
      jest.spyOn(studentModel, 'findByPk').mockResolvedValue({
        ...mockStudent,
        getClasses: jest.fn().mockResolvedValue([mockClass]),
      } as any);

      await expect(studentService.enroll('1', '1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('unenroll', () => {
    it('should unenroll a student from a class', async () => {
      const studentInstance = {
        ...mockStudent,
        getClasses: jest.fn().mockResolvedValue([mockClass]),
        removeClass: jest.fn().mockResolvedValue(undefined),
      };

      jest
        .spyOn(studentModel, 'findByPk')
        .mockResolvedValue(studentInstance as any);

      jest.spyOn(classModel, 'findByPk').mockResolvedValue(mockClass as any);

      await studentService.unenroll('1', '1');
      expect(studentInstance.removeClass).toHaveBeenCalledWith(mockClass);
    });

    it('should throw a NotFoundException if student is not found', async () => {
      jest.spyOn(studentModel, 'findByPk').mockResolvedValue(null);
      await expect(studentService.unenroll('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException if class is not found', async () => {
      jest.spyOn(classModel, 'findByPk').mockResolvedValue(null);
      await expect(studentService.unenroll('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if the student is not enrolled', async () => {
      jest.spyOn(studentModel, 'findByPk').mockResolvedValue({
        ...mockStudent,
        getClasses: jest.fn().mockResolvedValue([]),
      } as any);

      jest.spyOn(classModel, 'findByPk').mockResolvedValue(mockClass as any);

      await expect(studentService.unenroll('1', '1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getClasses', () => {
    it("should return the student's classes", async () => {
      const mockStudentWithClasses = {
        ...mockStudent,
        classes: [mockClass],
      };

      jest
        .spyOn(studentModel, 'findByPk')
        .mockResolvedValue(mockStudentWithClasses as any);

      const result = await studentService.getClasses('1');

      expect(studentModel.findByPk).toHaveBeenCalledWith('1', {
        include: {
          association: 'classes',
          through: { attributes: [] },
        },
      });
      expect(result).toEqual([mockClass]);
    });

    it('should throw a NotFoundException if student is not found', async () => {
      jest.spyOn(studentModel, 'findByPk').mockResolvedValue(null);

      await expect(studentService.getClasses('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
