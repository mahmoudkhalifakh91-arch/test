
/* Fix: Define google variable to resolve type errors for external script */
declare var google: any;

/**
 * وظيفة متقدمة لتطهير البيانات من أي مراجع دائرية أو كائنات معقدة غير قابلة للتسلسل.
 */
export const stripFirestore = (data: any, seen = new WeakSet()): any => {
  if (data === null || data === undefined) return data;
  const type = typeof data;
  if (type !== 'object') return data;
  if (seen.has(data)) return undefined;
  if (typeof data.toMillis === 'function') return data.toMillis();
  if (typeof data.toDate === 'function') return data.toDate().getTime();
  if (data.path && typeof data.path === 'string' && (data.firestore || data._delegate)) return data.path;
  seen.add(data);
  if (Array.isArray(data)) {
    return data.map((item) => stripFirestore(item, seen)).filter((val) => val !== undefined);
  }
  const stripped: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (key.startsWith('_') || key.startsWith('$')) continue;
      const value = data[key];
      if (typeof value === 'function') continue;
      const cleanedValue = stripFirestore(value, seen);
      if (cleanedValue !== undefined) stripped[key] = cleanedValue;
    }
  }
  return stripped;
};

/**
 * حساب المسافة الفعلية للطرق باستخدام Google Maps Distance Matrix
 */
export const getRoadDistance = (lat1: number, lon1: number, lat2: number, lon2: number): Promise<{ distance: number, duration: number }> => {
  return new Promise((resolve) => {
    /* Fix: Accessed google through window as any to avoid property existence error */
    if (!(window as any).google) {
      const straight = calculateDistance(lat1, lon1, lat2, lon2);
      resolve({ distance: parseFloat((straight * 1.3).toFixed(1)), duration: Math.ceil(straight * 3) });
      return;
    }

    /* Fix: Used global google variable for maps service */
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [{ lat: lat1, lng: lon1 }],
      destinations: [{ lat: lat2, lng: lon2 }],
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === 'OK' && response && response.rows[0].elements[0].status === 'OK') {
        const element = response.rows[0].elements[0];
        resolve({
          distance: parseFloat((element.distance.value / 1000).toFixed(1)),
          duration: Math.ceil(element.duration.value / 60)
        });
      } else {
        const straight = calculateDistance(lat1, lon1, lat2, lon2);
        resolve({ distance: parseFloat((straight * 1.3).toFixed(1)), duration: Math.ceil(straight * 3) });
      }
    });
  });
};

/**
 * جلب قائمة إحداثيات المسار الفعلي باستخدام Google Maps Directions
 */
/* Fix: Changed return type to any[] to resolve missing google namespace */
export const getRouteGeometry = (lat1: number, lon1: number, lat2: number, lon2: number): Promise<any[]> => {
  return new Promise((resolve) => {
    /* Fix: Accessed google through window as any */
    if (!(window as any).google) {
      resolve([{ lat: lat1, lng: lon1 }, { lat: lat2, lng: lon2 }]);
      return;
    }

    /* Fix: Used global google variable for directions service */
    const directionsService = new google.maps.DirectionsService();
    directionsService.route({
      origin: { lat: lat1, lng: lon1 },
      destination: { lat: lat2, lng: lon2 },
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === 'OK' && result && result.routes[0]) {
        resolve(result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() })));
      } else {
        resolve([{ lat: lat1, lng: lon1 }, { lat: lat2, lng: lon2 }]);
      }
    });
  });
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