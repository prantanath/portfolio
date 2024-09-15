import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {DarkModeComponent} from "../dark-mode/dark-mode.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    DarkModeComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  gradientColorClass = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  isMenuOpen = false;
  toggleDropdown() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeDropdown() {
    this.isMenuOpen = false;
  }
}
