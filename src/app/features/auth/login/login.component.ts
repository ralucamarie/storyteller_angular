import { Component, inject, OnInit } from '@angular/core';
import { Divider } from 'primeng/divider';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    Divider,
    Button,
    InputText,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = new FormBuilder();

  loginForm: FormGroup = new FormGroup({});

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  loginUser(event?:KeyboardEvent) {
    if(!event || event.key === 'Enter') {
      this.authService.login(this.loginForm?.value.email, this.loginForm?.value.password).subscribe({
        next: (): void => {
          this.router.navigate(['/']);
        },
        error: (): void => {
          //   TODO: display notification for Login error
        }
      })
    }

  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
}
