
import type { Village, District } from '../types';

export type { District };

export const PLATFORM_COMMISSION_RATE = 0.15;

/**
 * البيانات الجغرافية الشاملة والنهائية لمحافظة المنوفية (10 مراكز)
 * تم تحديث القائمة لتشمل كافة المراكز والمدن والوحدات المحلية الرئيسية
 */
export const MENOFIA_DATA: District[] = [
  {
    id: 'd-ashmoun',
    name: 'أشمون',
    villages: [
      { id: 'ash-city', name: 'مدينة أشمون', center: { lat: 30.2931, lng: 30.9863 } },
      { id: 'v-shamma', name: 'شما', center: { lat: 30.3340, lng: 31.1131 } },
      { id: 'v-tahway', name: 'طهواي', center: { lat: 30.3340, lng: 31.0392 } },
      { id: 'v-samadoun', name: 'سمادون', center: { lat: 30.2858, lng: 30.9636 } },
      { id: 'v-santes', name: 'سنتريس', center: { lat: 30.3008, lng: 30.9439 } },
      { id: 'v-gris', name: 'جريس', center: { lat: 30.3361, lng: 30.9812 } },
      { id: 'v-sabk', name: 'سبك الأحد', center: { lat: 30.3219, lng: 30.9981 } },
      { id: 'v-darwa', name: 'دروة', center: { lat: 30.2500, lng: 30.9800 } },
      { id: 'v-talia', name: 'طليا', center: { lat: 30.2450, lng: 30.9350 } },
      { id: 'v-shanshour', name: 'شنشور', center: { lat: 30.2799, lng: 30.9507 } }
    ]
  },
  {
    id: 'd-shebin',
    name: 'شبين الكوم',
    villages: [
      { id: 'shebin-city', name: 'مدينة شبين الكوم', center: { lat: 30.5612, lng: 31.0125 } },
      { id: 'v-elmay', name: 'الماي', center: { lat: 30.5200, lng: 30.9500 } },
      { id: 'v-elbetanoun', name: 'البتانون', center: { lat: 30.6100, lng: 31.0500 } },
      { id: 'v-shonofa', name: 'شنوفة', center: { lat: 30.5300, lng: 31.0400 } },
      { id: 'v-bakhati', name: 'ببخاتي', center: { lat: 30.5900, lng: 30.9800 } },
      { id: 'v-miliag', name: 'مليج', center: { lat: 30.5850, lng: 31.0600 } }
    ]
  },
  {
    id: 'd-menouf',
    name: 'منوف',
    villages: [
      { id: 'menouf-city', name: 'مدينة منوف', center: { lat: 30.4665, lng: 30.9332 } },
      { id: 'v-hamoul', name: 'الحامول', center: { lat: 30.4900, lng: 30.9200 } },
      { id: 'v-tata', name: 'تتا', center: { lat: 30.4500, lng: 30.9500 } },
      { id: 'v-fisha-kobra', name: 'فيشا الكبرى', center: { lat: 30.4200, lng: 30.9300 } },
      { id: 'v-sadoud', name: 'سدود', center: { lat: 30.4100, lng: 30.9600 } },
      { id: 'v-jazi', name: 'جزي', center: { lat: 30.3900, lng: 30.9100 } }
    ]
  },
  {
    id: 'd-bagour',
    name: 'الباجور',
    villages: [
      { id: 'bagour-city', name: 'مدينة الباجور', center: { lat: 30.4354, lng: 31.0366 } },
      { id: 'v-jarwan', name: 'جروان', center: { lat: 30.4100, lng: 31.0100 } },
      { id: 'v-fisha-soghra', name: 'فيشا الصغرى', center: { lat: 30.4500, lng: 31.0600 } },
      { id: 'v-sabk-dahak', name: 'سبك الضحاك', center: { lat: 30.4700, lng: 31.0400 } },
      { id: 'v-mushayrif', name: 'مشيرف', center: { lat: 30.3900, lng: 31.0500 } },
      { id: 'v-heet', name: 'هيت', center: { lat: 30.4600, lng: 31.0200 } }
    ]
  },
  {
    id: 'd-quweisna',
    name: 'قويسنا',
    villages: [
      { id: 'quweisna-city', name: 'مدينة قويسنا', center: { lat: 30.5539, lng: 31.1354 } },
      { id: 'v-bejeirm', name: 'بجيرم', center: { lat: 30.5300, lng: 31.1200 } },
      { id: 'v-mit-barra', name: 'ميت برة', center: { lat: 30.5100, lng: 31.1500 } },
      { id: 'v-quweisna-balad', name: 'قويسنا البلد', center: { lat: 30.5600, lng: 31.1100 } },
      { id: 'v-abnahs', name: 'أبنهس', center: { lat: 30.5800, lng: 31.1400 } },
      { id: 'v-taha-shobra', name: 'طه شبرا', center: { lat: 30.5900, lng: 31.1600 } }
    ]
  },
  {
    id: 'd-tala',
    name: 'تلا',
    villages: [
      { id: 'tala-city', name: 'مدينة تلا', center: { lat: 30.6800, lng: 30.9443 } },
      { id: 'v-babel', name: 'بابل', center: { lat: 30.6500, lng: 30.9300 } },
      { id: 'v-mit-el-keram', name: 'ميت الكرام', center: { lat: 30.7000, lng: 30.9600 } },
      { id: 'v-kfr-rabie', name: 'كفر ربيع', center: { lat: 30.7200, lng: 30.9200 } },
      { id: 'v-qashtokh', name: 'قشطوخ', center: { lat: 30.7400, lng: 30.9400 } }
    ]
  },
  {
    id: 'd-berket-sab',
    name: 'بركة السبع',
    villages: [
      { id: 'berket-sab-city', name: 'مدينة بركة السبع', center: { lat: 30.6335, lng: 31.0858 } },
      { id: 'v-toukh-tambisha', name: 'طوخ طمبشا', center: { lat: 30.6100, lng: 31.1100 } },
      { id: 'v-rawda', name: 'الروضة', center: { lat: 30.6600, lng: 31.1000 } },
      { id: 'v-abu-mashhour', name: 'أبو مشهور', center: { lat: 30.6400, lng: 31.0500 } },
      { id: 'v-horeen', name: 'هورين', center: { lat: 30.6000, lng: 31.0700 } }
    ]
  },
  {
    id: 'd-shohada',
    name: 'الشهداء',
    villages: [
      { id: 'shohada-city', name: 'مدينة الشهداء', center: { lat: 30.5976, lng: 30.8988 } },
      { id: 'v-zawiat-naoura', name: 'زاوية الناعورة', center: { lat: 30.6200, lng: 30.8700 } },
      { id: 'v-danshway', name: 'دنشواي', center: { lat: 30.6400, lng: 30.8800 } },
      { id: 'v-sahel-jawaber', name: 'ساحل الجوابر', center: { lat: 30.5800, lng: 30.8600 } },
      { id: 'v-ashma', name: 'عشما', center: { lat: 30.5600, lng: 30.8900 } }
    ]
  },
  {
    id: 'd-sadat',
    name: 'السادات',
    villages: [
      { id: 'sadat-city', name: 'مدينة السادات', center: { lat: 30.3796, lng: 30.5050 } },
      { id: 'v-khatatba', name: 'الخطاطبة', center: { lat: 30.2900, lng: 30.8200 } },
      { id: 'v-kfr-daoud', name: 'كفر داود', center: { lat: 30.4600, lng: 30.8100 } },
      { id: 'v-tamalay', name: 'طمالاي (المنطقة الحرة)', center: { lat: 30.4800, lng: 30.9000 } }
    ]
  },
  {
    id: 'd-sers',
    name: 'سرس الليان',
    villages: [
      { id: 'sers-city', name: 'مدينة سرس الليان', center: { lat: 30.4489, lng: 30.9634 } }
    ]
  }
];

export const ASHMOUN_VILLAGES: Village[] = MENOFIA_DATA.flatMap(d => d.villages);

/**
 * إعدادات التسعير المحدثة والدقيقة
 */
export const DEFAULT_PRICING = {
  basePrice: 1,             // فتح العداد
  pricePerKm: 5,            // سعر الكيلو الفعلي (طرق)
  minPrice: 15,             // الحد الأدنى للمشوار
  maxPrice: 1000,
  sameVillagePrice: 15,     // سعر ثابت داخل نفس القرية
  deliveryBasePrice: 20,    // سعر فتح عداد طلبات الأكل/الصيدلية
  foodOutsidePricePerKm: 5, // سعر الكيلو الإضافي لطلبات الأكل
  multipliers: {
    MOTORCYCLE: 0.9,        // الموتوسيكل
    TOKTOK: 1.0,            // التوك توك
    CAR: 2.0                // السيارة
  }
};
