
export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  highlight: string;
  features: string[];
  materials: string;
  images: string[];
  colors: Color[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  items: string;
  image: string;
  products: Product[];
}

export const CATEGORIES: Category[] = [
  {
    id: "1",
    slug: "remeras-y-polos",
    name: "Remeras y Polos",
    items: "Más de 15 modelos",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
    products: [
      {
        id: "rp-1",
        slug: "remera-algodon-manga-corta",
        name: "Remera Algodón Manga Corta",
        description: "Remera de algodón 100% con cuello a la base y costuras reforzadas. Ideal para uniformes corporativos.",
        highlight: "Con tu logo y entrega en 24hs",
        features: [
          "100% algodón gramaje premium",
          "Logo estampado frente, espalda o mangas",
          "Estampados sin límite de colores — inclusive pueden ser fotos",
          "Cuello a la base y costuras reforzadas",
          "Todos los talles disponibles",
          "Mínimo desde 10 unidades",
        ],
        materials: "Algodón 200g/m²",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
        ],
        colors: [
          { name: "Negro", hex: "#1a1a1a" },
          { name: "Blanco", hex: "#f5f5f5" },
          { name: "Gris", hex: "#9e9e9e" },
          { name: "Rojo", hex: "#e53935" },
          { name: "Azul marino", hex: "#1a237e" },
        ]
      },
      {
        id: "rp-2",
        slug: "polo-pique-premium",
        name: "Polo Piqué Premium",
        description: "Chomba polo de tela piqué de alta resistencia. Elegancia y profesionalismo para tu equipo.",
        highlight: "Bordado de alta definición",
        features: [
          "Tela Piqué 65/35 poliéster/algodón",
          "Cuello y puños tejidos",
          "Corte entallado o clásico",
          "Ideal para bordado de logo en pecho",
          "No destiñe ni deforma con los lavados",
        ],
        materials: "Piqué Premium",
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800",
        ],
        colors: [
          { name: "Azul Marino", hex: "#1a237e" },
          { name: "Blanco", hex: "#ffffff" },
          { name: "Negro", hex: "#000000" },
          { name: "Bordo", hex: "#800000" },
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "buzos-y-canguros",
    name: "Buzos y Canguros",
    items: "Frisa y Algodón",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
    products: [
      {
        id: "bc-1",
        slug: "buzo-canguro-frisa",
        name: "Buzo Canguro Frisa",
        description: "Buzo con capucha y bolsillo delantero. Máximo abrigo y comodidad.",
        highlight: "Disponible en más de 10 colores",
        features: [
          "Frisa invisible premium",
          "Capucha forrada",
          "Puños y cintura de ribb con lycra",
          "Cordón redondo con punteras plásticas",
        ],
        materials: "Frisa Invisible",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
        ],
        colors: [
          { name: "Gris Melange", hex: "#cccccc" },
          { name: "Negro", hex: "#1a1a1a" },
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "camperas-y-abrigo",
    name: "Camperas y Abrigo",
    items: "Softshell y Térmicas",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600",
    products: [
      {
        id: "ca-1",
        slug: "campera-softshell-corporate",
        name: "Campera Softshell Corporate",
        description: "Campera técnica rompeviento y resistente al agua.",
        highlight: "Ideal para personal operativo",
        features: [
          "Tela Triple Capa",
          "Micropolar interior",
          "Cierres impermeables",
        ],
        materials: "Softshell Premium",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
        ],
        colors: [
          { name: "Azul", hex: "#1e3a8a" },
          { name: "Negro", hex: "#000000" },
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "ropa-de-trabajo",
    name: "Ropa de Trabajo",
    items: "Pantalones y Overoles",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
    products: [
      {
        id: "rt-1",
        slug: "pantalon-cargo-reforzado",
        name: "Pantalón Cargo Reforzado",
        description: "Pantalón de alta durabilidad con múltiples bolsillos.",
        highlight: "Costuras de seguridad",
        features: [
          "Tela Grafa 70",
          "Bolsillos laterales con velcro",
          "Refuerzo en entrepierna",
        ],
        materials: "Gabardina 8oz",
        images: [
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
        ],
        colors: [
          { name: "Beige", hex: "#d2b48c" },
          { name: "Azul Marino", hex: "#1a237e" },
          { name: "Verde Oliva", hex: "#556b2f" },
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "gorros-y-accesorios",
    name: "Gorros y Accesorios",
    items: "Trucker y Bordados",
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&?q=80&w=600",
    products: [
      {
        id: "ga-1",
        slug: "gorra-trucker-classic",
        name: "Gorra Trucker Classic",
        description: "Gorra con red clásica para personalización rápida.",
        highlight: "Varios colores combinados",
        features: [
          "Frente de espuma",
          "Red de poliéster",
          "Cierre ajustable",
        ],
        materials: "Poliéster/Espuma",
        images: [
          "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&q=80&w=800",
        ],
        colors: [
          { name: "Negro/Blanco", hex: "#000000" },
          { name: "Azul/Blanco", hex: "#1e3a8a" },
        ]
      }
    ]
  }
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getProductBySlugs(categorySlug: string, productSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.products.find(p => p.slug === productSlug);
}
