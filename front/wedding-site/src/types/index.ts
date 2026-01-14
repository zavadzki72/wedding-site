export interface Person {
  name: string;
  isAccepted: boolean | null;
  birthDate: string;
  cpf: string;
}

export interface Invite {
  id: string;
  familyName: string;
  celNumber: string;
  persons: string[];
  isResponded: boolean;
  inviteUrl: string;
  isSent: boolean;
}

export interface GuestPersonResponse {
  name: string;
  birthDate: string | null;
  cpf: string | null;
  isAccepted: boolean;
}

export interface GuestResponse {
  familyName: string;
  persons: GuestPersonResponse[];
}

export enum Category {
  ELETRODOMESTICO = 1,
  MOVEIS = 2,
  DECORACAO = 3,
  COZINHA = 4,
  CAMA_MESA_BANHO = 5,
  ELETRONICOS = 6,
  FERRAMENTAS = 7,
  LAZER = 8,
  OUTROS = 9,
}

export interface Product {
  id: string;
  name: string;
  photo: string;
  value: number;
  category: Category;
  isSold: boolean;
}

export interface CheckoutDto {
  name: string;
  message: string;
  products: string[];
}