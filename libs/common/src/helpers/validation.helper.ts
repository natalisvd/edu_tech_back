import { plainToClass, plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

export async function validateDto(dtoClass: any, data: any): Promise<void> {
  const dtoInstance = plainToInstance(dtoClass, data);
  try {
    await validateOrReject(dtoInstance, { forbidUnknownValues: true });
  } catch (errors) {
    const errorMessages = getErrorMessages(errors);
    throw new Error(`Validation failed: ${errorMessages}`);
  }
}

function getErrorMessages(errors: ValidationError[]): string {
  const errorMessages: string[] = [];
  errors.forEach(error => {
    Object.values(error.constraints).forEach(message => {
      errorMessages.push(message);
    });
  });
  return errorMessages.join(', ');
}