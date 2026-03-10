import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeroComponent } from '../../../shared/components/profile-hero/profile-hero';
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
    ProfileHeroComponent,
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
export class Home {
  iconSize = { width: 60, height: 60 };
}