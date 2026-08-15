export type ValidationMessageFactory = (error: unknown) => string;

interface LengthError {
  requiredLength: number;
}

interface RangeError {
  min?: number;
  max?: number;
}

interface ServerError {
  message: string;
}

const lengthOf = (error: unknown): number => (error as LengthError).requiredLength;

export const VALIDATION_MESSAGES: Readonly<Record<string, ValidationMessageFactory>> = {
  required: () => 'กรุณากรอกข้อมูลนี้',
  requiredTrue: () => 'กรุณายืนยันรายการนี้ก่อนดำเนินการต่อ',
  notBlank: () => 'ห้ามกรอกเฉพาะช่องว่าง',
  email: () => 'รูปแบบอีเมลไม่ถูกต้อง',
  username: () => 'ใช้ได้เฉพาะตัวอักษร ตัวเลข และ . _ - @ ความยาว 3-100 ตัวอักษร',
  minlength: (error) => `ต้องมีอย่างน้อย ${lengthOf(error)} ตัวอักษร`,
  maxlength: (error) => `ต้องไม่เกิน ${lengthOf(error)} ตัวอักษร`,
  maxTrimmedLength: (error) => `ต้องไม่เกิน ${lengthOf(error)} ตัวอักษร`,
  min: (error) => `ต้องไม่น้อยกว่า ${(error as RangeError).min}`,
  max: (error) => `ต้องไม่มากกว่า ${(error as RangeError).max}`,
  pattern: () => 'รูปแบบข้อมูลไม่ถูกต้อง',
  isoDate: () => 'รูปแบบวันที่ต้องเป็น ปปปป-ดด-วว',
  httpUrl: () => 'ต้องเป็น URL ที่ขึ้นต้นด้วย http:// หรือ https://',
  match: () => 'ค่าที่กรอกไม่ตรงกัน',
  serverError: (error) => (error as ServerError).message,
};

export const FALLBACK_VALIDATION_MESSAGE = 'ข้อมูลไม่ถูกต้อง';

export function validationMessage(key: string, error: unknown): string {
  const factory = VALIDATION_MESSAGES[key];

  return factory ? factory(error) : FALLBACK_VALIDATION_MESSAGE;
}
