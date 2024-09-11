import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  private themeSub = new BehaviorSubject<string>('light');
  theme$ = this.themeSub.asObservable();
  constructor() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  setTheme(theme: string) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme',theme);
    this.themeSub.next(theme);
  }
  toggleTheme() {
    const currentTheme = this.themeSub.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
