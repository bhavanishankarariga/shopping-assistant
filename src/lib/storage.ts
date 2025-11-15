export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  keywords: string[];
  icon: string;
}

const ITEMS_KEY = 'shopping_items';
const CATEGORIES_KEY = 'item_categories';

const DEFAULT_CATEGORIES: ItemCategory[] = [
  { id: '1', name: 'dairy', keywords: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'curd'], icon: '🥛' },
  { id: '2', name: 'fruits', keywords: ['apple', 'banana', 'orange', 'grape', 'mango', 'berry', 'strawberry', 'watermelon', 'pineapple'], icon: '🍎' },
  { id: '3', name: 'vegetables', keywords: ['tomato', 'potato', 'onion', 'carrot', 'lettuce', 'spinach', 'broccoli', 'cucumber'], icon: '🥕' },
  { id: '4', name: 'snacks', keywords: ['chips', 'biscuit', 'cookie', 'chocolate', 'candy', 'popcorn', 'crackers'], icon: '🍪' },
  { id: '5', name: 'beverages', keywords: ['juice', 'soda', 'coffee', 'tea', 'water', 'drink'], icon: '☕' },
  { id: '6', name: 'meat', keywords: ['chicken', 'beef', 'pork', 'fish', 'meat', 'lamb'], icon: '🍗' },
  { id: '7', name: 'grains', keywords: ['rice', 'bread', 'pasta', 'cereal', 'flour', 'oats'], icon: '🌾' },
  { id: '8', name: 'other', keywords: [], icon: '🛒' }
];

export function initializeCategories(): ItemCategory[] {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

export function getItems(): ShoppingItem[] {
  const stored = localStorage.getItem(ITEMS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveItems(items: ShoppingItem[]): void {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function addItem(name: string, quantity: number, unit: string, category: string): ShoppingItem {
  const items = getItems();
  const newItem: ShoppingItem = {
    id: Date.now().toString(),
    name,
    quantity,
    unit,
    category,
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  items.unshift(newItem);
  saveItems(items);
  return newItem;
}

export function removeItem(id: string): void {
  const items = getItems();
  const filtered = items.filter(item => item.id !== id);
  saveItems(filtered);
}

export function updateItem(id: string, updates: Partial<ShoppingItem>): void {
  const items = getItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
    saveItems(items);
  }
}

export function clearAllItems(): void {
  localStorage.setItem(ITEMS_KEY, JSON.stringify([]));
}

export function getCategories(): ItemCategory[] {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
}
