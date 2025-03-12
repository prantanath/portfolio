import { Component } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {projectsList} from "../../data/projects";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";

  protected readonly projectsList = projectsList;
}
