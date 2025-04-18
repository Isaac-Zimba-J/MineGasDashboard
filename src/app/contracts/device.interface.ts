export interface Device {
  name: string;
  temperature: number;
  humidity: number;
  sulphurDioxide: number;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}
