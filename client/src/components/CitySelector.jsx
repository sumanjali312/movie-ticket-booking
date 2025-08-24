import React, { useState } from "react";
import { X, MapPin } from "lucide-react";

const popularCities = [
  { name: "Mumbai", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gateway_of_India.jpg" },
  { name: "Delhi", icon: "https://upload.wikimedia.org/wikipedia/commons/3/3e/India_Gate_in_New_Delhi_03-2016_img3.jpg" },
  { name: "Bengaluru", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Vidhana_Soudha%2C_Bangalore.jpg" },
  { name: "Hyderabad", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Charminar_Hyderabad_2020.jpg" },
];

const otherCities = [
  "Ahmedabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Lucknow", "Chandigarh", "Indore",
  "Bhopal", "Nagpur", "Surat", "Patna", "Vadodara", "Visakhapatnam"
];

const CitySelector = ({ isOpen, onClose, onSelectCity }) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredOtherCities = otherCities.filter(city =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shadow-sm">
        <h2 className="text-lg font-semibold">Select Your City</h2>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search for your city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
        />
      </div>

      {/* Detect My Location */}
      <div className="px-4 pb-4">
        <button
          onClick={() => alert("Detecting location...")}
          className="flex items-center justify-center w-full bg-gray-100 border rounded-lg px-4 py-2 gap-2"
        >
          <MapPin className="w-5 h-5 text-red-500" />
          Detect My Location
        </button>
      </div>

      {/* Popular Cities */}
      <div className="px-4">
        <h3 className="text-md font-semibold mb-2">Popular Cities</h3>
        <div className="grid grid-cols-2 gap-4">
          {popularCities.map((city) => (
            <button
              key={city.name}
              onClick={() => { onSelectCity(city.name); onClose(); }}
              className="flex flex-col items-center p-3 border rounded-lg hover:shadow"
            >
              <img src={city.icon} alt={city.name} className="w-16 h-16 object-cover rounded-full" />
              <span className="mt-2 text-sm">{city.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Other Cities */}
      <div className="px-4 pt-4 flex-1 overflow-y-auto">
        <h3 className="text-md font-semibold mb-2">Other Cities</h3>
        <div className="flex flex-col gap-2">
          {filteredOtherCities.map((city) => (
            <button
              key={city}
              onClick={() => { onSelectCity(city); onClose(); }}
              className="border rounded-lg px-4 py-2 text-left hover:bg-gray-100"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
