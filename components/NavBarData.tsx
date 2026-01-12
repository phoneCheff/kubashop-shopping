// src/data/categories.ts

export const CATEGORIES = [
  {
    id: "1",
    name: "Ropa",
    slug: "ropa",
    color:
      "bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 text-pink-700",
    hoverColor: "hover:from-pink-200 hover:to-rose-200",
    icon: "👗", // Alternativas: 👕, 👚, 🧥
    iconDark: "💃", // Para móviles o hover
  },
  {
    id: "2",
    name: "Zapatos",
    slug: "zapatos",
    color:
      "bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 text-blue-700",
    hoverColor: "hover:from-blue-200 hover:to-cyan-200",
    icon: "👠", // Alternativas: 👟, 👢, 🥾
    iconDark: "🩰",
  },
  {
    id: "3",
    name: "Accesorios",
    slug: "accesorios",
    color:
      "bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-200 text-purple-700",
    hoverColor: "hover:from-purple-200 hover:to-violet-200",
    icon: "👜", // Alternativas: 👓, 🧣, 🧤
    iconDark: "💼",
  },
  {
    id: "4",
    name: "Cosméticos",
    slug: "cosmeticos",
    color:
      "bg-gradient-to-r from-fuchsia-100 to-pink-100 border border-fuchsia-200 text-fuchsia-700",
    hoverColor: "hover:from-fuchsia-200 hover:to-pink-200",
    icon: "💄", // Alternativas: 💅, 🧴, 🧼
    iconDark: "✨",
  },
  {
    id: "5",
    name: "Laptops",
    slug: "laptops",
    color:
      "bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700",
    hoverColor: "hover:from-emerald-200 hover:to-teal-200",
    icon: "💻",
    iconDark: "🖥️",
  },
  {
    id: "6",
    name: "Celulares",
    slug: "celulares",
    color:
      "bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 text-amber-700",
    hoverColor: "hover:from-amber-200 hover:to-yellow-200",
    icon: "📱",
    iconDark: "📲",
  },
  {
    id: "7",
    name: "Electrodomésticos",
    slug: "electrodomesticos",
    color:
      "bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 text-orange-700",
    hoverColor: "hover:from-orange-200 hover:to-red-200",
    icon: "🔌", // Alternativas: 🏠, 🛋️
    iconDark: "🏠",
  },
  {
    id: "8",
    name: "Motos",
    slug: "motos",
    color:
      "bg-gradient-to-r from-gray-100 to-slate-100 border border-gray-200 text-gray-700",
    hoverColor: "hover:from-gray-200 hover:to-slate-200",
    icon: "🏍️",
    iconDark: "🛵",
  },
  {
    id: "9",
    name: "Triciclos",
    slug: "triciclos",
    color:
      "bg-gradient-to-r from-cyan-100 to-sky-100 border border-cyan-200 text-cyan-700",
    hoverColor: "hover:from-cyan-200 hover:to-sky-200",
    icon: "🛵", // No hay emoji específico de triciclo
    iconDark: "🚜", // Alternativa
  },
  {
    id: "10",
    name: "Bicicletas",
    slug: "bicicletas",
    color:
      "bg-gradient-to-r from-lime-100 to-green-100 border border-lime-200 text-lime-700",
    hoverColor: "hover:from-lime-200 hover:to-green-200",
    icon: "🚴", // Alternativas: 🚲, 🚵
    iconDark: "🚵‍♀️",
  },
  {
    id: "11",
    name: "Computadoras",
    slug: "computadoras",
    color:
      "bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200 text-indigo-700",
    hoverColor: "hover:from-indigo-200 hover:to-blue-200",
    icon: "🖥️",
    iconDark: "💾",
  },
  {
    id: "12",
    name: "Neumáticos",
    slug: "neumaticos",
    color:
      "bg-gradient-to-r from-stone-100 to-zinc-100 border border-stone-200 text-stone-700",
    hoverColor: "hover:from-stone-200 hover:to-zinc-200",
    icon: "🛞", // Emoji nuevo, puede que no funcione en todos los dispositivos
    iconDark: "🚗", // Alternativa
  },
  {
    id: "13",
    name: "Ferretería",
    slug: "ferreteria",
    color:
      "bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 text-red-700",
    hoverColor: "hover:from-red-200 hover:to-rose-200",
    icon: "🔨", // Alternativas: 🛠️, ⚒️, 🔧
    iconDark: "⚒️",
  },
  {
    id: "14",
    name: "Servicios",
    slug: "servicios",
    color:
      "bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 text-violet-700",
    hoverColor: "hover:from-violet-200 hover:to-purple-200",
    icon: "💼", // Alternativas: 🤝, 📋, 📄
    iconDark: "💵",
  },
] as const;

// También puedes crear un array de colores para usar en gráficos o donde necesites
export const CATEGORY_COLORS = {
  ropa: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
  zapatos: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  accesorios: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
  cosmeticos: {
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-700",
    border: "border-fuchsia-300",
  },
  laptops: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
  celulares: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  electrodomesticos: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  motos: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  triciclos: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-300",
  },
  bicicletas: {
    bg: "bg-lime-100",
    text: "text-lime-700",
    border: "border-lime-300",
  },
  computadoras: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-300",
  },
  neumaticos: {
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
  },
  ferreteria: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  servicios: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-300",
  },
};
