import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function Notificacoes({ fechar }) {
    return (
        <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
                fixed 
                right-0 
                top-0 
                h-screen 
                w-[400px] 
                bg-[#FFF6FF] 
                rounded-l-xl 
                shadow-xl 
                z-50 
                text-black
                overflow-y-auto
            "
        >
            <div className="flex flex-row gap-6 m-6 items-center">
                <ArrowLeft onClick={fechar} className="cursor-pointer" />
                <h2 className="text-[20px] font-bold">Notificações</h2>
            </div>

            <p className="mx-6 mt-10">Você não tem novas notificações.</p>
        </motion.div>
    );
}

export default Notificacoes;
