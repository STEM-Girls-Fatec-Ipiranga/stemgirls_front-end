import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PopupAprovarReprovar from './PopupAprovarReprovar';

function Notificacoes({}) {
    const [notificacoes, setNotificacoes] = useState([]);
    const [notifSelecionada, setNotifSelecionada] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/notificacoes/pendentes')
            .then((response) => setNotificacoes(response.data))
            .catch((error) => console.error("Erro ao buscar notificações:", error));
    }, []);

    console.log(notificacoes);

    const fechar = () => {
        setNotifSelecionada(null);
        window.location.reload();
    }

    return (
        <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 h-screen w-[400px] bg-[#FFF6FF] rounded-l-xl shadow-xl z-50 text-black overflow-y-auto"
        >
            <div className="flex flex-row gap-6 m-6 items-center">
                <ArrowLeft onClick={fechar} className="cursor-pointer" />
                <h2 className="text-[20px] font-bold">Notificações</h2>
            </div>

            {notificacoes.length === 0 ? (
                <p className="mx-6 mt-10">Você não tem novas notificações.</p>
            ) : (
                <div className="mx-6 mt-6 flex flex-col gap-4">
                    {notificacoes.map((notif) => (
                        <div
                            key={notif.id}
                            className="p-4 rounded-lg bg-white shadow-md cursor-pointer"
                            onClick={() => setNotifSelecionada(notif)}
                        >
                            <p className="font-semibold">{notif.mensagem}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Notificação ID: {notif.id}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {notifSelecionada && (
                <PopupAprovarReprovar
                    notif={notifSelecionada}
                    fechar={fechar}
                />
            )}
        </motion.div>
    );
}

export default Notificacoes;
