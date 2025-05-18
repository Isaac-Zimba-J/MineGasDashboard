import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { FirebaseService } from '../../services/firebase.service';
import { Device } from '../../contracts/device.interface';

interface DeviceMarker {
  position: google.maps.LatLngLiteral;
  title: string;
  label: google.maps.MarkerLabel;
  options: google.maps.MarkerOptions;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  devices: Device[] = [];
  center: google.maps.LatLngLiteral = {
    lat: -1.2921, // Default to Kenya's approximate center
    lng: 36.8219,
  };
  zoom = 6;
  markers: DeviceMarker[] = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 4,
  };
  isMapLoaded = false;

  constructor(private firebaseService: FirebaseService) {
    console.log('Home Component Initialized');
  }

  ngOnInit() {
    console.log('Home Component ngOnInit');
    this.firebaseService.devices$.subscribe(
      (devices) => {
        console.log('Devices received in Home Component:', devices);
        this.devices = devices;
        if (devices.length > 0) {
          // Center the map on the first device if available
          this.center = {
            lat: devices[0].latitude,
            lng: devices[0].longitude,
          };
        }
        this.updateMarkers();
      },
      (error) => {
        console.error('Error in Home Component subscription:', error);
      }
    );

    // Check if Google Maps is loaded
    if (typeof google !== 'undefined' && google.maps) {
      this.isMapLoaded = true;
    } else {
      // Wait for Google Maps to load
      window.addEventListener('load', () => {
        this.isMapLoaded = true;
      });
    }
  }

  private updateMarkers() {
    if (!this.isMapLoaded) return;

    this.markers = this.devices.map((device) => ({
      position: {
        lat: device.latitude,
        lng: device.longitude,
      },
      title: device.name,
      label: {
        text: device.sulphurDioxide > 50 ? '⚠️' : '✅',
        color: device.sulphurDioxide > 50 ? 'red' : 'green',
      },
      options: {
        animation: google.maps.Animation.DROP,
      },
    }));
  }
}
