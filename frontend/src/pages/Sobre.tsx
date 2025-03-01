
import { Card } from "@/components/ui/card";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-purple-100 pt-24">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-purple-500 animate-fade-up">
              Sobre Nós
            </h1>
            <p className="text-lg text-purple-400 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Acreditamos que cada pessoa merece se sentir bonita e confiante. Nossa missão é proporcionar tratamentos personalizados que realçam sua beleza natural.
            </p>
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <h2 className="font-playfair text-2xl font-bold text-purple-400">Nossa Experiência</h2>
              <p className="text-purple-400">
                Com anos de experiência em estética, nossa equipe está comprometida em oferecer os melhores tratamentos, usando tecnologias avançadas e produtos de alta qualidade.
              </p>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Card className="overflow-hidden">
              <img
                src="/images/e68785af-8854-4687-8dff-8367ca60b0e8.png"
                alt="Ingrid Farmaceutica Esteta"
                className="w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
