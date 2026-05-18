export default function Categoria({ nome }) {
    return (
        <>
            <div>
                <button className="text-md px-3 py-1 bg-transparent text-[#F33EC0] rounded-lg border border-2 border-[#F33EC0] font-bold hover:text-white hover:bg-[#F33EC0] transition-all duration-200">
                    { nome }
                </button>
            </div>
        </>
    );
}