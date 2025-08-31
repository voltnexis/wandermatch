import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: 'weekly',
  libraries: ['places', 'geometry']
})

export const loadGoogleMaps = async () => {
  return await loader.load()
}

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

export const getDistrictFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    const google = await loadGoogleMaps()
    const geocoder = new google.maps.Geocoder()
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const addressComponents = results[0].address_components
            
            // Find district in address components
            for (const component of addressComponents) {
              if (component.types.includes('administrative_area_level_2')) {
                resolve(component.long_name)
                return
              }
            }
            
            // Fallback to locality
            for (const component of addressComponents) {
              if (component.types.includes('locality')) {
                resolve(component.long_name)
                return
              }
            }
            
            resolve('Unknown')
          } else {
            reject(new Error('Geocoding failed'))
          }
        }
      )
    })
  } catch (error) {
    console.error('Error getting district:', error)
    return 'Unknown'
  }
}

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Kerala districts with coordinates
export const keralaDistricts = [
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
  { name: 'Kollam', lat: 8.8932, lng: 76.6141 },
  { name: 'Pathanamthitta', lat: 9.2648, lng: 76.7870 },
  { name: 'Alappuzha', lat: 9.4981, lng: 76.3388 },
  { name: 'Kottayam', lat: 9.5916, lng: 76.5222 },
  { name: 'Idukki', lat: 9.8901, lng: 76.9734 },
  { name: 'Ernakulam', lat: 10.1632, lng: 76.6413 },
  { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
  { name: 'Palakkad', lat: 10.7867, lng: 76.6548 },
  { name: 'Malappuram', lat: 11.0510, lng: 76.0711 },
  { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 },
  { name: 'Wayanad', lat: 11.6854, lng: 76.1320 },
  { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
  { name: 'Kasaragod', lat: 12.4996, lng: 74.9869 }
]