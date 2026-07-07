import Link from "next/link";
import { Phone, Mail, MapPin, Send, Instagram, Youtube, Facebook } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-navy pt-16 pb-8 border-t border-white/5 relative z-10">
      <div className="container grid gap-8 md:gap-12 md:grid-cols-4">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
             <span className="grid h-12 w-12 place-items-center rounded-xl bg-navyLight border border-white/10 text-sm font-black text-white shadow-lg">STC</span>
             <div>
               <span className="block text-lg font-black text-white tracking-wide">STC-2026</span>
               <span className="block text-xs text-cyan-400 font-bold uppercase tracking-widest">Summer Tech Camp</span>
             </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid gap-4 md:col-span-1 text-sm text-slate-400 font-medium">
           <h3 className="text-white font-bold mb-2">Bog'lanish</h3>
           <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-white transition-colors">
              <Phone size={18} className="text-slate-500" />
              {siteConfig.phone}
           </a>
           <a href="mailto:info@stc2026.uz" className="flex items-center gap-3 hover:text-white transition-colors">
              <Mail size={18} className="text-slate-500" />
              info@stc2026.uz
           </a>
        </div>

        {/* Location info */}
        <div className="grid gap-4 md:col-span-1 text-sm text-slate-400 font-medium">
           <h3 className="text-white font-bold mb-2">Manzil</h3>
           <div className="flex items-start gap-3">
              <MapPin size={18} className="text-slate-500 mt-0.5 shrink-0" />
              <span>
                Chiroqchi tumani. <br/>
                <span className="text-xs text-slate-500">(Aniq manzil tez orada e'lon qilinadi)</span>
              </span>
           </div>
        </div>

        {/* Socials */}
        <div className="md:col-span-1 flex flex-col md:items-end">
           <h3 className="text-white font-bold mb-4 text-left w-full md:text-right">Biz ijtimoiy tarmoqlarda</h3>
           <div className="flex items-center gap-3">
             <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" className="grid w-10 h-10 place-items-center rounded-full bg-navyLight border border-white/10 text-white hover:bg-blue-500 hover:border-blue-500 transition-all">
                <Send size={18} />
             </a>
             <a href="#" className="grid w-10 h-10 place-items-center rounded-full bg-navyLight border border-white/10 text-white hover:bg-pink-600 hover:border-pink-600 transition-all">
                <Instagram size={18} />
             </a>
             <a href="#" className="grid w-10 h-10 place-items-center rounded-full bg-navyLight border border-white/10 text-white hover:bg-red-600 hover:border-red-600 transition-all">
                <Youtube size={18} />
             </a>
             <a href="#" className="grid w-10 h-10 place-items-center rounded-full bg-navyLight border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
                <Facebook size={18} />
             </a>
           </div>
        </div>

      </div>
      <div className="container mt-12 pt-8 border-t border-white/5 text-center text-sm text-slate-500 font-medium">
        © 2026 STC-2026 — Summer Tech Camp. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
