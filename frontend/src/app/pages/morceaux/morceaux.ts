import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-morceaux',
  imports: [],
  templateUrl: './morceaux.html',
  styleUrl: './morceaux.css'
})
export class Morceaux implements OnInit {

  private api = inject(ApiService);

  morceaux = signal<any[]>([]);
  recherche = signal('');
  chargement = signal(true);
  erreur = signal('');

  morceauxFiltres = computed(() => {
    const recherche = this.recherche().toLowerCase().trim();

    return this.morceaux().filter(morceau =>
      morceau.titre_morceau.toLowerCase().includes(recherche) ||
      morceau.nom_artiste.toLowerCase().includes(recherche) ||
      morceau.titre_album.toLowerCase().includes(recherche)
    );
  });

  ngOnInit(): void {
    this.api.getMorceaux().subscribe({
      next: (data) => {
        this.morceaux.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les morceaux.');
        this.chargement.set(false);
      }
    });
  }

  formatDuree(duree: number): string {
    const minutes = Math.floor(duree / 60);
    const secondes = duree % 60;

    return `${minutes}:${secondes.toString().padStart(2, '0')}`;
  }
}