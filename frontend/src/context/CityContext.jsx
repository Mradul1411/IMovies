import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext(null);

// Top Popular Cities (Featured with icon pills like District / BMS)
export const POPULAR_CITIES = [
  { id: 'Mumbai', name: 'Mumbai', state: 'Maharashtra', icon: '🌊', popular: true },
  { id: 'Delhi-NCR', name: 'Delhi-NCR', state: 'Delhi', icon: '🏛️', popular: true },
  { id: 'Bengaluru', name: 'Bengaluru', state: 'Karnataka', icon: '💻', popular: true },
  { id: 'Hyderabad', name: 'Hyderabad', state: 'Telangana', icon: '💎', popular: true },
  { id: 'Ahmedabad', name: 'Ahmedabad', state: 'Gujarat', icon: '🪁', popular: true },
  { id: 'Chennai', name: 'Chennai', state: 'Tamil Nadu', icon: '🏖️', popular: true },
  { id: 'Kolkata', name: 'Kolkata', state: 'West Bengal', icon: '🌉', popular: true },
  { id: 'Pune', name: 'Pune', state: 'Maharashtra', icon: '🌄', popular: true },
  { id: 'Jaipur', name: 'Jaipur', state: 'Rajasthan', icon: '🏰', popular: true },
  { id: 'Lucknow', name: 'Lucknow', state: 'Uttar Pradesh', icon: '🕌', popular: true },
  { id: 'Chandigarh', name: 'Chandigarh', state: 'Punjab/Haryana', icon: '🌳', popular: true },
  { id: 'Kochi', name: 'Kochi', state: 'Kerala', icon: '⛵', popular: true }
];

// All Cities across India organized by State / Region
export const ALL_INDIAN_CITIES = [
  // Maharashtra
  { name: 'Mumbai', state: 'Maharashtra', region: 'West' },
  { name: 'Pune', state: 'Maharashtra', region: 'West' },
  { name: 'Nagpur', state: 'Maharashtra', region: 'West' },
  { name: 'Thane', state: 'Maharashtra', region: 'West' },
  { name: 'Nashik', state: 'Maharashtra', region: 'West' },
  { name: 'Aurangabad (Chhatrapati Sambhaji Nagar)', state: 'Maharashtra', region: 'West' },
  { name: 'Solapur', state: 'Maharashtra', region: 'West' },
  { name: 'Kolhapur', state: 'Maharashtra', region: 'West' },
  { name: 'Navi Mumbai', state: 'Maharashtra', region: 'West' },
  { name: 'Amravati', state: 'Maharashtra', region: 'West' },
  { name: 'Nanded', state: 'Maharashtra', region: 'West' },
  { name: 'Sangli', state: 'Maharashtra', region: 'West' },
  { name: 'Jalgaon', state: 'Maharashtra', region: 'West' },
  { name: 'Akola', state: 'Maharashtra', region: 'West' },
  { name: 'Latur', state: 'Maharashtra', region: 'West' },
  { name: 'Dhule', state: 'Maharashtra', region: 'West' },
  { name: 'Ahmednagar', state: 'Maharashtra', region: 'West' },
  { name: 'Chandrapur', state: 'Maharashtra', region: 'West' },
  { name: 'Satara', state: 'Maharashtra', region: 'West' },

  // Delhi & NCR
  { name: 'Delhi-NCR', state: 'Delhi', region: 'North' },
  { name: 'New Delhi', state: 'Delhi', region: 'North' },
  { name: 'Noida', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Greater Noida', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Gurugram (Gurgaon)', state: 'Haryana', region: 'North' },
  { name: 'Faridabad', state: 'Haryana', region: 'North' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', region: 'North' },

  // Karnataka
  { name: 'Bengaluru', state: 'Karnataka', region: 'South' },
  { name: 'Mysore (Mysuru)', state: 'Karnataka', region: 'South' },
  { name: 'Hubballi-Dharwad', state: 'Karnataka', region: 'South' },
  { name: 'Mangalore (Mangaluru)', state: 'Karnataka', region: 'South' },
  { name: 'Belgaum (Belagavi)', state: 'Karnataka', region: 'South' },
  { name: 'Davanagere', state: 'Karnataka', region: 'South' },
  { name: 'Bellary', state: 'Karnataka', region: 'South' },
  { name: 'Shivamogga (Shimoga)', state: 'Karnataka', region: 'South' },
  { name: 'Tumkur', state: 'Karnataka', region: 'South' },
  { name: 'Gulbarga (Kalaburagi)', state: 'Karnataka', region: 'South' },
  { name: 'Udupi', state: 'Karnataka', region: 'South' },

  // Telangana & Andhra Pradesh
  { name: 'Hyderabad', state: 'Telangana', region: 'South' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Guntur', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Warangal', state: 'Telangana', region: 'South' },
  { name: 'Nellore', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Kurnool', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Tirupati', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Kakinada', state: 'Andhra Pradesh', region: 'South' },
  { name: 'Nizamabad', state: 'Telangana', region: 'South' },
  { name: 'Karimnagar', state: 'Telangana', region: 'South' },
  { name: 'Anantapur', state: 'Andhra Pradesh', region: 'South' },

  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu', region: 'South' },
  { name: 'Coimbatore', state: 'Tamil Nadu', region: 'South' },
  { name: 'Madurai', state: 'Tamil Nadu', region: 'South' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', region: 'South' },
  { name: 'Salem', state: 'Tamil Nadu', region: 'South' },
  { name: 'Tirunelveli', state: 'Tamil Nadu', region: 'South' },
  { name: 'Tirupur', state: 'Tamil Nadu', region: 'South' },
  { name: 'Vellore', state: 'Tamil Nadu', region: 'South' },
  { name: 'Erode', state: 'Tamil Nadu', region: 'South' },
  { name: 'Thoothukudi', state: 'Tamil Nadu', region: 'South' },
  { name: 'Thanjavur', state: 'Tamil Nadu', region: 'South' },
  { name: 'Nagercoil', state: 'Tamil Nadu', region: 'South' },

  // Gujarat
  { name: 'Ahmedabad', state: 'Gujarat', region: 'West' },
  { name: 'Surat', state: 'Gujarat', region: 'West' },
  { name: 'Vadodara', state: 'Gujarat', region: 'West' },
  { name: 'Rajkot', state: 'Gujarat', region: 'West' },
  { name: 'Bhavnagar', state: 'Gujarat', region: 'West' },
  { name: 'Jamnagar', state: 'Gujarat', region: 'West' },
  { name: 'Junagadh', state: 'Gujarat', region: 'West' },
  { name: 'Gandhinagar', state: 'Gujarat', region: 'West' },
  { name: 'Anand', state: 'Gujarat', region: 'West' },
  { name: 'Navsari', state: 'Gujarat', region: 'West' },
  { name: 'Bhuj', state: 'Gujarat', region: 'West' },

  // West Bengal
  { name: 'Kolkata', state: 'West Bengal', region: 'East' },
  { name: 'Howrah', state: 'West Bengal', region: 'East' },
  { name: 'Durgapur', state: 'West Bengal', region: 'East' },
  { name: 'Asansol', state: 'West Bengal', region: 'East' },
  { name: 'Siliguri', state: 'West Bengal', region: 'East' },
  { name: 'Bardhaman', state: 'West Bengal', region: 'East' },
  { name: 'Kharagpur', state: 'West Bengal', region: 'East' },
  { name: 'Darjeeling', state: 'West Bengal', region: 'East' },

  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', region: 'North' },
  { name: 'Jodhpur', state: 'Rajasthan', region: 'North' },
  { name: 'Kota', state: 'Rajasthan', region: 'North' },
  { name: 'Bikaner', state: 'Rajasthan', region: 'North' },
  { name: 'Ajmer', state: 'Rajasthan', region: 'North' },
  { name: 'Udaipur', state: 'Rajasthan', region: 'North' },
  { name: 'Bhilwara', state: 'Rajasthan', region: 'North' },
  { name: 'Alwar', state: 'Rajasthan', region: 'North' },
  { name: 'Sri Ganganagar', state: 'Rajasthan', region: 'North' },

  // Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Kanpur', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Varanasi', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Agra', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Meerut', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Bareilly', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Aligarh', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Moradabad', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Saharanpur', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Jhansi', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Mathura', state: 'Uttar Pradesh', region: 'North' },
  { name: 'Ayodhya', state: 'Uttar Pradesh', region: 'North' },

  // Madhya Pradesh
  { name: 'Bhopal', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Indore', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Jabalpur', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Gwalior', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Ujjain', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Sagar', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Dewas', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Satna', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Ratlam', state: 'Madhya Pradesh', region: 'Central' },
  { name: 'Rewa', state: 'Madhya Pradesh', region: 'Central' },

  // Punjab & Haryana
  { name: 'Chandigarh', state: 'Punjab/Haryana', region: 'North' },
  { name: 'Ludhiana', state: 'Punjab', region: 'North' },
  { name: 'Amritsar', state: 'Punjab', region: 'North' },
  { name: 'Jalandhar', state: 'Punjab', region: 'North' },
  { name: 'Patiala', state: 'Punjab', region: 'North' },
  { name: 'Bathinda', state: 'Punjab', region: 'North' },
  { name: 'Mohali', state: 'Punjab', region: 'North' },
  { name: 'Panchkula', state: 'Haryana', region: 'North' },
  { name: 'Panipat', state: 'Haryana', region: 'North' },
  { name: 'Ambala', state: 'Haryana', region: 'North' },
  { name: 'Karnal', state: 'Haryana', region: 'North' },
  { name: 'Rohtak', state: 'Haryana', region: 'North' },
  { name: 'Hisar', state: 'Haryana', region: 'North' },

  // Kerala
  { name: 'Kochi', state: 'Kerala', region: 'South' },
  { name: 'Thiruvananthapuram', state: 'Kerala', region: 'South' },
  { name: 'Kozhikode', state: 'Kerala', region: 'South' },
  { name: 'Thrissur', state: 'Kerala', region: 'South' },
  { name: 'Kollam', state: 'Kerala', region: 'South' },
  { name: 'Kannur', state: 'Kerala', region: 'South' },
  { name: 'Alappuzha', state: 'Kerala', region: 'South' },
  { name: 'Palakkad', state: 'Kerala', region: 'South' },

  // Bihar & Jharkhand
  { name: 'Patna', state: 'Bihar', region: 'East' },
  { name: 'Gaya', state: 'Bihar', region: 'East' },
  { name: 'Bhagalpur', state: 'Bihar', region: 'East' },
  { name: 'Muzaffarpur', state: 'Bihar', region: 'East' },
  { name: 'Darbhanga', state: 'Bihar', region: 'East' },
  { name: 'Ranchi', state: 'Jharkhand', region: 'East' },
  { name: 'Jamshedpur', state: 'Jharkhand', region: 'East' },
  { name: 'Dhanbad', state: 'Jharkhand', region: 'East' },
  { name: 'Bokaro', state: 'Jharkhand', region: 'East' },
  { name: 'Deoghar', state: 'Jharkhand', region: 'East' },

  // Odisha & Chhattisgarh
  { name: 'Bhubaneswar', state: 'Odisha', region: 'East' },
  { name: 'Cuttack', state: 'Odisha', region: 'East' },
  { name: 'Rourkela', state: 'Odisha', region: 'East' },
  { name: 'Berhampur', state: 'Odisha', region: 'East' },
  { name: 'Puri', state: 'Odisha', region: 'East' },
  { name: 'Raipur', state: 'Chhattisgarh', region: 'Central' },
  { name: 'Bhilai', state: 'Chhattisgarh', region: 'Central' },
  { name: 'Bilaspur', state: 'Chhattisgarh', region: 'Central' },
  { name: 'Korba', state: 'Chhattisgarh', region: 'Central' },

  // Assam & North East
  { name: 'Guwahati', state: 'Assam', region: 'North-East' },
  { name: 'Silchar', state: 'Assam', region: 'North-East' },
  { name: 'Dibrugarh', state: 'Assam', region: 'North-East' },
  { name: 'Jorhat', state: 'Assam', region: 'North-East' },
  { name: 'Agartala', state: 'Tripura', region: 'North-East' },
  { name: 'Shillong', state: 'Meghalaya', region: 'North-East' },
  { name: 'Imphal', state: 'Manipur', region: 'North-East' },
  { name: 'Aizawl', state: 'Mizoram', region: 'North-East' },
  { name: 'Kohima', state: 'Nagaland', region: 'North-East' },
  { name: 'Gangtok', state: 'Sikkim', region: 'North-East' },
  { name: 'Itanagar', state: 'Arunachal Pradesh', region: 'North-East' },

  // Uttarakhand & Himachal Pradesh
  { name: 'Dehradun', state: 'Uttarakhand', region: 'North' },
  { name: 'Haridwar', state: 'Uttarakhand', region: 'North' },
  { name: 'Rishikesh', state: 'Uttarakhand', region: 'North' },
  { name: 'Nainital', state: 'Uttarakhand', region: 'North' },
  { name: 'Shimla', state: 'Himachal Pradesh', region: 'North' },
  { name: 'Dharamshala', state: 'Himachal Pradesh', region: 'North' },
  { name: 'Manali', state: 'Himachal Pradesh', region: 'North' },

  // Jammu & Kashmir and Ladakh
  { name: 'Srinagar', state: 'Jammu & Kashmir', region: 'North' },
  { name: 'Jammu', state: 'Jammu & Kashmir', region: 'North' },
  { name: 'Leh', state: 'Ladakh', region: 'North' },

  // Goa & Union Territories
  { name: 'Panaji (Goa)', state: 'Goa', region: 'West' },
  { name: 'Margao (Goa)', state: 'Goa', region: 'West' },
  { name: 'Puducherry', state: 'Puducherry', region: 'South' },
  { name: 'Port Blair', state: 'Andaman & Nicobar', region: 'South' }
];

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('imovies_city') || 'Mumbai';
  });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const changeCity = (cityName) => {
    setSelectedCity(cityName);
    localStorage.setItem('imovies_city', cityName);
    setIsCityModalOpen(false);
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        changeCity,
        isCityModalOpen,
        openCityModal: () => setIsCityModalOpen(true),
        closeCityModal: () => setIsCityModalOpen(false),
        popularCities: POPULAR_CITIES,
        allCities: ALL_INDIAN_CITIES
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
