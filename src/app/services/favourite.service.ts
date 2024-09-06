import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Product } from '../products/product.interface';


@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private favouriteAdded = new BehaviorSubject<Product>(null);
  favouriteAdded$: Observable<Product> = this
                                          .favouriteAdded
                                          .asObservable()
                                          .pipe(
                                          // filter(product => product != null)
                                          );
  constructor() { }

  private favourites: Set<Product> = new Set();

  addToFavourites(product: Product) {
    this.favouriteAdded.next(product);
    setTimeout(() => this.favouriteAdded.next(null), 2000);
    this.favourites.add(product);
  }

  getFavouritesNb(): number {
    return this.favourites.size;
  }
}
