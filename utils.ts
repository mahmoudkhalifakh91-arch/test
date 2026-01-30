
/**
 * مفتاح API الخاص بـ OpenRouteService
 */
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImIxZGM0YjQyMDEzNjRjYmRiY2E0YWY2ZTg5ZjBlMzU3IiwiaCI6Im11cm11cjY0In0=';

/**
 * وظيفة متقدمة لتطهير البيانات من أي مراجع دائرية أو كائنات معقدة غير قابلة للتسلسل.
 * تمنع خطأ "Converting circular structure to JSON"
 */
export const stripFirestore = (data: any, seen = new WeakSet()): any => {
  if (data === null || data === undefined) return data;
  
  const type = typeof data;
  if (type !== 'object') return data;

  if (seen.has(data)) return undefined;

  if (typeof data.toMillis === 'function') return data.toMillis();
  if (typeof data.toDate === 'function') return data.toDate().getTime();

  if (data.path && typeof data.path === 'string' && (data.firestore || data._delegate)) {
    return data.path;
  }

  if (typeof Node !== 'undefined' && data instanceof Node) {
    return undefined;
  }

  seen.add(data);

  if (Array.isArray(data)) {
    return data
      .map((item) => stripFirestore(item, seen))
      .filter((val) => val !== undefined);
  }

  const stripped: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (key.startsWith('_') || key.startsWith('$')) continue;
      const value = data[key];
      if (typeof value === 'function') continue;
      const cleanedValue = stripFirestore(value, seen);
      if (cleanedValue !== undefined) {
        stripped[key] = cleanedValue;
      }
    }
  }
  return stripped;
};

/**
 * دالة مساعدة لجلب البيانات من ORS مع معالجة الأخطاء والمهلة الزمنية
 */
const fetchORS = async (endpoint: string, params: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // مهلة 5 ثواني

  try {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car${endpoint}?${params}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': ORS_API_KEY
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('ORS_ERROR');
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * جلب قائمة إحداثيات المسار الفعلي (Road Geometry)
 */
export const getRouteGeometry = async (lat1: number, lon1: number, lat2: number, lon2: number): Promise<[number, number][]> => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return [[lat1, lon1], [lat2, lon2]];
  
  try {
    const data = await fetchORS('', `start=${lon1},${lat1}&end=${lon2},${lat2}`);
    if (data.features && data.features.length > 0) {
      return data.features[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    }
    return [[lat1, lon1], [lat2, lon2]];
  } catch (error) {
    // في حال فشل الـ API (مثل Failed to fetch)، نعود لرسم خط مستقيم صامت
    return [[lat1, lon1], [lat2, lon2]];
  }
};

/**
 * حساب المسافة الفعلية للطرق بدلاً من الخط المستقيم
 */
export const getRoadDistance = async (lat1: number, lon1: number, lat2: number, lon2: number): Promise<{ distance: number, duration: number }> => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return { distance: 0, duration: 0 };
  
  try {
    const data = await fetchORS('', `start=${lon1},${lat1}&end=${lon2},${lat2}`);
    if (data.features && data.features.length > 0) {
      const summary = data.features[0].properties.summary;
      return {
        distance: parseFloat((summary.distance / 1000).toFixed(1)),
        duration: Math.ceil(summary.duration / 60)
      };
    }
    throw new Error('FALLBACK');
  } catch (error) {
    // نظام احتياطي ذكي: المسافة المستقيمة + 30% لتعويض تعرجات الطرق
    const straight = calculateDistance(lat1, lon1, lat2, lon2);
    const estimatedRoadDist = straight === 0 ? 0 : parseFloat((straight * 1.3).toFixed(1));
    return { 
      distance: estimatedRoadDist, 
      duration: Math.ceil(straight * 3) // تقدير الوقت: 3 دقائق لكل كيلو
    };
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

export const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) { resolve(base64Str); return; }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width; let height = img.height;
      if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } }
      else { if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; } }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(base64Str);
  });
};
