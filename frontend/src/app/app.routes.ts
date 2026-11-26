import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Artistes } from './pages/artistes/artistes';
import { Albums } from './pages/albums/albums';
import { Morceaux } from './pages/morceaux/morceaux';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'artistes', component: Artistes },
    { path: 'albums', component: Albums },
    { path: 'morceaux', component: Morceaux }
];