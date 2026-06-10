/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ContactInquiry } from '../types';
import { COURSES } from '../data';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronRight, Award, Clock, ArrowRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactFormProps {
  preselectedCourseId?: string;
  onClearPreselectedCourse?: () => void;
}

export default function ContactForm({ preselectedCourseId, onClearPreselectedCourse }: ContactFormProps) {
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<'Alger' | 'Oran' | 'Constantine'>('Alger');
  const [courseId, setCourseId] = useState<string>('');
  const [message, setMessage] = useState('');
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected office coordinates/details toggle
  const [selectedOffice, setSelectedOffice] = useState<'Alger' | 'Oran' | 'Constantine'>('Alger');

  const offices = {
    Alger: {
      address: "Centre d'Affaires El-Qods, 8ème Étage, Bureau 804, Chéraga, Alger",
      phone: "+213 (0) 23 45 67 89",
      mobile: "+213 (0) 550 12 34 56",
      email: "alger.office@dentovaevents.com",
      mapCoords: "36.7516° N, 2.9463° E"
    },
    Oran: {
      address: "Résidence El-Bahia, Bloc C2, Frange Maritime, Oran",
      phone: "+213 (0) 41 98 76 54",
      mobile: "+213 (0) 550 98 76 54",
      email: "oran.office@dentovaevents.com",
      mapCoords: "35.6971° N, 0.6308° W"
    },
    Constantine: {
      address: "Boulevard Belouizdad, Immeuble Lafayette, Constantine",
      phone: "+213 (0) 31 12 34 56",
      mobile: "+213 (0) 550 45 67 89",
      email: "constantine.office@dentovaevents.com",
      mapCoords: "36.3650° N, 6.6147° E"
    }
  };

  // Sync preselected course from props
  useEffect(() => {
    if (preselectedCourseId) {
      setCourseId(preselectedCourseId);
      // Auto-set the city based on the preselected course location
      const selectedCourseObj = COURSES.find(c => c.id === preselectedCourseId);
      if (selectedCourseObj) {
        setCity(selectedCourseObj.location);
        setSelectedOffice(selectedCourseObj.location);
      }
    }
  }, [preselectedCourseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field validations
    if (!firstName || !lastName || !email || !phone) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (Prénom, Nom, Email, Téléphone).");
      return;
    }

    // Phone number quick checklist length (e.g. at least 9 chars representing Algerian mob/landline)
    if (phone.replace(/\D/g, '').length < 9) {
      setErrorMsg("Veuillez saisir un numéro de téléphone valide (9 chiffres minimum).");
      return;
    }

    setIsSubmitting(true);

    // Simulate clean service upload
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onClearPreselectedCourse) {
        onClearPreselectedCourse();
      }
    }, 1800);
  };

  const selectedCourseName = COURSES.find(c => c.id === courseId)?.title || "Demande d'information générale";

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCourseId('');
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <section id="contact" className="bg-white py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-sm text-dentova-teal-700 uppercase tracking-widest font-black inline-flex items-center gap-1.5 mb-3 bg-dentova-teal-50 border border-dentova-teal-100 py-1 px-4 rounded-full">
            <Mail size={12} className="text-dentova-teal-600" />
            CONTACTEZ-NOUS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dentova-navy-900 leading-tight mb-4">
            Demande d'Inscription <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dentova-teal-750 to-dentova-teal-550">
              et Centres d'Expertise
            </span>
          </h2>
          <p className="text-base text-dentova-navy-650 font-light max-w-2xl mx-auto">
            Soumettez votre pré-inscription pour la formation choisie ou contactez l'un de nos centres d'affaires régionaux à Alger, Oran et Constantine.
          </p>
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* Left panel: Interactive Inscriptions Request Form */}
          <div className="lg:col-span-7 bg-white border border-dentova-navy-200 rounded-3xl p-6 sm:p-10 shadow-sm relative">
            
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-left"
                >
                  <h3 className="font-display font-extrabold text-2xl text-dentova-navy-900 mb-2">
                    Formulaire de Demande
                  </h3>
                  <p className="text-sm text-dentova-navy-550 font-light mb-8">
                    Chaque programme théorique et pratique dispose d'un nombre restreint de participants pour privilégier l'excellence pédagogique. Soumettez vos coordonnées ci-dessous pour être rappelé.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Error Alerts */}
                    {errorMsg && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm font-medium">
                        {errorMsg}
                      </div>
                    )}

                    {/* Name fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first-name" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                          Prénom <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="first-name"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Ex: Dr. Sarah"
                          className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 placeholder-dentova-navy-400 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="last-name" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                          Nom de Famille <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="last-name"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ex: Benali"
                          className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 placeholder-dentova-navy-400 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900"
                        />
                      </div>
                    </div>

                    {/* Contact fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                          Adresse Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="sarah.benali@gmail.com"
                          className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 placeholder-dentova-navy-400 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                          Téléphone Mobile <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ex: 0550123456"
                          className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 placeholder-dentova-navy-400 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900"
                        />
                      </div>
                    </div>

                    {/* Selector criteria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="target-city" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                          Ville Préférée de la Formation
                        </label>
                        <select
                          id="target-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value as any)}
                          className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900"
                        >
                          <option value="Alger">Alger</option>
                          <option value="Oran">Oran</option>
                          <option value="Constantine">Constantine</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="target-course" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                          Thème / Session de Cursus
                        </label>
                        <select
                          id="target-course"
                          value={courseId}
                          onChange={(e) => setCourseId(e.target.value)}
                          className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900 font-medium"
                        >
                          <option value="">-- Information Générale --</option>
                          {COURSES.map((course) => (
                            <option key={course.id} value={course.id}>
                              [{course.location}] {course.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message-text" className="text-xs font-bold text-dentova-navy-700 block mb-1.5">
                        Message / Remarques Particulières
                      </label>
                      <textarea
                        id="message-text"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Précisez votre spécialité (Orthodontiste, Omnipraticien libéral...), vos années de pratique ou toutes autres attentes particulières..."
                        className="w-full bg-white border border-dentova-navy-300 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500 placeholder-dentova-navy-400 rounded-xl px-4 py-3 text-sm outline-none transition-all text-dentova-navy-900 resize-none"
                      />
                    </div>

                    {/* Trigger sign button */}
                    <button
                      type="submit"
                      id="signup-form-submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-dentova-teal-600 to-dentova-teal-700 hover:from-dentova-teal-700 hover:to-dentova-teal-850 text-white font-bold py-4 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 focus:outline-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={18} className="animate-spin text-white" />
                          <span>Vérification des disponibilités...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Soumettre ma Pré-Inscription Dentova</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-dentova-navy-400 text-center font-medium mt-1">
                      Conformément à notre charte de déontologie, toutes vos informations de formation et d'activité libérale restent strictement confidentielles et sécurisées.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-inner animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-dentova-navy-900 mb-3">
                    Demande Reçue avec Succès !
                  </h3>
                  <p className="text-sm text-dentova-navy-600 font-light max-w-lg mb-8 leading-relaxed">
                    Félicitations, <strong>Dr. {firstName} {lastName}</strong>. Votre pré-demande clinique pour le thème <strong className="text-dentova-teal-700">"{selectedCourseName}"</strong> a été validée avec succès sur nos registres d'inscription.
                  </p>

                  <div className="bg-dentova-navy-50 border border-dentova-navy-200/65 rounded-2xl p-6 text-left max-w-md w-full mb-8 flex flex-col gap-3 font-medium text-xs text-dentova-navy-700">
                    <div className="flex justify-between border-b border-dentova-navy-150 pb-2">
                      <span className="text-dentova-navy-400">ID Candidat :</span>
                      <span>DNT-2026-{(Math.random() * 10000).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dentova-navy-150 pb-2">
                      <span className="text-dentova-navy-400">Mobile :</span>
                      <span>{phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-dentova-navy-150 pb-2">
                      <span className="text-dentova-navy-400">Ville préférée :</span>
                      <span>{city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dentova-navy-400">Status :</span>
                      <span className="text-emerald-600 font-bold">En cours de traitement</span>
                    </div>
                  </div>

                  <p className="text-xs text-dentova-teal-900 bg-dentova-teal-50 border border-dentova-teal-100 px-6 py-3 rounded-full font-semibold max-w-lg mb-8 leading-relaxed">
                    Un délégué ou conseiller pédagogique Dentova vous contactera par téléphone au <strong>{phone}</strong> dans les prochaines 24h ouvrées pour valider définitivement les modalités logistiques et de TP.
                  </p>

                  <button
                    onClick={handleResetForm}
                    className="bg-dentova-navy-900 hover:bg-dentova-navy-800 text-white font-bold text-xs py-3.5 px-8 rounded-full shadow-sm hover:scale-105 active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Nouvelle demande d'inscription
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right panel: Offices information & Map Representation */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Center contact choice toggles */}
            <div className="bg-dentova-navy-950 text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl relative text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-dentova-teal-400 mb-2.5 block">
                Nos centres de formation
              </span>
              <h3 className="font-display font-extrabold text-xl mb-6">
                Réseau d'Élite Régional
              </h3>

              {/* Office Selector list tab buttons */}
              <div className="grid grid-cols-3 gap-2.5 mb-8 border-b border-white/10 pb-5">
                {(Object.keys(offices) as Array<keyof typeof offices>).map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => setSelectedOffice(cityName)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer focus:outline-none ${
                      selectedOffice === cityName
                        ? 'bg-dentova-teal-500 text-white'
                        : 'bg-white/5 text-dentova-navy-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cityName}
                  </button>
                ))}
              </div>

              {/* Selected Office Details pane */}
              <div className="flex flex-col gap-4 font-light text-sm">
                <div className="flex gap-3 items-start">
                  <MapPin size={18} className="text-dentova-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-dentova-navy-400 font-bold uppercase tracking-wider mb-0.5">Adresse du bureau</p>
                    <p className="text-dentova-navy-150 leading-relaxed">{offices[selectedOffice].address}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Phone size={18} className="text-dentova-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-dentova-navy-400 font-bold uppercase tracking-wider mb-0.5">Contact Téléphonique</p>
                    <p className="text-dentova-navy-150">Fixe: {offices[selectedOffice].phone}</p>
                    <p className="text-dentova-navy-150 font-bold mt-0.5">Mobile: {offices[selectedOffice].mobile}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Mail size={18} className="text-dentova-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-dentova-navy-400 font-bold uppercase tracking-wider mb-0.5">Email Direct</p>
                    <p className="text-dentova-navy-150">{offices[selectedOffice].email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Vector / Coordinate Mock Map */}
            <div className="bg-gradient-to-br from-dentova-navy-100 to-dentova-navy-50 border border-dentova-navy-200 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between aspect-video shadow-inner group">
              <div id="grid-map-visual" className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start text-left">
                <div>
                  <span className="text-[10px] font-bold text-dentova-teal-700 bg-dentova-teal-100/70 border border-dentova-teal-200 uppercase tracking-widest py-0.5 px-2.5 rounded-full">
                    GPS Coordinates
                  </span>
                  <p className="text-xs font-mono text-dentova-navy-600 mt-1.5 font-bold">
                    {offices[selectedOffice].mapCoords}
                  </p>
                </div>

                {/* Satellite symbol */}
                <div className="w-8 h-8 rounded-full bg-white border border-dentova-navy-200 text-dentova-teal-700 flex items-center justify-center animate-pulse">
                  <Award size={14} />
                </div>
              </div>

              {/* Decorative target crosshair marker */}
              <div className="relative w-full h-24 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-dentova-teal-500/20 flex items-center justify-center animate-ping pointer-events-none" />
                <div className="absolute w-8 h-8 rounded-full bg-dentova-teal-600/10 border border-dentova-teal-500 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-dentova-teal-500 animate-pulse shadow-md" />
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-end text-left border-t border-dentova-navy-200 pt-3">
                <div>
                  <p className="text-[9px] text-dentova-navy-400 font-bold uppercase tracking-wider">Centre d'éducation</p>
                  <p className="text-xs font-extrabold text-dentova-navy-950 font-display">Dentova {selectedOffice}</p>
                </div>
                <span className="text-[10px] text-dentova-teal-800 bg-white border border-dentova-teal-200 px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                  Directions
                  <ChevronRight size={12} />
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
