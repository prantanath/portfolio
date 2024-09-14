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
  about_one = "I am a Developer specializing in dynamic web applications with Angular and Django. I work on creating user centric interfaces that make it more engaging as well as functional.";

  about_two = "My Research takes me into fields like Machine Learning, AI,Software Engineering and Deep Learning. My research aims to push those fields forward and find real world applications.";

  about_three = "I am currently focused on Growth as a Lifelong Learner and trying to keep up with state-of-the-art. View my work and hit me up if you are down for collaboration/talks.";
}
