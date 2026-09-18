export interface Product {
  id: string;
  title: string;
  category: string;
  color?: string;
  size?: string;
  stockQuantity: number;
  costPrice: number;
  sellingPrice: number;
  image?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  title: string;
  variantInfo?: string;
  quantity: number;
  sellingPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  comment?: string;
  date: string;
}

export type ExpenseCategory = 
  | 'Оренда'
  | 'Закупівля товару'
  | 'Реклама'
  | 'Доставка'
  | 'Інше';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}