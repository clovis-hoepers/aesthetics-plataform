
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Servicos = () => {
  const services = [
    {
      title: "Limpeza de Pele Profunda",
      description: "Tratamento completo para remover impurezas, desobstruir os poros e revitalizar a pele, proporcionando uma aparência saudável e luminosa."
    },
    {
      title: "Limpeza de Pele + Peeling",
      description: "Combinação de limpeza profunda com peeling químico para renovação celular, redução de manchas e melhora da textura da pele."
    },
    {
      title: "Limpeza de Pele + Dermaplaning",
      description: "Procedimento que remove células mortas e pelos faciais, deixando a pele mais lisa, uniforme e preparada para melhor absorção de ativos."
    },
    {
      title: "Tratamento para Oleosidade",
      description: "Controle da produção sebácea com ativos específicos, reduzindo o brilho excessivo e prevenindo a acne para uma pele equilibrada e saudável."
    },
    {
      title: "Tratamento para Melasma",
      description: "Uso de técnicas avançadas para suavizar manchas escuras causadas pelo melasma, uniformizando o tom da pele e promovendo luminosidade."
    },
    {
      title: "Tratamento para Manchas",
      description: "Procedimentos estéticos para clareamento de manchas e uniformização da pele, garantindo um tom mais homogêneo e radiante."
    },
    {
      title: "Microagulhamento",
      description: "Estimulação do colágeno através de microperfurações, melhorando a textura, firmeza e reduzindo cicatrizes e linhas de expressão."
    },
    {
      title: "Botox",
      description: "Toxina botulínica para suavização de rugas e linhas de expressão, proporcionando um aspecto rejuvenescido e natural."
    },
    {
      title: "Bioestimulador de Colágeno",
      description: "Tratamento que estimula a produção natural de colágeno, restaurando a firmeza e elasticidade da pele para um efeito rejuvenescedor."
    },
    {
      title: "Preenchimento de Mento",
      description: "Harmonização facial com preenchimento do queixo, melhorando o contorno e equilíbrio do rosto de forma natural e sofisticada."
    },
    {
      title: "Preenchimento Bigode Chinês",
      description: "Correção das marcas ao redor da boca com ácido hialurônico, suavizando sulcos e proporcionando um aspecto mais jovem e revitalizado."
    }
  ];

  return (
    <div className="min-h-screen bg-purple-100 pt-24">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-purple-500 mb-8 text-center">
          Estética Facial e Corporal
        </h1>
        
        <div className="mb-12">
          <p className="text-lg text-purple-400 text-center max-w-3xl mx-auto">
            Oferecemos tratamentos faciais personalizados para realçar sua beleza natural.
            Utilizamos tecnologias avançadas e produtos de alta qualidade para garantir os melhores resultados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-purple-500">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-400">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Servicos;
