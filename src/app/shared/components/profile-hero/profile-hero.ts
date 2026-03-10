import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-hero',
  imports: [CommonModule],
  templateUrl: './profile-hero.html',
  styleUrl: './profile-hero.css'
})
export class ProfileHeroComponent implements OnInit {
  @Input() mode: 'home' | 'about' = 'home';

  profile = signal<Profile | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: data => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Error al cargar el perfil');
        this.loading.set(false);
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  downloadCv(): void {
    this.profileService.downloadCv();
  }
}