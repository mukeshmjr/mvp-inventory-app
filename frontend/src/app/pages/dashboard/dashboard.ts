import { Component, OnInit } from '@angular/core';
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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCellDef, MatHeaderCellDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatCellDef,
    MatHeaderCellDef,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // Define any properties or methods needed for the dashboard
  items: any[] = [];
  page = 1;
  total = 0;
  filters = {
  title: '',
  createdDate: null as Date | null
};

  displayedColumns: string[] = ['image', 'title', 'description', 'qty', 'price', 'date'];

  constructor(private itemService: ItemService, private router: Router) {
    // Initialize any properties if needed
    this.items = [
      {
        image: 'https://via.placeholder.com/60',
        title: 'Tomato Ketchup',
        description: 'Fresh & Organic',
        qty: 10,
        price: 120,
        date: new Date(),
      },
      {
        image: 'https://via.placeholder.com/60',
        title: 'Dry Mango Slices',
        description: 'Sweet & Tangy',
        qty: 25,
        price: 300,
        date: new Date(),
      },
      // Add more or fetch from API
    ];
  }

  ngOnInit() {
    // this.fetchItems();
  }

  fetchItems() {
    this.itemService.getItems(this.page).subscribe((res: any) => {
      this.items = res.items;
      this.total = res.total;
    });
  }

  nextPage() {
    this.page++;
    this.fetchItems();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchItems();
    }
  }

  goToAddItem() {
    this.router.navigate(['/add-item']);
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  applyFilters() {
  this.items = this.items.filter(item => {
    const matchTitle = this.filters.title
      ? item.title.toLowerCase().includes(this.filters.title.toLowerCase())
      : true;
    const matchCreatedDate = this.filters.createdDate
      ? new Date(item.date) <= new Date(this.filters.createdDate)
      : true;

    return matchTitle && matchCreatedDate;
  });

  this.page = 1; // reset to page 1 after filter
}


}
