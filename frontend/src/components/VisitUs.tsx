
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, MapPin, Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function VisitUs() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-purple-500 text-center mb-12 animate-fade-up">
          Venha nos fazer uma visita!
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Card className="border-purple-200 overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="bg-purple-50 p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-purple-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-purple-500 mb-2">
                        Localização
                      </h3>
                      <p className="text-purple-400 mb-4">
                        Rua Camboriú, 4370 - Bairro Gloria<br />
                        Joinville - SC<br />
                        CEP: 89216-222
                      </p>
                      <Button 
                        onClick={() => window.open("https://maps.app.goo.gl/5HpLQ8qGGBP7aMd79", "_blank")}
                        variant="outline"
                        className="text-purple-400 border-purple-300 hover:bg-purple-200"
                      >
                        <MapPin className="mr-2 h-5 w-5" />
                        Ver no Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="bg-purple-50 p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-purple-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-purple-500 mb-2">
                        Horário de Funcionamento
                      </h3>
                      <div className="space-y-2 text-purple-400">
                        <div className="flex justify-between">
                          <span>Segunda a Sexta</span>
                          <span>8h às 21h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sábado</span>
                          <span>9h às 20h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Domingos e Feriados</span>
                          <span>Fechado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="bg-purple-50 p-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-purple-300 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-purple-500 mb-2">
                        Contato
                      </h3>
                      <p className="text-purple-400 mb-2">
                      <a href="https://wa.me/5547992245604?text=Olá!, Vim através do Site e Gostaria de saber mais sobre os tratamentos." className="hover:text-purple-400 transition-colors">Telefone: (47) 99224-5604</a>
                      </p>
                      <p className="text-purple-400">
                      <a href="mailto:ingridestetica.corporalfacial@gmail.com" className="hover:text-purple-400 transition-colors">Email: ingridestetica.corporalfacial@gmail.com</a>
                      </p>
                      <div className="text-purple-400 mb-2">
                      <a
                        href="https://www.instagram.com/farmaingridmelo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                    </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg h-[450px] animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.6442608348675!2d-48.86639498493348!3d-26.273206640957262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94deaf864e50b29f%3A0xd62710151b65d039!2sIngrid%20Melo-%20Bioestimulador%20de%20col%C3%A1geno%20l%20Botox%20l%20Limpeza%20de%20pele%20l%20Peeling%20l!5e0!3m2!1spt-BR!2sbr!4v1740833308167!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Ingrid Farmaceutica Esteta"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}