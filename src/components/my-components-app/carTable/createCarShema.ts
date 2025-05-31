import { z } from 'zod';
import {
  driveTypeArray,
  engineTypeArray,
  transmissionTypeArray,
} from './constants';

export const createCarformShema = z.object({
  make: z
    .string()
    .min(2, { message: 'Марка должна содержать минимум 2 символа' })
    .max(20, { message: 'Марка не должна превышать 20 символов' }),
  model: z
    .string()
    .min(2, { message: 'Модель должна содержать минимум 2 символа' })
    .max(20, { message: 'Модель не должна превышать 20 символов' }),
  year: z
    .number({ invalid_type_error: 'Год должен быть числом' })
    .min(1900, { message: 'Год не может быть раньше 1900' })
    .max(new Date().getFullYear() + 1, {
      message: 'Год не может быть позже следующего года',
    }),
  color: z
    .string()
    .min(2, { message: 'Цвет должен содержать минимум 2 символа' })
    .max(20, { message: 'Цвет не должен превышать 20 символов' }),
  engine_capacity: z
    .number({ invalid_type_error: 'Объем двигателя должен быть числом' })
    .min(1, { message: 'Объём двигателя должен быть не менее 1 литра' })
    .max(10, { message: 'Объём двигателя не должен превышать 10 литров' })
    .transform((val) => Number(val.toFixed(1)))
    .nullable(),
  engine_type: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => {
      return [...engineTypeArray, null].includes(
        val as (typeof engineTypeArray)[number]
      )
        ? true
        : false;
    })
    .nullable(),
  engine_power: z
    .number({ invalid_type_error: 'Мощность должна быть числом' })
    .min(30, { message: 'Мощность должна быть не менее 30 л.с.' })
    .max(3000, { message: 'Мощность не должна превышать 3000 л.с.' })
    .transform((val) => Number(val.toFixed(2)))
    .nullable(),
  transmission_type: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => {
      return [...transmissionTypeArray, null].includes(
        val as (typeof transmissionTypeArray)[number]
      )
        ? true
        : false;
    })
    .nullable(),
  drive_type: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => {
      return [...driveTypeArray, null].includes(
        val as (typeof driveTypeArray)[number]
      )
        ? true
        : false;
    })
    .nullable(),
  price: z
    .number({ invalid_type_error: 'Цена должна быть числом' })
    .min(1000, { message: 'Цена должна быть не менее 1000' })
    .max(100000, { message: 'Цена не должна превышать 100000' })
    .transform((val) => Number(val.toFixed(0)))
    .nullable(),
  fuel_consumption: z
    .number({ invalid_type_error: 'Расход топлива должен быть числом' })
    .min(1, { message: 'Расход топлива должен быть не менее 1 литра' })
    .max(100, { message: 'Расход топлива не должен превышать 100 литров' })
    .transform((val) => Number(val.toFixed(1)))
    .nullable(),
  is_available: z.boolean(),
  description: z
    .string()
    .max(1000, { message: 'Описание не должно превышать 1000 символов' })
    .transform((val) => (val === '' ? null : val))
    .nullable(),
});

export type FormValues = z.infer<typeof createCarformShema>;
