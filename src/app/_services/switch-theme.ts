import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SwitchThemeService{
    selectedTheme = 'web';
    insertedElement: HTMLElement;

    constructor() {
        this.loadTheme();   
    }

    loadTheme() {
        import(
            `../../assets/js/web/${this.selectedTheme}.js`
        )
      .then((s) => s.default)
      .then(this.insertToDom);
    }

    insertToDom = (content: string) => {
    const element = document.createElement('style');
    element.textContent = content;
    document.head.appendChild(element);

    if (this.insertedElement) this.insertedElement.remove();
    this.insertedElement = element;
  };
}