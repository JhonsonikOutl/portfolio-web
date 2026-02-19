import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../shared/models/profile.model';
import { DotnetComponent } from '../../../shared/components/icons/dotnet';
import { CSharpComponent } from '../../../shared/components/icons/csharp';
import { AngularIconComponent } from '../../../shared/components/icons/angular-icon';
import { TypeScriptComponent } from '../../../shared/components/icons/typescript';
import { MongoDBComponent } from '../../../shared/components/icons/mongodb';
import { MicrosoftSQLServerComponent } from '../../../shared/components/icons/sqlserver';
import { GitComponent } from '../../../shared/components/icons/git';
import { AzureComponent } from '../../../shared/components/icons/azure';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    DotnetComponent,
    CSharpComponent,
    AngularIconComponent,
    TypeScriptComponent,
    MongoDBComponent,
    MicrosoftSQLServerComponent,
    GitComponent,
    AzureComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  profile = signal<Profile | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  iconSize = { width: 60, height: 60 };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el perfil');
        this.loading.set(false);
        console.error('Error loading profile:', err);
      }
    });
  }
}