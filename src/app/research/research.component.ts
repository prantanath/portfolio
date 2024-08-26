import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

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


  researchInterests = [
    'Artificial Intelligence and Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Software Engineering',
    'Data Science and Big Data Analytics',
  ];

  len = this.researchInterests.length;

  publicationsList = [
    {
      title: 'Unmasking the Botnet Attacks: A Hybrid Deep Learning Approach',
      authors: 'PN Nayan, M Mahajabin, A Rahman, N Maisha, MT Chowdhury, MM Uddin, RA Tuhin, MS Hossain Khan ',
      journal: 'Smart Trends in Computing and Communications',
      year: 2024,
      link: 'https://doi.org/10.1007/978-981-97-1313-4_38'
    },
    {
      title: 'Impact Analysis of Rooftop Solar Photovoltaic Systems in Academic Buildings',
      authors: 'PN Nayan, AK Ahammed, A Rahman, FT Johora, AW Reza, MS Arefin',
      journal: 'Intelligent Computing and Optimization',
      year: 2023,
      link: 'https://doi.org/10.1007/978-3-031-50330-6_32'
    },
    // Add more publications here
  ];
}
