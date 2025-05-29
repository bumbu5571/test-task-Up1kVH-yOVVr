import { Button, Flex, Table, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engine_capacity: number | null;
  engine_type: string | null;
  engine_power: number | null;
  transmission_type: string | null;
  drive_type: string | null;
  price: number | null;
  fuel_consumption: number | null;
  is_available: boolean | null;
  description: string | null;
}

export default function App() {
  const [data, setData] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(Infinity);

  useEffect(() => {
    if (data.length === 0) {
      fetch(`http://localhost:3000/cars?_page=1&_per_page=10`)
        .then((res) => res.json())
        .then((dataDB) => {
          setData(dataDB.data);
          setTotalPage(dataDB.pages);
        });
    }
  }, [data]);

  function clickHandle() {
    if (page >= totalPage) {
      return;
    }

    fetch(`http://localhost:3000/cars?_page=${page + 1}&_per_page=10`)
      .then((res) => res.json())
      .then((dataDB) => {
        setData((prev) => [...prev, ...dataDB.data]);
        setTotalPage(dataDB.pages);
      });
    setPage((prev) => prev + 1);
  }

  return (
    <Flex
      w='100vw'
      height='100vh'
      direction='column'
      align='center'
      justify='center'
      gapY='5'
    >
      <Text textStyle='4xl' fontWeight='medium'>
        Таблица автомобилей
      </Text>
      <Table.ScrollArea
        maxW='2/3'
        maxH='4/6'
        h={`${data.length * 37 + 36.5}px`}
        borderWidth='1px'
        rounded='md'
        transition='height 0.5s ease-in-out'
      >
        <Table.Root size='sm' variant='outline' showColumnBorder>
          <Table.Header>
            <Table.Row bg='Highlight'>
              <Table.ColumnHeader>Марка</Table.ColumnHeader>
              <Table.ColumnHeader>Модель</Table.ColumnHeader>
              <Table.ColumnHeader>Год выпуска</Table.ColumnHeader>
              <Table.ColumnHeader>Объём двигателя</Table.ColumnHeader>
              <Table.ColumnHeader>Тип двигателя</Table.ColumnHeader>
              <Table.ColumnHeader>Мощность двигателя</Table.ColumnHeader>
              <Table.ColumnHeader>Тип трансмиссии</Table.ColumnHeader>
              <Table.ColumnHeader>Тип привода</Table.ColumnHeader>
              <Table.ColumnHeader>Цена</Table.ColumnHeader>
              <Table.ColumnHeader>Расход топлива</Table.ColumnHeader>
              <Table.ColumnHeader>В наличии</Table.ColumnHeader>
              <Table.ColumnHeader textAlign='center'>
                Описание
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.map((car) => (
              <Table.Row key={car.id}>
                <Table.Cell>{car.make}</Table.Cell>
                <Table.Cell>{car.model}</Table.Cell>
                <Table.Cell>{car.year} г</Table.Cell>
                <Table.Cell>
                  {car.engine_capacity ? `${car.engine_capacity} л` : null}
                </Table.Cell>
                <Table.Cell>{car.engine_type}</Table.Cell>
                <Table.Cell>
                  {car.engine_power ? `${car.engine_power} л.с.` : null}
                </Table.Cell>
                <Table.Cell>{car.transmission_type}</Table.Cell>
                <Table.Cell>{car.drive_type}</Table.Cell>
                <Table.Cell>{`${car.price} \u0024`}</Table.Cell>
                <Table.Cell>
                  {car.fuel_consumption
                    ? `${car.fuel_consumption} л/100км`
                    : null}
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  {car.is_available ? '\u2705' : '\u274C'}
                </Table.Cell>
                <Table.Cell textAlign='center'>{car.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Button
        onClick={clickHandle}
        bg='Highlight'
        color='white'
        disabled={page >= totalPage}
      >
        Загрузить больше
      </Button>
    </Flex>
  );
}
