/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Course } from '../types';
import { COURSES } from '../data';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Users, Award, 
  CheckCircle2, Sparkles, BookOpen, ShieldCheck, Phone, Mail, Send, Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
  onRegister: (courseId: string) => void;
}

export default function CourseDetailPage({ courseId, onBack, onRegister }: CourseDetailPageProps) {
  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];

  // Inscription Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !lastName || !email || !phone) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (phone.replace(/\D/g, '').length < 9) {
      setErrorMsg("Veuillez saisir un numéro de téléphone valide (9 chiffres minimum).");
      return;
    }

    setIsSubmitting(true);

    // Simulate database write / network action
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onRegister) {
        onRegister(course.id);
      }
    }, 1500);
  };

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pt-24 pb-20 font-sans text-left relative z-10 selection:bg-dentova-navy-800 selection:text-white">
      {/* Visual top grid decoration */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-dentova-navy-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Back navigation header */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-dentova-navy-700 hover:text-white font-bold text-xs mb-8 bg-white border border-slate-200 hover:bg-dentova-navy-800 px-5 py-2.5 rounded-full cursor-pointer transition-all hover:scale-103"
        >
          <ArrowLeft size={14} />
          <span>← Tous les thèmes</span>
        </button>

        {/* Course Header Banner */}
        <div className="mb-12 border-b border-slate-200/80 pb-10">
          <div className="flex flex-wrap gap-2.5 items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest bg-dentova-navy-50 border border-dentova-navy-200 text-dentova-navy-750 py-1 px-3.5 rounded-md">
              {course.categoryLabel}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-dentova-teal-50 border border-dentova-teal-200 text-dentova-teal-700 py-1 px-3 rounded-md flex items-center gap-1">
              <Sparkles size={10} className="text-dentova-teal-500" />
              TP Hands-On Inclus
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4 text-dentova-navy-900">
            {course.title}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-4xl">
            {course.description}
          </p>
        </div>

        {/* Streamlined Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Clean Course Information & Syllabus */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Quick Statistics details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-dentova-navy-50 border border-dentova-navy-100 flex items-center justify-center text-dentova-navy-600 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Durée</p>
                  <p className="text-xs font-black text-dentova-navy-950 leading-tight">{course.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-dentova-navy-50 border border-dentova-navy-100 flex items-center justify-center text-dentova-navy-600 flex-shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Session</p>
                  <p className="text-xs font-black text-dentova-navy-950 leading-tight">{course.upcomingDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-dentova-navy-50 border border-dentova-navy-100 flex items-center justify-center text-dentova-navy-600 flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Lieu</p>
                  <p className="text-xs font-black text-dentova-navy-950 leading-tight">{course.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-550 flex-shrink-0">
                  <Users size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-rose-500 font-bold uppercase">Places Restantes</p>
                  <p className="text-xs font-black text-rose-600 leading-tight">
                    {course.seatsLeft} / {course.maxSeats} places
                  </p>
                </div>
              </div>
            </div>

            {/* Course Image Showcase */}
            {course.imageUrl && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="w-full h-80 sm:h-96 md:h-[450px] overflow-hidden rounded-xl bg-slate-100 relative shadow-inner">
                  <img
                    referrerPolicy="no-referrer"
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Subtle luxurious badge */}
                  <span className="absolute top-4 left-4 bg-dentova-navy-900/90 backdrop-blur-sm text-white font-extrabold text-[9px] uppercase tracking-widest py-1.5 px-3.5 rounded-lg border border-white/10 shadow-sm">
                    {course.categoryLabel} Masterclass
                  </span>
                </div>
              </div>
            )}

            {/* Trainer/Instructor Info */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-display font-black text-base uppercase tracking-widest text-dentova-navy-900 mb-6 flex items-center gap-2">
                <Award size={16} className="text-dentova-teal-500" />
                VOTRE FORMATEUR RÉFÉRENT
              </h3>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                  <img 
                    referrerPolicy="no-referrer"
                    src={course.speakerAvatar} 
                    alt={course.speaker} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] text-dentova-teal-600 font-extrabold uppercase tracking-widest mb-0.5">Membres de Académie</p>
                  <h4 className="font-display font-black text-lg text-dentova-navy-900 mb-1">
                    {course.speaker}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3 font-semibold leading-snug">
                    {course.speakerTitle}
                  </p>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Dirigé par un clinicien expert actif. Profitez de conseils directs de haut standing, de démos d'excellence en temps réel et d'un suivi de vos cas pratiques par messagerie fermée pendant 6 mois.
                  </p>
                </div>
              </div>
            </div>

            {/* Prestige Accreditations */}
            <div className="bg-dentova-navy-50 border border-dentova-navy-100 rounded-2xl p-5 flex gap-4 items-start text-left">
              <div className="w-10 h-10 rounded-full bg-white border border-dentova-navy-200 flex items-center justify-center text-dentova-navy-700 flex-shrink-0 mt-0.5 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-dentova-navy-900 mb-0.5 uppercase tracking-wide">Attestation d'excellence de haut niveau</p>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Ce cursus pratique et d'exposés théoriques inclut une attestation scientifique reconnue de fin d'études de masterclass délivrée directement par Dentova Events et signée par le mentor.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Embedded Application (Inscription) Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Enrollment Form Container */}
            <div className="bg-white text-dentova-navy-900 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative">
              <div className="absolute -top-3.5 left-6 bg-dentova-navy-755 border border-dentova-navy-700 text-white font-black text-[9px] uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md bg-dentova-navy-800">
                {course.seatsLeft <= 3 ? "🔥 TRÈS PEU DE PLACES RESTANTES" : "ℹ️ FORMULAIRE D'INSCRIPTION"}
              </div>

              <div className="text-left mb-6 pt-2">
                <h3 className="font-display font-black text-xl text-dentova-navy-950 mb-1">
                  Réserver mon Atelier
                </h3>
                <p className="text-xs text-slate-550 font-medium leading-relaxed">
                  Soumettez rapidement vos coordonnées ci-dessous pour pré-réserver votre place sur nos installations de TP de {course.location}.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-4.5 text-left">
                    {errorMsg && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs font-semibold">
                        {errorMsg}
                      </div>
                    )}

                    {/* Preselected Course Indicator */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Thématique :</span>
                      <span className="font-black text-dentova-navy-900 truncate max-w-[200px]" title={course.title}>
                        {course.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="course-first-name" className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                          Prénom
                        </label>
                        <input
                          id="course-first-name"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Dr. Sarah"
                          className="w-full bg-white border border-slate-205 focus:border-dentova-navy-500 focus:ring-1 focus:ring-dentova-navy-500 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="course-last-name" className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                          Nom
                        </label>
                        <input
                          id="course-last-name"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Benali"
                          className="w-full bg-white border border-slate-205 focus:border-dentova-navy-500 focus:ring-1 focus:ring-dentova-navy-500 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="course-phone" className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Téléphone Mobile <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="course-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 0550123456"
                        className="w-full bg-white border border-slate-205 focus:border-dentova-navy-500 focus:ring-1 focus:ring-dentova-navy-500 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="course-email" className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Adresse Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="course-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.benali@gmail.com"
                        className="w-full bg-white border border-slate-205 focus:border-dentova-navy-500 focus:ring-1 focus:ring-dentova-navy-500 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="course-msg" className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Message / Remarques cliniques
                      </label>
                      <textarea
                        id="course-msg"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Précisez votre spécialité, vos attentes pratiques..."
                        className="w-full bg-white border border-slate-205 focus:border-dentova-navy-500 focus:ring-1 focus:ring-dentova-navy-500 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all text-slate-900 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-dentova-navy-700 to-dentova-navy-800 hover:from-dentova-navy-800 hover:to-dentova-navy-950 text-white font-bold py-3.5 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs focus:outline-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={15} className="animate-spin text-white" />
                          <span>Validation de place...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Soumettre ma pré-inscription Dentova</span>
                        </>
                      )}
                    </button>

                    <p className="text-[9px] text-slate-400 text-center font-medium leading-relaxed">
                      L'inscription comprend l'accès aux séminaires théoriques, tout le matériel de TP individuel, les déjeuners buffet et l'accompagnement post-formation pendant 6 mois.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                      <CheckCircle2 size={26} />
                    </div>
                    <h4 className="font-display font-black text-lg text-dentova-navy-950 mb-1">
                      Pré-Inscription Reçue !
                    </h4>
                    <p className="text-xs text-slate-600 font-light mb-4 leading-relaxed px-2">
                      Félicitations <strong>Dr. {firstName} {lastName}</strong>. Votre dossier de pré-candidature a été enregistré avec succès pour la session de {course.location}.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3.5 text-left w-full mb-5 flex flex-col gap-2 font-medium text-[10px] text-slate-700">
                      <div className="flex justify-between border-b border-slate-205 pb-1.5">
                        <span className="text-slate-400">Thème :</span>
                        <span className="font-bold max-w-[170px] truncate">{course.categoryLabel}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-205 pb-1.5">
                        <span className="text-slate-400">Téléphone :</span>
                        <span className="font-bold">{phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Statut :</span>
                        <span className="text-emerald-700 font-extrabold">Traitement prioritaire (24h)</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-dentova-navy-900 bg-dentova-navy-50 border border-dentova-navy-100 px-4 py-2.5 rounded-lg mb-4 font-semibold leading-relaxed">
                      Un conseiller scientifique vous appellera dans les prochaines heures sur votre mobile <strong>{phone}</strong> pour aborder le volet académique, la logistique et valider vos accès.
                    </p>

                    <button
                      onClick={handleResetForm}
                      className="text-[10.5px] font-bold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer focus:outline-none"
                    >
                      Modifier mes coordonnées
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Direct Phone Support */}
            <div className="bg-dentova-navy-900 border border-dentova-navy-850 rounded-2xl p-5 text-left text-white shadow-md">
              <h4 className="font-display font-extrabold text-xs text-white mb-2 uppercase tracking-wider">
                Support Clinique Direct
              </h4>
              <p className="text-xs text-dentova-navy-200 font-light leading-relaxed mb-4">
                Des questions sur le programme, l'hébergement d'hôtel ou les modalités de financement scientifique en Algérie ?
              </p>
              
              <div className="flex flex-col gap-2 text-xs text-dentova-teal-300 font-semibold font-mono">
                <a href="tel:+213550123456" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={13} />
                  <span>+213 (0) 550 12 34 56</span>
                </a>
                <a href="mailto:contact@dentovaevents.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={13} />
                  <span>contact@dentovaevents.com</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
