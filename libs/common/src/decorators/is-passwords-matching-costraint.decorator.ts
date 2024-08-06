import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { RegisterDto } from "src/auth/dto";

@ValidatorConstraint({name: 'IsPasswordsMatching', async: false})
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface{
    validate(passwordRepeat: string, args?: ValidationArguments): boolean  {
        const obj = args.object as RegisterDto;
        return obj.password === passwordRepeat
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Passwords did not match'
    }
}