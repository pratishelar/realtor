import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="contact-container container-fluid px-0">
      <!-- Hero Section -->
      <section class="contact-hero text-white text-center py-5">
        <div class="container py-4">
          <h1 class="mb-3">Get In Touch</h1>
          <p class="mb-0 fs-5">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      <!-- Contact Content -->
      <section class="py-5">
        <div class="container">
          <div class="row g-4">
            <!-- Contact Form -->
            <div class="col-12 col-lg-7">
              <div class="card p-4">
                <h2 class="mb-4">Send us a Message</h2>
                <form (ngSubmit)="submitForm()" *ngIf="!formSubmitted" class="d-grid gap-3">
                  <div class="form-group">
                    <label for="name" class="form-label fw-bold">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      [(ngModel)]="formData.name"
                      name="name"
                      required
                      placeholder="Your full name"
                      class="form-control"
                    />
                  </div>

                  
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <label for="email" class="form-label fw-bold">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        [(ngModel)]="formData.email"
                        name="email"
                        required
                        placeholder="user@example.com"
                        class="form-control"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="phone" class="form-label fw-bold">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        [(ngModel)]="formData.phone"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        class="form-control"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="subject" class="form-label fw-bold">Subject *</label>
                    <select [(ngModel)]="formData.subject" name="subject" required class="form-select">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="properties">Properties Question</option>
                    <option value="selling">Interested in Selling</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                  <div class="form-group">
                    <label for="message" class="form-label fw-bold">Message *</label>
                    <textarea
                      id="message"
                      [(ngModel)]="formData.message"
                      name="message"
                      required
                      rows="5"
                      placeholder="Tell us more about your inquiry..."
                      class="form-control"
                    ></textarea>
                  </div>

                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="subscribe"
                      [(ngModel)]="formData.subscribe"
                      name="subscribe"
                    />
                    <label class="form-check-label" for="subscribe">
                      I'd like to receive updates and newsletters
                    </label>
                  </div>

                  <button type="submit" class="btn btn-primary w-100 py-2 mt-3">Send Message</button>
                </form>

                <div *ngIf="formSubmitted" class="text-center py-5">
                  <div class="display-1 text-success mb-3">✓</div>
                  <h3 class="mb-3">Thank You!</h3>
                  <p class="mb-4">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                  <button (click)="resetForm()" class="btn btn-outline-primary">Send Another Message</button>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="col-12 col-lg-5">
              <h2 class="mb-4">Contact Information</h2>
              
              <div class="card p-4 mb-3">
                <div class="fs-1 mb-3">📍</div>
                <h3 class="mb-3">Office Location</h3>
                <p class="mb-0">123 Property Street<br>Real Estate City, RC 12345<br>United States</p>
              </div>

              <div class="card p-4 mb-3">
                <div class="fs-1 mb-3">📞</div>
                <h3 class="mb-3">Phone</h3>
                <p class="mb-0">Main: +1 (555) 123-4567<br>Sales: +1 (555) 234-5678<br>Support: +1 (555) 345-6789</p>
              </div>

              <div class="card p-4 mb-3">
                <div class="fs-1 mb-3">📧</div>
                <h3 class="mb-3">Email</h3>
                <p class="mb-0">Info: info&#64;dsrealtor.com<br>Sales: sales&#64;dsrealtor.com<br>Support: support&#64;dsrealtor.com</p>
              </div>

              <div class="card p-4 mb-3">
                <div class="fs-1 mb-3">🕐</div>
                <h3 class="mb-3">Business Hours</h3>
                <p class="mb-0">Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM<br>Sunday: Closed</p>
              </div>

              <div class="card p-4">
                <h3 class="mb-3">Follow Us</h3>
                <div class="d-flex gap-3">
                  <a href="#" title="Facebook" class="text-decoration-none">f</a>
                  <a href="#" title="Twitter" class="text-decoration-none">𝕏</a>
                  <a href="#" title="Instagram" class="text-decoration-none">📷</a>
                  <a href="#" title="LinkedIn" class="text-decoration-none">in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-5">Frequently Asked Questions</h2>
          <div class="row g-4">
            <div class="col-12 col-md-6">
              <div class="card p-4 h-100">
                <h3 class="mb-3">How do I schedule a property tour?</h3>
                <p class="mb-0">You can schedule a tour directly through our properties page or contact our sales team. We offer both virtual and in-person tours at your convenience.</p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card p-4 h-100">
                <h3 class="mb-3">What's your response time?</h3>
                <p class="mb-0">We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our sales team directly.</p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card p-4 h-100">
                <h3 class="mb-3">Do you offer financing help?</h3>
                <p class="mb-0">Yes, our team can connect you with trusted lenders and assist with the financing process to make your purchase smooth.</p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card p-4 h-100">
                <h3 class="mb-3">How can I list my property?</h3>
                <p class="mb-0">Contact our sales team to discuss your property listing. We provide comprehensive marketing and management services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
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
