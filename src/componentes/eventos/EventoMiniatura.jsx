import { motion } from "framer-motion";

export default function EventoMiniatura({ img, titulo, local }) {
    return (
        <>
            <div>
                <motion.div
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="cursor-pointer"
                >
                    <div className="bg-white text-black shadow-md p-6 rounded-lg border border-pink-200 shadow-lg hover:shadow-xl transition-shadow duration-300 h-[380px] flex flex-col justify-between">
                        <div>
                            <img src={img} alt={titulo} className="w-full h-40 object-cover rounded" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-2">{titulo}</h4>
                                <p className="text-sm text-gray-600">
                                    Resumo do evento, com destaque para networking, inovação e aprendizado.
                                </p>
                            </div>
                        </div>
                        <div className="px-4 pb-3">
                            <p className="text-pink-500 font-semibold">{local}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}