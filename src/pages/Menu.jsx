import React, { useState } from 'react';

const MENU_CATEGORIES = [
  { id: 'taglieri', name: 'Taglieri a Km0' },
  { id: 'primi', name: 'Primi della Tradizione' },
  { id: 'cocktail', name: 'Cocktail & Lounge Bar' },
];

const MENU_ITEMS = [
  {
    id: 1,
    categoryId: 'taglieri',
    name: 'Gran Tagliere Faro Rosso',
    description: 'Selezione di salumi e formaggi della nostra Azienda Agricola, miele al tartufo e torta al testo.',
    price: 18,
  },
  {
    id: 2,
    categoryId: 'taglieri',
    name: 'Tagliere Vegetariano',
    description: 'Verdure grigliate dell\'orto, formaggi freschi, bruschette miste con olio EVO di nostra produzione.',
    price: 15,
  },
  {
    id: 3,
    categoryId: 'primi',
    name: 'Strangozzi al Tartufo',
    description: 'Pasta fresca fatta in casa con scaglie di tartufo nero estivo umbro.',
    price: 16,
  },
  {
    id: 4,
    categoryId: 'primi',
    name: 'Umbricelli alla Norcina',
    description: 'Salsiccia, panna fresca e un pizzico di noce moscata.',
    price: 14,
  },
  {
    id: 5,
    categoryId: 'cocktail',
    name: 'Faro Rosso Spritz',
    description: 'Rivisitazione dello spritz con bitter locale e prosecco millesimato.',
    price: 8,
  },
  {
    id: 6,
    categoryId: 'cocktail',
    name: 'Gin Tonic Umbro',
    description: 'Gin artigianale alle erbe spontanee con tonica premium e bacche di ginepro.',
    price: 10,
  }
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('taglieri');

  const filteredItems = MENU_ITEMS.filter(item => item.categoryId === activeCategory);

  return (
    <div className="min-h-[100dvh] bg-background pb-24 md:pb-12 pt-6 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <div className="text-center mb-8 md:mb-12 md:mt-8">
        <h1 className="text-3xl md:text-5xl font-serif text-textPrimary mb-2 md:mb-4">Il Nostro Menù</h1>
        <p className="text-gray-500 text-sm md:text-base px-4">Assapora i prodotti genuini della nostra terra, comodamente dal tuo lettino.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex md:justify-center overflow-x-auto hide-scrollbar gap-2 md:gap-4 mb-8 pb-2">
        {MENU_CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`whitespace-nowrap px-5 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-accent text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <h3 className="font-serif font-bold text-lg md:text-xl text-textPrimary">{item.name}</h3>
              <span className="font-semibold text-accent whitespace-nowrap ml-4 text-lg">€ {item.price.toFixed(2)}</span>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
