import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-artistes',
  imports: [],
  templateUrl: './artistes.html',
  styleUrl: './artistes.css'
})
export class Artistes implements OnInit {

  private api = inject(ApiService);

  artistes = signal<any[]>([]);
  recherche = signal('');
  chargement = signal(true);
  erreur = signal('');

  artistesFiltres = computed(() =>
    this.artistes().filter(artiste =>
      artiste.nom_artiste.toLowerCase()
        .includes(this.recherche().toLowerCase().trim())
    )
  );

  ngOnInit(): void {
    this.api.getArtistes().subscribe({
      next: (data) => {
        this.artistes.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les artistes.');
        this.chargement.set(false);
      }
    });
  }
}