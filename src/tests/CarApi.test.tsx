import {
  createCar,
  getCars,
  limit,
} from '@/components/my-components-app/carTable/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/../db.json';
import type { Car } from '@/components/my-components-app/carTable/types';
import type { FormValues } from '@/components/my-components-app/carTable/createCarShema';

const sortedCars = [...db.cars].sort((a, b) => b.created_at - a.created_at);
export const invalidUrl =
  'http://localhost:5010/cars?_sort=-created_at&_page=1&_per_page=10';

describe('GET', async () => {
  const cars = await getCars(1, limit);

  it('успешно загружает корректное количество(limit) отсортированных автомобилей', async () => {
    expect(cars).toBeDefined();
    expect(cars.data.length).toBe(limit);
    expect(cars.data).toEqual(sortedCars.slice(0, limit));
  });

  it('вернуть корректное количество страниц', async () => {
    expect(cars.pages).toBe(Math.ceil(db.cars.length / limit));
  });

  it('вернуть корректное общее количество элементов', async () => {
    expect(cars.items).toBe(db.cars.length);
  });

  it('корректно обрабатывать ошибку с некорректным URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error(`Failed to fetch ${invalidUrl}`)
    );

    await expect(getCars(1, 10)).rejects.toThrowError(
      'Failed to fetch http://localhost:5010/cars?_sort=-created_at&_page=1&_per_page=10'
    );
  });
});

describe('POST', async () => {
  const mockFetch = vi.fn();
  globalThis.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  const formValues: FormValues = {
    make: 'Nissan',
    model: 'Maxima',
    year: 1999,
    color: 'Коричневый',
    engine_capacity: null,
    engine_type: null,
    engine_power: null,
    transmission_type: 'Автоматическая',
    drive_type: null,
    price: 5000,
    fuel_consumption: null,
    is_available: false,
    description: null,
  };

  const newCar = {
    ...formValues,
    id: `${db.cars.length + 1}`,
    created_at: Date.now(),
  } as Car;

  const createFetchResponse = (data: Car, status: number = 200) => ({
    json: () => Promise.resolve(data),
    ok: status >= 200 && status < 300,
    status: status,
  });

  it('Запись нового автомобиля успешно создалась', async () => {
    mockFetch.mockResolvedValue(createFetchResponse(newCar, 200)); // ----

    const carPost = await createCar(
      formValues,
      db.cars.length,
      newCar.created_at
    );

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/cars', {
      method: 'POST',
      body: JSON.stringify(newCar),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    expect(carPost).toStrictEqual(newCar);
  });
});
