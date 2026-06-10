/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ArrowRight, Award, Flame, Users, BookOpen, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreCourses: () => void;
  onContactClick: () => void;
}

export default function Hero({ onExploreCourses, onContactClick }: HeroProps) {
  const stats = [
    { value: '3+ Ans', label: "D'Excellence Active", icon: Award },
    { value: '1,500+', label: 'Praticiens Formés', icon: Users },
    { value: '35+', label: 'Sessions Réalisées', icon: BookOpen },
    { value: '99%', label: 'Avis Excellents', icon: Star },
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-dentova-navy-950 via-dentova-navy-900 to-dentova-teal-950 text-white overflow-hidden pt-12 pb-20 px-6">
      {/* Decorative background grid and ambient light orbs */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div id="orb-1" className="absolute top-20 left-10 w-96 h-96 bg-dentova-teal-500/10 rounded-full blur-3xl animate-pulse" />
      <div id="orb-2" className="absolute bottom-5 right-10 w-80 h-80 bg-dentova-teal-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left column: Text Content */}
        <div className="lg:col-span-7 flex flex-col text-left">
          {/* Animated Badge */}
          <div id="hero-badge" className="inline-flex self-start items-center gap-2 bg-dentova-teal-950/80 hover:bg-dentova-teal-900/80 border border-dentova-teal-500/30 text-dentova-teal-300 py-1.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner hover:scale-105 transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-dentova-teal-400 animate-ping" />
            <span className="font-display">Formations Dentaires de Pointe en Algérie</span>
          </div>

          {/* Majestic Heading */}
          <h1 id="hero-heading" className="font-display font-extrabold text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-tight mb-6">
            Où l'Excellence <br />
            <span className="bg-gradient-to-r from-dentova-teal-400 via-dentova-teal-300 to-emerald-300 bg-clip-text text-transparent">
              Rencontre l'Expertise
            </span>
          </h1>

          {/* Detailed Paragraph */}
          <p id="hero-description" className="text-dentova-navy-200 text-base sm:text-lg lg:text-xl leading-relaxed font-light mb-10 max-w-2xl">
            Développez vos compétences cliniques auprès de conférenciers internationaux de haut niveau. 
            Débutez ou perfectionnez votre pratique en implantologie, endodontie, esthétique et dentisterie numérique grâce à l'excellence théorique et la rigueur d'ateliers pratiques immersifs sur fantômes en Algérie.
          </p>

          {/* High-impact CTAs */}
          <div id="hero-ctas" className="flex flex-col sm:flex-row gap-4 mb-12 sm:items-center">
            <button
              id="hero-cta-primary"
              onClick={onExploreCourses}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-dentova-teal-500 to-dentova-teal-600 hover:from-dentova-teal-600 hover:to-dentova-teal-700 text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-dentova-teal-500/20 hover:scale-[1.02] cursor-pointer"
            >
              Découvrir nos formations
              <ArrowRight size={18} />
            </button>
            <button
              id="hero-cta-secondary"
              onClick={onContactClick}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
            >
              Nous contacter
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Right column: Interactive Visual Concept */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div id="hero-visual-card" className="relative w-full max-w-md bg-white-50/10 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden group">
            {/* Gloss effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none group-hover:opacity-60 transition-opacity duration-300" />
            
            <div className="relative z-10 flex flex-col">
              {/* Header inside card */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-black text-lg tracking-tight uppercase">DENTOVA ACADEMY</h3>
                  <p className="text-xs text-dentova-teal-400 font-medium">Programme d'élite 2026</p>
                </div>
                <div className="bg-dentova-teal-500/20 border border-dentova-teal-400/30 p-2 rounded-xl text-dentova-teal-350">
                  <Flame size={20} className="animate-bounce" />
                </div>
              </div>

              {/* Dynamic Course Highlights */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="bg-white/5 hover:bg-white/8 transition-colors p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-dentova-teal-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase text-dentova-navy-300">Implantologie Masterclass</p>
                    <p className="text-xs text-white/70 font-semibold">25 - 27 Juin · Alger (Plus que 3 places)</p>
                  </div>
                </div>
                <div className="bg-white/5 hover:bg-white/8 transition-colors p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-dentova-teal-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase text-dentova-navy-300">Endodontie Moderne</p>
                    <p className="text-xs text-white/70 font-semibold">09 - 10 Juillet · Oran</p>
                  </div>
                </div>
                <div className="bg-white/5 hover:bg-white/8 transition-colors p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase text-dentova-navy-300">Esthétique & Facettes</p>
                    <p className="text-xs text-white/70 font-semibold">22 - 24 Juillet · Alger</p>
                  </div>
                </div>
              </div>

              {/* Live Status indicator */}
              <div className="flex items-center justify-between border-t border-white/10 pt-5 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                  </div>
                  <div>
                    <p className="text-[10px] text-dentova-navy-400 font-bold uppercase tracking-wider">Inscriptions</p>
                    <p className="text-xs text-white font-semibold">En cours sur dossier</p>
                  </div>
                </div>
                <button
                  onClick={onExploreCourses}
                  className="bg-white text-dentova-navy-950 font-bold text-xs py-2 px-4 rounded-lg hover:bg-dentova-teal-400 hover:text-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  Postuler
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded statistics panel in hero bottom */}
      <div id="hero-stats-panel" className="max-w-7xl mx-auto w-full z-10 mt-16 lg:mt-24 border-t border-white/10 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xl:gap-8 justify-items-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                id={`hero-stat-item-${i}`}
                className="flex flex-col items-center md:items-start text-center md:text-left group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-dentova-teal-500/10 border border-dentova-teal-500/20 text-dentova-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={16} />
                  </div>
                  <span className="font-display font-black text-3xl md:text-4xl tracking-tight text-white group-hover:text-dentova-teal-400 transition-colors">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-dentova-navy-300 font-medium tracking-wide">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
