/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Course } from '../types';
import { COURSES } from '../data';
import { MapPin, Calendar, Clock, Award, ArrowRight, CheckCircle2, Filter, Info, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursesProps {
  onSelectCourseForInquiry: (courseId: string) => void;
  onViewCourseDetail: (courseId: string) => void;
}

export default function Courses({ onSelectCourseForInquiry, onViewCourseDetail }: CoursesProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeLocation, setActiveLocation] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'implantology', label: 'Implantologie' },
    { id: 'endodontics', label: 'Endodontie' },
    { id: 'aesthetics', label: 'Esthétique' },
    { id: 'orthodontics', label: 'Orthodontie' },
    { id: 'digital', label: 'Flux Numérique' },
  ];

  const locations = [
    { id: 'all', label: 'Pays Entier' },
    { id: 'Alger', label: 'Alger' },
    { id: 'Oran', label: 'Oran' },
    { id: 'Constantine', label: 'Constantine' },
  ];

  // Filtering Logic
  const filteredCourses = COURSES.filter((course) => {
    const matchCategory = activeTab === 'all' || course.category === activeTab;
    const matchLocation = activeLocation === 'all' || course.location === activeLocation;
    return matchCategory && matchLocation;
  });

  return (
    <section id="courses" className="bg-dentova-navy-950 text-white py-24 px-6 relative border-t border-white/5 text-left">
      {/* Intricate thin matrix lines of dark luxury background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-dentova-teal-650/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-16 max-w-3xl">
          <span className="text-xs text-dentova-teal-300 uppercase tracking-widest font-black inline-flex items-center gap-1.5 mb-4 bg-dentova-teal-500/10 border border-dentova-teal-505/20 py-1.5 px-4.5 rounded-full">
            <Award size={12} className="text-dentova-teal-400" />
            CATALOGUE DES FORMATIONS D'ÉLITE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Prenez place pour nos prochaines <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-dentova-teal-400 via-dentova-teal-300 to-emerald-300">
              Masterclasses & Travaux Pratiques
            </span>
          </h2>
          <p className="text-sm text-dentova-navy-300 font-light max-w-2xl">
            Cliquez sur un cursus pour ouvrir sa fiche clinique structurée, explorer ses modules théoriques d'excellence de haut niveau et postuler en ligne.
          </p>
        </div>

        {/* Categories Tab & Location Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 border-b border-white/10 pb-8">
          
          {/* Categories Tab */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <span className="text-[10px] text-dentova-navy-400 font-black uppercase tracking-wider flex items-center gap-1">
              <Filter size={11} className="text-dentova-teal-400" />
              Filtrer par Thématique :
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-medium">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                    activeTab === cat.id
                      ? 'bg-dentova-teal-500/20 border border-dentova-teal-400 text-dentova-teal-300 scale-102 font-black'
                      : 'bg-white/5 border border-white/5 text-dentova-navy-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filters */}
          <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
            <span className="text-[10px] text-dentova-navy-400 font-black uppercase tracking-wider lg:text-right w-full">
              Ville de Session :
            </span>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocation(loc.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer focus:outline-none ${
                    activeLocation === loc.id
                      ? 'bg-white text-dentova-navy-950 border-white'
                      : 'bg-white/5 text-dentova-navy-300 border-white/5 hover:border-dentova-teal-400/50'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Full-Cover Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  id={`course-card-${course.id}`}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: 'spring', damping: 20 }}
                  onClick={() => onViewCourseDetail(course.id)}
                  className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-dentova-teal-400/40 shadow-xl transition-all duration-500 flex flex-col justify-between h-[440px] group cursor-pointer"
                >
                  {/* Background Image with less opacity and fade-cover effect */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      referrerPolicy="no-referrer"
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out saturate-75"
                    />
                    {/* The Fade Overlays - beautiful progressive dark gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dentova-navy-950 via-dentova-navy-950/75 to-dentova-navy-950/20" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
                  </div>

                  {/* Card upper - Floating Labels */}
                  <div className="p-6 relative z-10 flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-dentova-teal-500/20 border border-dentova-teal-400/30 text-dentova-teal-300 py-1 px-3 rounded-md backdrop-blur-md">
                      {course.categoryLabel}
                    </span>
                    <span className="bg-black/50 text-white font-semibold text-[10px] px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1 border border-white/10">
                      <MapPin size={10} className="text-dentova-teal-400" />
                      {course.location}
                    </span>
                  </div>

                  {/* Card Body & Footer - Stacked below image with opacity fade */}
                  <div className="p-6 relative z-10 text-left bg-gradient-to-t from-dentova-navy-950 via-dentova-navy-950/90 to-transparent pt-12">
                    
                    {/* Placeholder image tag indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-2 right-6 bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[8px] tracking-wider text-dentova-navy-200 uppercase pointer-events-none">
                      [Modifier l'image]
                    </div>

                    {/* Quick Course Details */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-bold text-dentova-teal-300">
                        {course.duration}
                      </span>
                      <span className="text-[10px] text-dentova-navy-300 flex items-center gap-1 font-semibold">
                        <Calendar size={11} className="text-dentova-teal-400" />
                        {course.upcomingDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-lg text-white mb-2 leading-snug group-hover:text-dentova-teal-300 transition-colors line-clamp-2 min-h-[50px]">
                      {course.title}
                    </h3>

                    {/* Speaker subtitle */}
                    <p className="text-[10px] text-dentova-navy-300 font-light mb-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-dentova-teal-400" />
                      Dirigé par <strong>{course.speaker}</strong>
                    </p>

                    {/* Progress bar / Seats left alerts */}
                    <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-dentova-navy-400 uppercase tracking-widest font-black">État TP :</span>
                        <span className={`font-bold ${course.seatsLeft <= 3 ? 'text-rose-400' : 'text-dentova-teal-400'}`}>
                          {course.seatsLeft <= 3 ? `Dernières ${course.seatsLeft} places !` : `${course.seatsLeft} places de TP dispos`}
                        </span>
                      </div>
                      
                      {/* Compact seats visual progress bar */}
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${course.seatsLeft <= 3 ? 'bg-rose-500' : 'bg-dentova-teal-500'}`}
                          style={{ width: `${((course.maxSeats - course.seatsLeft) / course.maxSeats) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Interactive CTAs */}
                    <div className="flex items-center justify-between gap-2.5 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewCourseDetail(course.id);
                        }}
                        className="text-[10px] font-bold text-dentova-navy-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors focus:outline-none"
                      >
                        Clinique & Détails
                        <Info size={11} className="text-dentova-teal-400" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourseForInquiry(course.id);
                        }}
                        className="bg-dentova-teal-500 hover:bg-dentova-teal-600 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 focus:outline-none"
                      >
                        S'inscrire
                        <ArrowRight size={10} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center text-center">
                <AlertCircle size={32} className="text-dentova-navy-500 mb-2" />
                <p className="text-lg font-bold text-dentova-navy-400 mb-1">Aucune session trouvée</p>
                <p className="text-xs text-dentova-navy-500 font-light max-w-sm">
                  Essayez de réinitialiser la recherche thématique ou de choisir une autre ville en Algérie.
                </p>
                <button
                  onClick={() => { setActiveTab('all'); setActiveLocation('all'); }}
                  className="mt-4 text-xs font-bold bg-white/5 border border-white/10 text-white py-2 px-5 rounded-full hover:bg-white/10 hover:border-dentova-teal-400/50 transition-colors cursor-pointer focus:outline-none"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Informative advice footer for courses */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-16 max-w-4xl mx-auto flex flex-col sm:flex-row gap-5 items-center text-left">
          <div className="p-3 bg-dentova-teal-500/10 border border-dentova-teal-500/20 text-dentova-teal-400 rounded-2xl flex-shrink-0">
            <Info size={22} />
          </div>
          <div className="text-xs">
            <h4 className="font-display font-bold text-white mb-1">
              Des interrogations sur le choix du thème ou votre niveau clinique ?
            </h4>
            <p className="text-dentova-navy-300 font-light leading-relaxed">
              Toutes nos sessions sont supervisées en direct par des chirurgiens experts pour assurer une sécurité d'action totale. Contactez notre académie au <strong className="text-dentova-teal-400">+213 (0) 550 12 34 56</strong> pour un conseil personnalisé.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
