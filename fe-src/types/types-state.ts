interface User {
  token: string;
  email: string;
  record: boolean;
}
interface Data{ 
  user: User | null;
  geolocation: Geolocation | null;
}
interface Geolocation { 
  lat: number;
  lng: number;
}
export { Data, User, Geolocation }