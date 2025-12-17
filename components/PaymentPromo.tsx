export default function PaymentPromo() {
  return (
    <section className="bg-background py-12 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Frete Grátis */}
          <div className="flex items-center gap-4">
            <span className="text-primary text-4xl">🎁</span>
            <div>
              <h3 className="text-text font-bold text-lg mb-1">FRETE GRÁTIS</h3>
              <p className="text-muted-text">Em compras acima de R$ 250,00</p>
            </div>
          </div>

          {/* Parcelamento */}
          <div className="text-center">
            <p className="text-text font-bold text-lg mb-1">12x SEM JUROS</p>
            <p className="text-muted-text">No cartão de crédito</p>
          </div>

          {/* Métodos de Pagamento */}
          <div>
            <p className="text-muted-text mb-2">Parcele com</p>
            <div className="flex gap-2">
              <span className="bg-card px-3 py-1 rounded text-card-text text-sm">PIX</span>
              <span className="bg-card px-3 py-1 rounded text-card-text text-sm">BOLETO</span>
              <span className="bg-card px-3 py-1 rounded text-card-text text-sm">CARTÃO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
