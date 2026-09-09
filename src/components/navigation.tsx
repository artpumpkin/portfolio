"use client";
import { LachkarLogo } from "./lachkar-logo";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Lachkar home">
        <LachkarLogo />
      </a>
      <nav
        aria-label="Main navigation"
        className={open ? "main-nav open" : "main-nav"}
      >
        <a href="#journey" onClick={() => setOpen(false)}>
          The journey
        </a>
        <a href="#work" onClick={() => setOpen(false)}>
          Selected work
        </a>
        <a href="#about" onClick={() => setOpen(false)}>
          A little more
        </a>
        <a
          className="nav-contact"
          href="#contact"
          onClick={() => setOpen(false)}
        >
          Let’s talk <ArrowUpRight size={15} />
        </a>
      </nav>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
