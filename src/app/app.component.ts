import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {AboutComponent} from "./about/about.component";
import {EducationComponent} from "./education/education.component";
import {ProjectsComponent} from "./projects/projects.component";
import {ResearchComponent} from "./research/research.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AboutComponent, EducationComponent, ProjectsComponent, ResearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';
}
