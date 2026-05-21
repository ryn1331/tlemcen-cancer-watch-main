/**
 * Algeria 58 wilayas — center coordinates and approximate boundaries
 * Used for choropleth rendering and spatial analysis
 */

export interface WilayaData {
  code: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  population2023: number;
}

export const ALGERIA_WILAYAS: WilayaData[] = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار', lat: 27.87, lng: -0.29, population2023: 476460 },
  { code: '02', name: 'Chlef', nameAr: 'الشلف', lat: 36.17, lng: 1.33, population2023: 1210688 },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط', lat: 33.80, lng: 2.88, population2023: 625858 },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي', lat: 35.87, lng: 7.11, population2023: 727603 },
  { code: '05', name: 'Batna', nameAr: 'باتنة', lat: 35.56, lng: 6.17, population2023: 1311407 },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية', lat: 36.75, lng: 5.08, population2023: 1005157 },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة', lat: 34.85, lng: 5.73, population2023: 880152 },
  { code: '08', name: 'Béchar', nameAr: 'بشار', lat: 31.62, lng: -2.22, population2023: 314847 },
  { code: '09', name: 'Blida', nameAr: 'البليدة', lat: 36.47, lng: 2.83, population2023: 1195570 },
  { code: '10', name: 'Bouira', nameAr: 'البويرة', lat: 36.37, lng: 3.90, population2023: 770547 },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست', lat: 22.79, lng: 5.53, population2023: 220696 },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة', lat: 35.40, lng: 8.12, population2023: 738427 },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان', lat: 34.88, lng: -1.32, population2023: 1050000 },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت', lat: 35.37, lng: 1.32, population2023: 960428 },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو', lat: 36.71, lng: 4.05, population2023: 1212842 },
  { code: '16', name: 'Alger', nameAr: 'الجزائر', lat: 36.75, lng: 3.06, population2023: 3915811 },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة', lat: 34.67, lng: 3.25, population2023: 1456766 },
  { code: '18', name: 'Jijel', nameAr: 'جيجل', lat: 36.82, lng: 5.77, population2023: 757506 },
  { code: '19', name: 'Sétif', nameAr: 'سطيف', lat: 36.19, lng: 5.41, population2023: 1741260 },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة', lat: 34.83, lng: 0.15, population2023: 403447 },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة', lat: 36.88, lng: 6.91, population2023: 1013074 },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', lat: 35.19, lng: -0.63, population2023: 680332 },
  { code: '23', name: 'Annaba', nameAr: 'عنابة', lat: 36.90, lng: 7.77, population2023: 687858 },
  { code: '24', name: 'Guelma', nameAr: 'قالمة', lat: 36.46, lng: 7.43, population2023: 530852 },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة', lat: 36.37, lng: 6.61, population2023: 1043585 },
  { code: '26', name: 'Médéa', nameAr: 'المدية', lat: 36.26, lng: 2.75, population2023: 947089 },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم', lat: 35.93, lng: 0.09, population2023: 835850 },
  { code: '28', name: 'M\'Sila', nameAr: 'المسيلة', lat: 35.70, lng: 4.54, population2023: 1198578 },
  { code: '29', name: 'Mascara', nameAr: 'معسكر', lat: 35.40, lng: 0.14, population2023: 902340 },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة', lat: 31.95, lng: 5.33, population2023: 638402 },
  { code: '31', name: 'Oran', nameAr: 'وهران', lat: 35.70, lng: -0.63, population2023: 1758925 },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض', lat: 33.68, lng: 1.02, population2023: 318583 },
  { code: '33', name: 'Illizi', nameAr: 'إليزي', lat: 26.48, lng: 8.48, population2023: 69516 },
  { code: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', lat: 36.07, lng: 4.76, population2023: 756745 },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس', lat: 36.76, lng: 3.48, population2023: 884953 },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف', lat: 36.77, lng: 8.31, population2023: 473190 },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف', lat: 27.67, lng: -8.15, population2023: 99813 },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت', lat: 35.61, lng: 1.81, population2023: 346855 },
  { code: '39', name: 'El Oued', nameAr: 'الوادي', lat: 33.37, lng: 6.85, population2023: 805422 },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة', lat: 35.44, lng: 7.14, population2023: 430557 },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس', lat: 36.28, lng: 7.95, population2023: 512596 },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة', lat: 36.59, lng: 2.45, population2023: 699775 },
  { code: '43', name: 'Mila', nameAr: 'ميلة', lat: 36.45, lng: 6.26, population2023: 876661 },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى', lat: 36.26, lng: 1.97, population2023: 879707 },
  { code: '45', name: 'Naâma', nameAr: 'النعامة', lat: 33.27, lng: -0.31, population2023: 264237 },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت', lat: 35.30, lng: -1.14, population2023: 427839 },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية', lat: 32.49, lng: 3.67, population2023: 474737 },
  { code: '48', name: 'Relizane', nameAr: 'غليزان', lat: 35.73, lng: 0.56, population2023: 800410 },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون', lat: 29.26, lng: 0.23, population2023: 127959 },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', lat: 21.33, lng: 0.95, population2023: 30600 },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال', lat: 34.43, lng: 5.07, population2023: 227000 },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس', lat: 30.13, lng: -2.17, population2023: 45000 },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح', lat: 27.19, lng: 2.47, population2023: 62000 },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام', lat: 19.57, lng: 5.77, population2023: 13000 },
  { code: '55', name: 'Touggourt', nameAr: 'تقرت', lat: 33.10, lng: 6.06, population2023: 265000 },
  { code: '56', name: 'Djanet', nameAr: 'جانت', lat: 24.55, lng: 9.48, population2023: 25000 },
  { code: '57', name: 'El M\'Ghair', nameAr: 'المقير', lat: 33.95, lng: 5.92, population2023: 177000 },
  { code: '58', name: 'El Meniaa', nameAr: 'المنيعة', lat: 30.58, lng: 2.88, population2023: 97000 },
];

/** Tlemcen communes for detailed drill-down */
export const TLEMCEN_COMMUNES = [
  { code: '1301', name: 'Tlemcen', lat: 34.8828, lng: -1.3167 },
  { code: '1302', name: 'Mansourah', lat: 34.8600, lng: -1.3300 },
  { code: '1303', name: 'Chetouane', lat: 34.9100, lng: -1.2900 },
  { code: '1304', name: 'Remchi', lat: 35.0600, lng: -1.4300 },
  { code: '1305', name: 'Ghazaouet', lat: 35.1000, lng: -1.8600 },
  { code: '1306', name: 'Maghnia', lat: 34.8500, lng: -1.7400 },
  { code: '1307', name: 'Sebdou', lat: 34.6300, lng: -1.3300 },
  { code: '1308', name: 'Hennaya', lat: 34.9500, lng: -1.3700 },
  { code: '1309', name: 'Nedroma', lat: 35.0700, lng: -1.7500 },
  { code: '1310', name: 'Beni Snous', lat: 34.6600, lng: -1.5500 },
  { code: '1311', name: 'Ouled Mimoun', lat: 34.9000, lng: -1.0300 },
  { code: '1312', name: 'Ain Tallout', lat: 34.8500, lng: -1.2000 },
  { code: '1313', name: 'Bab El Assa', lat: 35.0800, lng: -2.0200 },
  { code: '1314', name: 'Honaine', lat: 35.1800, lng: -1.6600 },
  { code: '1315', name: 'Ain Fezza', lat: 34.8700, lng: -1.2300 },
  { code: '1316', name: 'Sabra', lat: 35.0200, lng: -1.5800 },
  { code: '1317', name: 'Bensekrane', lat: 35.0700, lng: -1.2200 },
  { code: '1318', name: 'Ain Nehala', lat: 34.7500, lng: -1.5600 },
  { code: '1319', name: 'Fellaoucene', lat: 35.0000, lng: -1.4800 },
  { code: '1320', name: 'Sidi Djillali', lat: 34.5700, lng: -1.5900 },
];

/** Color scales for choropleth */
export const COLOR_SCALES = {
  sequential: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
  diverging: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'],
  heat: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
  cancer: ['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'],
};

export function getColorForValue(value: number, max: number, scale: string[] = COLOR_SCALES.cancer): string {
  if (max === 0) return scale[0];
  const idx = Math.min(Math.floor((value / max) * (scale.length - 1)), scale.length - 1);
  return scale[idx];
}
