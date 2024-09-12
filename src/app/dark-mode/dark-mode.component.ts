import {Component, inject, OnInit} from '@angular/core';
import {ThemeServiceService} from "../services/theme-service.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './dark-mode.component.html',
  styleUrl: './dark-mode.component.css'
})
export class DarkModeComponent implements OnInit{
  isDarkMode = true;
  themeService = inject(ThemeServiceService);

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme(){
    this.themeService.toggleTheme();
  }
}
