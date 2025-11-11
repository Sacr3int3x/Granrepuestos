import type { Brand, Category, Part } from './types';

const brands: Brand[] = [
  { id: 'bosch', name: 'Bosch', logoUrl: 'https://picsum.photos/seed/bosch/150/80' },
  { id: 'brembo', name: 'Brembo', logoUrl: 'https://picsum.photos/seed/brembo/150/80' },
  { id: 'ngk', name: 'NGK', logoUrl: 'https://picsum.photos/seed/ngk/150/80' },
  { id: 'mann-filter', name: 'Mann-Filter', logoUrl: 'https://picsum.photos/seed/mann/150/80' },
  { id: 'bilstein', name: 'Bilstein', logoUrl: 'https://picsum.photos/seed/bilstein/150/80' },
  { id: 'valeo', name: 'Valeo', logoUrl: 'https://picsum.photos/seed/valeo/150/80' },
];

const categories: Category[] = [
  { id: 'engine', name: 'Motor' },
  { id: 'suspension', name: 'Suspensión' },
  { id: 'brakes', name: 'Frenos' },
  { id: 'body', name: 'Carrocería' },
  { id: 'electrical', name: 'Eléctrico' },
];

const parts: Part[] = [
  {
    id: 'p001',
    name: 'Juego de Pastillas de Freno Delanteras',
    sku: 'BR-BP-001',
    description: 'Juego de pastillas de freno de cerámica de alto rendimiento para una frenada superior y bajo nivel de polvo.',
    price: 75.99,
    stock: 120,
    brand: brands[1], // Brembo
    category: categories[2], // Brakes
    imageUrls: [
      'https://picsum.photos/seed/brake3/600/600',
      'https://picsum.photos/seed/brake1/600/600',
      'https://picsum.photos/seed/brake2/600/600',
    ],
    isFeatured: true,
    specifications: {
      Material: 'Cerámica',
      Posición: 'Delantera',
      Compatibilidad: 'Toyota Corolla 2018-2022',
      Dimensiones: '137 x 55 x 17 mm',
    },
    relatedPartIds: ['p002', 'p003'],
  },
  {
    id: 'p002',
    name: 'Amortiguador de Gas Trasero',
    sku: 'SU-SA-002',
    description: 'Amortiguador de gas monotubo para una conducción suave y estable.',
    price: 120.5,
    stock: 80,
    brand: brands[4], // Bilstein
    category: categories[1], // Suspension
    imageUrls: ['https://picsum.photos/seed/susp1/600/600', 'https://picsum.photos/seed/susp2/600/600'],
    isFeatured: true,
    specifications: {
      Tipo: 'Monotubo de gas',
      Posición: 'Trasera',
      Compatibilidad: 'Honda Civic 2016-2021',
      Marca: 'Bilstein',
    },
    relatedPartIds: ['p001', 'p004'],
  },
  {
    id: 'p003',
    name: 'Bujía de Iridio',
    sku: 'EN-SP-003',
    description: 'Bujía de iridio de larga duración para un encendido eficiente y un mejor rendimiento del combustible.',
    price: 15.0,
    stock: 300,
    brand: brands[2], // NGK
    category: categories[0], // Engine
    imageUrls: ['https://picsum.photos/seed/spark1/600/600'],
    isFeatured: true,
    specifications: {
      Material: 'Iridio',
      'Vida útil': 'Hasta 100,000 km',
      Compatibilidad: 'Universal (consultar manual)',
      Marca: 'NGK',
    },
    relatedPartIds: ['p005'],
  },
  {
    id: 'p004',
    name: 'Faro LED Delantero Derecho',
    sku: 'BO-HL-004',
    description: 'Faro completo con tecnología LED para una visibilidad nocturna superior y un aspecto moderno.',
    price: 250.0,
    stock: 45,
    brand: brands[5], // Valeo
    category: categories[3], // Body
    imageUrls: ['https://picsum.photos/seed/headlight1/600/600'],
    isFeatured: true,
    specifications: {
      Tecnología: 'Full LED',
      Posición: 'Delantero Derecho',
      Compatibilidad: 'Volkswagen Golf MK7',
      Marca: 'Valeo',
    },
    relatedPartIds: ['p002', 'p010'],
  },
  {
    id: 'p005',
    name: 'Filtro de Aceite',
    sku: 'EN-OF-005',
    description: 'Filtro de aceite de alta capacidad para una protección óptima del motor.',
    price: 12.99,
    stock: 500,
    brand: brands[3], // Mann-Filter
    category: categories[0], // Engine
    imageUrls: ['https://picsum.photos/seed/filter1/600/600'],
    isFeatured: false,
    specifications: {
      Tipo: 'Sellado',
      Compatibilidad: 'Varios modelos (consultar)',
      Marca: 'Mann-Filter',
    },
    relatedPartIds: ['p003', 'p006'],
  },
  {
    id: 'p006',
    name: 'Filtro de Aire de Cabina',
    sku: 'BO-CF-006',
    description: 'Filtro de aire de cabina con carbón activado para eliminar olores y partículas.',
    price: 22.5,
    stock: 250,
    brand: brands[3], // Mann-Filter
    category: categories[3], // Body
    imageUrls: ['https://picsum.photos/seed/filter2/600/600'],
    isFeatured: false,
    specifications: {
      Material: 'Carbón Activado',
      Compatibilidad: 'Ford Focus 2015-2018',
      Marca: 'Mann-Filter',
    },
    relatedPartIds: ['p005'],
  },
  {
    id: 'p007',
    name: 'Disco de Freno Ventilado',
    sku: 'BR-DR-007',
    description: 'Disco de freno ventilado para una mejor disipación del calor y rendimiento constante.',
    price: 95.0,
    stock: 150,
    brand: brands[1], // Brembo
    category: categories[2], // Brakes
    imageUrls: ['https://picsum.photos/seed/brake1/600/600', 'https://picsum.photos/seed/brake2/600/600'],
    isFeatured: false,
    specifications: {
      Tipo: 'Ventilado',
      Posición: 'Delantero',
      Diámetro: '312 mm',
      Compatibilidad: 'Audi A3 2017-2020',
    },
    relatedPartIds: ['p001'],
  },
  {
    id: 'p008',
    name: 'Radiador de Aluminio',
    sku: 'EN-RD-008',
    description: 'Radiador de alto rendimiento fabricado en aluminio para una refrigeración eficiente.',
    price: 180.0,
    stock: 60,
    brand: brands[5], // Valeo
    category: categories[0], // Engine
    imageUrls: ['https://picsum.photos/seed/radiator1/600/600'],
    isFeatured: false,
    specifications: {
      Material: 'Aluminio',
      Compatibilidad: 'BMW Serie 3 E90',
      Marca: 'Valeo',
    },
    relatedPartIds: ['p005', 'p003'],
  },
  {
    id: 'p009',
    name: 'Alternador 120A',
    sku: 'EL-AL-009',
    description: 'Alternador remanufacturado de 120 amperios, calidad OEM.',
    price: 210.0,
    stock: 70,
    brand: brands[0], // Bosch
    category: categories[4], // Electrical
    imageUrls: ['https://picsum.photos/seed/alternator1/600/600'],
    isFeatured: false,
    specifications: {
      Amperaje: '120A',
      Voltaje: '12V',
      Compatibilidad: 'Mercedes-Benz C-Class W204',
      Marca: 'Bosch',
    },
    relatedPartIds: ['p010'],
  },
  {
    id: 'p010',
    name: 'Batería AGM 760 CCA',
    sku: 'EL-BT-010',
    description: 'Batería AGM (Absorbent Glass Mat) de alto rendimiento para vehículos con sistema Start-Stop.',
    price: 199.99,
    stock: 90,
    brand: brands[0], // Bosch
    category: categories[4], // Electrical
    imageUrls: ['https://picsum.photos/seed/battery1/600/600'],
    isFeatured: false,
    specifications: {
      Tipo: 'AGM',
      CCA: '760A',
      Capacidad: '70Ah',
      Compatibilidad: 'Varios modelos con Start-Stop',
    },
    relatedPartIds: ['p009', 'p004'],
  },
   {
    id: 'p011',
    name: 'Kit de Embrague',
    sku: 'EN-CL-011',
    description: 'Kit de embrague completo incluye disco, plato de presión y cojinete.',
    price: 240.0,
    stock: 55,
    brand: brands[5], // Valeo
    category: categories[0], // Engine
    imageUrls: ['https://picsum.photos/seed/clutch1/600/600'],
    isFeatured: false,
    specifications: {
      Componentes: 'Disco, Plato, Cojinete',
      Diámetro: '240 mm',
      Compatibilidad: 'Peugeot 308 1.6 HDi',
      Marca: 'Valeo',
    },
    relatedPartIds: ['p005'],
  },
  {
    id: 'p012',
    name: 'Juego de Amortiguadores Deportivos',
    sku: 'SU-SS-012',
    description: 'Juego de 4 amortiguadores deportivos para una mayor rigidez y mejor manejo.',
    price: 450.0,
    stock: 30,
    brand: brands[4], // Bilstein
    category: categories[1], // Suspension
    imageUrls: ['https://picsum.photos/seed/susp-kit/600/600'],
    isFeatured: false,
    specifications: {
      Tipo: 'Deportivo',
      Posición: 'Kit completo',
      Compatibilidad: 'Subaru Impreza WRX 2015+',
      Marca: 'Bilstein',
    },
    relatedPartIds: ['p002', 'p007', 'p001'],
  }
];

export function getParts(filters: {
  query?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}) {
  let filteredParts = [...parts];

  if (filters.query) {
    const lowerCaseQuery = filters.query.toLowerCase();
    filteredParts = filteredParts.filter(
      (part) =>
        part.name.toLowerCase().includes(lowerCaseQuery) ||
        part.sku.toLowerCase().includes(lowerCaseQuery) ||
        part.description.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (filters.brand) {
    filteredParts = filteredParts.filter((part) => part.brand.id === filters.brand);
  }

  if (filters.category) {
    filteredParts = filteredParts.filter((part) => part.category.id === filters.category);
  }
  
  if (filters.minPrice) {
    filteredParts = filteredParts.filter((part) => part.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    filteredParts = filteredParts.filter((part) => part.price <= filters.maxPrice);
  }

  return filteredParts;
}

export function getPartById(id: string): Part | undefined {
  return parts.find((part) => part.id === id);
}

export function getFeaturedParts(): Part[] {
  return parts.filter((part) => part.isFeatured);
}

export function getBrands(): Brand[] {
  return brands;
}

export function getCategories(): Category[] {
  return categories;
}

export function getRelatedParts(part: Part): Part[] {
    return parts.filter(p => part.relatedPartIds.includes(p.id) && p.id !== part.id);
}
