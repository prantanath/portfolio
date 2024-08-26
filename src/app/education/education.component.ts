import { Component } from '@angular/core';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
}
