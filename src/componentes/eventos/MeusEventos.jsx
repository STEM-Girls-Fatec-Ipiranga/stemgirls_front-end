import Evento from "./Evento";

export default function MeusEventos({ eventos, user }) {
    
    
    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Meus Eventos</h2>
            {eventos.length == 0 ? (
                <div>Nenhum evento criado.</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6 items-stretch">
                    {eventos.map((evento, index) => (
                        <Evento 
                            key={index}
                            evento={evento}
                            user={user}
                        />
                    ))}
                </div>
            )}
        </>
    );
}