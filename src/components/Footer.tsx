import { Facebook, Linkedin, Instagram, Youtube, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Section - Company Name and Social Icons */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              TURING INTELIGENCIA ARTIFICIAL
            </h3>
            <div className="flex gap-3">
              {/* Facebook */}
              <a 
                href="#" 
                className="w-10 h-10 bg-[#6ee7b7] rounded flex items-center justify-center hover:bg-[#5dd6a6] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-[#1e293b]" />
              </a>

              {/* LinkedIn */}
              <a 
                href="#" 
                className="w-10 h-10 bg-[#6ee7b7] rounded flex items-center justify-center hover:bg-[#5dd6a6] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-[#1e293b]" />
              </a>

              {/* Instagram */}
              <a 
                href="#" 
                className="w-10 h-10 bg-[#6ee7b7] rounded flex items-center justify-center hover:bg-[#5dd6a6] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#1e293b]" />
              </a>

              {/* YouTube */}
              <a 
                href="#" 
                className="w-10 h-10 bg-[#6ee7b7] rounded flex items-center justify-center hover:bg-[#5dd6a6] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-[#1e293b]" />
              </a>

              {/* Twitter */}
              <a 
                href="#" 
                className="w-10 h-10 bg-[#6ee7b7] rounded flex items-center justify-center hover:bg-[#5dd6a6] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-[#1e293b]" />
              </a>
            </div>
          </div>

          {/* Right Section - Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 max-w-3xl">
            {/* Column 1 - Address & Email */}
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-white mt-0.5" />
                <div>
                  <p className="text-xs text-white leading-relaxed font-sans">
                    AV. INSURGENTES SUR 674. COL DEL VALLE, BENITO JUÁREZ, 03103<br />
                    CIUDAD DE MÉXICO, CDMX
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-white" />
                <div>
                  <p className="text-xs text-[#94a3b8] uppercase font-sans tracking-wide">CORREO ELECTRÓNICO:</p>
                  <a 
                    href="mailto:contacto@turing-latam.com" 
                    className="text-xs text-white hover:text-[#6ee7b7] transition-colors font-sans"
                  >
                    contacto@turing-latam.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2 - Phone */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-white" />
                <div>
                  <p className="text-xs text-[#94a3b8] uppercase font-sans tracking-wide">TELÉFONO DE CONTACTO:</p>
                  <a 
                    href="tel:+527226789459" 
                    className="text-xs text-white hover:text-[#6ee7b7] transition-colors font-sans"
                  >
                    +52 (722) 678-94-59
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
