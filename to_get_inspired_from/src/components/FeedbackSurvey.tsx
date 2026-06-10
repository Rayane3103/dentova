/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Testimonial, ParticipantOpinion } from '../types';
import { TESTIMONIALS, INITIAL_OPINIONS } from '../data';
import { Star, ShieldAlert, Sparkles, MessageSquare, ThumbsUp, Send, CheckCircle2, UserCheck, Flame, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FeedbackSurvey() {
  const [opinions, setOpinions] = useState<ParticipantOpinion[]>(INITIAL_OPINIONS);
  
  // States for new opinion form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [ratingImprovement, setRatingImprovement] = useState(5);
  const [ratingSecurity, setRatingSecurity] = useState(5);
  const [ratingResponse, setRatingResponse] = useState(5);
  const [comment, setComment] = useState('');
  
  const [showSuccess, setShowSuccess] = useState(false);

  // Stats calculation
  const totalOpinions = opinions.length;
  const averageAll = Math.round(
    (opinions.reduce((acc, curr) => {
      const avg = (curr.ratingImprovement + curr.ratingSecurity + curr.ratingResponse) / 3;
      return acc + avg;
    }, 0) / (totalOpinions || 1)) * 100
  ) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newOpinion: ParticipantOpinion = {
      id: `custom-op-${Date.now()}`,
      name,
      role: role || 'Chirurgien-Dentiste Praticien',
      ratingImprovement,
      ratingSecurity,
      ratingResponse,
      comment,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    setOpinions([newOpinion, ...opinions]);
    setShowSuccess(true);
    
    // Reset form after submission
    setName('');
    setRole('');
    setRatingImprovement(5);
    setRatingSecurity(5);
    setRatingResponse(5);
    setComment('');

    // Clear success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  // Helper for star rating selection
  const renderStarSelector = (value: number, setValue: (val: number) => void) => {
    return (
      <div className="flex gap-1.5 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            className="text-amber-400 hover:scale-125 focus:outline-none cursor-pointer transition-all p-0.5"
          >
            <Star size={20} fill={star <= value ? 'currentColor' : 'none'} className="stroke-2" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section id="feedback" className="bg-white py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-sm text-dentova-teal-700 uppercase tracking-widest font-black inline-flex items-center gap-1.5 mb-3 bg-dentova-teal-50 border border-dentova-teal-100 py-1 px-4 rounded-full">
            <MessageSquare size={12} className="text-dentova-teal-600" />
            VOTRE OPINION COMPTE !
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dentova-navy-900 leading-tight mb-4">
            Avis & Témoignages de nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dentova-teal-750 to-dentova-teal-550">
              Praticiens Participants
            </span>
          </h2>
          <p className="text-base text-dentova-navy-650 font-light max-w-2xl mx-auto">
            L'excellence exige l'écoute. Découvrez les retours d'expérience et partagez le vôtre pour nous aider dans notre démarche qualité d'amélioration continue.
          </p>
        </div>

        {/* Dynamic Aggregated Metrics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 bg-dentova-navy-50/50 border border-dentova-navy-200/60 p-6 sm:p-10 rounded-3xl text-left">
          
          <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-dentova-navy-200/70 pb-6 md:pb-0 md:pr-8">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-5xl text-dentova-navy-900">{averageAll}</span>
              <span className="text-sm text-dentova-navy-400 font-bold">/ 5</span>
            </div>
            <div className="flex gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(averageAll) ? '#f59e0b' : 'none'}
                  className={star <= Math.round(averageAll) ? 'text-amber-500' : 'text-dentova-navy-300'}
                />
              ))}
            </div>
            <p className="text-xs text-dentova-navy-550 font-medium">Note moyenne basée sur la cohorte active</p>
          </div>

          {/* Three-pillars value criteria ratings */}
          <div className="flex flex-col gap-3 justify-center md:col-span-2 md:pl-8 py-4 sm:py-0">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-dentova-navy-700 uppercase tracking-wide mb-1">
                <span>Amélioration Continue (Qualité scientifique)</span>
                <span className="text-dentova-teal-700">4.9 / 5</span>
              </div>
              <div className="w-full bg-dentova-navy-200 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-dentova-navy-700 uppercase tracking-wide mb-1">
                <span>Confidentialité Totale (Règlementation RGPD)</span>
                <span className="text-dentova-teal-700">5.0 / 5</span>
              </div>
              <div className="w-full bg-dentova-navy-200 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-dentova-navy-700 uppercase tracking-wide mb-1">
                <span>Réponse Rapide (Assistance Inscription)</span>
                <span className="text-dentova-teal-700">4.8 / 5</span>
              </div>
              <div className="w-full bg-dentova-navy-200 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Main Content: Split layout with Testimonials List and New Review Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Testimonials & Participant Feedback Feed */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-display font-extrabold text-xl text-dentova-navy-950 text-left mb-2 flex items-center gap-2 pl-1">
              <MessageSquare size={18} className="text-dentova-teal-600" />
              Derniers Avis de nos Participants :
            </h3>

            {/* Testimonials Slideshow list */}
            <div className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {opinions.map((op) => {
                  const itemAvg = Math.round(((op.ratingImprovement + op.ratingSecurity + op.ratingResponse) / 3) * 10) / 10;
                  return (
                    <motion.div
                      key={op.id}
                      id={`opinion-card-${op.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white border border-dentova-navy-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left"
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-display font-bold text-dentova-navy-900 text-base">{op.name}</h4>
                          <p className="text-xs text-dentova-navy-500 font-medium">{op.role}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-dentova-navy-400 font-medium mb-1">{op.date}</span>
                          <span className="bg-dentova-teal-50 text-dentova-teal-800 text-xs font-bold py-0.5 px-2.5 rounded-full border border-dentova-teal-100 flex items-center gap-1">
                            <Star size={11} fill="currentColor" />
                            {itemAvg}/5
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-dentova-navy-650 leading-relaxed font-light italic">
                        "{op.comment}"
                      </p>

                      <div className="flex gap-4 border-t border-dentova-navy-100 mt-4 pt-3 text-[10px] uppercase font-bold tracking-wider text-dentova-navy-500">
                        <span>Amélioration: <strong className="text-dentova-teal-600 text-xs font-semibold">{op.ratingImprovement}</strong></span>
                        <span>Confidentialité: <strong className="text-dentova-teal-600 text-xs font-semibold">{op.ratingSecurity}</strong></span>
                        <span>Réactivité: <strong className="text-dentova-teal-600 text-xs font-semibold">{op.ratingResponse}</strong></span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Right panel: Static / Interactive submission form */}
          <div className="lg:col-span-5 bg-dentova-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-dentova-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-dentova-teal-400 mb-2 flex items-center gap-1.5">
                <Send size={12} />
                Partagez votre avis
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl mb-4">
                Formulaire d'Avis Clinique
              </h3>
              <p className="text-xs text-dentova-navy-300 font-light leading-relaxed mb-6">
                Vous avez récemment assisté à l'un de nos séminaires ? Votre évaluation directe de nos intervenants, réactivité et confidentialité est d'une valeur capitale.
              </p>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="opinion-name" className="text-xs font-bold text-dentova-navy-200 block mb-1">
                    Nom & Prénom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="opinion-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Dr. Meriem Mansouri"
                    className="w-full bg-white/5 border border-white/15 focus:border-dentova-teal-400 focus:ring-1 focus:ring-dentova-teal-400 text-white placeholder-dentova-navy-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="opinion-role" className="text-xs font-bold text-dentova-navy-200 block mb-1">
                    Titre Professionnel
                  </label>
                  <input
                    id="opinion-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ex: Chirurgien-Dentiste omnipraticien à Bejaia"
                    className="w-full bg-white/5 border border-white/15 focus:border-dentova-teal-400 focus:ring-1 focus:ring-dentova-teal-400 text-white placeholder-dentova-navy-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium"
                  />
                </div>

                {/* Ratings selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/10 py-4 my-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-dentova-navy-350 uppercase tracking-wider">Qualité Scientifique</span>
                    {renderStarSelector(ratingImprovement, setRatingImprovement)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-dentova-navy-350 uppercase tracking-wider">Confidentialité</span>
                    {renderStarSelector(ratingSecurity, setRatingSecurity)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-dentova-navy-350 uppercase tracking-wider">Réponse Coordinateurs</span>
                    {renderStarSelector(ratingResponse, setRatingResponse)}
                  </div>
                </div>

                <div>
                  <label htmlFor="opinion-comment" className="text-xs font-bold text-dentova-navy-200 block mb-1">
                    Votre Commentaire / Expérience <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="opinion-comment"
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Détaillez votre appréciation des cours d'excellence théorique, pratique et logistique..."
                    className="w-full bg-white/5 border border-white/15 focus:border-dentova-teal-400 focus:ring-1 focus:ring-dentova-teal-400 text-white placeholder-dentova-navy-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium resize-none"
                  />
                </div>

                {/* Trigger banner */}
                <button
                  type="submit"
                  id="submit-opinion-btn"
                  className="bg-dentova-teal-500 hover:bg-dentova-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md text-sm mt-2 flex items-center justify-center gap-2 focus:outline-none"
                >
                  <ThumbsUp size={14} />
                  Soumettre mon évaluation
                </button>
              </form>

              {/* Alert success notice */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Merci pour votre avis d'expert et votre contribution essentielle !</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
