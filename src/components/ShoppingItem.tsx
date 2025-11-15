import { Check, Trash2 } from 'lucide-react';
import { ShoppingItem as ShoppingItemType } from '../lib/supabase';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  icon: string;
}

export function ShoppingItem({ item, onToggle, onDelete, icon }: ShoppingItemProps) {
  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300
        ${item.is_completed
          ? 'bg-gray-50 border-gray-200 opacity-60'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${item.is_completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-blue-500'
          }
        `}
      >
        {item.is_completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`
            text-lg font-medium transition-all
            ${item.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}
          `}>
            {item.quantity > 1 && `${item.quantity} `}
            {item.unit !== 'item' && `${item.unit} `}
            {item.name}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
            {icon} {item.category}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
