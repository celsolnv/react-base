export function FakePage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4 text-center">
      <img
        src={"/images/people.svg"}
        alt="Manutenção"
        width={300}
        height={300}
      />
      <h1 className="mt-4 text-2xl font-bold text-gray-500">
        Tela em desenvolvimento ou manutenção...
      </h1>
      <p className="mt-4 text-gray-400">
        Estamos trabalhando para melhorar a experiência de nossos usuários.
        Volte mais tarde!
      </p>
    </div>
  );
}
