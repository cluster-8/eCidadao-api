// https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA98J02Ptcl_86GZuSzR060JUFjH2pRPyA&address=Rua+par%C3%A1,+Ca%C3%A7apava,SP
// https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA98J02Ptcl_86GZuSzR060JUFjH2pRPyA&latlng=-23.070110,%20-45.714553
// example urls

import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&`;

export const getGoogleGeocode = async (lat: string, long: string) => {
  const { data } = await axios.get<GoogleApiResponse>(`${baseUrl}latlng=${lat},${long}`).catch(() => {
    throw new BadRequestException('Cannot find your lat and long into google');
  });

  const result = data.results.length ? data.results[0] : null;

  if (!result) throw new BadRequestException('Cannot find your lat and long into google');

  console.log(result.address_components);

  return {
    formattedAdress: result?.formatted_address,
    street: result.address_components.find((v) => v.types.includes('route'))?.long_name || result.address_components.find((v) => v.types.includes('transit_station'))?.long_name,
    zipcode: result.address_components.find((v) => v.types.includes('postal_code'))?.long_name,
    number: Number(result.address_components.find((v) => v.types.includes('street_number'))?.long_name) || null,
    city: result.address_components.find((v) => v.types.includes('administrative_area_level_2'))?.long_name,
    neighborhood: result.address_components.find((v) => v.types.includes('sublocality_level_1'))?.long_name,
    state: result.address_components.find((v) => v.types.includes('administrative_area_level_1'))?.short_name,
  };
};

interface GoogleApiResponse {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      location_type: string;
      location: { lat: number; lng: number };
      bounds: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
      viewport: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
    };
    partial_match: true;
    place_id: string;
    plus_code: {
      compound_code: string;
      global_code: string;
    };
    types: string[];
  }[];
  status: string;
}
