import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { Device } from '../../contracts/device.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  devices: Device[] = [];

  constructor(private firebaseService: FirebaseService) {
    console.log('Home Component Initialized');
  }

  ngOnInit() {
    console.log('Home Component ngOnInit');
    this.firebaseService.devices$.subscribe(
      (devices) => {
        console.log('Devices received in Home Component:', devices);
        this.devices = devices;
      },
      (error) => {
        console.error('Error in Home Component subscription:', error);
      }
    );
  }
}
