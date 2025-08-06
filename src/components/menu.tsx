// import React, { useState } from 'react';
// import { menuData, MenuItem } from '../utils/menu-data';

// const MenuFilter: React.FC = () => {
//     const [selectedCategory, setSelectedCategory] = useState<string>('All');

//     const renderItems = (items: MenuItem[], subcategory?: string) => (
//       <div className="mb-6">
//         {subcategory && <h3 className="text-xl font-bold mb-3 text-gray-800">{subcategory}</h3>}
//         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {items.map((item, index) => {
//             const actualPrice = typeof item.price === 'number' ? item.price : Array.isArray(item.price) ? item.price[0] : 0;
//             const offerPrice = actualPrice > 0 ? Math.round(actualPrice * 1.1) : 0;

//             return (
//               <li key={index} className="flex gap-6 bg-white rounded-xl shadow-lg hover:shadow-xl p-5">
//                 <img
//                   src="https://images.unsplash.com/photo-1604908177063-e8703f1794a3?auto=format&fit=crop&w=400&q=80"
//                   alt={item.name}
//                   className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-cover border"
//                 />
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start mb-1">
//                     <div>
//                       <h4 className="text-lg sm:text-xl font-semibold text-gray-900">{item.name}</h4>
//                       {item.name_mr && <p className="text-md text-yellow-700 font-medium">{item.name_mr}</p>}
//                     </div>
//                     <div className="text-right">
//                       <p className="text-red-500 font-semibold text-sm line-through">
//                         ₹{Array.isArray(item.price) ? item.price.map(p => p + 10).join(' / ₹') : offerPrice}
//                       </p>
//                       <p className="text-green-600 font-bold text-lg">
//                         {Array.isArray(item.price)
//                           ? `₹${item.price.join(' / ₹')}`
//                           : item.price === null
//                           ? 'N/A'
//                           : `₹${item.price}`}
//                       </p>
//                     </div>
//                   </div>
//                   {(item.details || item.details_mr) && (
//                     <div className="mt-1">
//                       {item.details && <p className="text-sm text-gray-700 font-medium">{item.details}</p>}
//                       {item.details_mr && <p className="text-sm text-gray-500 italic">{item.details_mr}</p>}
//                     </div>
//                   )}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );

//     const filteredCategories = Object.entries(menuData).filter(
//       ([category]) => selectedCategory === 'All' || selectedCategory === category
//     );

//     return (
//       <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
//         <div className="text-center mb-6">
//           <h2 className="text-4xl font-bold text-yellow-700">Our Delicious Menu</h2>
//           <p className="text-lg text-rose-600 font-semibold mt-2 italic">
//             येथे तुम्हाला मेहुणीपेक्षा तिखट आणि बायकोपेक्षा झणझणीत चिकन मटण मिळेल!
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-3 justify-center mb-8">
//           <button
//             onClick={() => setSelectedCategory('All')}
//             className={`px-5 py-2 rounded-full shadow text-sm font-semibold transition ${
//               selectedCategory === 'All'
//                 ? 'bg-yellow-500 text-white'
//                 : 'bg-white border border-yellow-400 text-yellow-500'
//             }`}
//           >
//             All
//           </button>
//           {Object.keys(menuData).map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-5 py-2 rounded-full shadow text-sm font-semibold transition ${
//                 selectedCategory === category
//                   ? 'bg-yellow-500 text-white'
//                   : 'bg-white border border-yellow-400 text-yellow-500'
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {filteredCategories.map(([category, data]) => (
//           <div key={category} className="mb-10">
//             <h2 className="text-2xl font-bold text-yellow-600 mb-4 border-b pb-1 border-yellow-300">{category}</h2>
//             {Array.isArray(data)
//               ? renderItems(data)
//               : Object.entries(data).map(([sub, items]) => renderItems(items, sub))}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   export default MenuFilter;
