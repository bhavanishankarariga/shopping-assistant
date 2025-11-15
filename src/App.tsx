import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Search, Trash2, AlertCircle } from 'lucide-react';
import { ShoppingItem, ItemCategory } from './lib/supabase';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { processVoiceCommand, categorizeItem } from './utils/commandProcessor';
import { VoiceButton } from './components/VoiceButton';
import { ShoppingItem as ShoppingItemComponent } from './components/ShoppingItem';
import { Suggestions } from './components/Suggestions';
import {
  getItems,
  saveItems,
  getCategories,
  initializeCategories,
  addItem as addItemToStorage,
  removeItem as removeItemFromStorage,
  updateItem as updateItemInStorage,
  clearAllItems as clearAllItemsFromStorage
} from './lib/storage';

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const loadCategories = useCallback(() => {
    const cats = initializeCategories();
    setCategories(cats);
  }, []);

  const loadItems = useCallback(() => {
    setLoading(true);
    const storedItems = getItems();
    setItems(storedItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
    loadItems();
  }, [loadCategories, loadItems]);

  const addItem = (name: string, quantity: number, unit: string) => {
    const category = categorizeItem(name, categories);
    addItemToStorage(name, quantity, unit, category);
    loadItems();
    showNotification(`Added ${quantity} ${unit} of ${name}`);
  };

  const removeItem = (name: string) => {
    const item = items.find(i => i.name.toLowerCase().includes(name.toLowerCase()));

    if (item) {
      removeItemFromStorage(item.id);
      loadItems();
      showNotification(`Removed ${item.name}`);
    } else {
      showNotification('Item not found');
    }
  };

  const toggleItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    updateItemInStorage(id, { is_completed: !item.is_completed });
    loadItems();
  };

  const deleteItem = (id: string) => {
    removeItemFromStorage(id);
    loadItems();
    showNotification('Item deleted');
  };

  const clearAllItems = () => {
    clearAllItemsFromStorage();
    loadItems();
    showNotification('All items cleared');
  };

  const handleVoiceCommand = useCallback((result: { transcript: string }) => {
    const command = processVoiceCommand(result.transcript);
    setLastCommand(result.transcript);

    switch (command.action) {
      case 'add':
        if (command.item) {
          addItem(command.item, command.quantity || 1, command.unit || 'item');
        }
        break;
      case 'remove':
        if (command.item) {
          removeItem(command.item);
        }
        break;
      case 'search':
        if (command.searchQuery) {
          setSearchQuery(command.searchQuery);
          showNotification(`Searching for: ${command.searchQuery}`);
        }
        break;
      case 'clear':
        clearAllItems();
        break;
      case 'check':
        if (command.item) {
          const item = items.find(i => i.name.toLowerCase().includes(command.item!.toLowerCase()));
          if (item) toggleItem(item.id);
        }
        break;
      case 'uncheck':
        if (command.item) {
          const item = items.find(i => i.name.toLowerCase().includes(command.item!.toLowerCase()));
          if (item) toggleItem(item.id);
        }
        break;
      default:
        showNotification('Command not recognized');
    }
  }, [items, categories]);

  const { isListening, startListening, stopListening, isSupported, error } = useVoiceRecognition(handleVoiceCommand);

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || '🛒';
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const handleSuggestionSelect = (suggestionName: string) => {
    addItem(suggestionName, 1, 'item');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingBag className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Voice Shopping Assistant</h1>
          </div>
          <p className="text-gray-600">Manage your shopping list with voice commands</p>
        </header>

        {!isSupported && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col items-center gap-6">
                <VoiceButton
                  isListening={isListening}
                  onClick={handleVoiceButtonClick}
                  disabled={!isSupported}
                />

                <div className="text-center">
                  {isListening ? (
                    <p className="text-lg font-medium text-red-500 animate-pulse">
                      Listening...
                    </p>
                  ) : (
                    <p className="text-lg text-gray-600">
                      Tap to speak
                    </p>
                  )}
                </div>

                {lastCommand && (
                  <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Last command:</p>
                    <p className="text-lg font-medium text-blue-700">"{lastCommand}"</p>
                  </div>
                )}

                {notification && (
                  <div className="w-full p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                    <p className="text-center text-green-700 font-medium">{notification}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
                <div className="flex gap-2">
                  <button
                    onClick={clearAllItems}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading items...</div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your shopping list is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Say "Add milk" to get started!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {getCategoryIcon(category)} {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryItems.map((item) => (
                          <ShoppingItemComponent
                            key={item.id}
                            item={item}
                            onToggle={toggleItem}
                            onDelete={deleteItem}
                            icon={getCategoryIcon(item.category)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total items: {items.length}</span>
                  <span>Completed: {items.filter(i => i.is_completed).length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Suggestions onSelect={handleSuggestionSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
