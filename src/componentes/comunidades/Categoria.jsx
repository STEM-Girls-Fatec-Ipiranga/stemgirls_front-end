export default function Categoria({ nome, onClick, ativo }) {
    return (
        <>
            <div>
                <button
                    onClick={onClick}
                    className={`text-md px-3 py-1 rounded-lg border-2 border-[#F33EC0] font-bold transition-all duration-200 ${ativo ? "bg-[#F33EC0] text-white" : "bg-transparent text-[#F33EC0] hover:text-white hover:bg-[#F33EC0]"}`}
                >
                    {nome}
                </button>
            </div>
        </>
    );
}