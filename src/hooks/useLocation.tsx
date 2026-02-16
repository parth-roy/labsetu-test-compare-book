import { createContext, useContext, useState, useEffect } from "react";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Bhopal", "Indore", "Nagpur", "Patna",
  "Gurgaon", "Noida", "Kochi", "Surat", "Visakhapatnam",
];

interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  detecting: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [city, setCity] = useState(() => localStorage.getItem("labsetu_city") || "");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (city) {
      localStorage.setItem("labsetu_city", city);
      return;
    }
    // Auto-detect via geolocation
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const detected =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            "";
          const match = INDIAN_CITIES.find(
            (c) => detected.toLowerCase().includes(c.toLowerCase())
          );
          if (match) {
            setCity(match);
            localStorage.setItem("labsetu_city", match);
          }
        } catch {
          // ignore
        }
        setDetecting(false);
      },
      () => setDetecting(false),
      { timeout: 5000 }
    );
  }, []);

  const handleSetCity = (c: string) => {
    setCity(c);
    localStorage.setItem("labsetu_city", c);
  };

  return (
    <LocationContext.Provider value={{ city, setCity: handleSetCity, cities: INDIAN_CITIES, detecting }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within LocationProvider");
  return context;
};
