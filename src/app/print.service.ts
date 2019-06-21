import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
isPrinting = false;

  constructor(private router: Router) { }

  printDocument(documentCols: [], documentData: []){
    this.isPrinting = true;
    this.router.navigate(['/',{outlets: {'print': ['print', documentCols, documentData.join()]
  }}]);
  }

  onDataReady(){
    setTimeout(() =>{
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null }}]);
    });
  }
}
