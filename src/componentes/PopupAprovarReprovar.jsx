import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PopupConfirmar from './PopupConfirmar';
import PopupReprovar from './PopupReprovar';

function PopupAprovarReprovar({ notif, fechar, removerNotificacao }) {
    const [confirmar, setConfirmar] = useState(false);
    const [reprovar, setReprovar] = useState(false);
    const [empresa, setEmpresa] = useState(null);

    const empresaId = notif?.empresaId;
    console.log('Empresa ID:', empresaId);

    useEffect(() => {
        axios.get(`http://localhost:8080/empresa/${empresaId}`)
            .then((response) => setEmpresa(response.data))
            .catch((error) => console.error("Erro ao buscar empresa:", error));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        >
            <div className="bg-white h-[500px] rounded-xl shadow-xl w-[600px] flex flex-col p-8">
                <h2 className="text-[24px] font-bold mb-6 text-center">Dados da Empresa</h2>

                {empresa ? (
                    <div className="text-[18px] m-4">
                        <p><b>Nome:</b> {empresa.nomeEmpresa}</p>
                        <p><b>Email:</b> {empresa.email}</p>
                        <p><b>CNPJ:</b> {empresa.cnpj}</p>
                        <p><b>Telefone:</b> {empresa.telefone}</p>
                    </div>
                ) : (
                    <p>Erro ao carregar os dados da empresa.</p>
                )}

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setConfirmar(true)} className="bg-green-500 px-4 py-2 rounded-xl text-white">
                        Aprovar
                    </button>
                    <button onClick={() => setReprovar(true)} className="bg-red-500 px-4 py-2 rounded-xl text-white">
                        Reprovar
                    </button>
                    <button onClick={fechar} className="bg-gray-400 px-4 py-2 rounded-xl text-white">
                        Fechar
                    </button>
                </div>

                {confirmar && (
                    <PopupConfirmar
                        fechar={fechar}
                        //removerNotificacao={removerNotificacao}
                    />
                )}

                {reprovar && (
                    <PopupReprovar
                        fechar={fechar}
                        //onReprovar={removerNotificacao}
                    />
                )}
            </div>
        </motion.div>
    );
}

export default PopupAprovarReprovar;
