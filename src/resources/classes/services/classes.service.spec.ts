import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { Class } from '../models/class.model';
import { CreateClassDto } from '../dtos/create-class.dto';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('ClassesService', () => {
  let classesService: ClassesService;
  let classModel: typeof Class;

  const mockClass = {
    id: '1',
    name: 'Math 101',
    description: 'Basic Math Class',
    start_date: '2024-07-10',
    end_date: '2024-08-10',
    created_at: '2024-08-10',
    updated_at: '2024-08-10',
  };

  const mockDto: CreateClassDto = {
    name: 'Math 101',
    description: 'Basic Math Class',
    startDate: '2024-07-10',
    endDate: '2024-08-10',
  };

  const mockClassService = {
    findAll: jest.fn(() => [mockClass]),
    findOne: jest.fn(() => mockClass),
    create: jest.fn(() => mockClass),
    update: jest.fn(() => mockClass),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        { provide: getModelToken(Class), useValue: mockClassService },
      ],
    }).compile();

    classesService = module.get<ClassesService>(ClassesService);
    classModel = module.get<typeof Class>(getModelToken(Class));

    classModel.findByPk = jest.fn().mockResolvedValue(mockClass);
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      const result = await classesService.findAll();
      expect(result).toEqual([mockClass]);
      expect(classModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a class by id', async () => {
      const result = await classesService.findOne('1');
      expect(result).toEqual(mockClass);
      expect(classModel.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw a NotFoundException if class not found', async () => {
      jest.spyOn(classModel, 'findOne').mockResolvedValue(null);
      await expect(classesService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new class', async () => {
      const result = await classesService.create(mockDto);
      expect(result).toEqual(mockClass);
      expect(classModel.create).toHaveBeenCalledWith({
        name: mockDto.name,
        description: mockDto.description,
        start_date: mockDto.startDate,
        end_date: mockDto.endDate,
      });
    });
  });

  describe('update', () => {
    it('should update an existing class', async () => {
      const updateClassDto: CreateClassDto = {
        name: 'Physics 102',
        description: 'Advanced Physics Class',
        startDate: '2024-09-15',
        endDate: '2024-12-15',
      };

      const classInstance = {
        ...mockClass,
        save: jest.fn().mockResolvedValue(mockClass),
      };

      jest.spyOn(classModel, 'findOne').mockResolvedValue(classInstance as any);

      const result = await classesService.update('1', updateClassDto);

      expect(result).toEqual(mockClass);
      expect(classModel.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(classInstance.save).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if class is not found', async () => {
      jest.spyOn(classModel, 'findOne').mockResolvedValue(null);
      await expect(
        classesService.update('1', {} as CreateClassDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an existing class', async () => {
      const classInstance = {
        ...mockClass,
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      jest
        .spyOn(classModel, 'findByPk')
        .mockResolvedValue(classInstance as any);

      await classesService.remove('1');
      expect(classModel.findByPk).toHaveBeenCalledWith('1');
      expect(classInstance.destroy).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if class not found', async () => {
      jest.spyOn(classModel, 'findByPk').mockResolvedValue(null);
      await expect(classesService.remove('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
