require("colors");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoCheckList,
} = require("./helpers/inquirer");
// const Tarea = require("./models/tarea");
const Tareas = require("./models/tareas");
// const { mostrarMenu, pausa } = require("./helpers/mensajes");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();
  const tareasDB = leerDB();
  if (tareasDB) {
    // cargar tareas
    const cargarTareas = tareas.cargarTareasFromArray(tareasDB);
  }
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case "1":
        // crear opt
        const desc = await leerInput("Descripcion: ");
        console.log(desc);
        tareas.crearTarea(desc);
        break;
      case "2":
        // listar opt
        tareas.listadoCompleto();
        break;
      case "3":
        // listar completadas
        tareas.listarPendientesCompletadas();
        break;
      case "4":
        // listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;
      case "5":
        // completado | Pendiente
        const ids = await mostrarListadoCheckList(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6":
        // borrar
        const id = await listadoTareasBorrar(tareas.listadoArr);

        if (id !== "0") {
          const ok = await confirmar("Estas seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("tarea borrada correctamente");
          }
        }

        break;

      default:
        break;
    }

    guardarDB(tareas.listadoArr);

    if (opt !== "0") await pausa();
  } while (opt !== "0");
};

main();
