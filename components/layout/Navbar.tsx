"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Mail,
  Menu,
  Phone,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navItems, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar({
  admin = false,
  authenticated = false
}: {
  admin?: boolean;
  authenticated?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none",
          admin ? "h-[76px] sm:h-[80px]" : "h-[76px] sm:h-[80px] lg:h-[116px]"
        )}
      />

      <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_1px_0_rgba(20,18,58,0.06),0_4px_24px_rgba(20,18,58,0.06)]">
      {!admin ? (
        <div className="relative hidden overflow-hidden border-b border-dentova-navy-100 bg-dentova-navy-950 lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-dentova-teal-600/20 via-transparent to-dentova-teal-600/20" />
          <Container className="relative flex h-9 max-w-screen-2xl items-center justify-between text-[11px] font-medium text-white/75">
            <div className="flex items-center gap-5">
              <a
                className="flex items-center gap-1.5 transition-colors hover:text-dentova-teal-300"
                href={`tel:${siteConfig.phone}`}
              >
                <Phone className="h-3 w-3 text-dentova-teal-400" />
                {siteConfig.phone}
              </a>
              <span aria-hidden className="h-3 w-px bg-white/15" />
              <a
                className="flex items-center gap-1.5 transition-colors hover:text-dentova-teal-300"
                href={`mailto:${siteConfig.email}`}
              >
                <Mail className="h-3 w-3 text-dentova-teal-400" />
                {siteConfig.email}
              </a>
            </div>
            <p className="flex items-center gap-2 font-semibold text-dentova-teal-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dentova-teal-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-dentova-teal-400" />
              </span>
              Inscriptions ouvertes · Formations 2026
            </p>
          </Container>
        </div>
      ) : null}

      <header className="w-full border-b border-dentova-navy-100/80 bg-white">
        <Container className="max-w-screen-2xl">
          <div className="flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3 lg:py-3.5">
            <Link
              className="dentova-focus group flex shrink-0 items-center rounded-xl"
              href="/"
            >
              <Image
                alt="Dentova"
                className="h-11 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90 sm:h-12"
                height={48}
                src="/brand/logo.svg"
                width={168}
              />
            </Link>

            <nav
              aria-label="Navigation principale"
              className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
            >
              <div className="flex items-center gap-0.5 rounded-full border border-dentova-navy-100 bg-dentova-navy-50/70 p-1">
                {navItems.map((item) => (
                  <Link
                    className="dentova-focus whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold text-dentova-navy-600 transition-all duration-200 hover:bg-white hover:text-dentova-teal-700 hover:shadow-sm xl:px-3 xl:text-sm"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Button
                asChild
                className="hidden sm:inline-flex"
                href="/#contact"
                size="sm"
                variant="primary"
              >
                S&apos;inscrire
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              {authenticated ? (
                <div className="hidden items-center gap-2 lg:flex">
                  <Button asChild href="/admin" size="sm" variant="outline">
                    Tableau de bord
                  </Button>
                  <form action="/api/admin/logout" method="post">
                    <button
                      className={buttonClassName({ size: "sm", variant: "ghost" })}
                      type="submit"
                    >
                      Se deconnecter
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  className="dentova-focus hidden whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-dentova-navy-600 transition hover:bg-dentova-navy-50 hover:text-dentova-teal-700 lg:block"
                  href="/admin/login"
                >
                  Connexion
                </Link>
              )}

              <button
                aria-expanded={open}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                className="dentova-focus inline-flex h-10 w-10 items-center justify-center rounded-xl text-dentova-navy-700 transition-colors hover:bg-dentova-navy-50 hover:text-dentova-teal-700 lg:hidden"
                onClick={() => setOpen((value) => !value)}
                type="button"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </Container>

        <AnimatePresence>
          {open ? (
            <>
              <motion.button
                animate={{ opacity: 1 }}
                aria-label="Fermer le menu"
                className="fixed inset-0 z-40 bg-dentova-navy-950/50 backdrop-blur-sm lg:hidden"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                transition={{ duration: 0.25 }}
                type="button"
              />

              <motion.div
                animate={{ x: 0 }}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto border-l border-dentova-navy-100 bg-white shadow-2xl lg:hidden"
                exit={{ x: "100%" }}
                initial={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between border-b border-dentova-navy-100 px-5 py-4">
                  <Link
                    className="flex items-center"
                    href="/"
                    onClick={() => setOpen(false)}
                  >
                    <Image
                      alt="Dentova"
                      className="h-8 w-auto object-contain"
                      height={32}
                      src="/brand/logo.svg"
                      width={120}
                    />
                  </Link>
                  <button
                    aria-label="Fermer le menu"
                    className="dentova-focus rounded-lg p-2 text-dentova-navy-600 hover:bg-dentova-navy-50"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 px-4 py-5">
                  {navItems.map((item, index) => (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: 16 }}
                      key={item.href}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                    >
                      <Link
                        className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-dentova-navy-800 transition hover:bg-dentova-navy-50 hover:text-dentova-teal-700"
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4 text-dentova-navy-300" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto space-y-4 border-t border-dentova-navy-100 px-5 py-5">
                  <div className="space-y-2 text-sm text-dentova-navy-500">
                    <a
                      className="flex items-center gap-2 transition hover:text-dentova-teal-700"
                      href={`tel:${siteConfig.phone}`}
                    >
                      <Phone className="h-4 w-4 text-dentova-teal-600" />
                      {siteConfig.phone}
                    </a>
                    <a
                      className="flex items-center gap-2 transition hover:text-dentova-teal-700"
                      href={`mailto:${siteConfig.email}`}
                    >
                      <Mail className="h-4 w-4 text-dentova-teal-600" />
                      {siteConfig.email}
                    </a>
                  </div>

                  <Button
                    asChild
                    className="w-full"
                    href="/#contact"
                    onClick={() => setOpen(false)}
                    variant="primary"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Demander une formation
                  </Button>

                  {authenticated ? (
                    <div className="space-y-2">
                      <Button
                        asChild
                        className="w-full"
                        href="/admin"
                        onClick={() => setOpen(false)}
                        variant="outline"
                      >
                        Tableau de bord
                      </Button>
                      <form action="/api/admin/logout" method="post">
                        <button
                          className={buttonClassName({
                            className: "w-full",
                            size: "md",
                            variant: "ghost"
                          })}
                          type="submit"
                        >
                          Se deconnecter
                        </button>
                      </form>
                    </div>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      href="/admin/login"
                      onClick={() => setOpen(false)}
                      variant="outline"
                    >
                      Connexion
                    </Button>
                  )}
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </header>
      </div>
    </>
  );
}
