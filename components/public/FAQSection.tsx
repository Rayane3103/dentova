"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";

const categories = [
  { id: "all", label: "Toutes les Questions" },
  { id: "General", label: "General" },
  { id: "Formations", label: "La Pratique" },
  { id: "Certification", label: "Certification" },
  { id: "Paiement", label: "Paiement & Cursus" }
];

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.question ?? null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory =
        activeCategory === "all" || faq.category === activeCategory;
      const matchQuery =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [activeCategory, faqs, searchQuery]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-dentova-navy-50 to-white px-6 py-24"
      id="faq"
    >
      {/* Decorative */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 20, 0] }}
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-dentova-teal-500/[0.04] blur-3xl"
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="max-w-4xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-dentova-teal-100 bg-dentova-teal-50 px-4 py-1 text-sm font-black uppercase tracking-widest text-dentova-teal-700"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <HelpCircle className="h-3 w-3 text-dentova-teal-600" />
            VOS QUESTIONS REPONDUES
          </motion.span>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-dentova-navy-900 sm:text-4xl">
            Tout savoir sur nos{" "}
            <span className="bg-gradient-to-r from-dentova-magenta to-dentova-lavender bg-clip-text text-transparent">
              Formations & Congres
            </span>
          </h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-base font-light text-dentova-navy-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Vous avez des interrogations sur le deroulement, le materiel fourni,
            les financements ou l&apos;hebergement en Algerie ? Consultez nos
            reponses immediates.
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-1 font-medium md:w-auto">
            {categories.map((cat) => (
              <button
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-xl border px-4 py-2 text-xs transition-all sm:text-sm",
                  activeCategory === cat.id
                    ? "border-dentova-magenta bg-dentova-magenta font-semibold text-white"
                    : "border-dentova-navy-200 bg-white text-dentova-navy-700 hover:border-dentova-magenta/40"
                )}
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedId(null);
                }}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              className="w-full rounded-xl border border-dentova-navy-300 py-2.5 pl-10 pr-4 text-sm font-medium text-dentova-navy-900 outline-none transition-all placeholder:text-dentova-navy-400 focus:border-dentova-teal-400 focus:ring-1 focus:ring-dentova-teal-400"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question..."
              type="text"
              value={searchQuery}
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dentova-navy-400" />
          </div>
        </motion.div>

        {/* FAQ items */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.question;
                return (
                  <motion.div
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-white text-left transition-all",
                      isExpanded
                        ? "border-dentova-teal-500 shadow-md shadow-dentova-teal-500/5"
                        : "border-dentova-navy-200 shadow-sm hover:border-dentova-navy-300"
                    )}
                    key={faq.question}
                    layout
                  >
                    <button
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : faq.question)
                      }
                      type="button"
                    >
                      <span
                        className={cn(
                          "font-display text-sm font-bold sm:text-base",
                          isExpanded
                            ? "text-dentova-teal-800"
                            : "text-dentova-navy-900"
                        )}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={cn(
                          "flex-shrink-0 rounded-lg p-1.5 transition-colors",
                          isExpanded
                            ? "bg-dentova-teal-50 text-dentova-teal-700"
                            : "bg-dentova-navy-100 text-dentova-navy-500"
                        )}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="border-t border-dentova-navy-100 bg-dentova-navy-50/20 px-6 pb-6 pt-1 text-sm font-light leading-relaxed text-dentova-navy-600">
                            {faq.answer}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dentova-navy-200 bg-white py-12 text-center">
                <AlertCircle className="mb-2.5 h-6 w-6 text-dentova-navy-400" />
                <p className="text-sm font-bold text-dentova-navy-600">
                  Aucun resultat d&apos;aide trouve
                </p>
                <p className="mt-1 max-w-sm text-xs font-light text-dentova-navy-400">
                  Essayez avec un autre mot cle comme &quot;attestation&quot;,
                  &quot;virement&quot; ou &quot;Alger&quot;.
                </p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
