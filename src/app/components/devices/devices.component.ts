import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Device } from '../../contracts/device.interface';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  devices: Device[] = [];
  currentDevice: Device | null = null;
  isEditing = false;
  showModal = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.devices$.subscribe((devices) => {
      this.devices = devices;
    });
  }

  resetForm() {
    this.currentDevice = null;
    this.isEditing = false;
    this.showModal = false;
  }

  addNewDevice() {
    this.currentDevice = {
      name: '',
      temperature: 0,
      humidity: 0,
      sulphurDioxide: 0,
      latitude: 0,
      longitude: 0,
      updatedAt: new Date(),
    };
    this.isEditing = false;
    this.showModal = true;
  }

  editDevice(device: Device) {
    this.currentDevice = { ...device };
    this.isEditing = true;
    this.showModal = true;
  }

  deleteDevice(deviceName: string) {
    if (confirm('Are you sure you want to delete this device?')) {
      this.firebaseService.deleteDevice(deviceName);
    }
  }

  onSubmit() {
    if (this.currentDevice) {
      // Update the timestamp before saving
      this.currentDevice.updatedAt = new Date();

      if (this.isEditing) {
        this.firebaseService.updateDevice(
          this.currentDevice.name,
          this.currentDevice
        );
      } else {
        this.firebaseService.addDevice(this.currentDevice);
      }
      this.resetForm();
    }
  }
}
