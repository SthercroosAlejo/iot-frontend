// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './App.css';
import {database, set, ref}  from "./firebase";
import { v4 as uuidv4 } from 'uuid';

const EstadoTabla = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        try {
            // Simulación de datos (puedes reemplazar con tu API)
            const json = {
                id: uuidv4(),
                estado_puerta: 'Cerrado',
                estado_sensores: 'Activado',
                estado_movimiento: 'Detectado',
                fecha_hora: new Date().toLocaleString(),
            };
            setData(json);
        } catch (wrong) {
            setError('Error al cargar datos.');
            console.log(wrong);
        }
    }

    // Función para enviar datos a Firebase
    const sendDataToFirebase = (data) => {
        const dbRef = ref(database, `smartHome/${data.id}`);
        console.log('Guardando datos en Firebase:', data);
        set(dbRef, data).then(r => {
            console.log('Datos guardados en Firebase:', r);
        }); // Guarda los datos en la base de datos
    };


    const getStatusClass = (valor) => {
        sendDataToFirebase(data);
        const estadosClases = {
            Abierta: 'badge-warning',
            Cerrada: 'badge-success',
            Activados: 'badge-success',
            Desactivados: 'badge-error',
            Detectado: 'badge-warning',
            'Sin movimiento': 'badge-neutral',
        };
        return estadosClases[valor] || 'badge-neutral';
    };

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="estado-tabla">
                <h2 style={{textAlign: "center"}}>Estado del Sistema</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Campo</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data && Object.keys(data).map(
                        (key) =>
                            key !== 'id' && key !== 'fecha_hora' && (
                                <tr key={key}>
                                    <td>{key.replace('estado_', '').replace('_', ' ').toUpperCase()}</td>
                                    <td>
                      <span className={`badge ${getStatusClass(data[key])}`}>
                        {data[key]}
                      </span>
                                    </td>
                                </tr>
                            )
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default EstadoTabla;
