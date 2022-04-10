import { Injectable } from '@angular/core';
// import { DOCUMENT } from '@angular/common';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor(
    // @Inject(DOCUMENT) private document: Document
  ) { }

  /**
  * Append the JS tag to the Document Body.
  * @param renderer The Angular Renderer
  * @param src The path to the script
  * @returns the script element
  */
  // public loadJsScript(renderer: Renderer2, src: string): HTMLScriptElement {
  //   const script = renderer.createElement('script');
  //   script.type = 'text/javascript';
  //   script.src = src;
  //   renderer.appendChild(this.document.body, script);
  //   return script;
  // }
  myScriptElement: HTMLScriptElement;

  public loadJsScript(src:string){
    //To load compement specific js
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = src;
    document.body.appendChild(this.myScriptElement);
  }
}
