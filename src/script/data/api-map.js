import Map from '../utils/map';
 
export async function storiesMap(stories) {
  return {
    ...stories,
    location: {
      ...stories.location,
      placeName: await Map.getPlaceNameByCoordinate(stories.location.latitude, stories.location.longitude),
    },
  };
}