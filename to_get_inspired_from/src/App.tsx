/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WhyParticipate from './components/WhyParticipate';
import AboutUs from './components/AboutUs';
import Courses from './components/Courses';
import CourseDetailPage from './components/CourseDetailPage';
import FeedbackSurvey from './components/FeedbackSurvey';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [preselectedCourseId, setPreselectedCourseId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Scoll to target section with offset for header height
  const handleSectionNavigate = (sectionId: string) => {
    setSelectedCourseId(null); // Close course detail view to show landing content
    setActiveSection(sectionId);
    
    // Custom scroll mapping to anchor elements
    let elementId = sectionId;
    if (sectionId === 'home') elementId = 'hero';
    if (sectionId === 'why-us') elementId = 'why-us';
    if (sectionId === 'about') elementId = 'about';
    if (sectionId === 'courses') elementId = 'courses';
    if (sectionId === 'feedback') elementId = 'feedback';
    if (sectionId === 'faq') elementId = 'faq';
    if (sectionId === 'contact') elementId = 'contact';

    // Wait slightly for DOM to render the sections if coming back from page view
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  // Triggered when participant clicks "S'inscrire" or "Réserver ma place" in courses catalog or hero
  const handleSelectCourseForInquiry = (courseId: string) => {
    setPreselectedCourseId(courseId);
    setSelectedCourseId(null); // Return to home layout
    
    // Smoothly scroll down to contact form after layout mounts
    setTimeout(() => {
      handleSectionNavigate('contact');
    }, 150);
  };

  // Open the structured Course detail page
  const handleViewCourseDetail = (courseId: string) => {
    setSelectedCourseId(courseId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Track active section on scroll
  useEffect(() => {
    if (selectedCourseId) return; // Disable scroll tracking when on course page

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // Offset for header & triggers

      const sections = [
        { id: 'home', elementId: 'hero' },
        { id: 'why-us', elementId: 'why-us' },
        { id: 'about', elementId: 'about' },
        { id: 'courses', elementId: 'courses' },
        { id: 'feedback', elementId: 'feedback' },
        { id: 'faq', elementId: 'faq' },
        { id: 'contact', elementId: 'contact' },
      ];

      for (const s of sections) {
        const el = document.getElementById(s.elementId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(s.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCourseId]);

  return (
    <div className="bg-white min-h-screen font-sans text-dentova-navy-900 selection:bg-dentova-teal-500 selection:text-white flex flex-col antialiased">
      {/* Dynamic Header Nav */}
      <Navigation onNavigate={handleSectionNavigate} activeSection={selectedCourseId ? 'courses' : activeSection} />

      <main className="flex-grow">
        {selectedCourseId ? (
          /* Structured Course Detail Page Component */
          <CourseDetailPage 
            courseId={selectedCourseId} 
            onBack={() => setSelectedCourseId(null)} 
            onRegister={handleSelectCourseForInquiry}
          />
        ) : (
          /* Normal Landing Modules with clean placeholders & styles */
          <>
            {/* Hero Section */}
            <Hero
              onExploreCourses={() => handleSectionNavigate('courses')}
              onContactClick={() => handleSectionNavigate('contact')}
            />

            {/* Why Participate (Pourquoi nous) Section */}
            <WhyParticipate />

            {/* Qui Sommes-Nous Section */}
            <AboutUs />

            {/* Courses List Section */}
            <Courses 
              onSelectCourseForInquiry={handleSelectCourseForInquiry} 
              onViewCourseDetail={handleViewCourseDetail}
            />

            {/* Feedback Opinion Section */}
            <FeedbackSurvey />

            {/* FAQ Section */}
            <FAQ />

            {/* Registrations & Offices Centers Contact Section */}
            <ContactForm
              preselectedCourseId={preselectedCourseId}
              onClearPreselectedCourse={() => setPreselectedCourseId('')}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleSectionNavigate} />
    </div>
  );
}

