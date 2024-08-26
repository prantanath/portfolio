import { Component } from '@angular/core';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";

  downloadCV(){
    const link = document.createElement('a');
    link.href = './pranta_cv.pdf';
    link.download = 'Pranta_Nath_Nayan_CV.pdf';
    link.click();
  }
  about_one = "As a Developer, I create dynamic web applications using Angular and Django. I focus on building user-friendly interfaces that enhance engagement and functionality.";

  about_two = "As a Researcher, I delve into Software Engineering, Machine Learning, AI, and Deep Learning. I aim to advance these fields through innovative research and impactful solutions.";

  about_three = "As a Lifelong Learner, I am dedicated to continuous growth and staying updated with the latest advancements. Explore my portfolio and reach out for potential collaborations or discussions.";
}
