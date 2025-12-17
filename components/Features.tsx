import { Truck, Shield, Phone } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Acima de R$ 250"
    },
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Dados protegidos"
    },
    {
      icon: Phone,
      title: "Atendimento",
      description: "Via WhatsApp"
    }
  ];

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4 bg-card rounded-lg p-4">
                <IconComponent className="text-primary w-8 h-8" />
                <div>
                  <h4 className="text-card-text font-bold">{feature.title}</h4>
                  <p className="text-muted-text text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

