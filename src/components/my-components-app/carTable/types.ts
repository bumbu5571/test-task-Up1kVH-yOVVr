export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engine_capacity: number | null;
  engine_type: 'Бензиновый' | 'Дизельный' | 'Электрический' | 'Газовый' | null;
  engine_power: number | null;
  transmission_type: 'Механическая' | 'Автоматическая' | null;
  drive_type: 'Полный привод' | 'Задний привод' | 'Передний привод' | null;
  price: number | null;
  fuel_consumption: number | null;
  is_available: boolean;
  description: string | null;
  created_at: number;
}

export interface APIResponse<T> {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
}
