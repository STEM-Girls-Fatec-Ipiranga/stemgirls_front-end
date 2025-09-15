import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ListaEventos = () => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarEventos()
  }, [])

  const carregarEventos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/eventos')
      setEventos(response.data)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h1 className="card-title">Lista de Eventos</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h1 className="card-title">Lista de Eventos</h1>
      
      {eventos.length === 0 ? (
        <p>Nenhum evento cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1">
          {eventos.map((evento) => (
            <div key={evento.id} className="card" style={{ marginBottom: '15px' }}>
              <div className="grid grid-cols-2">
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
                    {evento.nomeEvento}
                  </h3>
                  <p><strong>Empresa:</strong> {evento.nomeEmpresa}</p>
                  <p><strong>Data:</strong> {evento.dataEvento} às {evento.horaEvento}</p>
                  <p><strong>Modelo:</strong> {evento.modelo}</p>
                  
                  {evento.modelo === 'presencial' && evento.localidade && (
                    <div>
                      <p><strong>Local:</strong> {evento.localidade.rua}, {evento.localidade.numero}</p>
                      <p>{evento.localidade.bairro}, {evento.localidade.cidade} - {evento.localidade.estado}</p>
                    </div>
                  )}
                  
                  {evento.modelo === 'remoto' && (
                    <p><strong>Link:</strong> {evento.linkEvento}</p>
                  )}
                </div>
                
                <div>
                  <img 
                    src={evento.fotoDivulgacao} 
                    alt={`Imagem de divulgação do evento ${evento.nomeEvento}`}
                    style={{ 
                      width: '100%', 
                      maxWidth: '200px', 
                      borderRadius: '8px',
                      float: 'right'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <p><strong>Descrição:</strong></p>
                <p>{evento.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaEventos