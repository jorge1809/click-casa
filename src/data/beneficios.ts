import { Truck, ShieldCheck, MessageCircle, Tag } from "lucide-react";
import type { Beneficio } from "../types/Beneficio";

export const beneficios: Beneficio[] = [
  {
    id: 1,
    icono: Truck,
    titulo: "Envíos a todo el país",
    descripcion: "Consulta cobertura y costos",
  },
  {
    id: 2,
    icono: ShieldCheck,
    titulo: "Garantía en productos",
    descripcion: "Consulta las condiciones de cada producto",
  },
  {
    id: 3,
    icono: MessageCircle,
    titulo: "Asesoría por WhatsApp",
    descripcion: "Te ayudamos a elegir",
  },
  {
    id: 4,
    icono: Tag,
    titulo: "Precios competitivos",
    descripcion: "Cotiza antes de comprar",
  },
];
