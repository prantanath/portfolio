import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

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
  achievementList = [
    "EWU In-House Programming Battle Summer 2022 - Champion",
    "EWU In-House Programming Battle Spring 2023 - Runner-up",
    "EWU Intra Kick-Off Contest Fall 2022 - 2nd Runner-up",
    "Solved 1000+ problems in various Online Judge",
    "100% Merit Scholarship",
    "Dean's List Scholarship"
  ];
}
