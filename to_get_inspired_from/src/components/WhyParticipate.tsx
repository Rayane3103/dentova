/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Monitor, Users, GraduationCap, Flame, ArrowRight, HeartPulse, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyParticipate() {
  const points = [
    {
      icon: Target,
      tag: 'Pratique Réelle',
      title: 'Travaux Pratiques en Hands-On direct',
      description: 'Plus de 70% du temps de formation est alloué à la manipulation concrète sur des fantômes anatomiques haut de gamme ou des simulateurs de cabinet moderne.',
      color: 'bg-teal-50 border-teal-100 text-teal-800',
      iconColor: 'bg-teal-500/10 border-teal-500/20 text-teal-600'
    },
    {
      icon: Users,
      tag: 'Expertise Mondiale',
      title: 'Intervenants et Conférenciers Experts',
      description: 'Formez-vous auprès de leaders opinion nationaux et internationaux reconnus issus d’institutions académiques majeures ou de cliniques spécialisées réputées.',
      color: 'bg-sky-50 border-sky-100 text-sky-800',
      iconColor: 'bg-sky-500/10 border-sky-500/20 text-sky-600'
    },
    {
      icon: Monitor,
      tag: 'Dernière Technologie',
      title: 'Équipement Clinique Ultra-Moderne',
      description: 'Accédez à des technologies dentaires immersives haut de gamme : caméras intra-orales 3D, microscopes opératoires cliniques, moteurs d’endodontie intelligents, etc.',
      color: 'bg-violet-50 border-violet-100 text-violet-800',
      iconColor: 'bg-violet-500/10 border-violet-500/20 text-violet-600'
    },
    {
      icon: GraduationCap,
      tag: 'Accompagnement Suivi',
      title: 'Mentorat de Cas Cliniques sur 6 Mois',
      description: 'Bénéficiez d’un accompagnement inédit post-formation : intégrez en toute sérénité vos cas de cabinet avec un soutien direct par le conférencier et la cohorte.',
      color: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      iconColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
    }
  ];

  return (
    <section id="why-us" className="bg-gradient-to-b from-dentova-navy-50 to-white py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-sm text-dentova-teal-700 uppercase tracking-widest font-black inline-flex items-center gap-1.5 mb-3 bg-dentova-teal-50 border border-dentova-teal-100 py-1 px-4 rounded-full">
            <Flame size={12} className="animate-bounce" />
            POURQUOI PARTICIPER ?
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dentova-navy-900 leading-tight mb-4">
            Prenez une longueur d'avance dans <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dentova-teal-750 to-dentova-teal-550">
              votre Pratique Dentaire
            </span>
          </h2>
          <p className="text-base text-dentova-navy-650 font-light max-w-2xl mx-auto">
            L'évolution des technologies et des exigences des patients nécessite une mise à jour constante. Découvrez comment nous transformons votre apprentissage en réussite clinique.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {points.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                id={`why-point-card-${i}`}
                className="relative bg-white border border-dentova-navy-200/50 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                {/* Visual hover background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-dentova-teal-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                  <div className={`p-4 rounded-2xl border ${point.iconColor} shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-grow text-left">
                    <span className="text-xs font-bold text-dentova-teal-600 uppercase tracking-wider mb-1.5 block">
                      {point.tag}
                    </span>
                    <h3 className="font-display font-bold text-xl text-dentova-navy-900 mb-3 group-hover:text-dentova-teal-750 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-sm text-dentova-navy-600 leading-relaxed font-light">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative banners */}
        <div id="stats-banner" className="bg-dentova-navy-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl text-left">
          {/* background details */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-dentova-teal-900),transparent)] opacity-40" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-3 text-white">
                Prêt à intégrer les techniques dentaires de demain ?
              </h3>
              <p className="text-sm sm:text-base text-dentova-navy-200 font-light leading-relaxed max-w-3xl">
                Toutes nos formations sont validées, certifiantes et dotées d'un nombre de sièges restreint (10 à 15 participants maximum) afin de garantir une attention continue et un encadrement hautement qualitatif lors des travaux pratiques (TP).
              </p>
            </div>
            
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-start sm:items-center lg:items-start xl:pl-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-dentova-teal-400 flex-shrink-0" size={20} />
                <span className="text-sm font-semibold">Attestation clinique de haut niveau</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-dentova-teal-400 flex-shrink-0" size={20} />
                <span className="text-sm font-semibold">Accréditation Dentova Events</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-dentova-teal-400 flex-shrink-0" size={20} />
                <span className="text-sm font-semibold">Supports cliniques exclusifs inclus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
