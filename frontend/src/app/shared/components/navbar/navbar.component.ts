import { Component, ElementRef, HostListener } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { selectCurrentUser, selectIsOwner } from '../../store/user/user.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    open = false;

    user$ = this.store.select(selectCurrentUser);
    isOwner$ = this.store.select(selectIsOwner);

    constructor(
      private store: Store,
      private el: ElementRef
    ) {}

    toggle(): void {
      this.open = !this.open;
    }

    close(): void {
      this.open = false;
    }

    logoutUser(): void {
      this.close();
      this.store.dispatch(logout());
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      if (!this.el.nativeElement.contains(event.target)) {
        this.open = false;
      }
    }
}
