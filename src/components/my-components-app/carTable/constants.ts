import type { FormValues } from './createCarShema';
import type { APIResponse, Car } from './types';

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

export async function getCars(
  pageParam: number,
  limitParam: number
): Promise<APIResponse<Car>> {
  try {
    const res = await fetch(
      `http://localhost:3000/cars?_sort=-created_at&_page=${pageParam}&_per_page=${limitParam}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function createCar(
  data: FormValues,
  totalId: number,
  created_at: number = Date.now()
): Promise<Car> {
  try {
    const res = await fetch(`http://localhost:3000/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        ...data,
        id: String(totalId + 1),
        created_at,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
