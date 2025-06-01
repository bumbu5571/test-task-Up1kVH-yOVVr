import {
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Input,
  NativeSelect,
  NumberInput,
  Portal,
  Spinner,
  Stack,
  Table,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { toaster } from '../../chakra/toaster';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { Car } from './types';
import { createCarformShema, type FormValues } from './createCarShema';
import {
  createCar,
  delay,
  driveTypeArray,
  engineTypeArray,
  transmissionTypeArray,
} from './constants';

export default function CarTable({
  data,
  setData,
  errorLoadingCars,
  isLoadingCars,
  clickHandle,
  totalCountCar,
  setTotalCountCar,
  isLastPage,
}: {
  data: Car[];
  setData: React.Dispatch<React.SetStateAction<Car[]>>;
  errorLoadingCars: boolean;
  isLoadingCars: boolean;
  clickHandle: () => void;
  totalCountCar: number;
  setTotalCountCar: React.Dispatch<React.SetStateAction<number>>;
  isLastPage: boolean;
}) {
  const [isCreatingCar, setIsCreatingCar] = useState(false);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createCarformShema),
    defaultValues: {
      year: 2025,
      engine_capacity: null,
      engine_type: null,
      engine_power: null,
      transmission_type: null,
      drive_type: null,
      price: null,
      fuel_consumption: null,
      is_available: false,
      description: null,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsCreatingCar(true);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const res = createCar(data, totalCountCar);

    res
      .then((data) => {
        setTotalCountCar((prev) => prev + 1);
        setData((prev) => [data, ...prev]);
        reset();
      })
      .finally(() => setIsCreatingCar(false));

    toaster.promise(res, {
      success: {
        title: 'Отлично! Автомобиль добавлен!',
        description: 'Информация сохранена.',
      },
      error: {
        title: 'Извините, произошла ошибка.',
        description:
          'Не удалось добавить автомобиль. Пожалуйста, попробуйте еще раз.',
      },
      loading: {
        title: 'Идет загрузка...',
        description: 'Пожалуйста, подождите',
      },
    });
  });

  return (
    <>
      <Stack
        w='100vw'
        height='100vh'
        direction='column'
        align='center'
        justify='center'
        gapY='5'
      >
        <Text textStyle={{ base: '2xl', lg: '4xl' }} fontWeight='medium'>
          Таблица автомобилей
        </Text>
        {errorLoadingCars ? (
          <Text textStyle={{ base: 'xl', lg: '2xl' }} color='red.600'>
            Не удалось загрузить список автомобилей. Пожалуйста, попробуйте
            позже.
          </Text>
        ) : null}
        {data.length === 0 && isLoadingCars ? (
          <Spinner size='lg' color='Highlight' borderWidth='4px' />
        ) : (
          <>
            <Table.ScrollArea
              maxW='2/3'
              maxH='4/6'
              h={`${data.length * 45 + 44.5}px`}
              borderWidth='1px'
              rounded='md'
              transition='height 1.5s ease-in-out'
              hidden={data.length === 0}
            >
              <Table.Root
                size={{ base: 'sm', lg: 'md' }}
                variant='outline'
                showColumnBorder
              >
                <Table.Header>
                  <Table.Row bg='Highlight'>
                    <Table.ColumnHeader>Марка</Table.ColumnHeader>
                    <Table.ColumnHeader>Модель</Table.ColumnHeader>
                    <Table.ColumnHeader>Год выпуска</Table.ColumnHeader>
                    <Table.ColumnHeader>Цвет</Table.ColumnHeader>
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
                  {data.map((car) => (
                    <Table.Row key={car.id}>
                      <Table.Cell>{car.make}</Table.Cell>
                      <Table.Cell>{car.model}</Table.Cell>
                      <Table.Cell>{car.year} г</Table.Cell>
                      <Table.Cell>{car.color}</Table.Cell>
                      <Table.Cell>
                        {car.engine_capacity
                          ? `${car.engine_capacity} л`
                          : null}
                      </Table.Cell>
                      <Table.Cell>{car.engine_type}</Table.Cell>
                      <Table.Cell>
                        {car.engine_power ? `${car.engine_power} л.с.` : null}
                      </Table.Cell>
                      <Table.Cell>{car.transmission_type}</Table.Cell>
                      <Table.Cell>{car.drive_type}</Table.Cell>
                      <Table.Cell>
                        {car.price ? `${car.price} \u0024` : null}
                      </Table.Cell>
                      <Table.Cell>
                        {car.fuel_consumption
                          ? `${car.fuel_consumption} л/100км`
                          : null}
                      </Table.Cell>
                      <Table.Cell textAlign='center'>
                        {car.is_available ? '\u2705' : '\u274C'}
                      </Table.Cell>
                      <Table.Cell textAlign='center'>
                        {car.description}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>

            <Stack direction={{ base: 'column', lg: 'row' }}>
              <Button
                loading={isLoadingCars}
                loadingText='Загрузка данных...'
                onClick={clickHandle}
                bg='Highlight'
                color='white'
                disabled={isLastPage || isLoadingCars}
                minW='48'
              >
                Загрузить больше
              </Button>

              <Dialog.Root
                size='lg'
                placement='center'
                closeOnInteractOutside={!isCreatingCar}
              >
                <Dialog.Trigger asChild>
                  <Button
                    minW='48'
                    bg='green.600'
                    color='gray.950'
                    disabled={isLoadingCars || data.length === 0}
                  >
                    Добавить автомобиль
                  </Button>
                </Dialog.Trigger>

                <Portal>
                  <Dialog.Backdrop />

                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>Новый автомобиль</Dialog.Title>
                        <Dialog.CloseTrigger asChild disabled={isCreatingCar}>
                          <CloseButton size='sm' />
                        </Dialog.CloseTrigger>
                      </Dialog.Header>

                      <Dialog.Body>
                        <form
                          action=''
                          onSubmit={onSubmit}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: '10px',
                          }}
                        >
                          <Field.Root invalid={!!errors.make} required>
                            <Field.Label>
                              Марка
                              <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                              placeholder='УАЗ'
                              {...register('make')}
                              disabled={isCreatingCar}
                            />
                            <Field.ErrorText>
                              {errors.make?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.model} required>
                            <Field.Label>
                              Модель
                              <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                              disabled={isCreatingCar}
                              placeholder='Патриот'
                              {...register('model')}
                            />
                            <Field.ErrorText>
                              {errors.model?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.year} required>
                            <Field.Label>
                              Год выпуска <Field.RequiredIndicator />
                            </Field.Label>

                            <Controller
                              name='year'
                              control={control}
                              render={({ field }) => (
                                <NumberInput.Root
                                  disabled={field.disabled || isCreatingCar}
                                  name={field.name}
                                  value={String(field.value)}
                                  onValueChange={({ value }) => {
                                    field.onChange(Number(value));
                                  }}
                                  w='full'
                                >
                                  <NumberInput.Control />
                                  <NumberInput.Input onBlur={field.onBlur} />
                                </NumberInput.Root>
                              )}
                            />

                            <Field.HelperText>
                              Введите год выпуска (например - 2023, диапазон
                              1900 - {new Date().getFullYear() + 1})
                            </Field.HelperText>

                            <Field.ErrorText>
                              {errors.year?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.color} required>
                            <Field.Label>
                              Цвет
                              <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                              disabled={isCreatingCar}
                              placeholder='Зелёный'
                              {...register('color')}
                            />
                            <Field.ErrorText>
                              {errors.color?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.engine_capacity}>
                            <Field.Label>Объём двигателя(литр)</Field.Label>

                            <Controller
                              name='engine_capacity'
                              control={control}
                              render={({ field }) => (
                                <NumberInput.Root
                                  disabled={field.disabled || isCreatingCar}
                                  name={field.name}
                                  value={field.value ? String(field.value) : ''}
                                  onValueChange={({ value }) => {
                                    field.onChange(
                                      value ? Number(value) : null
                                    );
                                  }}
                                  step={0.1}
                                  w='full'
                                >
                                  <NumberInput.Control />
                                  <NumberInput.Input onBlur={field.onBlur} />
                                </NumberInput.Root>
                              )}
                            />

                            <Field.HelperText>
                              Введите объём двигателя в литрах (например, 2.0)
                            </Field.HelperText>

                            <Field.ErrorText>
                              {errors.engine_capacity?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.engine_type}>
                            <Field.Label>Тип двигателя</Field.Label>

                            <NativeSelect.Root>
                              <NativeSelect.Field
                                disabled={isCreatingCar}
                                {...register('engine_type')}
                              >
                                <option value=''>Выберете вариант</option>
                                {engineTypeArray.map((item) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>

                            <Field.ErrorText>
                              {errors.engine_type?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.engine_power}>
                            <Field.Label>Мощность двигателя(л.с.)</Field.Label>

                            <Controller
                              name='engine_power'
                              control={control}
                              render={({ field }) => (
                                <NumberInput.Root
                                  disabled={field.disabled || isCreatingCar}
                                  name={field.name}
                                  value={field.value ? String(field.value) : ''}
                                  onValueChange={({ value }) => {
                                    field.onChange(
                                      value ? Number(value) : null
                                    );
                                  }}
                                  w='full'
                                >
                                  <NumberInput.Control />
                                  <NumberInput.Input onBlur={field.onBlur} />
                                </NumberInput.Root>
                              )}
                            />

                            <Field.HelperText>
                              Введите мощность двигателя в лошадиных силах
                              (например, 128)
                            </Field.HelperText>

                            <Field.ErrorText>
                              {errors.engine_power?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.transmission_type}>
                            <Field.Label>Тип трансмиссии</Field.Label>

                            <NativeSelect.Root>
                              <NativeSelect.Field
                                disabled={isCreatingCar}
                                {...register('transmission_type')}
                              >
                                <option value=''>Выберете вариант</option>
                                {transmissionTypeArray.map((item) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>

                            <Field.ErrorText>
                              {errors.transmission_type?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.drive_type}>
                            <Field.Label>Тип привода</Field.Label>

                            <NativeSelect.Root>
                              <NativeSelect.Field
                                disabled={isCreatingCar}
                                {...register('drive_type')}
                              >
                                <option value=''>Выберете вариант</option>
                                {driveTypeArray.map((item) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>

                            <Field.ErrorText>
                              {errors.drive_type?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.price}>
                            <Field.Label>Цена(USD)</Field.Label>

                            <Controller
                              name='price'
                              control={control}
                              render={({ field }) => (
                                <NumberInput.Root
                                  disabled={field.disabled || isCreatingCar}
                                  name={field.name}
                                  value={field.value ? String(field.value) : ''}
                                  onValueChange={({ value }) => {
                                    field.onChange(
                                      value ? Number(value) : null
                                    );
                                  }}
                                  step={1000}
                                  w='full'
                                >
                                  <NumberInput.Control />
                                  <NumberInput.Input onBlur={field.onBlur} />
                                </NumberInput.Root>
                              )}
                            />

                            <Field.HelperText>
                              Укажите цену в долларах США (например, 15000)
                            </Field.HelperText>

                            <Field.ErrorText>
                              {errors.price?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Field.Root invalid={!!errors.fuel_consumption}>
                            <Field.Label>Расход топлива(л/100км)</Field.Label>

                            <Controller
                              name='fuel_consumption'
                              control={control}
                              render={({ field }) => (
                                <NumberInput.Root
                                  disabled={field.disabled || isCreatingCar}
                                  name={field.name}
                                  value={field.value ? String(field.value) : ''}
                                  onValueChange={({ value }) => {
                                    field.onChange(
                                      value ? Number(value) : null
                                    );
                                  }}
                                  step={0.1}
                                  w='full'
                                >
                                  <NumberInput.Control />
                                  <NumberInput.Input onBlur={field.onBlur} />
                                </NumberInput.Root>
                              )}
                            />

                            <Field.HelperText>
                              Укажите расход топлива в литрах на 100 км
                              (например, 7.5)
                            </Field.HelperText>

                            <Field.ErrorText>
                              {errors.fuel_consumption?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Controller
                            control={control}
                            name='is_available'
                            render={({ field }) => (
                              <Field.Root
                                invalid={!!errors.is_available}
                                disabled={field.disabled || isCreatingCar}
                              >
                                <Checkbox.Root
                                  checked={field.value}
                                  onCheckedChange={({ checked }) =>
                                    field.onChange(checked)
                                  }
                                >
                                  <Checkbox.HiddenInput />
                                  <Checkbox.Control />
                                  <Checkbox.Label>
                                    Отметьте, если автомобиль доступен для
                                    продажи
                                  </Checkbox.Label>
                                </Checkbox.Root>

                                <Field.ErrorText>
                                  {errors.is_available?.message}
                                </Field.ErrorText>
                              </Field.Root>
                            )}
                          />

                          <Field.Root invalid={!!errors.description}>
                            <Field.Label>Описание</Field.Label>

                            <Textarea
                              disabled={isCreatingCar}
                              {...register('description')}
                              placeholder='В октябре 2014 года УАЗ начал прием заказов на обновленную версию внедорожника УАЗ Патриот.'
                            />

                            <Field.ErrorText>
                              {errors.description?.message}
                            </Field.ErrorText>
                          </Field.Root>

                          <Button
                            type='submit'
                            disabled={isCreatingCar}
                            loading={isCreatingCar}
                            loadingText='Отправляем данные ...'
                            bg='green.600'
                            color='gray.950'
                          >
                            Добавить
                          </Button>
                        </form>
                      </Dialog.Body>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
}
