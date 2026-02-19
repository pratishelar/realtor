import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-container container-fluid px-0">
      <!-- Hero Section -->
      <section class="about-hero text-white text-center py-5">
        <div class="container py-5">
          <h1 class="mb-3">About DS Associates</h1>
          <p class="mb-0 fs-5">Your trusted partner in real estate since 2010</p>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-lg-6">
              <div class="card h-100 p-4">
                <div class="fs-1 mb-3">🎯</div>
                <h2 class="mb-3">Our Mission</h2>
                <p class="mb-0">To make real estate accessible and transparent for everyone. We believe that finding the right property should be simple, straightforward, and stress-free. Our mission is to provide world-class service and expert guidance at every step of your real estate journey.</p>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="card h-100 p-4">
                <div class="fs-1 mb-3">✨</div>
                <h2 class="mb-3">Our Vision</h2>
                <p class="mb-0">To be the leading real estate platform that transforms how people buy, sell, and invest in properties. We envision a future where technology and human expertise work together to create seamless property transactions and build thriving communities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-5">Why Choose Us?</h2>
          <div class="row g-4">
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-badge mb-3">1</div>
                <h3 class="mb-3">20+ Years Experience</h3>
                <p class="mb-0">With over two decades in the real estate industry, we understand market dynamics and client needs better than anyone.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-badge mb-3">2</div>
                <h3 class="mb-3">Expert Team</h3>
                <p class="mb-0">Our team of certified real estate professionals brings expertise, dedication, and personalized service to every transaction.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-badge mb-3">3</div>
                <h3 class="mb-3">Premium Properties</h3>
                <p class="mb-0">We curate a selection of premium properties in prime locations, ensuring quality and value for our clients.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-badge mb-3">4</div>
                <h3 class="mb-3">Technology-Driven</h3>
                <p class="mb-0">Our advanced technology platform allows you to search, analyze, and manage properties from anywhere, anytime.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-badge mb-3">5</div>
                <h3 class="mb-3">Transparent Pricing</h3>
                <p class="mb-0">No hidden fees, no surprises. We believe in complete transparency from start to finish of your transaction.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-badge mb-3">6</div>
                <h3 class="mb-3">24/7 Support</h3>
                <p class="mb-0">Our customer support team is always available to answer your questions and provide assistance whenever you need it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Our Team -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-5">Meet Our Leadership Team</h2>
          <div class="row g-4">
            <div class="col-12 col-md-6 col-lg-3">
              <div class="card h-100 p-4 text-center">
                <div class="fs-1 mb-3">👨‍💼</div>
                <h3 class="mb-2">John Smith</h3>
                <p class="text-primary fw-bold mb-3">Chief Executive Officer</p>
                <p class="mb-0 small">20+ years of real estate experience with a track record of successful transactions exceeding $500M in value.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
              <div class="card h-100 p-4 text-center">
                <div class="fs-1 mb-3">👩‍💼</div>
                <h3 class="mb-2">Sarah Johnson</h3>
                <p class="text-primary fw-bold mb-3">Chief Operating Officer</p>
                <p class="mb-0 small">Expert in operations management and client relations with a passion for delivering exceptional service.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
              <div class="card h-100 p-4 text-center">
                <div class="fs-1 mb-3">👨‍💼</div>
                <h3 class="mb-2">Michael Chen</h3>
                <p class="text-primary fw-bold mb-3">Chief Technology Officer</p>
                <p class="mb-0 small">Technology innovator with expertise in building scalable platforms and digital transformation solutions.</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
              <div class="card h-100 p-4 text-center">
                <div class="fs-1 mb-3">👩‍💼</div>
                <h3 class="mb-2">Emma Wilson</h3>
                <p class="text-primary fw-bold mb-3">Head of Sales</p>
                <p class="mb-0 small">Sales leader with proven ability to build high-performing teams and exceed revenue targets consistently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Company Stats -->
      <section class="bg-light py-5">
        <div class="container">
          <h2 class="text-center mb-5">By The Numbers</h2>
          <div class="row g-4">
            <div class="col-6 col-md-4">
              <div class="card p-4 text-center">
                <h3 class="text-primary mb-2">15,000+</h3>
                <p class="mb-0">Happy Clients</p>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="card p-4 text-center">
                <h3 class="text-primary mb-2">$2B+</h3>
                <p class="mb-0">Properties Sold</p>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="card p-4 text-center">
                <h3 class="text-primary mb-2">500+</h3>
                <p class="mb-0">Active Listings</p>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="card p-4 text-center">
                <h3 class="text-primary mb-2">50+</h3>
                <p class="mb-0">Professional Agents</p>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="card p-4 text-center">
                <h3 class="text-primary mb-2">10</h3>
                <p class="mb-0">Offices Nationwide</p>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="card p-4 text-center">
                <h3 class="text-primary mb-2">98%</h3>
                <p class="mb-0">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section text-white text-center py-5">
        <div class="container py-5">
          <h2 class="mb-3">Ready to Find Your Perfect Property?</h2>
          <p class="mb-4">Browse our extensive collection of properties and start your real estate journey with us today.</p>
          <a routerLink="/properties" class="btn btn-light btn-lg">Explore Properties</a>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class AboutComponent {}
