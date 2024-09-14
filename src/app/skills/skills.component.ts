import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
}
