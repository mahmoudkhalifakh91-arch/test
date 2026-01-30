
import type { Village, District } from '../types';

export type { District };

export const PLATFORM_COMMISSION_RATE = 0.15;

/**
 * القائمة الشاملة والنهائية لكافة مراكز وقرى محافظة المنوفية
 */
export const MENOFIA_DATA: District[] = [
  {
    id: 'd-ashmoun',
    name: 'أشمون',
    villages: [
      { id: 'ash-city', name: 'مدينة أشمون', center: { lat: 30.2931, lng: 30.9863 } },
      // وحدة شما (تم ضبطها لتكون على بعد 13كم من مدينة أشمون)
      { id: 'v-shamma', name: 'شما', center: { lat: 30.3340, lng: 31.1131 } },
      { id: 'v-khadra', name: 'الخضرة', center: { lat: 30.3200, lng: 31.0100 } },
      // وحدة سمادون
      { id: 'v-samadoun', name: 'سمادون', center: { lat: 30.2858, lng: 30.9636 } },
      { id: 'v-ezbet-samadoun', name: 'عزبة سمادون', center: { lat: 30.2916, lng: 30.9709 } },
      { id: 'v-smalay', name: 'سملاي', center: { lat: 30.2750, lng: 30.9550 } },
      // وحدة سنتريس
      { id: 'v-santes', name: 'سنتريس', center: { lat: 30.3008, lng: 30.9439 } },
      { id: 'v-mansh-santes', name: 'منشأة سنتريس', center: { lat: 30.3050, lng: 30.9400 } },
      { id: 'v-kohafa', name: 'كفر قورص', center: { lat: 30.3100, lng: 30.9450 } },
      { id: 'v-qours', name: 'قورص', center: { lat: 30.3150, lng: 30.9500 } },
      // وحدة طهواي (على بعد 7.1كم من شما)
      { id: 'v-tahway', name: 'طهواي', center: { lat: 30.3340, lng: 31.0392 } },
      // دلهمو (تقع بعد طهواي، وعلى بعد 9.3كم من شما)
      { id: 'v-dalhamou', name: 'دلهمو', center: { lat: 30.3340, lng: 31.0163 } },
      { id: 'v-ezbet-tahway', name: 'عزبة كرم', center: { lat: 30.3050, lng: 30.9250 } },
      // وحدة ساقية أبو شعرة
      { id: 'v-saqia', name: 'ساقية أبو شعرة', center: { lat: 30.3256, lng: 30.9394 } },
      { id: 'v-shatanouf', name: 'شطانوف', center: { lat: 30.3297, lng: 30.9268 } },
      { id: 'v-hallawsi', name: 'الحلواصي', center: { lat: 30.3300, lng: 30.9350 } },
      { id: 'v-kfr-mansour', name: 'كفر منصور', center: { lat: 30.3350, lng: 30.9400 } },
      // وحدة سبك الأحد
      { id: 'v-sabk', name: 'سبك الأحد', center: { lat: 30.3219, lng: 30.9981 } },
      { id: 'v-shanshour', name: 'شنشور', center: { lat: 30.2799, lng: 30.9507 } },
      { id: 'v-brahim', name: 'براهيم', center: { lat: 30.2750, lng: 30.9450 } },
      { id: 'v-kfr-sabk', name: 'كفر سبك الأحد', center: { lat: 30.3250, lng: 31.0050 } },
      // وحدة جريس
      { id: 'v-gris', name: 'جريس', center: { lat: 30.3361, lng: 30.9812 } },
      { id: 'v-monsha-gris', name: 'منشأة جريس', center: { lat: 30.3400, lng: 30.9850 } },
      { id: 'v-abu-raqaba', name: 'أبو رقبة', center: { lat: 30.3450, lng: 30.9750 } },
      { id: 'v-kfr-abu-raqaba', name: 'كفر أبو رقبة', center: { lat: 30.3500, lng: 30.9800 } },
      // وحدة منشأة سلطان
      { id: 'v-monsha-sultan', name: 'منشأة سلطان', center: { lat: 30.3550, lng: 31.0100 } },
      { id: 'v-amreia', name: 'العامرية', center: { lat: 30.3600, lng: 31.0150 } },
      { id: 'v-kfr-amreia', name: 'كفر العامرية', center: { lat: 30.3650, lng: 31.0200 } },
      // وحدة رملة الأنجب
      { id: 'v-ramla-anjab', name: 'رملة الأنجب', center: { lat: 30.3750, lng: 30.9900 } },
      { id: 'v-anjab', name: 'الأنجب', center: { lat: 30.3800, lng: 31.0000 } },
      { id: 'v-kawadi', name: 'الكوادي', center: { lat: 30.3850, lng: 31.0100 } },
      { id: 'v-lawaizeh', name: 'اللوايزة', center: { lat: 30.3900, lng: 31.0200 } },
      // وحدة طليا
      { id: 'v-talia', name: 'طليا', center: { lat: 30.2450, lng: 30.9350 } },
      { id: 'v-barania', name: 'البرانية', center: { lat: 30.2400, lng: 30.9250 } },
      { id: 'v-kfr-barania', name: 'كفر البرانية', center: { lat: 30.2350, lng: 30.9150 } },
      // وحدة دروة
      { id: 'v-darwa', name: 'دروة', center: { lat: 30.2500, lng: 30.9800 } },
      { id: 'v-khyria', name: 'الخيرية', center: { lat: 30.2450, lng: 30.9850 } },
      { id: 'v-sandafeis', name: 'صندفيس', center: { lat: 30.2400, lng: 30.9900 } },
      // مناطق أخرى
      { id: 'v-ramla', name: 'الرملة', center: { lat: 30.2700, lng: 30.9900 } },
      { id: 'v-ezbet-bakr', name: 'عزبة بكر', center: { lat: 30.3000, lng: 30.9850 } },
      { id: 'v-ezbet-aly', name: 'عزبة علي', center: { lat: 30.3050, lng: 30.9900 } },
      { id: 'v-ashma-village', name: 'أشما', center: { lat: 30.2950, lng: 30.9500 } },
      { id: 'v-qanatir', name: 'منطقة القناطر', center: { lat: 30.2200, lng: 31.0100 } }
    ]
  },
  {
    id: 'd-shebin',
    name: 'شبين الكوم',
    villages: [
      { id: 'shebin-city', name: 'مدينة شبين الكوم', center: { lat: 30.5612, lng: 31.0125 } },
      { id: 'v-elmay', name: 'الماي', center: { lat: 30.5200, lng: 30.9500 } },
      { id: 'v-elbetanoun', name: 'البتانون', center: { lat: 30.6100, lng: 31.0500 } }
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
