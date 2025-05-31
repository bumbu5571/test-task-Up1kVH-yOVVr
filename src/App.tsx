import { useCallback, useEffect, useState } from 'react';
import type { Car } from './components/my-components-app/carTable/types';
import CarTable from './components/my-components-app/carTable/CarTable';
import {
  delay,
  limit,
} from './components/my-components-app/carTable/constants';
import { Toaster } from '@/components/chakra/toaster';

export default function App() {
  // Локальный state подходит для этого небольшого проекта.
  // В более крупном приложении стейт-менеджер предоставил бы следующие преимущества: централизованное управление состоянием,  отсутствие prop drilling,
  // встроенные инструменты для обработки асинхронных действий и загрузки,  легкость передачи данных между компонентами.  Однако,  для этого проекта это избыточно.
  const [data, setData] = useState<Car[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [errorLoadingCars, setErrorLoadingCars] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(Infinity);

  //  Отслеживает максимальный ID, полученный из JSON Server.
  //  Используется для генерации новых ID на стороне клиента,  обеспечивая последовательность (1, 2, 3...)
  //  поскольку JSON Server использует другой формат ID. ("a67f", "b89c" и т.п.).
  const [totalCountCar, setTotalCountCar] = useState(Infinity);

  async function getCar(pageParam: number, limitParam: number) {
    setIsLoadingCars(true);
    setErrorLoadingCars(false);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const res = await fetch(
        `http://localhost:3000/cars?_sort=-created_at&_page=${pageParam}&_per_page=${limitParam}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const dataDB = await res.json();

      setData((prev) => {
        if (pageParam === 1) {
          return dataDB.data;
        }

        setPage((prev) => prev + 1);
        return [...prev, ...dataDB.data];
      });
      setTotalPage(dataDB.pages);
      setTotalCountCar(dataDB.items);
      setErrorLoadingCars(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorLoadingCars(true);
    } finally {
      setIsLoadingCars(false);
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      getCar(1, limit);
    }
  }, [data]);

  const clickHandle = useCallback(() => {
    if (page >= totalPage) {
      return;
    }

    getCar(page + 1, limit);
  }, [page, totalPage]);

  return (
    <>
      <CarTable
        data={data}
        setData={setData}
        errorLoadingCars={errorLoadingCars}
        isLoadingCars={isLoadingCars}
        clickHandle={clickHandle}
        totalCountCar={totalCountCar}
        setTotalCountCar={setTotalCountCar}
        isLastPage={page >= totalPage}
      />
      <Toaster />
    </>
  );
}
