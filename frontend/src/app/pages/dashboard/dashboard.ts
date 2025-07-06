import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MatTableModule,
} from '@angular/material/table';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import moment from 'moment';
import { LoaderOverlay } from "../../shared/loader-overlay/loader-overlay";
import { Toast } from '../../services/toast';


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    NgxPaginationModule,
    LoaderOverlay
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  originalData: any[] = []; // for keeping original response
  filteredData: any[] = [];
  fallbackImage = "https://dummyimage.com/180x180/eeeeee/aaa&text=No+Image";
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  itemsPerPage = 10;
  isProgress = false; // for showing loading state
  canGoToNext = false;
  filters = {
    title: '',
    createdDate: null as Date | null,
  };

  displayedColumns: string[] = [
    'image',
    'title',
    'description',
    'qty',
    'price',
    'date',
  ];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: Toast,
  ) {  }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.isProgress = true; // Show loading state
    this.cdr.detectChanges(); // 🪄 force UI update
    this.itemService.getItems(this.currentPage).subscribe(
      {
        next: (res: any) => {
          this.isProgress = false; // Hide loading state
          this.cdr.detectChanges();
          if (res && res.statusCode === 200) {
            this.originalData = res.data.items || [];
            this.filteredData = this.originalData; // Initialize filteredData with original data
            this.totalItems = res.data.total || 0;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            if (this.totalPages > 1) {
              this.canGoToNext = true;
            }
          } else {
            this.isProgress = false; // Hide loading state
            console.error('Error fetching items:', res.data.message);
          }
        },
        error: (err) => {
          this.isProgress = false; // Hide loading state
          this.toast.error('Failed to fetch items', err.message); // Show error message
        },
      }).add(() => {
        this.isProgress = false; // Ensure loading state is hidden after completion
        this.cdr.detectChanges(); // 🪄 force UI update
      });
  }
  
  // Pagination methods
  goToPage(e: any): void {
    this.currentPage = e;
    if (e === 1) {
      this.currentPage = 1;
    }
    this.fetchItems();
  }

  nextPage() {
    this.currentPage++;
    this.fetchItems();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchItems();
    }
  }

  onImageError(event: Event) {
  (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  goToAddItem() {
    this.router.navigate(['/add-item']);
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  applyFilters() {
    if (!this.originalData.length) {
      // If originalData is empty, we assume it has not been set yet
      this.originalData = [...this.filteredData]; // Store the initial data
    }

    this.filteredData = this.originalData.filter((item) => {
      const matchTitle = this.filters.title
        ? item.title.toLowerCase().includes(this.filters.title.toLowerCase())
        : true;

      const matchCreatedDate = this.filters.createdDate ? moment(this.filters.createdDate).isSame(moment(item.date), 'day')  : true;

      return matchTitle && matchCreatedDate;
    });

    this.currentPage = 1; // reset to page 1 after filter
  }
}
