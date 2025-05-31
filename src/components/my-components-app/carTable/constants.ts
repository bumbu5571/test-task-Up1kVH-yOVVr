import type { Car } from './types';

export const limit = 20; // Ограничение количества записей с БД.
export const delay = 1500; // Задержка для имитации сетевого запроса.

// Массивы допустимых значений.
// Это централизованное хранилище значений,  используемое для:
//   - Валидации данных (Zod):  Обеспечивает корректность вводимых данных.
//   - Заполнения выпадающих списков (NativeSelect):  Упрощает создание интерфейса.
//   - Улучшение поддерживаемости:  Изменение списка значений требуется только в одном месте.

export const engineTypeArray: Array<Exclude<Car['engine_type'], null>> = [
  'Бензиновый',
  'Газовый',
  'Дизельный',
  'Электрический',
];

export const transmissionTypeArray: Array<
  Exclude<Car['transmission_type'], null>
> = ['Механическая', 'Автоматическая'];

export const driveTypeArray: Array<Exclude<Car['drive_type'], null>> = [
  'Полный привод',
  'Задний привод',
  'Передний привод',
];
