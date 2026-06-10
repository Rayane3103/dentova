/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQItem } from '../types';
import { FAQ_ITEMS } from '../data';
import { Search, ChevronDown, ChevronUp, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1'); // default expanded

  const categories = [
    { id: 'all', label: 'Toutes les Questions' },
    { id: 'Général', label: 'Général' },
    { id: 'Formations', label: 'La Pratique' },
    { id: 'Certification', label: 'Certification' },
    { id: 'Paiement & Inscriptions', label: 'Paiement & Cursus' }
  ];

  // Filtering Logic
  const filteredFaqs = FAQ_ITEMS.filter((faq) => {
    const matchCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="bg-gradient-to-b from-dentova-navy-50 to-white py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm text-dentova-teal-700 uppercase tracking-widest font-black inline-flex items-center gap-1.5 mb-3 bg-dentova-teal-50 border border-dentova-teal-100 py-1 px-4 rounded-full">
            <HelpCircle size={12} className="text-dentova-teal-600" />
            VOS QUESTIONS RÉPONDUES
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dentova-navy-900 leading-tight mb-4">
            Tout savoir sur nos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dentova-teal-750 to-dentova-teal-550">
              Formations & Congrès
            </span>
          </h2>
          <p className="text-base text-dentova-navy-650 font-light max-w-2xl mx-auto">
            Vous avez des interrogations sur le déroulement, le matériel fourni, les financements ou l'hébergement en Algérie ? Consultez nos réponses immédiates.
          </p>
        </div>

        {/* Search & Theme Tabs controls container */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          
          {/* Category Pills */}
          <div className="flex gap-2 pb-1 overflow-x-auto w-full md:w-auto font-medium scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setExpandedId(null); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-dentova-teal-600 text-white border-dentova-teal-600 font-semibold'
                    : 'bg-white text-dentova-navy-700 border-dentova-navy-200 hover:border-dentova-teal-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input block */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-400 focus:ring-1 focus:ring-dentova-teal-400 placeholder-dentova-navy-450 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all font-medium text-left text-dentova-navy-900"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dentova-navy-400" />
          </div>

        </div>

        {/* Accordion FAQ Grid */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layoutId={`faq-container-${faq.id}`}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all text-left ${
                      isExpanded
                        ? 'border-dentova-teal-500 shadow-md shadow-dentova-teal-500/5'
                        : 'border-dentova-navy-200 shadow-sm hover:border-dentova-navy-300'
                    }`}
                  >
                    {/* Collapsed/Expanded trigger button */}
                    <button
                      id={`faq-trigger-${faq.id}`}
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer"
                    >
                      <span className={`font-display font-bold text-sm sm:text-base ${isExpanded ? 'text-dentova-teal-800' : 'text-dentova-navy-900'}`}>
                        {faq.question}
                      </span>
                      <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${isExpanded ? 'bg-dentova-teal-50 text-dentova-teal-700' : 'bg-dentova-navy-100 text-dentova-navy-500'}`}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Expandable answer panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div id={`faq-answer-${faq.id}`} className="px-6 pb-6 pt-1 text-sm text-dentova-navy-650 leading-relaxed font-light border-t border-dentova-navy-100 bg-dentova-navy-50/20">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 bg-white rounded-2xl border border-dentova-navy-200 text-center flex flex-col items-center">
                <AlertCircle size={24} className="text-dentova-navy-400 mb-2.5" />
                <p className="text-sm font-bold text-dentova-navy-600">Aucun résultat d'aide trouvé</p>
                <p className="text-xs text-dentova-navy-400 font-light mt-1 max-w-sm">
                  Essayez avec un autre mot clé comme "attestation", "virement", "repas" ou "Alger".
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
