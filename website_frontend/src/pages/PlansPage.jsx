import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import CookieConsent from '../components/CookieConsent';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Rocket,
  Building2,
  Globe,
  Zap,
  Shield,
  Users,
  HardDrive,
  Layers,
  Share2,
  Cloud,
} from 'lucide-react';

/* ── Plans data ─────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'community',
    name: 'Community',
    subtitle: 'For individuals and open-source projects',
    price: { monthly: 0, annual: 0 },
    priceLabel: 'Free',
    cta: 'Get Started Free',
    ctaMode: 'register',
    highlight: false,
    badge: null,
    color: '#6c757d',
    features: [
      '5 GB storage',
      'Unlimited public datasets',
      'Community support',
      'Basic visualization',
      'Open source tools',
      'API access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'For professionals who need more power',
    price: { monthly: 29, annual: 24 },
    priceLabel: null,
    cta: 'Start Free Trial',
    ctaMode: 'register',
    highlight: true,
    badge: 'Most Popular',
    color: '#0041e8',
    features: [
      '100 GB storage',
      'Unlimited private datasets',
      'Priority support',
      'Advanced visualization',
      '3D point cloud viewer',
      'Orthophoto tools',
      'Collaboration (up to 5 members)',
      'API access + webhooks',
      'Custom domain',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    subtitle: 'For teams working together on geospatial data',
    price: { monthly: 79, annual: 66 },
    priceLabel: null,
    cta: 'Start Free Trial',
    ctaMode: 'register',
    highlight: false,
    badge: null,
    color: '#00c4cc',
    features: [
      '1 TB storage',
      'Unlimited private datasets',
      'Priority support',
      'Advanced visualization',
      '3D point cloud viewer',
      'Orthophoto tools',
      'Collaboration (up to 20 members)',
      'Role-based access control',
      'API access + webhooks',
      'Custom domain',
      'SSO / SAML',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Custom solutions for large organizations',
    price: { monthly: null, annual: null },
    priceLabel: 'Contact Us',
    cta: 'Contact Sales',
    ctaMode: null,
    highlight: false,
    badge: null,
    color: '#1a1a2e',
    features: [
      'Unlimited storage',
      'Unlimited datasets & members',
      'Dedicated support & SLA',
      'On-premise deployment',
      'Advanced security controls',
      'Custom integrations',
      'White-label options',
      'Audit logs',
      'Custom contracts',
    ],
  },
];

/* ── FAQ data ───────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What is DroneDB?',
    a: 'DroneDB is a free and open source software platform for modern geospatial data management. It lets you store, visualize, and share orthophotos, point clouds, 3D models, and geotagged files — all in one place.',
  },
  {
    q: 'Can I try DroneDB for free?',
    a: 'Yes! Our Community plan is permanently free with 5 GB of storage and unlimited public datasets. Pro and Team plans also offer a 14-day free trial with no credit card required.',
  },
  {
    q: 'What types of geospatial data does DroneDB support?',
    a: 'DroneDB supports orthophotos (GeoTIFF), point clouds (LAS/LAZ/COPC), 3D models (OBJ, glTF), geotagged images (JPEG, DNG), elevation models (DTM/DSM), and many more formats.',
  },
  {
    q: 'Is my data secure and private?',
    a: 'Absolutely. All data is encrypted in transit and at rest. Private datasets are accessible only to you and your authorized team members. We never share your data with third parties.',
  },
  {
    q: 'Can I use DroneDB with my existing tools?',
    a: 'Yes. DroneDB provides a full REST API and supports integration with popular GIS tools like QGIS, OpenDroneMap, and WebODM. SDKs are available for Python, JavaScript, and more.',
  },
  {
    q: 'How does billing work?',
    a: 'You can choose monthly or annual billing. Annual plans save you up to 17%. You can upgrade, downgrade, or cancel at any time. Payments are processed securely via Stripe.',
  },
  {
    q: 'What happens when I exceed my storage limit?',
    a: 'You will receive an email notification before you hit your limit. Uploads will be paused until you upgrade your plan or free up space. Your existing data is never deleted automatically.',
  },
  {
    q: 'Do you offer on-premise or self-hosted options?',
    a: 'Yes! DroneDB is fully open source. You can self-host it on your own infrastructure at no cost. Enterprise customers can also get dedicated hosting and managed on-premise deployments.',
  },
  {
    q: 'Is there a limit on the number of team members?',
    a: 'Community is for individuals, Pro supports up to 5 members, Team supports up to 20 members, and Enterprise has unlimited members. You can invite collaborators with fine-grained role-based permissions.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from your account settings with no cancellation fees. Your plan will remain active until the end of the current billing period.',
  },
];

/* ── Feature comparison table ───────────────────────────────── */
const COMPARE_FEATURES = [
  { label: 'Storage', community: '5 GB', pro: '100 GB', team: '1 TB', enterprise: 'Unlimited' },
  { label: 'Public datasets', community: 'Unlimited', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
  { label: 'Private datasets', community: '—', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
  { label: 'Team members', community: '1', pro: '5', team: '20', enterprise: 'Unlimited' },
  { label: '3D point cloud viewer', community: false, pro: true, team: true, enterprise: true },
  { label: 'Orthophoto tools', community: false, pro: true, team: true, enterprise: true },
  { label: 'API access', community: true, pro: true, team: true, enterprise: true },
  { label: 'Webhooks', community: false, pro: true, team: true, enterprise: true },
  { label: 'SSO / SAML', community: false, pro: false, team: true, enterprise: true },
  { label: 'Custom domain', community: false, pro: true, team: true, enterprise: true },
  { label: 'On-premise deployment', community: false, pro: false, team: false, enterprise: true },
  { label: 'SLA & dedicated support', community: false, pro: false, team: false, enterprise: true },
];

/* ── Helpers ────────────────────────────────────────────────── */
function Cell({ value }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span style={{ color: '#0041e8', fontSize: '1.1rem' }}>✓</span>
    ) : (
      <span style={{ color: '#ccc' }}>—</span>
    );
  }
  return <span>{value}</span>;
}

/* ── Component ──────────────────────────────────────────────── */
export default function PlansPage() {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'annual'
  const [openFaq, setOpenFaq] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [showCookiePrefs, setShowCookiePrefs] = useState(false);

  const handleCTA = (plan) => {
    if (plan.ctaMode) {
      setAuthMode(plan.ctaMode);
      setAuthModalOpen(true);
    } else {
      window.location.href = 'mailto:sales@dronedb.app';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: '"Inter", "Roboto", system-ui, sans-serif', color: '#212529' }}>
      <Header onOpenAuth={(mode) => { setAuthMode(mode); setAuthModalOpen(true); }} onOpenPricing={() => {}} />

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #0d2137 100%)',
        paddingTop: '132px',
        paddingBottom: '80px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 80%, rgba(0,196,204,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,65,232,0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px', padding: '0.4rem 1rem', marginBottom: '1.25rem',
            fontSize: '0.875rem', fontWeight: 500, color: '#00c4cc',
            backdropFilter: 'blur(10px)',
          }}>
            <Rocket size={14} /> Simple, Transparent Pricing
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem',
          }}>
            Choose the plan that's<br />
            <span style={{
              background: 'linear-gradient(135deg, #00c4cc, #0041e8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>right for you</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '2rem' }}>
            All plans include a 14-day free trial. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.12)', borderRadius: '50px', padding: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
            {['monthly', 'annual'].map((b) => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '0.5rem 1.5rem', borderRadius: '50px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600,
                background: billing === b ? '#ffffff' : 'transparent',
                color: billing === b ? '#0041e8' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s',
              }}>
                {b === 'monthly' ? 'Monthly' : 'Annual'}{b === 'annual' && <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: billing === 'annual' ? '#00c4cc' : '#00c4cc', fontWeight: 700 }}>Save 17%</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ─────────────────────────────────────── */}
      <section style={{ background: '#f8f9fb', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}>
            {PLANS.map((plan) => {
              const price = plan.priceLabel
                ? plan.priceLabel
                : billing === 'annual'
                ? `$${plan.price.annual}`
                : `$${plan.price.monthly}`;
              const period = plan.priceLabel ? null : `/ mo${billing === 'annual' ? ' (billed annually)' : ''}`;

              return (
                <div key={plan.id} style={{
                  background: plan.highlight ? 'linear-gradient(145deg, #0041e8, #0033b5)' : '#ffffff',
                  color: plan.highlight ? '#fff' : '#1a1a2e',
                  borderRadius: '1.25rem',
                  padding: '2rem',
                  boxShadow: plan.highlight
                    ? '0 20px 60px rgba(0,65,232,0.35)'
                    : '0 4px 24px rgba(0,0,0,0.08)',
                  position: 'relative',
                  transform: plan.highlight ? 'translateY(-12px)' : 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: plan.highlight ? 'none' : '1px solid #e9ecef',
                }}>
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #00c4cc, #0041e8)',
                      color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                      padding: '0.3rem 1rem', borderRadius: '50px',
                      letterSpacing: '0.5px', whiteSpace: 'nowrap',
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{plan.name}</h2>
                    <p style={{ fontSize: '0.875rem', color: plan.highlight ? 'rgba(255,255,255,0.75)' : 'rgba(26,26,46,0.6)', margin: 0, lineHeight: 1.5 }}>{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      {!plan.priceLabel && <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>$</span>}
                      <span style={{ fontSize: plan.priceLabel ? '1.75rem' : '3rem', fontWeight: 800, lineHeight: 1 }}>
                        {plan.priceLabel
                          ? plan.priceLabel
                          : billing === 'annual'
                          ? plan.price.annual
                          : plan.price.monthly}
                      </span>
                    </div>
                    {period && (
                      <p style={{ fontSize: '0.8rem', color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(26,26,46,0.5)', margin: '0.25rem 0 0' }}>
                        {period}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button onClick={() => handleCTA(plan)} style={{
                    width: '100%', padding: '0.875rem 1rem',
                    borderRadius: '50px', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700,
                    background: plan.highlight ? '#ffffff' : `linear-gradient(135deg, #0041e8, #00c4cc)`,
                    color: plan.highlight ? '#0041e8' : '#ffffff',
                    boxShadow: plan.highlight ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,65,232,0.3)',
                    transition: 'all 0.25s',
                    marginBottom: '1.75rem',
                  }}>
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}>
                        <Check size={15} style={{ color: plan.highlight ? '#00c4cc' : '#0041e8', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#374151' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature Comparison Table ──────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.75rem' }}>
              Compare Plans
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(26,26,46,0.65)', margin: 0 }}>
              Everything you need to choose the right plan for your team.
            </p>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #e9ecef' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #0a1628, #1a365d)', color: '#fff' }}>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontWeight: 700, fontSize: '0.875rem' }}>Feature</th>
                  {['Community', 'Pro', 'Team', 'Enterprise'].map((h) => (
                    <th key={h} style={{ padding: '1rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FEATURES.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8f9fb' : '#fff', borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500, color: '#1a1a2e' }}>{row.label}</td>
                    {(['community', 'pro', 'team', 'enterprise']).map((col) => (
                      <td key={col} style={{ padding: '0.85rem 1.25rem', textAlign: 'center', color: '#374151' }}>
                        <Cell value={row[col]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Trust Logos / Why DroneDB ─────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: '#f8f9fb', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: '1rem' }}>
            Why thousands of professionals choose DroneDB
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(26,26,46,0.65)', marginBottom: '3rem' }}>
            Built for drone pilots, surveyors, and GIS professionals worldwide.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <HardDrive size={28} color="#0041e8" />, title: 'Secure Storage', desc: 'Encrypted at rest and in transit. Your data, your control.' },
              { icon: <Layers size={28} color="#0041e8" />, title: 'All Formats', desc: 'Orthophotos, point clouds, 3D models — we support them all.' },
              { icon: <Share2 size={28} color="#0041e8" />, title: 'Easy Sharing', desc: 'Share datasets with a link or collaborate with your team.' },
              { icon: <Cloud size={28} color="#0041e8" />, title: 'Open Source', desc: 'Self-host for free or use our cloud — the choice is yours.' },
              { icon: <Zap size={28} color="#0041e8" />, title: 'Fast Viewer', desc: 'Render large point clouds and orthophotos blazing fast in the browser.' },
              { icon: <Shield size={28} color="#0041e8" />, title: 'Enterprise Ready', desc: 'SSO, RBAC, audit logs, and dedicated support for large teams.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '1rem', padding: '1.75rem 1.25rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #e9ecef',
                textAlign: 'left',
              }}>
                <div style={{ marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 0.4rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(26,26,46,0.65)', margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'linear-gradient(135deg, rgba(0,65,232,0.08), rgba(0,196,204,0.08))',
              border: '1px solid rgba(0,65,232,0.15)', borderRadius: '50px',
              padding: '0.35rem 1rem', marginBottom: '1rem',
              fontSize: '0.8rem', fontWeight: 600, color: '#0041e8',
            }}>
              FAQ
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.75rem' }}>
              Frequently asked questions
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(26,26,46,0.65)', margin: 0 }}>
              Everything you need to know about DroneDB and our pricing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                border: '1px solid #e9ecef', borderRadius: '0.875rem',
                overflow: 'hidden',
                boxShadow: openFaq === i ? '0 4px 20px rgba(0,65,232,0.1)' : 'none',
                transition: 'box-shadow 0.2s',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1.125rem 1.5rem', background: openFaq === i ? 'linear-gradient(135deg, rgba(0,65,232,0.04), rgba(0,196,204,0.04))' : '#fff',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '1rem', fontWeight: 600, color: '#1a1a2e', textAlign: 'left',
                  gap: '1rem',
                }}>
                  <span>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} color="#0041e8" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={18} color="#6c757d" style={{ flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(0,65,232,0.02), rgba(0,196,204,0.02))',
                    fontSize: '0.9375rem', color: 'rgba(26,26,46,0.75)', lineHeight: 1.7,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0041e8, #0033b5)',
        padding: '5rem 1.5rem', textAlign: 'center', color: '#fff',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Join thousands of professionals managing their geospatial data with DroneDB.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }} style={{
              padding: '1rem 2.25rem', borderRadius: '50px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700,
              background: '#ffffff', color: '#0041e8',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              transition: 'all 0.25s',
            }}>
              Start Free Trial
            </button>
            <Link to="/" style={{
              padding: '1rem 2.25rem', borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.4)',
              fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer onOpenCookiePrefs={() => setShowCookiePrefs(true)} />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      <CookieConsent
        forceShow={showCookiePrefs}
        onCloseForce={() => setShowCookiePrefs(false)}
      />
    </div>
  );
}
