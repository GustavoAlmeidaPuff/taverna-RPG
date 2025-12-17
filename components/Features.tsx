export default function Features() {
  const features = [
    {
      icon: "🚚",
      title: "Frete Grátis",
      description: "Acima de R$ 250"
    },
    {
      icon: "🛡️",
      title: "Compra Segura",
      description: "Dados protegidos"
    },
    {
      icon: "💳",
      title: "Parcele em 12x",
      description: "Sem juros"
    },
    {
      icon: "📱",
      title: "Atendimento",
      description: "Via WhatsApp"
    }
  ];

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 bg-card rounded-lg p-4">
              <span className="text-primary text-3xl">{feature.icon}</span>
              <div>
                <h4 className="text-card-text font-bold">{feature.title}</h4>
                <p className="text-muted-text text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
