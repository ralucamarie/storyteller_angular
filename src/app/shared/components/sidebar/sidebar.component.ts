import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  imports: [
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        key: '0',
        label: 'Users',
        icon: 'pi pi-users',
        items: [
          {
            key: '0_1',
            label: 'New',
            items: [
              {
                key: '0_1_0',
                label: 'Member'
              },
              {
                key: '0_1_1',
                label: 'Group'
              }
            ]
          },
          {
            key: '0_2',
            label: 'Search'
          }
        ]
      },
      {
        key: '1',
        label: 'Tasks',
        icon: 'pi pi-server',
        items: [
          {
            key: '1_0',
            label: 'Add New'
          },
          {
            key: '1_1',
            label: 'Pending'
          },
          {
            key: '1_2',
            label: 'Overdue'
          }
        ]
      },
      {
        key: '2',
        label: 'Calendar',
        icon: 'pi pi-calendar',
        items: [
          {
            key: '2_0',
            label: 'New Event'
          },
          {
            key: '2_1',
            label: 'Today'
          },
          {
            key: '2_2',
            label: 'This Week'
          }
        ]
      }
    ];
  }
}

