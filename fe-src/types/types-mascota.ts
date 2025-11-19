import { Geolocation } from "./types-state";

interface PetWanted {
  name: string;
  img: string;
  street: string;
  city: string;
  id: number;
}
type DtReporte = {
  location: Geolocation;
  name: string;
  city: string;
  country: string;
  img: File;
};
export { PetWanted, DtReporte }