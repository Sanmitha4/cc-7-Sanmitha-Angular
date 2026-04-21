import {
  Component,
  signal,
  effect,
  computed,
  ChangeDetectionStrategy,
  linkedSignal,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './linked-signal-demo.html',
  styleUrl: './linked-signal-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSignalDemo {
  userStatus = signal<'online' | 'away' | 'offline'>('offline');
  notificationPreference = signal<boolean>(this.userStatus() === 'online');

  constructor() {
    effect(() => {
      if (this.userStatus() === 'online') {
        this.notificationPreference.set(true);
      } else {
        this.notificationPreference.set(false);
      }
    });
  }

  //Abandoned because of the use of effect,this is used for linked signals
  // notificationsEnabled = computed(() => {
  //   return this.userStatus() === 'online';
  // });

  statusMessage = computed(() => {
    const status = this.userStatus();
    switch (status) {
      case 'online':
        return 'Available for meetings and messages';
      case 'away':
        return 'Temporarily away,will respond soon';
      case 'offline':
        return 'Not available ,check back later';
      default:
        return 'Status unknown';
    }
  });

  isWithinWorkingHours = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekday = now.getDay() > 0 && now.getDay() < 6;
    return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
  });

  goOnline() {
    this.userStatus.set('online');
  }

  goAway() {
    this.userStatus.set('away');
  }

  goOffline() {
    this.userStatus.set('offline');
  }

  toggleStatus() {
    const current = this.userStatus();
    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        //this.notificationPreference.set(true);
        break;
      case 'online':
        this.userStatus.set('away');
        //this.notificationPreference.set(false);
        break;
      case 'away':
        //this.userStatus.set('offline');
        break;
    }
  }
  toggleNotifications() {
    //this works for linked signals
    //this.notificationsEnabled.update((prev) => !prev);
    this.notificationPreference.update((prev) => !prev);
  }
}
