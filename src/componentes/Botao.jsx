

export default function Botao({ preenchimento, tamanho, legenda }){
    return (
        <>
            <div className="flex">
                <button className={`w-full bg-${preenchimento} text-white text-${tamanho} font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                    {legenda}
                </button>
            </div>
        </>
    );
}