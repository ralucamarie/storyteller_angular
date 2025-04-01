import { Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Badge } from 'primeng/badge';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
    Ripple,
    Badge,
    Avatar,
    Menu,
    Button
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] =[];
  userMenuItems: MenuItem[] =[];

  constructor(private router: Router) {}

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
    this.userMenuItems = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        routerLink: '/users/logout',
      }
    ]
  }

  addNewStory() {
    this.router.navigate(['/add-story']);
  }
}
