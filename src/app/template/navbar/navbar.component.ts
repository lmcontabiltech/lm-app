import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.showSidebar('header-toggle', 'sidebar', 'header');
    this.activateLink();
    this.setupDropdown();
    this.setupCloseSidebar();
  }

  showSidebar(toggleId: string, sidebarId: string, headerId: string): void {
    const toggle = document.getElementById(toggleId);
    const sidebar = document.getElementById(sidebarId);
    const header = document.getElementById(headerId);

    if (toggle && sidebar && header) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('show-sidebar');
        header.classList.toggle('left-pd');
      });
    }
  }

  activateLink(): void {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    function linkColor(this: HTMLElement): void {
      sidebarLinks.forEach((l) => l.classList.remove('active-link'));
      this.classList.add('active-link');
    }

    sidebarLinks.forEach((l) => l.addEventListener('click', linkColor));
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

    if (closeSidebar && sidebar && header && overlay) {
      closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('show-sidebar');
        header.classList.remove('left-pd');
        overlay.classList.remove('show');
      });
    }
  }
}
