import { Component } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

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
  projectsList = [
    {
      title: 'GOOGLE CLASSROOM CLONE',
      description: 'The project includes user login, registration by role, creating and joining\n' +
        'classrooms, creating posts and comments, and creating assignment and grading\n' +
        'functions.',
      technologies: ['Django','Python','MySQL'],
      link: 'https://github.com/prantanath/homeschool',
      live: '',
    },
    {
      title: 'CODEGRINDER – A PROGRAMMING PROBLEM RECOMMENDER',
      description: 'It extracts information that is publicly available from the specified coding profiles,\n' +
        'analyzes it, and recommends problem based on user rating and their desired\n' +
        'tags.',
      technologies: ['Html', 'Css', 'Js' , 'Php'],
      link: 'https://github.com/prantanath/codeGrinder',
      live: 'https://codegrinder.000webhostapp.com/',
    },
    {
      title: 'MUSIX',
      description: 'Web app utilizing a public API to stream music. Implemented play and stop ' +
        'buttons, handled user interactions for playback control, and integrated a ' +
        'progress bar and timer to track song duration.',
      technologies: ['Angular', 'Tailwind CSS', 'TypeScript'],
      link: 'https://github.com/prantanath/musix',
      live: 'https://musix-200ea.web.app/',
    },
    // Add more projects as needed
  ];
}
