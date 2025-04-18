import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
} from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { Device } from '../contracts/device.interface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private devicesSubject = new BehaviorSubject<Device[]>([]);
  devices$ = this.devicesSubject.asObservable();

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyB6QJ6QJ6QJ6QJ6QJ6QJ6QJ6QJ6QJ6QJ6Q',
      authDomain: 'muf-gas.firebaseapp.com',
      projectId: 'muf-gas',
      storageBucket: 'muf-gas.appspot.com',
      messagingSenderId: '123456789012',
      appId: '1:123456789012:web:1234567890123456789012',
      databaseURL: 'https://muf-gas-default-rtdb.firebaseio.com',
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // Set up listener for devices
    const devicesRef = ref(database, 'Devices');
    onValue(
      devicesRef,
      (snapshot) => {
        const devices: Device[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const deviceData = childSnapshot.val();
            devices.push({
              name: childSnapshot.key || '',
              temperature: deviceData.temperature || 0,
              humidity: deviceData.humidity || 0,
              sulphurDioxide: deviceData.sulphurDioxide || 0,
              latitude: deviceData.latitude || 0,
              longitude: deviceData.longitude || 0,
              updatedAt: deviceData.updatedAt
                ? new Date(deviceData.updatedAt)
                : new Date(),
            });
          });
        }
        this.devicesSubject.next(devices);
      },
      (error) => {
        console.error('Error reading from Firebase:', error);
      }
    );
  }

  addDevice(device: Device) {
    const database = getDatabase();
    const devicesRef = ref(database, 'Devices');
    push(devicesRef, {
      name: device.name,
      temperature: device.temperature,
      humidity: device.humidity,
      sulphurDioxide: device.sulphurDioxide,
      latitude: device.latitude,
      longitude: device.longitude,
      updatedAt: new Date().toISOString(),
    });
  }

  updateDevice(deviceName: string, device: Device) {
    const database = getDatabase();
    const deviceRef = ref(database, `Devices/${deviceName}`);
    update(deviceRef, {
      name: device.name,
      temperature: device.temperature,
      humidity: device.humidity,
      sulphurDioxide: device.sulphurDioxide,
      latitude: device.latitude,
      longitude: device.longitude,
      updatedAt: new Date().toISOString(),
    });
  }

  deleteDevice(deviceName: string) {
    const database = getDatabase();
    const deviceRef = ref(database, `Devices/${deviceName}`);
    remove(deviceRef);
  }
}
