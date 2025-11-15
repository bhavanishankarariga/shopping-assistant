import { Sparkles } from 'lucide-react';

interface SuggestionsProps {
  onSelect: (item: string) => void;
}

const suggestions = [
  { name: 'Organic Apples', category: 'Seasonal' },
  { name: 'Fresh Bread', category: 'Popular' },
  { name: 'Almond Milk', category: 'Alternative' },
  { name: 'Greek Yogurt', category: 'Healthy' },
  { name: 'Dark Chocolate', category: 'Snack' },
  { name: 'Olive Oil', category: 'Pantry' },
  { name: 'Avocados', category: 'Fresh' },
  { name: 'Chicken Breast', category: 'Protein' }
];

export function Suggestions({ onSelect }: SuggestionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-800">Smart Suggestions</h2>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion.name)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {suggestion.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">{suggestion.category}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold">Voice tip:</span> Try saying "Add 2 packets of biscuits" or "Remove eggs" to manage your list hands-free!
        </p>
      </div>
    </div>
  );
}
