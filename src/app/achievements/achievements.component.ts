import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {achievementList} from "../../data/achievement";

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.css'
})
export class AchievementsComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";

  protected readonly achievementList = achievementList;
}
