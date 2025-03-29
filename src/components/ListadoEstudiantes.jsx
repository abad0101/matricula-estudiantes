import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import jsPDF from "jspdf";

const ListadoEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtroGrado, setFiltroGrado] = useState("Todos");
  const [filtroGenero, setFiltroGenero] = useState("Todos");
  const [filtroSeccion, setFiltroSeccion] = useState("Todos"); 
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [mostrarListado, setMostrarListado] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: "",
    fechaNacimiento: "",
    grado: "Primero",
    grupo: "A",
    genero: "Niño",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  useEffect(() => {
    if (mostrarListado) {
      fetchEstudiantes();
    }
  }, [filtroGrado, filtroGenero, filtroSeccion, busquedaNombre, mostrarListado]); 

  const fetchEstudiantes = async () => {
    try {
      let q = collection(db, "estudiantes");
      if (filtroGrado !== "Todos") {
        q = query(q, where("grado", "==", filtroGrado));
      }
      if (filtroGenero !== "Todos") {
        q = query(q, where("genero", "==", filtroGenero));
      }
      if (filtroSeccion !== "Todos") { 
        q = query(q, where("grupo", "==", filtroSeccion));
      }
      const querySnapshot = await getDocs(q);
      const estudiantesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEstudiantes(estudiantesData);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };

  const handleEditar = async (id, campo, valor) => {
    try {
      const estudianteRef = doc(db, "estudiantes", id);
      await updateDoc(estudianteRef, { [campo]: valor });
      fetchEstudiantes();
      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      alert("Hubo un error al actualizar el estudiante.");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este estudiante?")) {
      try {
        const estudianteRef = doc(db, "estudiantes", id);
        await deleteDoc(estudianteRef);
        fetchEstudiantes();
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        alert("Hubo un error al eliminar el estudiante.");
      }
    }
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "estudiantes"), nuevoEstudiante);
      fetchEstudiantes();
      const respuesta = window.confirm(
        "Estudiante registrado con éxito. ¿Deseas agregar otro?"
      );
      if (!respuesta) {
        setMostrarFormulario(false);
      } else {
        setNuevoEstudiante({
          nombre: "",
          fechaNacimiento: "",
          grado: "Primero",
          grupo: "A",
          genero: "Niño",
        });
      }
    } catch (error) {
      console.error("Error al registrar estudiante:", error);
      alert("Hubo un error al registrar el estudiante.");
    }
  };

  const filtrarPorNombre = (estudiantes) => {
    return estudiantes.filter((estudiante) =>
      estudiante.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
    );
  };

  const ordenarEstudiantes = (estudiantes) => {
    const ordenGrados = ["Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto"];
    return estudiantes.sort((a, b) => {
      const indexA = ordenGrados.indexOf(a.grado);
      const indexB = ordenGrados.indexOf(b.grado);
      if (indexA < indexB) return -1;
      if (indexA > indexB) return 1;

      if (a.grupo < b.grupo) return -1;
      if (a.grupo > b.grupo) return 1;

      if (a.genero < b.genero) return -1;
      if (a.genero > b.genero) return 1;

      return a.nombre.localeCompare(b.nombre);
    });
  };

  const estudiantesFiltrados = filtrarPorNombre(estudiantes);
  const estudiantesOrdenados = ordenarEstudiantes(estudiantesFiltrados);

  const handleExportarPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("Listado de Estudiantes", 10, 10);
    doc.setFontSize(12);
    doc.text("Nombre", 10, 20);
    doc.text("Fecha de Nacimiento", 50, 20);
    doc.text("Grado", 100, 20);
    doc.text("Grupo", 120, 20);
    doc.text("Género", 140, 20);
    let yPos = 30;
    estudiantesOrdenados.forEach((estudiante) => {
      doc.text(estudiante.nombre, 10, yPos);
      doc.text(new Date(estudiante.fechaNacimiento).toLocaleDateString(), 50, yPos);
      doc.text(estudiante.grado, 100, yPos);
      doc.text(estudiante.grupo, 120, yPos);
      doc.text(estudiante.genero, 140, yPos);
      yPos += 10;
    });
    doc.save("listado_estudiantes.pdf");
  };

  return (
    <div className="card">
      <h2>Listado de Estudiantes</h2>
      {!mostrarFormulario && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="add-student-button"
        >
          Agregar Estudiante
        </button>
      )}
      {mostrarFormulario && (
        <form onSubmit={handleAgregar}>
          <h3>Agregar Nuevo Estudiante</h3>
          <label>Nombre:</label>
          <input
            type="text"
            value={nuevoEstudiante.nombre}
            onChange={(e) =>
              setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })
            }
            required
          />
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={nuevoEstudiante.fechaNacimiento}
            onChange={(e) =>
              setNuevoEstudiante({ ...nuevoEstudiante, fechaNacimiento: e.target.value })
            }
            required
          />
          <label>Grado:</label>
          <select
            value={nuevoEstudiante.grado}
            onChange={(e) =>
              setNuevoEstudiante({ ...nuevoEstudiante, grado: e.target.value })
            }
          >
            <option value="Primero">Primero</option>
            <option value="Segundo">Segundo</option>
            <option value="Tercero">Tercero</option>
            <option value="Cuarto">Cuarto</option>
            <option value="Quinto">Quinto</option>
            <option value="Sexto">Sexto</option>
          </select>
          <label>Grupo:</label>
          <select
            value={nuevoEstudiante.grupo}
            onChange={(e) =>
              setNuevoEstudiante({ ...nuevoEstudiante, grupo: e.target.value })
            }
          >
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <label>Género:</label>
          <select
            value={nuevoEstudiante.genero}
            onChange={(e) =>
              setNuevoEstudiante({ ...nuevoEstudiante, genero: e.target.value })
            }
          >
            <option value="Niño">Niño</option>
            <option value="Niña">Niña</option>
          </select>
          <div style={{ marginTop: "10px" }}>
            <button type="submit" className="register-button">
              Registrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false);
                setNuevoEstudiante({
                  nombre: "",
                  fechaNacimiento: "",
                  grado: "Primero",
                  grupo: "A",
                  genero: "Niño",
                });
              }}
              className="cancel-button"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <button
        onClick={() => setMostrarListado(!mostrarListado)}
        className={mostrarListado ? "hide-list-button" : "show-list-button"}
      >
        {mostrarListado ? "Ocultar Listado" : "Ver Listado"}
      </button>
      {mostrarListado && (
        <>
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busquedaNombre}
              onChange={(e) => setBusquedaNombre(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <div>
              <label>Filtrar por Grado:</label>
              <select
                value={filtroGrado}
                onChange={(e) => setFiltroGrado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Primero">Primero</option>
                <option value="Segundo">Segundo</option>
                <option value="Tercero">Tercero</option>
                <option value="Cuarto">Cuarto</option>
                <option value="Quinto">Quinto</option>
                <option value="Sexto">Sexto</option>
              </select>
            </div>
            <div>
              <label>Filtrar por Género:</label>
              <select
                value={filtroGenero}
                onChange={(e) => setFiltroGenero(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Niño">Niño</option>
                <option value="Niña">Niña</option>
              </select>
            </div>
            <div>
              <label>Filtrar por Sección:</label>
              <select
                value={filtroSeccion}
                onChange={(e) => setFiltroSeccion(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>
          <button onClick={handleExportarPDF} className="pdf-export-button">
            Exportar a PDF
          </button>
          <table className="students-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de Nacimiento</th>
                <th>Grado</th>
                <th>Grupo</th>
                <th>Género</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesOrdenados.map((estudiante) => {
                return (
                  <tr key={estudiante.id}>
                    <td>
                      {editandoId === estudiante.id ? (
                        <input
                          type="text"
                          defaultValue={estudiante.nombre}
                          onBlur={(e) =>
                            handleEditar(estudiante.id, "nombre", e.target.value)
                          }
                        />
                      ) : (
                        estudiante.nombre
                      )}
                    </td>
                    <td>
                      {editandoId === estudiante.id ? (
                        <input
                          type="date"
                          defaultValue={estudiante.fechaNacimiento}
                          onBlur={(e) =>
                            handleEditar(estudiante.id, "fechaNacimiento", e.target.value)
                          }
                        />
                      ) : (
                        new Date(estudiante.fechaNacimiento).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {editandoId === estudiante.id ? (
                        <select
                          defaultValue={estudiante.grado}
                          onBlur={(e) =>
                            handleEditar(estudiante.id, "grado", e.target.value)
                          }
                        >
                          <option value="Primero">Primero</option>
                          <option value="Segundo">Segundo</option>
                          <option value="Tercero">Tercero</option>
                          <option value="Cuarto">Cuarto</option>
                          <option value="Quinto">Quinto</option>
                          <option value="Sexto">Sexto</option>
                        </select>
                      ) : (
                        estudiante.grado
                      )}
                    </td>
                    <td>
                      {editandoId === estudiante.id ? (
                        <select
                          defaultValue={estudiante.grupo}
                          onBlur={(e) =>
                            handleEditar(estudiante.id, "grupo", e.target.value)
                          }
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                        </select>
                      ) : (
                        estudiante.grupo
                      )}
                    </td>
                    <td>
                      {editandoId === estudiante.id ? (
                        <select
                          defaultValue={estudiante.genero}
                          onBlur={(e) =>
                            handleEditar(estudiante.id, "genero", e.target.value)
                          }
                        >
                          <option value="Niño">Niño</option>
                          <option value="Niña">Niña</option>
                        </select>
                      ) : (
                        estudiante.genero
                      )}
                    </td>
                    <td>
                      {editandoId === estudiante.id ? (
                        <button
                          onClick={() => {
                            setEditandoId(null);
                            fetchEstudiantes();
                          }}
                          className="save-button"
                        >
                          Guardar Cambios
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditandoId(estudiante.id)}
                            className="edit-button"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(estudiante.id)}
                            className="delete-button"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ListadoEstudiantes;
