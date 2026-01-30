
import React, { useState, useEffect, useRef } from 'react';

// Types
import type { User, Order } from '../types';
import { OrderStatus } from '../types';

// Utils
import { stripFirestore } from '../utils';

// Icons
import { 
  Bike, MapPin, Loader2, Power, 
  MessageCircle, History, X,
  PhoneCall, User as UserIcon, Home, 
  ShieldAlert, Bot, Zap, Car, Map as MapIcon,
  AlertTriangle, Crosshair, ArrowRight, ClipboardList,
  Edit, Navigation2, Map as MapPlaceholderIcon, Radar
} from 'lucide-react';

// Services
import { db } from '../services/firebase';
import { 
  collection, query, where, onSnapshot, updateDoc, 
  doc, addDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Components
import ChatView from '../components/ChatView';
import ActivityView from './ActivityView';
import ProfileView from './ProfileView';

/* Fix: Define google variable to resolve type errors for external script */
declare var google: any;

// --- Native Google Map Component for Driver ---
const GoogleDriverMap: React.FC<{ 
  driverLoc: {lat: number, lng: number}, 
  destination?: {lat: number, lng: number} | null
}> = ({ driverLoc, destination }) => {
  const googleMap = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);
  const marker = useRef<any>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const mapEl = document.getElementById('driver-map');
    if (mapEl && !googleMap.current) {
      try {
        if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.Map) {
          setMapError(true);
          return;
        }

        googleMap.current = new (window as any).google.maps.Map(mapEl, {
          center: driverLoc,
          zoom: 16,
          disableDefaultUI: true,
          styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
        });

        directionsRenderer.current = new (window as any).google.maps.DirectionsRenderer({
          map: googleMap.current,
          suppressMarkers: true,
          polylineOptions: { strokeColor: "#0085C7", strokeWeight: 6 }
        });

        marker.current = new (window as any).google.maps.Marker({
          position: driverLoc,
          map: googleMap.current,
          icon: {
             url: 'https://img.icons8.com/color/48/motorcycle.png',
             scaledSize: new (window as any).google.maps.Size(40, 40)
          }
        });
      } catch (e) {
        setMapError(true);
      }
    }
  }, [driverLoc]);

  useEffect(() => {
    if (marker.current && !mapError) marker.current.setPosition(driverLoc);
    if (googleMap.current && destination && !mapError) {
       const directionsService = new (window as any).google.maps.DirectionsService();
       directionsService.route({
         origin: driverLoc,
         destination: destination,
         travelMode: (window as any).google.maps.TravelMode.DRIVING
       }, (result: any, status: any) => {
         if (status === 'OK') directionsRenderer.current?.setDirections(result);
       });
    }
  }, [driverLoc, destination, mapError]);

  if (mapError) {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="bg-emerald-500/10 p-8 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.2)] text-emerald-400">
           <Radar className="h-16 w-16 animate-pulse" />
        </div>
        <div className="space-y-2">
           <h4 className="font-black text-white text-xl">بث GPS نشط</h4>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">موقعك الآن يتم إرساله للعميل وللإدارة بنجاح.<br/>(واجهة الخريطة متوقفة مؤقتاً)</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl w-full">
           <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase mb-2">
              <span>إحداثياتك</span>
              <span className="text-emerald-400">Signal: Excellent</span>
           </div>
           <p className="text-white font-mono text-[10px]">{driverLoc.lat.toFixed(6)}, {driverLoc.lng.toFixed(6)}</p>
        </div>
      </div>
    );
  }

  return <div id="driver-map" className="w-full h-full" />;
};

const CourierDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeView, setActiveView] = useState<'HOME' | 'MAP' | 'ACTIVITY' | 'PROFILE'>('HOME');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfferInput, setShowOfferInput] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 30.556, lng: 31.008 });
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (isOnline && "geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition((pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLocation(newLoc);
        updateDoc(doc(db, "users", user.id), { location: { ...newLoc, updatedAt: Date.now() } });
      }, null, { enableHighAccuracy: true });
    }
    return () => { if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current); };
  }, [isOnline, user.id]);

  useEffect(() => {
    if (!isOnline || user.status !== 'APPROVED') return;
    onSnapshot(query(collection(db, "orders"), where("status", "==", OrderStatus.WAITING_FOR_OFFERS)), (snapshot) => {
      setAvailableOrders(snapshot.docs.map(d => ({ id: d.id, ...stripFirestore(d.data()) })) as Order[]);
    });
    return onSnapshot(query(collection(db, "orders"), where("driverId", "==", user.id)), (snapshot) => {
      const all = snapshot.docs.map(d => ({ id: d.id, ...stripFirestore(d.data()) } as Order));
      setActiveOrder(all.find(o => ![OrderStatus.DELIVERED, OrderStatus.DELIVERED_RATED, OrderStatus.CANCELLED].includes(o.status)) || null);
    });
  }, [isOnline, user.id, user.status]);

  const handleSendOffer = async (orderId: string) => {
    const price = parseFloat(offerPrice);
    if (!price || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const userSnap = await getDoc(doc(db, "users", user.id));
      await addDoc(collection(db, "offers"), {
        orderId, driverId: user.id, driverName: user.name, driverPhone: user.phone,
        driverRating: userSnap.data()?.rating || 5.0, driverPhoto: userSnap.data()?.photoURL || null,
        vehicleType: user.vehicleType || 'TOKTOK', price, createdAt: Date.now()
      });
      setShowOfferInput(null); setOfferPrice(''); alert('تم إرسال عرضك');
    } catch (e) { alert('خطأ'); } finally { setIsSubmitting(false); }
  };

  const updateOrderStatus = async (status: OrderStatus) => {
    if (!activeOrder || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updates: any = { status };
      if (status === OrderStatus.DELIVERED) updates.deliveredAt = Date.now();
      await updateDoc(doc(db, "orders", activeOrder.id), updates);
    } catch (e) { alert('خطأ'); } finally { setIsSubmitting(false); }
  };

  if (user.status !== 'APPROVED') return <div className="p-12 text-center font-black space-y-6"><ShieldAlert className="h-20 w-20 mx-auto text-emerald-600 animate-bounce" /><h2 className="text-3xl">حسابك بانتظار التفعيل</h2><button onClick={() => window.open('https://wa.me/201065019364')} className="w-full bg-[#25D366] text-white py-6 rounded-[2rem] font-black shadow-xl">واتساب الإدارة</button></div>;

  if (showChat && activeOrder) return <ChatView user={user} order={activeOrder} onBack={() => setShowChat(false)} />;
  if (activeView === 'ACTIVITY') return <ActivityView user={user} onBack={() => setActiveView('HOME')} />;
  if (activeView === 'PROFILE') return <ProfileView user={user} onBack={() => setActiveView('HOME')} onUpdate={() => {}} />;

  return (
    <div className="rh-layout relative">
      {activeView === 'MAP' && (
        <div className="map-page-container animate-in fade-in duration-500">
           <div className="absolute top-10 left-6 right-6 z-[1010] flex justify-between items-center"><button onClick={() => setActiveView('HOME')} className="p-4 bg-white rounded-3xl shadow-xl active:scale-90 transition-all"><ArrowRight className="h-6 w-6" /></button><div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Radar className="h-3 w-3 text-emerald-400" /> تتبع رقمي GPS</div></div>
           <GoogleDriverMap driverLoc={currentLocation} destination={activeOrder ? (activeOrder.status === OrderStatus.ACCEPTED ? activeOrder.pickup : activeOrder.dropoff) : null} />
        </div>
      )}
      <div className={`page-container no-scrollbar ${activeView === 'MAP' ? 'hidden' : 'block'}`}>
        <div className="p-6 md:p-12 space-y-8 max-w-2xl mx-auto text-right">
            <div className={`p-8 md:p-10 rounded-[3rem] text-white flex justify-between items-center shadow-2xl transition-all duration-700 ${isOnline ? 'bg-emerald-600' : 'bg-slate-950'}`}><div><h2 className="text-3xl font-black tracking-tighter leading-none">{isOnline ? 'نشط الآن' : 'متوقف'}</h2><p className="text-[10px] font-black opacity-60 mt-2 uppercase tracking-widest">كباتن المنوفية</p></div><button onClick={() => setIsOnline(!isOnline)} className={`p-6 rounded-[2rem] shadow-2xl active:scale-90 transition-all ${isOnline ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'}`}><Power className="h-10 w-10" /></button></div>
            {activeOrder ? (
               <div className="bg-white rounded-[4rem] shadow-2xl border-t-8 border-t-emerald-500 p-8 space-y-8 animate-reveal"><div className="flex justify-between items-center"><span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{activeOrder.status}</span><p className="text-5xl font-black text-slate-950">{activeOrder.price} <span className="text-xs font-bold opacity-30">ج.م</span></p></div>
                  <div className="space-y-6"><div className="flex gap-4 items-start flex-row-reverse text-right"><div className="bg-slate-50 p-4 rounded-2xl text-emerald-600 shadow-sm shrink-0 shadow-inner"><MapPin className="h-6 w-6" /></div><div className="flex-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">نقطة الاستلام</p><p className="font-black text-lg text-slate-900 leading-tight mt-1">{activeOrder.restaurantName || activeOrder.pickup?.villageName}</p></div></div><div className="flex gap-4 items-start flex-row-reverse text-right pt-4 border-t border-slate-50"><div className="bg-rose-50 p-4 rounded-2xl text-rose-600 shadow-sm shrink-0 shadow-inner"><Navigation2 className="h-6 w-6" /></div><div className="flex-1"><p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">وجهة الوصول</p><p className="font-black text-lg text-slate-900 leading-tight mt-1">{activeOrder.dropoff?.villageName}</p></div></div></div>
                  <div className="grid grid-cols-1 gap-4"><button onClick={() => setActiveView('MAP')} className="w-full bg-emerald-500 text-white py-7 rounded-[2.2rem] font-black flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-emerald-900/10"><Crosshair className="h-7 w-7" /> تتبع المسار الفعلي</button><div className="grid grid-cols-2 gap-4"><a href={`tel:${activeOrder.customerPhone}`} className="bg-slate-950 text-white py-6 rounded-3xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"><PhoneCall className="h-6 w-6" /> اتصال</a><button onClick={() => setShowChat(true)} className="bg-white border-2 border-slate-100 text-slate-900 py-6 rounded-3xl font-black flex items-center justify-center gap-3 active:scale-95 shadow-sm"><MessageCircle className="h-6 w-6" /> دردشة</button></div><button onClick={() => updateOrderStatus(activeOrder.status === OrderStatus.ACCEPTED ? OrderStatus.PICKED_UP : OrderStatus.DELIVERED)} disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-7 rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all">{isSubmitting ? <Loader2 className="h-7 w-7 animate-spin mx-auto" /> : activeOrder.status === OrderStatus.ACCEPTED ? 'تأكيد الاستلام' : 'تأكيد التوصيل'}</button></div></div>
            ) : (
               <div className="space-y-6 animate-reveal"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-right px-4">مشاوير بانتظارك ({availableOrders.length})</h3>{availableOrders.map(o => (
                 <div key={o.id} className="bg-white p-8 rounded-[3.5rem] border-2 border-slate-50 shadow-xl space-y-6 animate-reveal hover:border-emerald-500 transition-all">{showOfferInput === o.id ? (
                   <div className="space-y-6 animate-in zoom-in text-center"><h4 className="text-xl font-black">عرض السعر للمشوار</h4><input autoFocus type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder={o.price.toString()} className="w-full bg-slate-50 border-none rounded-3xl p-8 text-5xl font-black text-center outline-none shadow-inner focus:ring-4 focus:ring-emerald-500/5" /><div className="flex gap-4"><button onClick={() => setShowOfferInput(null)} className="flex-1 py-6 rounded-2xl font-black text-slate-400">إلغاء</button><button onClick={() => handleSendOffer(o.id)} className="flex-[2] bg-emerald-600 text-white py-6 rounded-2xl font-black shadow-xl active:scale-95">إرسال العرض</button></div></div>
                 ) : (
                   <><div className="flex justify-between items-start text-right"><div className="space-y-2"><p className="text-2xl font-black text-slate-950 leading-tight">{o.pickup?.villageName} ← {o.dropoff?.villageName}</p><div className="flex gap-2 items-center justify-end"><span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full">{o.requestedVehicleType}</span></div></div><div className="bg-slate-950 text-emerald-400 p-6 rounded-[2.2rem] font-black text-3xl shrink-0 shadow-2xl">{o.price}</div></div><button onClick={() => { setShowOfferInput(o.id); setOfferPrice(o.price.toString()); }} className="w-full bg-slate-950 text-white py-7 rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"><Zap className="h-6 w-6 text-emerald-400" /> تقديم عرض سريع</button></>
                 )}</div>
               ))}</div>
            )}
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-6 py-6 flex justify-around items-center z-[150] shadow-2xl flex-row-reverse rounded-t-[3.5rem]">{[{id: 'HOME', icon: <Home className="h-6 w-6" />, label: 'الرئيسية'}, {id: 'MAP', icon: <MapIcon className="h-6 w-6" />, label: 'الخريطة'}, {id: 'ACTIVITY', icon: <History className="h-6 w-6" />, label: 'سجلي'}, {id: 'PROFILE', icon: <UserIcon className="h-6 w-6" />, label: 'حسابي'}].map(tab => (
        <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex flex-col items-center gap-1 transition-all ${activeView === tab.id ? 'text-emerald-600' : 'text-slate-300'}`}><div className={`p-3.5 rounded-2xl transition-all ${activeView === tab.id ? 'bg-emerald-50 shadow-inner scale-110' : ''}`}>{tab.icon}</div><span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span></button>
      ))}</nav>
    </div>
  );
};

export default CourierDashboard;
