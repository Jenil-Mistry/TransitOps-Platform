import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, Shield, Zap, Activity, Navigation, Cpu, Globe, ArrowUpRight,
  ChevronDown, Menu, X, Box, Bus, HardHat, ChartBar, Wrench, AlertTriangle,
  GraduationCap, Map, Users, Briefcase, FileText, BookOpen, HeadphonesIcon,
  Building, Lock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navigationData = {
  Product: [
    { title: 'Fleet Operations', desc: 'Centralized command and control.', icon: Box },
    { title: 'Live Dispatch', desc: 'Algorithmic routing and assignments.', icon: Navigation },
    { title: 'Incident Response', desc: 'Real-time hazard mitigation.', icon: AlertTriangle },
    { title: 'Driver Performance', desc: 'Safety scoring and telematics.', icon: Activity },
    { title: 'Predictive Maintenance', desc: 'Engine diagnostics and scheduling.', icon: Wrench },
    { title: 'Reporting', desc: 'Custom operational analytics.', icon: ChartBar },
  ],
  Industries: [
    { title: 'Public Transit', desc: 'City buses and light rail networks.', icon: Bus },
    { title: 'School Transport', desc: 'Student routing and safety.', icon: GraduationCap },
    { title: 'Shuttle Networks', desc: 'Corporate and university fleets.', icon: Map },
    { title: 'Municipal Fleets', desc: 'City services and heavy equipment.', icon: HardHat },
    { title: 'Private Operators', desc: 'Contracted logistics and charter.', icon: Briefcase },
  ],
  Resources: [
    { title: 'Documentation', desc: 'API references and technical docs.', icon: FileText },
    { title: 'Operations Guides', desc: 'Best practices for transit teams.', icon: BookOpen },
    { title: 'Case Studies', desc: 'Success stories from the field.', icon: Globe },
    { title: 'Blog', desc: 'Latest updates and industry news.', icon: Zap },
    { title: 'Support', desc: '24/7 technical assistance.', icon: HeadphonesIcon },
  ],
  Company: [
    { title: 'About TransitOps', desc: 'Our mission and leadership.', icon: Building },
    { title: 'Security', desc: 'Enterprise-grade compliance.', icon: Lock },
    { title: 'Careers', desc: 'Join our engineering team.', icon: Users },
    { title: 'Contact', desc: 'Get in touch with sales.', icon: Shield },
    { title: 'Partners', desc: 'Integration ecosystem.', icon: ArrowUpRight },
  ],
};

function MegaMenuNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useGSAP(() => {
    if (navRef.current) {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'nav-scrolled', targets: navRef.current },
        onUpdate: (self) => {
          if (self.progress > 0) {
            gsap.to(navRef.current, { y: -32, width: '100%', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', duration: 0.3, ease: 'power2.out' });
          } else {
            gsap.to(navRef.current, { y: 0, width: 'calc(100% - 3rem)', borderRadius: '12px', border: '2px solid var(--color-border-strong)', duration: 0.3, ease: 'power2.out' });
          }
        }
      });
    }
  });

  return (
    <div className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none px-6" onMouseLeave={handleMouseLeave}>
      <nav 
        ref={navRef}
        className="w-full max-w-[1400px] h-16 flex items-center justify-between px-6 bg-[var(--color-bg-app)]/95 backdrop-blur-md border-2 border-[var(--color-border-strong)] rounded-xl pointer-events-auto shadow-lg shadow-black/20 relative"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-brand)] border-2 border-[var(--color-brand-foreground)] flex items-center justify-center">
            <span className="text-[var(--color-brand-foreground)] font-extrabold font-mono leading-none">T</span>
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">TransitOps</span>
        </div>
        
        {/* Desktop Primary Nav */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-[13px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] h-full">
          {Object.keys(navigationData).map((key) => (
            <button 
              key={key}
              onMouseEnter={() => handleMouseEnter(key)}
              onFocus={() => handleMouseEnter(key)}
              className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors h-full group outline-none focus-visible:text-[var(--color-text-primary)]"
            >
              {key} <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === key ? 'rotate-180 text-[var(--color-text-primary)]' : 'opacity-70 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        {/* Desktop Secondary Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="font-mono text-[13px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            Log in
          </Link>
          <Link to="/login">
            <Button className="h-9 font-bold uppercase tracking-wider text-xs px-6">
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-[var(--color-text-primary)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mega Menu Dropdown */}
        {activeMenu && (
          <div 
            className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-[800px] bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] shadow-[8px_8px_0_var(--color-border-strong)] p-6 hidden lg:block animate-in fade-in slide-in-from-top-4 duration-200"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
          >
            {/* Caret */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color-bg-secondary)] border-t-2 border-l-2 border-[var(--color-border-strong)] rotate-45" />
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {navigationData[activeMenu as keyof typeof navigationData].map((item, i) => (
                <a key={i} href="#" className="flex items-start gap-4 p-3 hover:bg-[var(--color-bg-primary)] rounded-[var(--radius-sm)] border-2 border-transparent hover:border-[var(--color-border-strong)] transition-all group">
                  <div className="p-2 bg-[var(--color-bg-app)] border-2 border-[var(--color-border-strong)] rounded-md text-[var(--color-text-primary)] group-hover:bg-[var(--color-brand)] group-hover:text-[var(--color-brand-foreground)] transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[var(--color-text-primary)] leading-none mb-1">{item.title}</h4>
                    <p className="text-[12px] font-mono text-[var(--color-text-muted)]">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-bg-app)] pt-28 px-6 pb-6 flex flex-col overflow-y-auto lg:hidden pointer-events-auto">
          <div className="flex flex-col gap-2 font-mono text-lg font-bold uppercase tracking-widest w-full max-w-[1400px] mx-auto">
            {Object.entries(navigationData).map(([key, items]) => (
              <div key={key} className="border-b border-[var(--color-border-strong)]">
                <button 
                  className="w-full flex justify-between items-center py-4 text-left"
                  onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                >
                  {key} <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpanded === key ? 'rotate-180' : ''}`}/>
                </button>
                {mobileExpanded === key && (
                  <div className="flex flex-col gap-4 pb-4 px-2">
                    {items.map((item, i) => (
                      <a key={i} href="#" className="flex items-center gap-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]" onClick={() => setIsMobileMenuOpen(false)}>
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-8 flex flex-col gap-4 w-full max-w-[1400px] mx-auto">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full h-12 text-sm font-bold uppercase tracking-widest">Log in</Button>
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full h-12 text-sm font-bold uppercase tracking-widest">Get started</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();
    
    tl.fromTo('.hero-badge', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    )
    .fromTo('.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      "-=0.4"
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      "-=0.6"
    )
    .fromTo('.hero-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      "-=0.4"
    )
    .fromTo('.hero-dashboard',
      { opacity: 0, y: 100, rotateX: 10 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power4.out' },
      "-=0.4"
    );

    gsap.utils.toArray('.bento-item').forEach((item: any) => {
      gsap.fromTo(item,
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    gsap.utils.toArray('.stat-number').forEach((stat: any) => {
      gsap.fromTo(stat,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: stat,
            start: "top 80%"
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--color-bg-app)] font-[var(--font-sans)] text-[var(--color-text-primary)] selection:bg-[var(--color-brand)] selection:text-[var(--color-brand-foreground)] overflow-x-hidden relative">
      
      <MegaMenuNavbar />

      {/* Hero Section */}
      <section className="relative pt-[200px] pb-20 md:pt-[240px] md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] text-[var(--color-text-muted)] font-mono text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 bg-[var(--color-brand)]" />
            System v4.0 Deployed
          </div>

          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
            Command Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] to-[#ffc107]">Entire Fleet.</span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-[var(--color-text-muted)] font-mono max-w-2xl mx-auto mb-10 tracking-wide">
            The industrial operating system for modern transit teams. Real-time telematics, predictive maintenance, and automated dispatch in one brutalist terminal.
          </p>

          <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto h-14 text-sm px-8 group">
                Initialize Terminal 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-sm px-8">
              View Architecture
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Abstract */}
      <section className="px-6 -mt-10 md:-mt-20 relative z-20 pb-24">
        <div className="hero-dashboard max-w-[1200px] mx-auto">
          <div className="rounded-none border-4 border-[var(--color-border-strong)] bg-[var(--color-bg-primary)] shadow-[16px_16px_0_var(--color-border-strong)] overflow-hidden">
            <div className="h-10 bg-[var(--color-bg-secondary)] border-b-4 border-[var(--color-border-strong)] flex items-center px-4 gap-2">
              <div className="w-3 h-3 bg-[var(--color-danger)]" />
              <div className="w-3 h-3 bg-[var(--color-warning)]" />
              <div className="w-3 h-3 bg-[var(--color-success)]" />
              <div className="mx-auto text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
                TRANSITOPS / DASHBOARD / LIVE
              </div>
            </div>
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-[var(--color-bg-app)]">
              <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="border-2 border-[var(--color-border-strong)] p-4 bg-[var(--color-bg-primary)]">
                    <div className="w-16 h-2 bg-[var(--color-border-strong)] mb-4" />
                    <div className="w-24 h-8 bg-[var(--color-text-primary)] opacity-20 mb-2" />
                    <div className="w-12 h-2 bg-[var(--color-success)] opacity-50" />
                  </div>
                ))}
              </div>
              <div className="col-span-1 md:col-span-2 border-2 border-[var(--color-border-strong)] h-64 bg-[var(--color-bg-primary)] p-4 flex flex-col justify-end relative overflow-hidden">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
                 <div className="w-full h-32 border-t-2 border-dashed border-[var(--color-brand)] relative z-10 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-[var(--color-brand)] opacity-80" style={{ height: `${h}%` }} />
                    ))}
                 </div>
              </div>
              <div className="col-span-1 border-2 border-[var(--color-border-strong)] h-64 bg-[var(--color-bg-primary)] p-4 space-y-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]" />
                      <div className="flex-1">
                        <div className="w-full h-2 bg-[var(--color-border-strong)] mb-1" />
                        <div className="w-1/2 h-2 bg-[var(--color-border-strong)]" />
                      </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee - Social Proof */}
      <section className="border-y-4 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] py-6 overflow-hidden">
        <div className="flex whitespace-nowrap opacity-50">
          <div className="animate-marquee inline-block font-mono text-xl font-bold uppercase tracking-[0.2em]">
            &bull; TRUSTED BY NY MTA &bull; LONDON TFL &bull; TOKYO METRO &bull; BERLIN BVG &bull; PARIS RATP &bull; SYDNEY TRAINS &bull; TRUSTED BY NY MTA &bull; LONDON TFL &bull; TOKYO METRO &bull; BERLIN BVG &bull; PARIS RATP &bull; SYDNEY TRAINS
          </div>
        </div>
      </section>

      {/* Platform Capabilities (Bento) */}
      <section id="platform" className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Core Architecture.</h2>
            <p className="text-[var(--color-text-muted)] font-mono max-w-xl">No fluffy dashboards. Just raw data and control interfaces built for operational superiority.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bento-item md:col-span-2 border-2 border-[var(--color-border-strong)] rounded-none bg-[var(--color-bg-secondary)] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <Globe className="w-10 h-10 text-[var(--color-brand)] mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Global Telematics</h3>
                <p className="text-[var(--color-text-muted)] font-mono text-sm leading-relaxed max-w-md">Track every vehicle in your fleet with sub-second latency. Geofencing, route deviation alerts, and live traffic overlays integrated directly into your command center.</p>
              </CardContent>
            </Card>
            
            <Card className="bento-item border-2 border-[var(--color-border-strong)] rounded-none bg-[var(--color-bg-secondary)]">
              <CardContent className="p-8 md:p-12">
                <Cpu className="w-10 h-10 text-[var(--color-brand)] mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Predictive Engine</h3>
                <p className="text-[var(--color-text-muted)] font-mono text-sm leading-relaxed">Machine learning models analyze engine telemetry to schedule maintenance before critical failures occur.</p>
              </CardContent>
            </Card>

            <Card className="bento-item border-2 border-[var(--color-border-strong)] rounded-none bg-[var(--color-bg-secondary)]">
              <CardContent className="p-8 md:p-12">
                <Shield className="w-10 h-10 text-[var(--color-brand)] mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Safety Matrix</h3>
                <p className="text-[var(--color-text-muted)] font-mono text-sm leading-relaxed">Monitor driver behavior, harsh braking, and speed limit violations to enforce safety protocols.</p>
              </CardContent>
            </Card>

            <Card className="bento-item md:col-span-2 border-2 border-[var(--color-border-strong)] rounded-none bg-[var(--color-brand)] text-[var(--color-brand-foreground)] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <Zap className="w-10 h-10 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Automated Dispatch</h3>
                <p className="font-mono text-sm leading-relaxed max-w-md font-bold opacity-90">Algorithmic routing assigns the best vehicle and driver to every trip based on hours-of-service, location, and load capacity.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* KPI Outcomes Section */}
      <section id="outcomes" className="py-24 border-y-4 border-[var(--color-border-strong)] bg-black text-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            <div>
              <div className="stat-number text-5xl md:text-7xl font-black font-mono tracking-tighter text-[var(--color-brand)] mb-2">-32%</div>
              <div className="text-sm font-bold uppercase tracking-widest text-neutral-400">Fuel Waste</div>
            </div>
            <div>
              <div className="stat-number text-5xl md:text-7xl font-black font-mono tracking-tighter text-[var(--color-brand)] mb-2">99.9%</div>
              <div className="text-sm font-bold uppercase tracking-widest text-neutral-400">System Uptime</div>
            </div>
            <div>
              <div className="stat-number text-5xl md:text-7xl font-black font-mono tracking-tighter text-[var(--color-brand)] mb-2">15M+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-neutral-400">Trips Logged</div>
            </div>
            <div>
              <div className="stat-number text-5xl md:text-7xl font-black font-mono tracking-tighter text-[var(--color-brand)] mb-2">24/7</div>
              <div className="text-sm font-bold uppercase tracking-widest text-neutral-400">Live Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Ready to Deploy?</h2>
          <p className="text-lg text-[var(--color-text-muted)] font-mono mb-10">Stop managing fleets with spreadsheets and consumer apps. Upgrade to the industrial standard.</p>
          
          <Link to="/login">
            <Button size="lg" className="h-16 text-base px-10 group shadow-[8px_8px_0_var(--color-border-strong)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
              Initialize Terminal <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] px-6 py-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center">
              <span className="font-extrabold font-mono leading-none">T</span>
            </div>
            <span className="font-black tracking-tighter uppercase">TransitOps</span>
          </div>
          
          <div className="flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>&copy; {new Date().getFullYear()}</span>
            <a href="#" className="hover:text-[var(--color-text-primary)]">Privacy</a>
            <a href="#" className="hover:text-[var(--color-text-primary)]">Terms</a>
            <span className="flex items-center gap-2 text-[var(--color-success)]"><div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"/> All Systems Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
