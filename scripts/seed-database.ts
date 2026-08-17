import { v4 as uuidv4 } from 'uuid';
import { db, initializeDatabase } from '../src/lib/database';
import { Product, Collection, KnowledgeDocument, Conversation, Message, Intent } from '../src/types';

const products: Product[] = [
  {
    id: 'prod-001',
    title: 'ColdStream Pro Regulator',
    type: 'Regulator',
    collection: 'regulators',
    description: 'Professional-grade cold-water regulator with excellent low-temperature performance',
    price: 599,
    availability: 'in-stock',
    specifications: {
      'Low Temperature Rating': '-10°C',
      'Breathing Resistance': 'Very Low',
      'Weight': '425g',
      'FirstStage Type': 'Balanced Diaphragm',
      'SecondStage': 'Cold-Water Optimized'
    },
    tags: ['cold-water', 'professional', 'technical', 'premium'],
    useCases: ['cold-water diving', 'technical diving', 'deep diving'],
    relatedProducts: ['prod-002', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-002',
    title: 'OceanFlex 5mm Wetsuit',
    type: 'Wetsuit',
    collection: 'wetsuits',
    description: '5mm premium neoprene wetsuit for tropical and temperate waters',
    price: 189,
    availability: 'in-stock',
    specifications: {
      'Thickness': '5mm',
      'Temperature Range': '15-22°C',
      'Material': 'Premium Neoprene',
      'Seam Technology': 'Blindstitched',
      'Weight Range': 'XS-XXL'
    },
    tags: ['temperate', 'tropical', 'versatile', 'entry-level'],
    useCases: ['temperate diving', 'tropical diving', 'recreational'],
    relatedProducts: ['prod-001', 'prod-004'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-003',
    title: 'AeroLite Travel BCD',
    type: 'BCD',
    collection: 'bcds',
    description: 'Lightweight travel BCD with exceptional portability and functionality',
    price: 449,
    availability: 'in-stock',
    specifications: {
      'Weight Capacity': '27kg',
      'Travel Friendly': 'Yes',
      'Dry Weight': '2.8kg',
      'Material': 'Cordura 1000D',
      'Pockets': 'Multiple'
    },
    tags: ['travel', 'lightweight', 'portable', 'recreational'],
    useCases: ['travel diving', 'recreational', 'warm water'],
    relatedProducts: ['prod-001', 'prod-002'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-004',
    title: 'ArcticSeal 7mm Wetsuit',
    type: 'Wetsuit',
    collection: 'wetsuits',
    description: 'Heavy-duty 7mm wetsuit for cold water and technical diving',
    price: 259,
    availability: 'in-stock',
    specifications: {
      'Thickness': '7mm',
      'Temperature Range': '2-12°C',
      'Material': 'Premium Compressed Neoprene',
      'Seam Technology': 'Taped Seams',
      'Warmth Rating': 'Maximum'
    },
    tags: ['cold-water', 'technical', 'premium', 'durable'],
    useCases: ['cold-water diving', 'technical diving', 'extended bottom time'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-005',
    title: 'DeepView Ultra Mask',
    type: 'Mask',
    collection: 'masks',
    description: 'Wide-view diving mask with tempered glass and silicone skirt',
    price: 89,
    availability: 'in-stock',
    specifications: {
      'Field of View': 'Ultra Wide',
      'Lens Type': 'Tempered Glass',
      'Skirt Material': 'Premium Silicone',
      'Fit Range': 'Narrow to Wide',
      'Anti-Fog': 'Yes'
    },
    tags: ['mask', 'visibility', 'comfort', 'entry-level'],
    useCases: ['recreational diving', 'general diving', 'snorkeling'],
    relatedProducts: ['prod-006', 'prod-007'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-006',
    title: 'CurrentFlow Fins',
    type: 'Fins',
    collection: 'fins',
    description: 'High-performance split-blade fins for efficient propulsion',
    price: 129,
    availability: 'in-stock',
    specifications: {
      'Blade Type': 'Split-Blade',
      'Material': 'Fiberglass Composite',
      'Sizes': 'XS-XL',
      'Foot Pocket': 'Anatomical',
      'Efficiency': 'High'
    },
    tags: ['fins', 'performance', 'technical', 'recreational'],
    useCases: ['recreational diving', 'technical diving', 'speed diving'],
    relatedProducts: ['prod-005', 'prod-008'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-007',
    title: 'Explorer 15L BCD',
    type: 'BCD',
    collection: 'bcds',
    description: 'Versatile 15L BCD suitable for recreational and technical diving',
    price: 389,
    availability: 'in-stock',
    specifications: {
      'Weight Capacity': '35kg',
      'Buoyancy': '15L',
      'Material': 'Cordura 500D',
      'Integrated Weight': 'Yes',
      'D-Rings': '6'
    },
    tags: ['versatile', 'recreational', 'technical', 'durable'],
    useCases: ['recreational diving', 'technical training', 'deep diving'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-008',
    title: 'ReefGuard Dive Computer',
    type: 'Dive Computer',
    collection: 'computers',
    description: 'Advanced wrist-mounted dive computer with wireless air integration',
    price: 749,
    availability: 'in-stock',
    specifications: {
      'Display': 'OLED Color',
      'Wireless': 'Yes',
      'Gauges': 'SPG + Tank Monitor',
      'Algorithms': 'RGBM',
      'Depth Rating': '200m'
    },
    tags: ['computer', 'advanced', 'technical', 'premium'],
    useCases: ['technical diving', 'deep diving', 'professional'],
    relatedProducts: ['prod-001', 'prod-004'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-009',
    title: 'Voyager Dive Bag',
    type: 'Bag',
    collection: 'accessories',
    description: 'Heavy-duty roller bag designed for travel with dive gear',
    price: 199,
    availability: 'in-stock',
    specifications: {
      'Capacity': '120L',
      'Material': 'Ballistic Nylon',
      'Wheels': 'Yes',
      'TSA Friendly': 'No',
      'Compartments': 'Multiple'
    },
    tags: ['travel', 'bag', 'organization', 'durable'],
    useCases: ['travel diving', 'gear storage', 'transport'],
    relatedProducts: ['prod-003', 'prod-001'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-010',
    title: 'Titan SPG Pressure Gauge',
    type: 'Gauge',
    collection: 'instruments',
    description: 'High-precision SPG with enhanced readability',
    price: 79,
    availability: 'in-stock',
    specifications: {
      'Range': '0-350 bar',
      'Accuracy': '±2%',
      'Dial Size': '63mm',
      'Material': 'Stainless Steel',
      'Depth': 'Primary/Backup'
    },
    tags: ['gauge', 'safety', 'precision', 'entry-level'],
    useCases: ['all diving types', 'backup instrument', 'training'],
    relatedProducts: ['prod-001', 'prod-008'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-011',
    title: 'ProTech Underwater Light',
    type: 'Lighting',
    collection: 'instruments',
    description: 'Powerful LED dive light for night and deep diving',
    price: 259,
    availability: 'in-stock',
    specifications: {
      'Lumens': '3000',
      'Battery Life': '8 hours',
      'Depth Rating': '200m',
      'Material': 'Aluminum',
      'Rechargeable': 'Yes'
    },
    tags: ['light', 'technical', 'night-diving', 'deep-diving'],
    useCases: ['night diving', 'deep diving', 'cave diving'],
    relatedProducts: ['prod-001', 'prod-008'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-012',
    title: 'SafetyFirst Training Knife',
    type: 'Tool',
    collection: 'accessories',
    description: 'Compact dive knife for emergency situations',
    price: 45,
    availability: 'in-stock',
    specifications: {
      'Blade Length': '8cm',
      'Material': 'Stainless Steel',
      'Sheath': 'Included',
      'Serrated Edge': 'Yes',
      'Weight': '120g'
    },
    tags: ['safety', 'tool', 'equipment', 'essential'],
    useCases: ['emergency equipment', 'backup tool', 'technical diving'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-013',
    title: 'WarmGear Thermal Gloves',
    type: 'Gloves',
    collection: 'wetsuits',
    description: '5mm neoprene gloves for cold water diving',
    price: 49,
    availability: 'in-stock',
    specifications: {
      'Thickness': '5mm',
      'Temperature': '2-12°C',
      'Material': 'Neoprene',
      'Dexterity': 'High',
      'Sizes': 'XS-XL'
    },
    tags: ['gloves', 'cold-water', 'warmth', 'comfort'],
    useCases: ['cold-water diving', 'winter diving', 'deep diving'],
    relatedProducts: ['prod-004', 'prod-002'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-014',
    title: 'Backplate HD Steel',
    type: 'BCD',
    collection: 'bcds',
    description: 'Technical diving backplate system for advanced divers',
    price: 329,
    availability: 'in-stock',
    specifications: {
      'Material': 'Stainless Steel',
      'Load Capacity': '50kg',
      'Height': 'Adjustable',
      'Weight Pocket': 'Integrated',
      'Tech Diving': 'Yes'
    },
    tags: ['technical', 'advanced', 'backplate', 'custom'],
    useCases: ['technical diving', 'cave diving', 'deep diving'],
    relatedProducts: ['prod-001', 'prod-008'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-015',
    title: 'DoubleHose Classic Regulator',
    type: 'Regulator',
    collection: 'regulators',
    description: 'Vintage-style double-hose regulator for specialty diving',
    price: 449,
    availability: 'low-stock',
    specifications: {
      'Type': 'Double Hose',
      'Temperature': 'Moderate',
      'Breathing': 'Balanced',
      'Vintage Style': 'Yes',
      'Collectors Item': 'No'
    },
    tags: ['vintage', 'specialty', 'recreational', 'historical'],
    useCases: ['recreational diving', 'vintage diving', 'specialty'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-016',
    title: 'StreamlineX Fins',
    type: 'Fins',
    collection: 'fins',
    description: 'Streamlined rigid-blade fins for technical diving',
    price: 179,
    availability: 'in-stock',
    specifications: {
      'Blade Type': 'Rigid',
      'Material': 'Carbon Fiber',
      'Efficiency': 'Maximum',
      'Speed': 'High',
      'Sizes': 'XS-XL'
    },
    tags: ['fins', 'technical', 'performance', 'premium'],
    useCases: ['technical diving', 'speed diving', 'efficiency'],
    relatedProducts: ['prod-006', 'prod-001'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-017',
    title: 'ThermoMax Hood',
    type: 'Wetsuit',
    collection: 'wetsuits',
    description: 'Insulated hood for maximum head warmth in cold water',
    price: 69,
    availability: 'in-stock',
    specifications: {
      'Thickness': '7mm',
      'Warmth Rating': 'High',
      'Coverage': 'Full Head',
      'Material': 'Neoprene',
      'Comfort': 'Premium'
    },
    tags: ['hood', 'cold-water', 'warmth', 'comfort'],
    useCases: ['cold-water diving', 'winter diving', 'technical diving'],
    relatedProducts: ['prod-004', 'prod-013'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-018',
    title: 'DepthLock Weightbelt',
    type: 'Weights',
    collection: 'accessories',
    description: 'Adjustable weight belt with quick-release buckle',
    price: 59,
    availability: 'in-stock',
    specifications: {
      'Max Capacity': '20kg',
      'Release Type': 'Quick-Release',
      'Material': 'Nylon',
      'Adjustment': 'Tool-Free',
      'Comfort': 'High'
    },
    tags: ['weights', 'safety', 'adjustable', 'essential'],
    useCases: ['all diving types', 'weight system', 'recreational'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-019',
    title: 'VisionPro Lens Insert',
    type: 'Mask',
    collection: 'masks',
    description: 'Prescription lens insert for diving masks',
    price: 129,
    availability: 'in-stock',
    specifications: {
      'Power Range': '±8D',
      'Material': 'Optical Glass',
      'Installation': 'Quick Change',
      'Compatibility': 'Most Masks',
      'Durability': 'High'
    },
    tags: ['mask', 'vision', 'prescription', 'accessibility'],
    useCases: ['recreational diving', 'accessibility', 'comfort'],
    relatedProducts: ['prod-005', 'prod-001'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-020',
    title: 'FlexiFit Booties',
    type: 'Boots',
    collection: 'wetsuits',
    description: '5mm neoprene booties for warmth and fin compatibility',
    price: 59,
    availability: 'in-stock',
    specifications: {
      'Thickness': '5mm',
      'Temperature': 'Moderate',
      'Material': 'Neoprene',
      'Heel Protection': 'Yes',
      'Sizes': 'XS-XL'
    },
    tags: ['booties', 'warmth', 'comfort', 'essential'],
    useCases: ['all diving types', 'warmth', 'protection'],
    relatedProducts: ['prod-002', 'prod-004'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Add more products to reach 30+
const additionalProducts: Product[] = [
  {
    id: 'prod-021',
    title: 'TechMaster Sidemount',
    type: 'BCD',
    collection: 'bcds',
    description: 'Professional sidemount harness system for technical diving',
    price: 399,
    availability: 'in-stock',
    specifications: { 'Configuration': 'Sidemount', 'Material': 'Stainless Steel', 'Capacity': 'Dual Tanks', 'Tech Ready': 'Yes' },
    tags: ['technical', 'sidemount', 'advanced'],
    useCases: ['cave diving', 'wreck diving', 'technical'],
    relatedProducts: ['prod-001', 'prod-014'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-022',
    title: 'NitroxPro Analyzer',
    type: 'Safety',
    collection: 'instruments',
    description: 'Oxygen analyzer for nitrox diving safety',
    price: 89,
    availability: 'in-stock',
    specifications: { 'Accuracy': '±0.1%', 'Range': '21-100%', 'Material': 'Stainless Steel', 'Portable': 'Yes' },
    tags: ['nitrox', 'safety', 'technical'],
    useCases: ['technical diving', 'nitrox diving', 'deep diving'],
    relatedProducts: ['prod-001', 'prod-008'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-023',
    title: 'LogbookPro Waterproof',
    type: 'Accessories',
    collection: 'accessories',
    description: 'Waterproof dive logbook with detailed tracking',
    price: 39,
    availability: 'in-stock',
    specifications: { 'Pages': '100', 'Waterproof': 'Yes', 'Size': 'A5', 'Binding': 'Spiral' },
    tags: ['logbook', 'record-keeping', 'essential'],
    useCases: ['dive certification', 'tracking', 'record-keeping'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-024',
    title: 'TravelCase Pro',
    type: 'Bag',
    collection: 'accessories',
    description: 'Hardshell protective case for dive equipment',
    price: 249,
    availability: 'in-stock',
    specifications: { 'Capacity': '90L', 'Material': 'ABS Plastic', 'Wheels': 'Yes', 'TSA Lock': 'Yes' },
    tags: ['bag', 'travel', 'protection'],
    useCases: ['travel diving', 'gear protection', 'transport'],
    relatedProducts: ['prod-009', 'prod-001'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-025',
    title: 'ReefSafe Sunscreen',
    type: 'Accessories',
    collection: 'accessories',
    description: 'Reef-safe sunscreen SPF 50 for divers',
    price: 22,
    availability: 'in-stock',
    specifications: { 'SPF': '50', 'Reef Safe': 'Yes', 'Volume': '200ml', 'Waterproof': '2hr' },
    tags: ['sunscreen', 'eco-friendly', 'essential'],
    useCases: ['sun protection', 'reef protection', 'pre-dive'],
    relatedProducts: ['prod-001', 'prod-002'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-026',
    title: 'NeutralPro Buoyancy Bag',
    type: 'BCD',
    collection: 'bcds',
    description: 'High-precision buoyancy compensation device',
    price: 169,
    availability: 'in-stock',
    specifications: { 'Capacity': '18L', 'Precision': 'High', 'Material': 'Rugged Nylon', 'Dump Valves': '2' },
    tags: ['buoyancy', 'technical', 'precision'],
    useCases: ['technical diving', 'training', 'advanced'],
    relatedProducts: ['prod-007', 'prod-014'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-027',
    title: 'CinematicCamera Mount',
    type: 'Accessories',
    collection: 'accessories',
    description: 'Universal camera mount system for underwater filming',
    price: 89,
    availability: 'in-stock',
    specifications: { 'Compatibility': 'Universal', 'Material': 'Aluminum', 'Weight': '250g', 'Adjustable': 'Yes' },
    tags: ['camera', 'filming', 'documentation'],
    useCases: ['underwater photography', 'videography', 'documentation'],
    relatedProducts: ['prod-001', 'prod-003'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-028',
    title: 'MeshBag Gear Storage',
    type: 'Bag',
    collection: 'accessories',
    description: 'Breathable mesh gear storage bag for equipment drying',
    price: 29,
    availability: 'in-stock',
    specifications: { 'Capacity': '60L', 'Material': 'Mesh Nylon', 'Washable': 'Yes', 'Breathable': 'Yes' },
    tags: ['bag', 'storage', 'maintenance'],
    useCases: ['gear storage', 'drying', 'organization'],
    relatedProducts: ['prod-009', 'prod-024'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-029',
    title: 'SafetyLine Reel',
    type: 'Accessories',
    collection: 'instruments',
    description: 'High-capacity safety reel for cave diving',
    price: 199,
    availability: 'in-stock',
    specifications: { 'Capacity': '200m', 'Material': 'Stainless Steel', 'Reel Type': 'Trigger', 'Weight': '400g' },
    tags: ['safety', 'technical', 'cave-diving'],
    useCases: ['cave diving', 'wreck diving', 'technical'],
    relatedProducts: ['prod-001', 'prod-021'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-030',
    title: 'TorchPro LED Backup',
    type: 'Lighting',
    collection: 'instruments',
    description: 'Compact LED backup light for secondary illumination',
    price: 49,
    availability: 'in-stock',
    specifications: { 'Lumens': '500', 'Battery': 'AAA', 'Depth': '100m', 'Weight': '80g' },
    tags: ['light', 'backup', 'essential'],
    useCases: ['backup lighting', 'emergency', 'recreational'],
    relatedProducts: ['prod-011', 'prod-001'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const allProducts = [...products, ...additionalProducts];

const collections: Collection[] = [
  {
    id: 'col-001',
    name: 'Regulators',
    description: 'Professional-grade regulators for all diving conditions',
    products: ['prod-001', 'prod-015']
  },
  {
    id: 'col-002',
    name: 'Wetsuits',
    description: 'Premium wetsuits for warmth and protection',
    products: ['prod-002', 'prod-004', 'prod-013', 'prod-017', 'prod-020']
  },
  {
    id: 'col-003',
    name: 'BCDs',
    description: 'Buoyancy compensation devices for all diving styles',
    products: ['prod-003', 'prod-007', 'prod-014', 'prod-021', 'prod-026']
  },
  {
    id: 'col-004',
    name: 'Masks & Vision',
    description: 'Diving masks and vision correction systems',
    products: ['prod-005', 'prod-019']
  },
  {
    id: 'col-005',
    name: 'Fins',
    description: 'High-performance fin systems for efficient propulsion',
    products: ['prod-006', 'prod-016']
  },
  {
    id: 'col-006',
    name: 'Instruments',
    description: 'Dive computers, gauges, and monitoring equipment',
    products: ['prod-008', 'prod-010', 'prod-011', 'prod-022', 'prod-030']
  },
  {
    id: 'col-007',
    name: 'Travel Gear',
    description: 'Portable equipment for diving on the go',
    products: ['prod-003', 'prod-009', 'prod-024']
  },
  {
    id: 'col-008',
    name: 'Accessories',
    description: 'Essential and specialty dive accessories',
    products: ['prod-012', 'prod-018', 'prod-023', 'prod-025', 'prod-027', 'prod-028', 'prod-029']
  }
];

const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'know-001',
    title: 'Cold Water Regulator Selection Guide',
    type: 'guide',
    content: 'Choosing the right regulator for cold water diving is critical for safety and comfort. Look for regulators specifically designed for low-temperature performance. Cold-water regulators have anti-freeze mechanisms and balanced first stages to maintain consistent performance. The ColdStream Pro is an excellent choice for cold water diving below 10°C.',
    source: 'Cold Water Safety Guide',
    tags: ['cold-water', 'regulator', 'safety', 'selection'],
    productAssociation: ['prod-001'],
    authorityLevel: 'approved',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-002',
    title: 'Wetsuit Sizing Chart',
    type: 'guide',
    content: 'Proper wetsuit sizing ensures comfort and thermal protection. Measure your height, weight, and chest circumference. A wetsuit should fit snugly without restricting movement. Use our size chart to find your perfect fit. Most divers prefer 5mm for temperate waters and 7mm for cold water.',
    source: 'Apparel Sizing Guide',
    tags: ['wetsuit', 'sizing', 'comfort', 'selection'],
    productAssociation: ['prod-002', 'prod-004'],
    authorityLevel: 'official',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-003',
    title: 'Travel BCD Selection',
    type: 'guide',
    content: 'When selecting a BCD for travel, prioritize lightweight design and durability. Travel BCDs typically weigh 2-3kg and pack down to a manageable size. They offer sufficient buoyancy for recreational diving while remaining portable. The AeroLite is specifically designed for travel divers.',
    source: 'Travel Diving Guide',
    tags: ['travel', 'bcd', 'portable', 'selection'],
    productAssociation: ['prod-003'],
    authorityLevel: 'approved',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-004',
    title: 'Shipping and International Orders',
    type: 'faq',
    content: 'We ship worldwide via DHL and FedEx. Domestic orders ship within 2 business days. International orders typically arrive within 5-10 business days. Shipping costs vary by location. We offer free shipping on orders over $500. All shipments include tracking.',
    source: 'Customer Service Policy',
    tags: ['shipping', 'orders', 'international', 'delivery'],
    productAssociation: [],
    authorityLevel: 'official',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-005',
    title: 'Return and Warranty Policy',
    type: 'faq',
    content: 'We offer a 30-day money-back guarantee on all products. Returns are free within 30 days of purchase. All equipment comes with a 2-year manufacturer warranty. Warranty covers manufacturing defects but not normal wear or misuse. Contact our support team for warranty claims.',
    source: 'Customer Service Policy',
    tags: ['returns', 'warranty', 'guarantee', 'support'],
    productAssociation: [],
    authorityLevel: 'official',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-006',
    title: 'Beginner Regulator Guide',
    type: 'guide',
    content: 'Beginners should choose regulators with excellent breathing comfort and reliability. Look for mid-range models that balance performance with affordability. Entry-level regulators work well in warm to moderate water. As you progress, you may choose specialized regulators for cold water or technical diving.',
    source: 'Training Materials',
    tags: ['beginner', 'regulator', 'training', 'selection'],
    productAssociation: ['prod-001'],
    authorityLevel: 'approved',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-007',
    title: 'Product Compatibility Guide',
    type: 'education',
    content: 'All regulators in our catalog are compatible with standard first stage connections. BCDs accept standard weight pockets. Fins fit most standard foot pockets. When in doubt, check product specifications or contact our technical support team. Most equipment is modular and compatible across brands.',
    source: 'Technical Specifications',
    tags: ['compatibility', 'technical', 'equipment', 'standards'],
    productAssociation: [],
    authorityLevel: 'official',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'know-008',
    title: 'Cold Water Diving Safety',
    type: 'education',
    content: 'Cold water diving requires proper equipment and training. Use a 7mm+ wetsuit, cold-water regulator, and hood. Avoid nitrogen narcosis by limiting depth. Plan shorter bottom times in cold water. Always dive with a trained buddy. Cold water increases physical stress on the body.',
    source: 'Safety Training',
    tags: ['cold-water', 'safety', 'training', 'technique'],
    productAssociation: ['prod-001', 'prod-004'],
    authorityLevel: 'approved',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function seedDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Insert products
      const productStmt = db.prepare(`
        INSERT INTO products (id, title, type, collection, description, price, image, availability, specifications, tags, compatibility, weight, useCases, relatedProducts, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      allProducts.forEach(product => {
        productStmt.run(
          product.id,
          product.title,
          product.type,
          product.collection,
          product.description,
          product.price,
          product.image,
          product.availability,
          JSON.stringify(product.specifications),
          JSON.stringify(product.tags),
          JSON.stringify(product.compatibility || []),
          product.weight,
          JSON.stringify(product.useCases),
          JSON.stringify(product.relatedProducts || []),
          product.createdAt,
          product.updatedAt
        );
      });
      productStmt.finalize();

      // Insert collections
      const collectionStmt = db.prepare(`
        INSERT INTO collections (id, name, description, products, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `);

      collections.forEach(collection => {
        collectionStmt.run(
          collection.id,
          collection.name,
          collection.description,
          JSON.stringify(collection.products),
          new Date()
        );
      });
      collectionStmt.finalize();

      // Insert knowledge documents
      const knowledgeStmt = db.prepare(`
        INSERT INTO knowledgeDocuments (id, title, type, content, source, tags, productAssociation, authorityLevel, status, updatedAt, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      knowledgeDocuments.forEach(doc => {
        knowledgeStmt.run(
          doc.id,
          doc.title,
          doc.type,
          doc.content,
          doc.source,
          JSON.stringify(doc.tags),
          JSON.stringify(doc.productAssociation),
          doc.authorityLevel,
          doc.status,
          doc.updatedAt,
          doc.createdAt
        );
      });
      knowledgeStmt.finalize();

      // Insert agent settings
      db.run(`
        INSERT INTO agentSettings (id, storeName, agentName, agentGreeting, knowledgeBaseEnabled, escalationEnabled, productRecommendationEnabled, confidenceThreshold, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'settings-001',
        'AQUA DIVE CO',
        'Aqua Guide',
        'Hi, I\'m Aqua Guide. I can help you choose dive gear, compare products, and answer questions about our equipment.',
        1,
        1,
        1,
        0.6,
        new Date(),
        new Date()
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

async function main() {
  try {
    await initializeDatabase();
    console.log('Database initialized');
    await seedDatabase();
    console.log('Database seeded with products, collections, and knowledge documents');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
