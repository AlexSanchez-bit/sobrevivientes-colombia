import { LocationService } from "@/services/Locations/Locations.service";

const locationService = new LocationService();

export const useLocationService = () => locationService;
