export interface FuelProduct {
  price: number;
  minPrice: number;
  maxPrice: number;
}

export interface AreaData {
  area: string;
  fuels: {
    [fuel: string]: {
      [station: string]: FuelProduct;
    };
  };
}

export interface ApiResponse {
  cities: string[];
  fuelTypes: string[];
  fuelPrices: AreaData[];
}