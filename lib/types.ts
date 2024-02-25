export type MeasurementsResponse = {
  meta: { name: string };
  results: {
    locationId: number;
    location: string;
    parameter: string;
    value: number;
    date: { utc: string; local: string };
    unit: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    country: string;
    isMobile: boolean;
    entity: string;
    sensorType: string;
  }[];
};

export type geoDataType = {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  readme: string;
} | null;
