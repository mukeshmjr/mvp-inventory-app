import { Component } from '@angular/core';
import { ItemService } from '../../services/item';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-item',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle,
],
  templateUrl: './add-item.html',
  styleUrl: './add-item.scss',
})
export class AddItem {
  formSubmitted = false;

  items = [
  {
    image: '',
    preview: '',
    title: '',
    description: '',
    qty: 1,
    price: 0,
    date: new Date()
  }
];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private toast: ToastrService,
  ) {}

  addField() {
    this.items.push({
    image: '',
    preview: '',
    title: '',
    description: '',
    qty: 1,
    price: 0,
    date: new Date()
  });
  }

  save() {
    
    this.formSubmitted = true;
    
    if (this.items.some(item => !item.title || !item.description || item.qty <= 0 || item.price < 0 || !item.date)) {
      this.toast.error('Please fill all fields correctly.');
      return;
    }

    // Validate each item
    for (const item of this.items) {
      // Check if required fields are filled
      if (!item.title ) {
        this.toast.error('Title field is required.');
        return;
      }
      if (!item.description) {
        this.toast.error('Description field is required.');
        return;
      }
      if (item.qty <= 0) {
        this.toast.error('Quantity must be greater than 0.');
        return;
      }
      if (item.price < 0) {
        this.toast.error('Price cannot be negative.');
        return;
      }
      if (!item.date) {
        this.toast.error('Date field is required.');
        return;
      }
      // Check if the date is valid
      if (isNaN(new Date(item.date).getTime())) {
        this.toast.error('Invalid date format.');
        return;
      }
    }

    // If all items are valid, proceed to save
    this.itemService.saveItems(this.items).subscribe({
      next: () => {
        this.toast.success('Items saved successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toast.error('Failed to save items. Please try again.');
      },
    });
  }

  removeField(index: number) {
    this.items.splice(index, 1);
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onImageChange(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.items[index].preview = reader.result as string;
      this.items[index].image = file; // for backend upload if needed
    };
    reader.readAsDataURL(file);
  }
}
  
}
