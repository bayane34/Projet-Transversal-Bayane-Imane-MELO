import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private api = inject(ApiService);

  albums = signal<any[]>([]);
  artistes = signal<any[]>([]);
  erreur = signal('');

  ngOnInit(): void {

    this.api.getAlbums().subscribe({
      next: (data) => this.albums.set(data.slice(0, 4)),
      error: () => this.erreur.set('Le catalogue est indisponible.')
    });

    this.api.getArtistes().subscribe({
      next: (data) => this.artistes.set(data.slice(0, 4)),
      error: () => this.erreur.set('Le catalogue est indisponible.')
    });

  }
}