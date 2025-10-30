import { PetWanted } from "../../types/types-cards";
import { Geolocation } from "../../types/types-state";
import { API_BASE_URL } from "../../config";


type GetMascotas = () => Promise<PetWanted[] | null>;
type GetMascotasCerca = ({ lat, lng }: Geolocation) => Promise<PetWanted[] | null>;


const getMascotasCercaApi:GetMascotasCerca = async ({ lat, lng }: Geolocation) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mascotas?lat=${lat}&lng=${lng}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error al obtener las mascotas:", response.statusText);
      return null;
    }

    const data: PetWanted[] = await response.json();
    return data;
  
  } catch (error) {
    console.error("Error en la petición de mascotas:", error);
    return null;
  }
}

const getMascotasCercaTest: GetMascotasCerca = async ({lat,lng}) => { 
  const datosMock: PetWanted[] = [
    {
      name: 'Test 1',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum1",
      city: 'loremipsum1',
      id:1
    },
    {
      name: 'Test 2',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum2",
      city: 'loremipsum2',
      id:2
    },
    {
      name: 'Test 3',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum3",
      city: 'loremipsum3',
      id:3
    },
    {
      name: 'Test 4',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum4",
      city: 'loremipsum4',
      id:4
    },
    {
      name: 'Test 5',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum5",
      city: 'loremipsum5',
      id:5
    },
  ];
  return datosMock; 
}

export { getMascotasCercaApi, getMascotasCercaTest }