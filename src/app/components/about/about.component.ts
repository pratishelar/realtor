import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-container">
      <!-- Hero Section -->
      <section class="about-hero">
        <div class="hero-content">
          <h1>About DS Realtor</h1>
          <p>Your trusted partner in real estate since 2010</p>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="mission-vision">
        <div class="section-wrapper">
          <div class="content-card">
            <div class="icon">🎯</div>
            <h2>Our Mission</h2>
            <p>To make real estate accessible and transparent for everyone. We believe that finding the right property should be simple, straightforward, and stress-free. Our mission is to provide world-class service and expert guidance at every step of your real estate journey.</p>
          </div>
          <div class="content-card">
            <div class="icon">✨</div>
            <h2>Our Vision</h2>
            <p>To be the leading real estate platform that transforms how people buy, sell, and invest in properties. We envision a future where technology and human expertise work together to create seamless property transactions and build thriving communities.</p>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="why-choose-us">
        <div class="section-wrapper">
          <h2>Why Choose Us?</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-number">1</div>
              <h3>20+ Years Experience</h3>
              <p>With over two decades in the real estate industry, we understand market dynamics and client needs better than anyone.</p>
            </div>
            <div class="feature-item">
              <div class="feature-number">2</div>
              <h3>Expert Team</h3>
              <p>Our team of certified real estate professionals brings expertise, dedication, and personalized service to every transaction.</p>
            </div>
            <div class="feature-item">
              <div class="feature-number">3</div>
              <h3>Premium Properties</h3>
              <p>We curate a selection of premium properties in prime locations, ensuring quality and value for our clients.</p>
            </div>
            <div class="feature-item">
              <div class="feature-number">4</div>
              <h3>Technology-Driven</h3>
              <p>Our advanced technology platform allows you to search, analyze, and manage properties from anywhere, anytime.</p>
            </div>
            <div class="feature-item">
              <div class="feature-number">5</div>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees, no surprises. We believe in complete transparency from start to finish of your transaction.</p>
            </div>
            <div class="feature-item">
              <div class="feature-number">6</div>
              <h3>24/7 Support</h3>
              <p>Our customer support team is always available to answer your questions and provide assistance whenever you need it.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Our Team -->
      <section class="team-section">
        <div class="section-wrapper">
          <h2>Meet Our Leadership Team</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-image">👨‍💼</div>
              <h3>John Smith</h3>
              <p class="role">Chief Executive Officer</p>
              <p>20+ years of real estate experience with a track record of successful transactions exceeding $500M in value.</p>
            </div>
            <div class="team-member">
              <div class="member-image">👩‍💼</div>
              <h3>Sarah Johnson</h3>
              <p class="role">Chief Operating Officer</p>
              <p>Expert in operations management and client relations with a passion for delivering exceptional service.</p>
            </div>
            <div class="team-member">
              <div class="member-image">👨‍💼</div>
              <h3>Michael Chen</h3>
              <p class="role">Chief Technology Officer</p>
              <p>Technology innovator with expertise in building scalable platforms and digital transformation solutions.</p>
            </div>
            <div class="team-member">
              <div class="member-image">👩‍💼</div>
              <h3>Emma Wilson</h3>
              <p class="role">Head of Sales</p>
              <p>Sales leader with proven ability to build high-performing teams and exceed revenue targets consistently.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Company Stats -->
      <section class="stats-section">
        <div class="section-wrapper">
          <h2>By The Numbers</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <h3>15,000+</h3>
              <p>Happy Clients</p>
            </div>
            <div class="stat-item">
              <h3>$2B+</h3>
              <p>Properties Sold</p>
            </div>
            <div class="stat-item">
              <h3>500+</h3>
              <p>Active Listings</p>
            </div>
            <div class="stat-item">
              <h3>50+</h3>
              <p>Professional Agents</p>
            </div>
            <div class="stat-item">
              <h3>10</h3>
              <p>Offices Nationwide</p>
            </div>
            <div class="stat-item">
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <h2>Ready to Find Your Perfect Property?</h2>
        <p>Browse our extensive collection of properties and start your real estate journey with us today.</p>
        <a routerLink="/properties" class="btn-cta">Explore Properties</a>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      width: 100%;
    }

    /* Hero Section */
    .about-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: 1.3rem;
      opacity: 0.95;
    }

    /* Section Wrapper */
    .section-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Mission & Vision */
    .mission-vision {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }

    .mission-vision .section-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .content-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .content-card .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .content-card h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .content-card p {
      color: #666;
      line-height: 1.6;
    }

    /* Why Choose Us */
    .why-choose-us {
      padding: 4rem 2rem;
    }

    .why-choose-us h2,
    .team-section h2,
    .stats-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-item {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
    }

    .feature-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .feature-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .feature-item h3 {
      color: #333;
      margin-bottom: 0.75rem;
    }

    .feature-item p {
      color: #666;
      line-height: 1.6;
    }

    /* Team Section */
    .team-section {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .team-member {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: center;
      transition: all 0.3s;
    }

    .team-member:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .member-image {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .team-member h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .team-member .role {
      color: #667eea;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .team-member p {
      color: #666;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats-section {
      padding: 4rem 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 2rem;
    }

    .stat-item {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .stat-item h3 {
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-item p {
      color: #666;
      font-weight: 500;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: white;
    }

    .cta-section p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }

    .btn-cta {
      display: inline-block;
      padding: 1rem 3rem;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      font-size: 1.1rem;
      transition: all 0.3s;
    }

    .btn-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .about-hero {
        padding: 3rem 1rem;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .hero-content p {
        font-size: 1rem;
      }

      .why-choose-us h2,
      .team-section h2,
      .stats-section h2 {
        font-size: 2rem;
      }

      .mission-vision .section-wrapper {
        grid-template-columns: 1fr;
      }

      .cta-section h2 {
        font-size: 1.8rem;
      }
    }
  `]
})
export class AboutComponent {}
