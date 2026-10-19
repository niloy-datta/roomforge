'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, ArrowUpRight, Calculator, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/studio', label: 'Studio', icon: Compass },
    { href: '/calculators', label: 'Calculators', icon: Calculator },
    { href: '/tools', label: 'Tools', icon: Layers },
    { href: '/guides', label: 'Guides', icon: BookOpen },
    { href: '/about', label: 'About', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sand-300/80 bg-sand-100/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-sand-50 font-black tracking-tighter shadow-sm transition-transform group-hover:scale-105">
            R<span className="text-clay-400">.</span>
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-forest leading-none">
              roomforge<span className="text-clay-500">.</span>
            </span>
            <span className="text-[10px] tracking-widest text-muted uppercase font-semibold">
              Visual Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname ? (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sand-200 text-forest font-semibold'
                    : 'text-muted-foreground hover:bg-sand-200/60 hover:text-charcoal'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/studio">
            <Button size="sm" className="gap-1.5 shadow-sm font-semibold">
              Open Studio
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-forest hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-sage-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-300 bg-sand-100/98 px-4 pt-2 pb-6 space-y-3">
          <nav id="mobile-nav" className="flex flex-col space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname ? (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sand-200 text-forest font-bold'
                      : 'text-muted-foreground hover:bg-sand-200/50 hover:text-charcoal'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 text-sage-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-2">
            <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="w-full block">
              <Button className="w-full gap-2 justify-center py-2.5">
                Open Studio
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
