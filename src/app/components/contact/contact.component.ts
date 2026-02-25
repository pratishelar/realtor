import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formSubmitted = false;
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    subscribe: false,
  };

  submitForm() {
    // Validate form
    if (
      !this.formData.name.trim() ||
      !this.formData.email.trim() ||
      !this.formData.subject.trim() ||
      !this.formData.message.trim()
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // In a real application, you would send this to a backend API
    console.log('Form submitted:', this.formData);
    
    this.formSubmitted = true;

    // Optional: Send to backend
    // this.contactService.sendMessage(this.formData).subscribe(...)
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      subscribe: false,
    };
    this.formSubmitted = false;
  }
}
