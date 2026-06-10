/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, BookOpen, Mic2, Users2, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutUs() {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Formation Clinique',
      desc: 'Cursus immersifs théoriques et pratiques structurés en thématiques de pointe (Implantologie, Endodontie...) avec des ateliers intensifs.'
    },
    {
      icon: Mic2,
      title: 'Événements Scientifiques',
      desc: 'Organisation de congrès d’élite, symposiums, et masterclasses de haut standing avec retransmission live.'
    },
    {
      icon: Users2,
      title: 'Réseau & Partage Clinique',
      desc: 'Accès privilégié à un cercle fermé de praticiens actifs en Algérie pour s’entraider sur l’analyse de cas complexes.'
    }
  ];

  return (
    <section id="about" className="bg-white py-24 px-6 relative overflow-hidden text-left">
      {/* Delicate layout background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-dentova-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-dentova-navy-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Block: Narrative text & Vision */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-xs text-dentova-teal-700 uppercase tracking-widest font-black inline-flex items-center gap-1.5 mb-4 bg-dentova-teal-50 border border-dentova-teal-100 py-1.5 px-4 rounded-full">
              <Sparkles size={12} className="text-dentova-teal-600" />
              QUI SOMMES-NOUS ?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-dentova-navy-900 leading-tight mb-6">
              L’Élite de la Formation Continue <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-dentova-teal-700 to-dentova-teal-500">
                Dentaire en Algérie
              </span>
            </h2>
            <p className="text-sm text-dentova-navy-650 font-light leading-relaxed mb-4">
              <strong>Dentova Events</strong> est le leader incontournable engagé dans l’élévation des standards de la médecine bucco-dentaire en Algérie. Nous créons des environnements d'apprentissage exclusifs où la théorie scientifique moderne rencontre la rigueur du geste clinique.
            </p>
            <p className="text-sm text-dentova-navy-650 font-light leading-relaxed mb-8">
              En direct lien avec des mentors internationaux de renom et des industries de pointe, nos formations intensives (TP Hands-On guidés sur simulateurs anatomiques) équipent les omnipraticiens avec l'excellence requise pour progresser au cabinet dès le lendemain.
            </p>

            {/* Quality seal & certificates */}
            <div className="flex items-center gap-4 border border-dentova-teal-100 bg-dentova-teal-50/60 rounded-2xl p-4 w-full mb-8">
              <div className="w-12 h-12 bg-white rounded-full border border-dentova-teal-100 flex items-center justify-center text-dentova-teal-600 flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <p className="text-xs text-dentova-teal-950 font-medium leading-relaxed">
                Programmes certifiés, accrédités officiellement par les conférenciers experts et co-validés pour dynamiser votre carrière.
              </p>
            </div>

            {/* Our Vision Card */}
            <div id="vision-card" className="bg-gradient-to-r from-dentova-teal-50/50 to-white hover:from-dentova-teal-50 border-l-4 border-dentova-teal-600 p-6 rounded-r-2xl shadow-sm flex items-start gap-4 transition-colors w-full">
              <div className="p-2.5 rounded-xl bg-dentova-teal-100 text-dentova-teal-700 flex-shrink-0">
                <Compass size={22} className="text-dentova-teal-600" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-dentova-teal-900 mb-1">
                  Notre Vision de l'Éducation
                </h4>
                <p className="text-xs text-dentova-navy-650 font-light leading-relaxed">
                  "Soutenir durablement les chirurgiens-dentistes algériens en leur offrant des opportunités d’enseignement clinique de standing international, renforçant l'habileté et la sécurité des traitements."
                </p>
              </div>
            </div>
          </div>

          {/* Right Block: Image Placeholder + Pillars of Service */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* Visual Image Placeholder Component (User requested) */}
            <div className="relative rounded-3xl overflow-hidden border border-dentova-navy-200 shadow-lg group h-64 bg-slate-100 flex flex-col justify-end p-6">
              {/* Clinical placeholder image from Unsplash */}
              <div className="absolute inset-0">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop" 
                  alt="Dentova Classroom" 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 filter saturate-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              {/* Floating label for ease of replacement */}
              <div className="absolute top-4 left-4 bg-dentova-teal-650 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-md opacity-90 backdrop-blur-md border border-dentova-teal-400/20">
                ✏️ IMAGE PLACEHOLDER
              </div>

              <div className="relative z-10 text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-dentova-teal-300">DENTOVA EVENTS ACADÉMIE</span>
                <h4 className="text-lg font-display font-black text-white mt-1 leading-snug">
                  Ateliers pratiques en direct & sessions interactives
                </h4>
                <p className="text-[10px] text-zinc-305 font-light text-zinc-350 mt-1">
                  [Vous pourrez remplacer ce placeholder par l'image réelle de vos salles de cours]
                </p>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="flex flex-col gap-4">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={index}
                    id={`pillar-card-${index}`}
                    className="bg-white border border-dentova-navy-150 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-dentova-teal-300 transition-all duration-300 flex gap-5 items-start group"
                  >
                    <div className="p-3 rounded-xl bg-dentova-navy-50 text-dentova-teal-700 group-hover:bg-dentova-teal-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-dentova-navy-900 mb-1 leading-snug">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-dentova-navy-600 font-light leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
