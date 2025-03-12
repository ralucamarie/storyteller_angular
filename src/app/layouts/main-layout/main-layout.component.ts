import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ScrollTop } from 'primeng/scrolltop';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    ScrollTop
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
