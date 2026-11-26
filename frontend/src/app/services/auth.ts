import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface Utilisateur {
  id_utilisateur: number;
  pseudo: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

interface LoginResponse {
  message: string;
  token: string;
  utilisateur: Utilisateur;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  private token = signal<string | null>(null);

  utilisateur = signal<Utilisateur | null>(null);

  estConnecte = computed(() =>
    this.utilisateur() !== null
  );

  estAdmin = computed(() =>
    this.utilisateur()?.role === 'ROLE_ADMIN'
  );

  register(pseudo: string, email: string, mot_de_passe: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      { pseudo, email, mot_de_passe }
    );
  }

  login(email: string, mot_de_passe: string) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, mot_de_passe }
    ).pipe(
      tap(response => {
        this.token.set(response.token);
        this.utilisateur.set(response.utilisateur);
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.utilisateur.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  getProfile() {
    return this.http.get<Utilisateur>(
      `${this.apiUrl}/profile`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    );
  }
}