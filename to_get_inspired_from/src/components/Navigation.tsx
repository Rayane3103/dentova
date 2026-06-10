/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Phone, Mail, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function Navigation({ onNavigate, activeSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', id: 'home' },
    { name: 'Pourquoi nous ?', id: 'why-us' },
    { name: 'Qui sommes-nous ?', id: 'about' },
    { name: 'Nos Formations', id: 'courses' },
    { name: 'Opinion Participant', id: 'feedback' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top micro-bar for general info */}
      <div id="nav-top-bar" className="hidden lg:block bg-dentova-navy-950 text-dentova-navy-300 text-xs py-2 border-b border-dentova-navy-800 transition-colors z-[100] relative">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-dentova-teal-400 cursor-pointer transition-colors">
              <Phone size={13} className="text-dentova-teal-500" />
              +213 (0) 550 12 34 56
            </span>
            <span className="flex items-center gap-2 hover:text-dentova-teal-400 cursor-pointer transition-colors">
              <Mail size={13} className="text-dentova-teal-500" />
              contact@dentovaevents.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-dentova-teal-400 flex items-center gap-1.5 font-medium">
              <Award size={13} />
              Leader Dentaire en Algérie
            </span>
            <span className="text-dentova-navy-400">|</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-dentova-teal-500" />
              Inscriptions Ouvertes 2026
            </span>
          </div>
        </div>
      </div>

      <header
        id="main-navigation"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-dentova-navy-100'
            : 'bg-white/70 backdrop-blur-sm py-5 border-b border-dentova-navy-50/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo with tooth/star abstract icon */}
          <button
            id="nav-logo"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-dentova-teal-700 to-dentova-teal-400 flex items-center justify-center text-white shadow-lg shadow-dentova-teal-600/15 group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-xl tracking-tighter">D</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-xl tracking-tight text-dentova-navy-900 group-hover:text-dentova-teal-700 transition-colors uppercase leading-none">
                Dentova
              </span>
              <span className="text-[10px] tracking-widest text-dentova-navy-500 font-bold uppercase mt-0.5">
                Dental Events
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <nav id="desktop-links" className="hidden md:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`relative px-3.5 py-1.5 rounded-full font-medium text-sm transition-all focus:outline-none cursor-pointer ${
                  activeSection === link.id
                    ? 'text-dentova-teal-800'
                    : 'text-dentova-navy-600 hover:text-dentova-teal-700 hover:bg-dentova-navy-100/40'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute inset-0 bg-dentova-teal-50 border border-dentova-teal-100/50 rounded-full z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              id="nav-cta-btn"
              onClick={() => handleLinkClick('contact')}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-dentova-teal-700 to-dentova-teal-650 hover:from-dentova-teal-800 hover:to-dentova-teal-750 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg shadow-dentova-teal-700/10 cursor-pointer focus:outline-none"
            >
              <Sparkles size={14} className="animate-pulse" />
              S'inscrire
            </button>

            {/* Mobile menu button */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-dentova-navy-600 hover:text-dentova-teal-600 hover:bg-dentova-navy-100/50 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-white border-t border-dentova-navy-100 overflow-hidden shadow-inner"
            >
              <div className="px-6 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className={`w-full text-left py-3 px-4 rounded-xl font-semibold text-base transition-all ${
                      activeSection === link.id
                        ? 'bg-dentova-teal-50 text-dentova-teal-850 hover:bg-dentova-teal-100/50'
                        : 'text-dentova-navy-700 hover:text-dentova-teal-700 hover:bg-dentova-navy-50'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                
                {/* Contact info for mobile menu */}
                <div className="border-t border-dentova-navy-150 pt-4 mt-2 flex flex-col gap-3 font-medium text-xs text-dentova-navy-500 px-4">
                  <span className="flex items-center gap-2">
                    <Phone size={13} className="text-dentova-teal-600" />
                    +213 (0) 550 12 34 56
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail size={13} className="text-dentova-teal-600" />
                    contact@dentovaevents.com
                  </span>
                </div>

                <button
                  id="mobile-nav-cta-btn"
                  onClick={() => handleLinkClick('contact')}
                  className="w-full text-center mt-4 bg-dentova-teal-600 hover:bg-dentova-teal-700 text-white py-3 rounded-xl font-bold text-base transition-colors"
                >
                  Demander une formation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
