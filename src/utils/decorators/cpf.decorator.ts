import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

export const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;

@ValidatorConstraint({ name: 'isCPFConstraint', async: true })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean | Promise<boolean> {
    return cpf ? regex.test(cpf.replace(/\D/g, '')) : false;
  }

  defaultMessage(): string {
    return 'CPF is not valid. The valid format is XXX.XXX.XXX-XX';
  }
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCPFConstraint,
    });
  };
}
