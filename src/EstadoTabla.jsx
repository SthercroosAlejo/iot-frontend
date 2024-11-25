import React, { useState, useEffect } from 'react';
import './App.css';
import { database, ref, onValue } from './firebase'; // Configuración de Firebase

const EstadoTabla = () => {
    const [dataList, setDataList] = useState([]); // Almacenará la lista de datos desde Firebase
    const [error, setError] = useState('');

    useEffect(() => {
        const dbRef = ref(database, 'smartHome');

        // Listener en tiempo real
        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Convertimos los datos de un objeto a un array
                    const dataList = Object.keys(data).map((key) => ({
                        id: key, // uuid como identificador
                        ...data[key], // El resto de los datos del objeto
                    }));
                    setDataList(dataList); // Guardamos la lista en el estado
                } else {
                    console.log('No hay datos disponibles en Firebase.');
                    setDataList([]);
                }
            },
            (error) => {
                console.error('Error al escuchar cambios en Firebase:', error);
                setError('Error al cargar datos en tiempo real.');
            }
        );

        // Limpiar el listener al desmontar el componente
        return () => unsubscribe();
    }, []);

    const getStatusClass = (valor) => {
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

    // Agrupar los datos por 'id'
    const groupedData = dataList.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = [];
        }
        acc[item.id].push(item);
        return acc;
    }, {});

    return (
        <div className="dashboard-container">
            <div className="estado-tabla">
                <h2>Estado del Sistema</h2>
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Campo</th>
                            <th>Estado</th>
                            <th>Fecha y Hora</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(groupedData).map((id) => (
                            <React.Fragment key={id}>
                                <tr className="group-header">
                                    <td colSpan="3">ID: {id}</td>
                                </tr>
                                {groupedData[id].map((item, index) => (
                                    <React.Fragment key={`${id}-${index}`}>
                                        <tr>
                                            <td>Puerta</td>
                                            <td>
                          <span className={`badge ${getStatusClass(item.estado_puerta)}`}>
                            {item.estado_puerta}
                          </span>
                                            </td>
                                            <td>{item.fecha_hora}</td>
                                        </tr>
                                        <tr>
                                            <td>Sensores</td>
                                            <td>
                          <span className={`badge ${getStatusClass(item.estado_sensores)}`}>
                            {item.estado_sensores}
                          </span>
                                            </td>
                                            <td>{item.fecha_hora}</td>
                                        </tr>
                                        <tr>
                                            <td>Movimiento</td>
                                            <td>
                          <span className={`badge ${getStatusClass(item.estado_movimiento)}`}>
                            {item.estado_movimiento}
                          </span>
                                            </td>
                                            <td>{item.fecha_hora}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EstadoTabla;
