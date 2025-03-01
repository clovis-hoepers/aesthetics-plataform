
import { ArrowRight, MapPin, MessageCircle, Star, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { VisitUs } from "@/components/VisitUs";

const Index = () => {
  const services = [
    {
      title: "Estética Facial",
      description: "Tratamentos especializados para revitalizar e rejuvenescer sua pele.",
      image: "/images/54fc6b7f-3f88-41b6-97ba-438f6dfdd2f1.png",
      link: "/servicos"
    },
    {
      title: "Estética Corporal",
      description: "Procedimentos personalizados para realçar sua beleza natural.",
      image: "/images/640e38bb-145e-4400-a258-2aa5f55c6788.png",
      link: "/servicos"
    }
  ];

  const benefits = [
    {
      icon: <Star className="h-8 w-8 text-purple-300" />,
      title: "Profissionais especializados",
      description: "Nossa equipe é formada por profissionais altamente qualificados e constantemente atualizados com as últimas técnicas e tecnologias."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-300" />,
      title: "Ambiente acolhedor",
      description: "Criamos um espaço relaxante e tranquilo para que você se sinta completamente à vontade durante seus tratamentos."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-300" />,
      title: "Tecnologia avançada",
      description: "Utilizamos equipamentos de última geração e produtos de alta qualidade para garantir os melhores resultados."
    }
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5547992245604?text=Olá!, Vim através do Site e Gostaria de saber mais sobre os tratamentos.", "_blank");
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-purple-50 to-white">
          <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-purple-500 mb-6 animate-fade-up">
                Transforme sua beleza
              </h1>
              <p className="text-lg md:text-xl text-purple-400 mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Descubra o melhor da estética facial e corporal com tratamentos personalizados para realçar sua beleza natural.
              </p>
              <div className="space-x-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <Button 
                  onClick={handleWhatsAppClick}
                  variant="outline" 
                  size="lg" 
                  className="text-purple-400 border-purple-300 hover:bg-purple-200"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Entre em contato pelo WhatsApp
                </Button>
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Card className="overflow-hidden">
                <img
                  src="/images/d9b25a3c-8a42-4f8a-8d0b-7d496a3f9711.png"
                  alt="Ingrid Farmaceutica Esteta"
                  className="w-full h-auto"
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-purple-500 text-center mb-12 animate-fade-up">
              Nossos Serviços
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl animate-fade-up"
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {service.description}
                    </p>
                    <Button asChild variant="secondary" className="w-fit bg-purple-100 hover:bg-purple-200 text-purple-500">
                      <Link to={service.link}>
                        Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-purple-50">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-purple-500 text-center mb-12 animate-fade-up">
              Por que nos escolher?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-up"
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                >
                  {benefit.icon}
                  <h3 className="font-playfair text-xl font-bold text-purple-500 my-4">
                    {benefit.title}
                  </h3>
                  <p className="text-purple-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visit Us Section (Replaces Location) */}
        <VisitUs />
      </main>
    </div>
  );
};

export default Index;
