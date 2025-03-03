import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showSidebar('header-toggle', 'sidebar', 'header');
    this.setupDropdown();
    this.setupCloseSidebar();
  }

  showSidebar(toggleId: string, sidebarId: string, headerId: string): void {
    const toggle = document.getElementById(toggleId);
    const sidebar = document.getElementById(sidebarId);
    const header = document.getElementById(headerId);
    const content = document.querySelector('.mat-drawer-content');

    if (toggle && sidebar && header && content) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('show-sidebar');
        header.classList.toggle('left-pd');
        content.classList.toggle('shifted');
      });
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  setupDropdown(): void {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', () => {
        dropdownToggle.classList.toggle('active');
        dropdownMenu.classList.toggle('show');
      });
    }
  }

  setupCloseSidebar(): void {
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const overlay = document.getElementById('overlay');
    const content = document.querySelector('.mat-drawer-content');

    if (closeSidebar && sidebar && header && overlay && content) {
      closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('show-sidebar');
        header.classList.remove('left-pd');
        overlay.classList.remove('show');
        content.classList.remove('shifted');
      });
    }
  }
}
