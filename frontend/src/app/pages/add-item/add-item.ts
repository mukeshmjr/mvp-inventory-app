import { ChangeDetectorRef, Component } from '@angular/core';
import { ItemService } from '../../services/item';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { Toast } from '../../services/toast';

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
      title: '',
      description: '',
      qty: 1,
      price: 0,
      date: new Date(),
    },
  ];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private toast: Toast,
    private cdr: ChangeDetectorRef
  ) {}

  addField() {
    this.items.push({
      image: '',
      title: '',
      description: '',
      qty: 1,
      price: 0,
      date: new Date(),
    });
  }

  save() {
    this.formSubmitted = true;

    if (
      this.items.some(
        (item) =>
          !item.title ||
          !item.description ||
          item.qty <= 0 ||
          item.price < 0 ||
          !item.date
      )
    ) {
      this.toast.error('Please fill all fields correctly.');
      return;
    }

    // Validate each item
    for (const item of this.items) {
      // Check if required fields are filled
      if (!item.title) {
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
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.toast.success('Items saved successfully!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error(response.message || 'Failed to save items.');
          console.error('Error saving items:', response);
        }
      },
      error: (error) => {
        this.toast.error('Error saving items. '+ error.message);
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
    if (!file) {
      this.toast.error('No file selected.');
      return;
    }

    // Show preview
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.items[index].image = reader.result as string;
    // };
    // reader.readAsDataURL(file);

    // Upload image to backend
    this.itemService.fileUploader(file).subscribe({
      next: (response) => {
        this.items[index].image = response.data.imageUrl; // Assuming the response contains the image URL
        this.cdr.detectChanges(); // 🪄 force UI update
      },
      error: () => {
        this.toast.error('Failed to upload image. Please try again.');
      },
    });
  }

  onDateChange(event: any, index: number) {
    this.items[index].date = event.value;
  }
  
}
