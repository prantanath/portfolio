import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {researchInterests} from "../../data/interest";
import {publicationsList} from "../../data/publications";

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './research.component.html',
  styleUrl: './research.component.css'
})
export class ResearchComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";

  protected readonly researchInterests = researchInterests;
  protected readonly publicationsList = publicationsList;
}
