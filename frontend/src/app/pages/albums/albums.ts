import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-albums',
  imports: [],
  templateUrl: './albums.html',
  styleUrl: './albums.css'
})
export class Albums implements OnInit {

  private api = inject(ApiService);

  albums = signal<any[]>([]);
  recherche = signal('');
  genreSelectionne = signal('');
  chargement = signal(true);
  erreur = signal('');

  genres = computed(() =>
    [...new Set(this.albums().map(album => album.nom_genre))].sort()
  );

  albumsFiltres = computed(() => {
    const recherche = this.recherche().toLowerCase().trim();

    return this.albums().filter(album => {

      const correspondRecherche =
        album.titre_album.toLowerCase().includes(recherche) ||
        album.nom_artiste.toLowerCase().includes(recherche);

      const correspondGenre =
        this.genreSelectionne() === '' ||
        album.nom_genre === this.genreSelectionne();

      return correspondRecherche && correspondGenre;
    });
  });

  ngOnInit(): void {
    this.api.getAlbums().subscribe({
      next: (data) => {
        this.albums.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les albums.');
        this.chargement.set(false);
      }
    });
  }
}