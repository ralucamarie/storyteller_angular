import { Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Badge } from 'primeng/badge';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
    Ripple,
    Badge,
    Avatar,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] =[];

  ngOnInit() {
    this.items = [
      {
        label: 'Stories',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
      },
      {
        label: 'News',
        icon: 'pi pi-lightbulb',
        badge: '3',
      },
    ];
  }
}
