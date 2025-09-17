import fundoSG from "../assets/img/FundoRodape.png";

function Rodape(){
    return(
        <footer className="w-full h-[470px] bg-gray-800 backdrop-blur-md "
        style={{ backgroundImage: `url(${fundoSG})` }}
        >

        </footer>
    );
}

export default Rodape;