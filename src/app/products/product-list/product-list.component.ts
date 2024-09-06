import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, EMPTY, combineLatest, Subscription, tap, catchError, startWith, count, map, debounceTime, filter, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import { Product } from '../product.interface';
import { ProductService } from '../../services/product.service';
import { FavouriteService } from '../../services/favourite.service';
import { AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe, NgIf } from '@angular/common';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    standalone: true,
    imports: [NgIf, RouterLink, AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe, ReactiveFormsModule]
})
export class ProductListComponent implements OnInit {

  title: string = 'Products';
  selectedProduct: Product;

  filter: FormControl = new FormControl("");

  products$: Observable<Product[]>;
  productsNumber$: Observable<number>;
  filter$: Observable<string>;
  filtered$: Observable<boolean>;
  filteredProducts$: Observable<Product[]>;
  favouriteAdded$: Observable<Product>;

  errorMessage;
  favouriteAdded: Product;

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router) {

    this.favouriteAdded$ =
        this
          .favouriteService
          .favouriteAdded$
          .pipe(
            tap(product => console.log(product?.name)),
          // takeUntilDestroyed()
          )
          // .subscribe(
          //   product => this.favouriteAdded = product
          // )

  }

  ngOnInit(): void {


    this.filter$ =
          this
            .filter
            .valueChanges
            .pipe(
              debounceTime(500),
              distinctUntilChanged(),
              map(text => text.trim()),
              filter(text => text == "" || text.length > 2),
              tap(() => this.firstPage()),
              startWith("")
            );

    this.filtered$ = this
                        .filter$
                        .pipe(
                          map(text => text.length > 0)
                        );

    this.products$ = this
                      .productService
                      .products$;

    this.filteredProducts$ = combineLatest([this.products$, this.filter$])
                    .pipe(
                      map(([products, filterString]) =>
                        products.filter(product =>
                          product.name.toLowerCase().includes(filterString.toLowerCase())
                        )
                      )
                    )

    this.productsNumber$ = this
                              .filteredProducts$
                              .pipe(
                                map(products => products.length),
                                startWith(0)
                              )
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;

  firstPage() {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }

  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl('/products/' + product.id);
  }

  reset() {
    this.productService.resetList();
    this.router.navigateByUrl('/products'); // self navigation to force data update
  }

  resetPagination() {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }
}
