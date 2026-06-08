import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, Card, Password, Button, Message, TranslatePipe],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly invalidLink = signal(false);

  private uid = '';
  private token = '';

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    this.uid = this.route.snapshot.queryParamMap.get('uid') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.invalidLink.set(!this.uid || !this.token);
  }

  submit(): void {
    if (this.invalidLink() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage.set(this.translate.instant('auth.resetPassword.passwordsMismatch'));
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .confirmPasswordReset({ uid: this.uid, token: this.token, password })
      .subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: (err) => {
          this.loading.set(false);
          const errors = err.error;
          if (typeof errors === 'object' && errors !== null) {
            const firstKey = Object.keys(errors)[0];
            const firstError = errors[firstKey];
            this.errorMessage.set(
              Array.isArray(firstError) ? firstError[0] : String(firstError)
            );
          } else {
            this.errorMessage.set(this.translate.instant('auth.resetPassword.failed'));
          }
        },
      });
  }
}
