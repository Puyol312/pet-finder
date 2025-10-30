interface User {
  id: string;
  name: string;
  email: string;
}
interface Geolocation { 
  lat: number;
  lng: number;
}
interface Data{ 
  user: User | null;
  geolocation: Geolocation | null;
}
export { Data, User, Geolocation }