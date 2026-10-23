export interface DatosPedido {
  nombre: string;
  telefono: string;
  entrega: "recogida" | "domicilio";
  direccion: string;
  notas: string;
}
