import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="contact-container">
      <!-- Hero Section -->
      <section class="contact-hero">
        <h1>Get In Touch</h1>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </section>

      <!-- Contact Content -->
      <section class="contact-content">
        <div class="section-wrapper">
          <div class="contact-main">
            <!-- Contact Form -->
            <div class="contact-form-section">
              <h2>Send us a Message</h2>
              <form (ngSubmit)="submitForm()" *ngIf="!formSubmitted">
                <div class="form-group">
                  <label for="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    [(ngModel)]="formData.name"
                    name="name"
                    required
                    placeholder="Your full name"
                    class="form-input"
                  />
                </div>

                
                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      [(ngModel)]="formData.email"
                      name="email"
                      required
                      placeholder="user@example.com"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      [(ngModel)]="formData.phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="subject">Subject *</label>
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
                  <label for="message">Message *</label>
                  <textarea
                    id="message"
                    [(ngModel)]="formData.message"
                    name="message"
                    required
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    class="form-textarea"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData.subscribe"
                      name="subscribe"
                    />
                    I'd like to receive updates and newsletters
                  </label>
                </div>

                <button type="submit" class="btn-submit">Send Message</button>
              </form>

              <div *ngIf="formSubmitted" class="success-message">
                <div class="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                <button (click)="resetForm()" class="btn-new-message">Send Another Message</button>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="contact-info-section">
              <h2>Contact Information</h2>
              
              <div class="info-card">
                <div class="info-icon">📍</div>
                <h3>Office Location</h3>
                <p>123 Property Street<br>Real Estate City, RC 12345<br>United States</p>
              </div>

              <div class="info-card">
                <div class="info-icon">📞</div>
                <h3>Phone</h3>
                <p>Main: +1 (555) 123-4567<br>Sales: +1 (555) 234-5678<br>Support: +1 (555) 345-6789</p>
              </div>

              <div class="info-card">
                <div class="info-icon">📧</div>
                <h3>Email</h3>
                <p>Info: info&#64;dsrealtor.com<br>Sales: sales&#64;dsrealtor.com<br>Support: support&#64;dsrealtor.com</p>
              </div>

              <div class="info-card">
                <div class="info-icon">🕐</div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM<br>Sunday: Closed</p>
              </div>

              <div class="social-section">
                <h3>Follow Us</h3>
                <div class="social-links">
                  <a href="#" title="Facebook">f</a>
                  <a href="#" title="Twitter">𝕏</a>
                  <a href="#" title="Instagram">📷</a>
                  <a href="#" title="LinkedIn">in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="section-wrapper">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-item">
              <h3>How do I schedule a property tour?</h3>
              <p>You can schedule a tour directly through our properties page or contact our sales team. We offer both virtual and in-person tours at your convenience.</p>
            </div>
            <div class="faq-item">
              <h3>What's your response time?</h3>
              <p>We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our sales team directly.</p>
            </div>
            <div class="faq-item">
              <h3>Do you offer financing help?</h3>
              <p>Yes, our team can connect you with trusted lenders and assist with the financing process to make your purchase smooth.</p>
            </div>
            <div class="faq-item">
              <h3>How can I list my property?</h3>
              <p>Contact our sales team to discuss your property listing. We provide comprehensive marketing and management services.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-container {
      width: 100%;
    }

    /* Hero Section */
    .contact-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .contact-hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .contact-hero p {
      font-size: 1.2rem;
      opacity: 0.95;
    }

    /* Section Wrapper */
    .section-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Contact Content */
    .contact-content {
      padding: 4rem 2rem;
    }

    .contact-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    /* Form Section */
    .contact-form-section h2,
    .contact-info-section h2,
    .faq-section h2 {
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 150px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      font-weight: 400;
      cursor: pointer;
      margin-bottom: 0;
    }

    .checkbox-label input {
      margin-right: 0.75rem;
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .btn-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      width: 100%;
    }

    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .success-message {
      background: #f0f4ff;
      border: 2px solid #667eea;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
    }

    .success-icon {
      font-size: 3rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .success-message h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .success-message p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .btn-new-message {
      background: #667eea;
      color: white;
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-new-message:hover {
      background: #764ba2;
    }

    /* Info Section */
    .contact-info-section {
      background: white;
    }

    .info-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #eee;
      margin-bottom: 1.5rem;
      transition: all 0.3s;
    }

    .info-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .info-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .info-card h3 {
      color: #333;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }

    .info-card p {
      color: #666;
      line-height: 1.8;
    }

    .social-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #eee;
      text-align: center;
    }

    .social-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .social-links {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }

    .social-links a {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s;
    }

    .social-links a:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    /* FAQ Section */
    .faq-section {
      background: #f8f9fa;
      padding: 4rem 2rem;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .faq-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
    }

    .faq-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .faq-item h3 {
      color: #333;
      margin-bottom: 0.75rem;
    }

    .faq-item p {
      color: #666;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .contact-main {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .contact-hero {
        padding: 2rem 1rem;
      }

      .contact-hero h1 {
        font-size: 2rem;
      }

      .contact-hero p {
        font-size: 1rem;
      }

      .contact-content {
        padding: 2rem 1rem;
      }

      .section-wrapper {
        padding: 0 1rem;
      }

      .contact-form-section h2,
      .contact-info-section h2,
      .faq-section h2 {
        font-size: 1.5rem;
      }

      .faq-section {
        padding: 2rem 1rem;
      }
    }
  `]
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
