import React, { useState, useEffect } from 'react';
import './features-services.css';

export default function FeaturesServices() {
  const [activeTab, setActiveTab] = useState('consult');

  // Sparkles generation
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const s = [];
    for (let i = 0; i < 24; i++) {
      s.push({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        delay: (Math.random() * 5) + 's',
        duration: (4 + Math.random() * 3) + 's'
      });
    }
    setSparkles(s);
  }, []);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = '✓ Added';
    setTimeout(() => { btn.textContent = original; }, 1400);
  };

  return (
    <div className="fs-root">
      <div className="fs-bg-glow"></div>
      <div className="fs-sparkles">
        {sparkles.map(s => (
          <span 
            key={s.id} 
            style={{ 
              left: s.left, 
              top: s.top, 
              animationDelay: s.delay, 
              animationDuration: s.duration 
            }} 
          />
        ))}
      </div>

      <nav className="fs-nav">
        <div className="fs-brand">
          <svg className="fs-mark" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#d4af37" strokeWidth="1.5"/>
            <text x="20" y="26" textAnchor="middle" fontSize="16" fill="#f5da7a" fontFamily="Cinzel">₹</text>
          </svg>
          <span>TAX &amp; ASTRO SUITE</span>
        </div>
        <div className="fs-nav-links">
          <a href="#features">Features</a>
          <a href="#services">Services</a>
          <a href="#pricing-itr">ITR &amp; GST</a>
          <a href="#pricing-astro">Astrology</a>
        </div>
        <a href="#services" className="fs-nav-cta">Book Now</a>
      </nav>

      <section className="fs-hero">
        <div className="fs-eyebrow">Features &amp; Services</div>
        <h1>Everything You Need — Taxation, GST, ITR &amp; Astrology, In One Place</h1>
        <p>Transparent pricing, expert consultations, and a dashboard-driven platform built for speed and trust. Ancient wisdom meets modern compliance.</p>
        <div className="fs-hero-ctas">
          <a href="#services" className="fs-btn-primary">Explore Services</a>
          <a href="#features" className="fs-btn-ghost">See Features</a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="fs-section" id="features">
        <div className="fs-section-head">
          <h2>Platform Features</h2>
          <div className="fs-divider"></div>
          <p>Built for clarity, speed, and complete peace of mind.</p>
        </div>
        <div className="fs-feature-grid">
          <div className="fs-feature-card"><span className="fs-ic">⚡</span><h3>Instant Booking</h3><p>Add any service to cart and confirm in a few taps — no back-and-forth calls needed.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">💬</span><h3>Free First Consultation</h3><p>Start with a free taxation or astrology consultation before committing to a paid plan.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">🔐</span><h3>Secure Payments</h3><p>All transactions processed through encrypted, verified payment gateways.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">📊</span><h3>Transparent Pricing</h3><p>Every ITR, GST, and consultation tier is listed upfront — no hidden charges.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">🗓️</span><h3>Zoom &amp; Personal Sessions</h3><p>Choose between video consultations or in-person sessions, billed by the minute-tier.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">📥</span><h3>Inquiry Tracking</h3><p>Every inquiry you submit is tracked and responded to through our admin-managed pipeline.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">🛠️</span><h3>Admin-Managed Catalog</h3><p>Services, prices, and availability are actively maintained and updated in real time.</p></div>
          <div className="fs-feature-card"><span className="fs-ic">📱</span><h3>Mobile &amp; Desktop Ready</h3><p>A fully responsive experience, whether you're booking from your phone or laptop.</p></div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="fs-section" id="services">
        <div className="fs-section-head">
          <h2>Our Services</h2>
          <div className="fs-divider"></div>
          <p>Pick a category to view services and pricing.</p>
        </div>

        <div className="fs-tab-bar">
          <button className={`fs-tab ${activeTab === 'consult' ? 'fs-active' : ''}`} onClick={() => setActiveTab('consult')}>Free Consultations</button>
          <button className={`fs-tab ${activeTab === 'itr' ? 'fs-active' : ''}`} onClick={() => setActiveTab('itr')}>ITR Filing</button>
          <button className={`fs-tab ${activeTab === 'gst' ? 'fs-active' : ''}`} onClick={() => setActiveTab('gst')}>GST Filing</button>
          <button className={`fs-tab ${activeTab === 'astro' ? 'fs-active' : ''}`} onClick={() => setActiveTab('astro')}>Astrology Zoom</button>
          <button className={`fs-tab ${activeTab === 'personal' ? 'fs-active' : ''}`} onClick={() => setActiveTab('personal')}>Personal Consultation</button>
        </div>

        {/* Free Consultations */}
        <div className={`fs-svc-panel ${activeTab === 'consult' ? 'fs-active' : ''}`}>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span><span className="fs-svc-badge fs-free">FREE</span></div>
            <div className="fs-svc-name">Taxation Consultation</div>
            <div className="fs-svc-desc">A quick discovery call to understand your tax situation and next steps.</div>
            <div className="fs-svc-actions">
              <button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button>
              <button className="fs-mini-btn">Inquiry Now</button>
            </div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span><span className="fs-svc-badge fs-free">FREE</span></div>
            <div className="fs-svc-name">Astrology Consultation (1 Question)</div>
            <div className="fs-svc-desc">Ask one focused question and receive guidance from our astrologer.</div>
            <div className="fs-svc-actions">
              <button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button>
              <button className="fs-mini-btn">Inquiry Now</button>
            </div>
          </div>
        </div>

        {/* ITR Filing */}
        <div className={`fs-svc-panel ${activeTab === 'itr' ? 'fs-active' : ''}`}>
          <div className="fs-svc-card" id="pricing-itr">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">ITR-1</div>
            <div className="fs-svc-desc">For salaried individuals with simple income sources.</div>
            <div className="fs-svc-price">₹999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">ITR-2, 3 &amp; 4</div>
            <div className="fs-svc-desc">For capital gains, business income, and presumptive taxation cases.</div>
            <div className="fs-svc-price">₹1499</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">ITR-4, 5, 6, 7 &amp; 8</div>
            <div className="fs-svc-desc">For firms, LLPs, companies, and trusts with complex filings.</div>
            <div className="fs-svc-price">Starting ₹2999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
        </div>

        {/* GST Filing */}
        <div className={`fs-svc-panel ${activeTab === 'gst' ? 'fs-active' : ''}`}>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">GST Monthly Filing</div>
            <div className="fs-svc-desc">Routine monthly GSTR filing for regular taxpayers.</div>
            <div className="fs-svc-price">₹999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">GST Quarterly Filing</div>
            <div className="fs-svc-desc">Quarterly return filing under the QRMP scheme.</div>
            <div className="fs-svc-price">₹2199</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Annual GSTR-4</div>
            <div className="fs-svc-desc">Annual return filing for composition scheme taxpayers.</div>
            <div className="fs-svc-price">₹3999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Annual GSTR-9</div>
            <div className="fs-svc-desc">Comprehensive annual return filing for regular taxpayers.</div>
            <div className="fs-svc-price">₹9999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
        </div>

        {/* Astrology Zoom */}
        <div className={`fs-svc-panel ${activeTab === 'astro' ? 'fs-active' : ''}`}>
          <div className="fs-svc-card" id="pricing-astro">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Astrology Zoom · 30 Minutes</div>
            <div className="fs-svc-desc">A focused video consultation covering key life questions.</div>
            <div className="fs-svc-price">₹1999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Astrology Zoom · 60 Minutes</div>
            <div className="fs-svc-desc">An in-depth reading with detailed guidance and remedies.</div>
            <div className="fs-svc-price">₹3599</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
        </div>

        {/* Personal Consultation */}
        <div className={`fs-svc-panel ${activeTab === 'personal' ? 'fs-active' : ''}`}>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Personal Consultation · 15 Minutes</div>
            <div className="fs-svc-desc">A short in-person or call-based session for quick queries.</div>
            <div className="fs-svc-price">₹1099</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Personal Consultation · 30 Minutes</div>
            <div className="fs-svc-desc">A standard session covering multiple topics in depth.</div>
            <div className="fs-svc-price">₹2099</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
          <div className="fs-svc-card">
            <div className="fs-svc-top"><span className="fs-svc-icon">📌</span></div>
            <div className="fs-svc-name">Personal Consultation · 60 Minutes</div>
            <div className="fs-svc-desc">A comprehensive session for detailed planning and advice.</div>
            <div className="fs-svc-price">₹3999</div>
            <div className="fs-svc-actions"><button className="fs-mini-btn fs-solid" onClick={handleAddToCart}>Add to Cart</button><button className="fs-mini-btn">Inquiry Now</button></div>
          </div>
        </div>
      </section>

      <div className="fs-cta-band">
        <h2>Ready to Book Your Service?</h2>
        <p>Start with a free consultation, or jump straight into filing — our team is ready when you are.</p>
        <a href="#services" className="fs-btn-primary">Book Your Service Today</a>
      </div>

      <footer className="fs-footer">
        <div className="fs-tag">TAXATION • GST • ITR FILING • ASTROLOGY CONSULTATION</div>
        <div style={{ marginTop: '8px' }}>© 2026 — Built with GurucraftPro design system.</div>
      </footer>
    </div>
  );
}
