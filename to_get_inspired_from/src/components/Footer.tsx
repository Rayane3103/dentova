/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, Send, CheckCircle2, Sparkles, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmitting(true);
    // Simulate real database append
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1200);
  };

  const navLinks = [
    { name: 'Conseils & Accueil', id: 'home' },
    { name: 'Pourquoi Participer ?', id: 'why-us' },
    { name: 'Qui Sommes-Nous ?', id: 'about' },
    { name: 'Catalogue Formations', id: 'courses' },
    { name: 'Évaluation Clinique', id: 'feedback' },
    { name: 'Suivi & FAQ', id: 'faq' },
    { name: 'Contact & Bureaux', id: 'contact' },
  ];

  return (
    <footer id="footer" className="bg-dentova-navy-950 text-white relative z-10 pt-20 pb-10 border-t border-white/5 text-left">
      {/* Background decoration elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-dentova-teal-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
        
        {/* Column 1: Brand & Bio */}
        <div className="lg:col-span-4 flex flex-col items-start gap-5">
          <div className="flex items-center gap-2.5 group cursor-pointer focus:outline-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-dentova-teal-700 to-dentova-teal-400 flex items-center justify-center text-white shadow-lg">
              <span className="font-display font-black text-lg tracking-tighter">D</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-lg tracking-tight text-white leading-none">
                DENTOVA
              </span>
              <span className="text-[9px] tracking-widest text-dentova-teal-400 font-bold uppercase mt-0.5 leading-none">
                Dental Events
              </span>
            </div>
          </div>
          <p className="text-xs text-dentova-navy-350 leading-relaxed font-light mt-2 max-w-sm">
            Dentova Events est le leader incontournable de la formation dentaire d’excellence et de l'organisation d'événements scientifiques odontostomatologiques d'élite en Algérie.
          </p>
          
          {/* Quick social follow links */}
          <div className="flex items-center gap-3.5 mt-3">
            <a
              href="https://facebook.com/dentova"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 ml-0 rounded-full bg-white/5 border border-white/10 text-dentova-navy-300 hover:text-dentova-teal-400 hover:bg-white/10 hover:border-dentova-teal-400/50 transition-all cursor-pointer"
              aria-label="Dentova Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://instagram.com/dentova"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-dentova-navy-300 hover:text-dentova-teal-400 hover:bg-white/10 hover:border-dentova-teal-400/50 transition-all cursor-pointer"
              aria-label="Dentova Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://linkedin.com/company/dentova"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-dentova-navy-300 hover:text-dentova-teal-400 hover:bg-white/10 hover:border-dentova-teal-400/50 transition-all cursor-pointer"
              aria-label="Dentova LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://youtube.com/dentova"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-dentova-navy-300 hover:text-dentova-teal-400 hover:bg-white/10 hover:border-dentova-teal-400/50 transition-all cursor-pointer"
              aria-label="Dentova YouTube Channel"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-3 lg:pl-4 flex flex-col items-start">
          <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4 w-full">
            Liens Rapides
          </h4>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="text-xs text-dentova-navy-350 hover:text-dentova-teal-300 transition-colors text-left flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <span>›</span>
                <span>{link.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Column 3: Contact Coordinates Info */}
        <div className="lg:col-span-2 flex flex-col items-start gap-4">
          <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-2 w-full">
            Nous Contacter
          </h4>
          <div className="flex flex-col gap-3 font-light text-xs text-dentova-navy-350 text-left">
            <span className="flex gap-2.5 items-start">
              <MapPin size={13} className="text-dentova-teal-400 flex-shrink-0 mt-0.5" />
              <span>Chéraga, El-Qods. Alger, Algérie</span>
            </span>
            <span className="flex gap-2.5 items-start">
              <Phone size={13} className="text-dentova-teal-400 flex-shrink-0 mt-0.5" />
              <span>+213 (0) 550 12 34 56</span>
            </span>
            <span className="flex gap-2.5 items-start overflow-hidden">
              <Mail size={13} className="text-dentova-teal-400 flex-shrink-0 mt-0.5" />
              <span className="truncate">contact@dentovaevents.com</span>
            </span>
          </div>
        </div>

        {/* Column 4: Newsletter Box */}
        <div className="lg:col-span-3 flex flex-col items-start gap-4 w-full">
          <h4 className="font-display font-extrabold text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-2 w-full">
            Abonnement Newsletter
          </h4>
          <p className="text-xs text-dentova-navy-350 leading-relaxed font-light mb-2">
            Rejoignez notre cercle d'odontostomatologie et recevez en exclusivité les dates de nos prochains congrès et masterclasses.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="relative w-full">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="votre.email@gmail.com"
              className="w-full bg-white/5 border border-white/15 focus:border-dentova-teal-400 rounded-xl pl-4 pr-12 py-3 text-xs outline-none transition-all placeholder-dentova-navy-500 font-medium text-white"
            />
            <button
              type="submit"
              id="newsletter-submit-btn"
              disabled={isSubmitting}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-dentova-teal-500 hover:bg-dentova-teal-600 disabled:bg-dentova-navy-800 text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
              aria-label="S'abonner"
            >
              {isSubmitting ? <Loader size={12} className="animate-spin text-white" /> : <Send size={12} />}
            </button>
          </form>

          {/* Success notice */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl flex items-center gap-2 text-[10px] w-full font-semibold "
              >
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Inscription validée. Bienvenue parmi nous !</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Copyblock footer */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-dentova-navy-400 font-medium">
        <p>© 2026 Dentova Events. Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          <Sparkles size={11} className="text-dentova-teal-500" />
          Conçu pour l'Excellence Clinique en Médecine Dentaire
        </p>
      </div>
    </footer>
  );
}
