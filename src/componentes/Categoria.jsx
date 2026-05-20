export default function Categoria({ nome, className, ...props}) {
    return (
        <>
            <div>
                <button className={`text-md px-3 py-1 rounded-lg border border-1 border-gray font-semibold ${className}`} {...props}>
                    { nome }
                </button>
            </div>
        </>
    );
}