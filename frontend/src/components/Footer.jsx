import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaArrowRight,
  FaPaperPlane,
  FaBolt,
  FaEnvelope,
  FaGlobe,
  FaShieldAlt,
  FaBriefcase,
  FaCompass,
  FaDiscord,
  FaYoutube
} from 'react-icons/fa';

import { Button } from './ui/Button';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#0b0e14] to-[#050505] pt-40 pb-16 overflow-hidden font-sans selection:bg-indigo-600 selection:text-white border-t border-white/10 ring-1 ring-white/5">

      {/* ─── Ambient Glows (Dribbble Style) ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">



        {/* ─── Main Navigation Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">

          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4 space-y-10">
            {/* SYNCED LOGO WITH NAVBAR */}
            <Link to="/" className="flex items-center gap-4 group p-1.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-xl w-fit ring-1 ring-white/5 transition-all hover:bg-white/10">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 bg-indigo-500 rounded-full">
                <FaBolt className="relative h-6 w-6 text-white fill-white transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="text-[15px] font-black tracking-tight text-white uppercase leading-none mr-4">
                MICRO<span className="text-indigo-500">FIVERR</span>
              </span>
            </Link>

            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xs">
              Pakistan's first high-fidelity professional node. Built for speed,
              designed for the elite.
            </p>
            <div className="flex items-center gap-3 p-1.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-xl w-fit ring-1 ring-white/5">
              {[FaTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
                <button key={i} className="w-11 h-11 rounded-full bg-transparent flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-500 group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: 'Platform',
              links: ['Marketplace', 'Freelance Hub', 'About Us'],
              icon: <FaCompass className="text-indigo-500" size={12} />
            },
            {
              title: 'Legal',
              links: ['Privacy Policy', 'Terms of Service', 'Security'],
              icon: <FaShieldAlt className="text-indigo-500" size={12} />
            }
          ].map((col, i) => (
            <div key={i} className="col-span-1 lg:col-span-2 space-y-8">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] opacity-40 flex items-center gap-3">
                {col.icon} {col.title}
              </h4>
              <ul className="space-y-5">
                {col.links.map(link => (
                  <li key={link}>
                    <Link to="#" className="text-slate-400 hover:text-indigo-400 font-bold text-[15px] transition-all">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Status Bar ─── */}
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">© 2024 MICROFIVERR PROTOCOL</p>
            <div className="flex items-center gap-8">
              {['Privacy_L3', 'Security_AES256', 'Status_Live'].map(t => (
                <span key={t} className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 p-1.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-xl">
            <button className="px-6 py-2.5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest">EN-US</button>
            <button className="px-6 py-2.5 rounded-full text-slate-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest">PKR-RS</button>
          </div>
        </div>

      </div>

      {/* Grid Pattern Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:80px_80px] opacity-20 pointer-events-none" />

    </footer>
  );
};

export default Footer;
