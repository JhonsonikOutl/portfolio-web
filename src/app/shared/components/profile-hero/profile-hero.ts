import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-hero.html',
  styleUrl: './profile-hero.css'
})
export class ProfileHeroComponent implements OnInit {
  @Input() mode: 'home' | 'about' = 'home';

  private profileService = inject(ProfileService);

  profile = this.profileService.profile;
  loading = this.profileService.loading;
  error = signal<string | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.profileService.loadProfile();
  }

  downloadCv(): void {
    this.profileService.downloadCv();
  }
}