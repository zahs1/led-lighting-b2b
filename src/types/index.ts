/**
 * Доменные типы данных лендинга.
 * Единственный источник правды для контента — src/data/mock.ts.
 */

export interface Category {
  id: string;
  title: string;
  description: string;
  powerRange: string;
  image: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  power: string;
  luminousFlux: string;
  ip: string;
  colorTemp: string;
  warranty: string;
  price: number;
  oldPrice: number;
  image: string;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  number: number;
  /** Ключ иконки lucide-react, см. iconMap в HowWeWork */
  icon: string;
}

export interface AudienceCard {
  title: string;
  description: string;
  features: string[];
  /** Ключ иконки lucide-react, см. iconMap в TargetAudience */
  icon: string;
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  /** Ключ иконки lucide-react, см. iconMap в WhyChooseUs */
  icon: string;
}
