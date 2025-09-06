import React, { useEffect, useState } from "react";
import RatingCard from "../components/RatingCard";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const NormalUser = () => {
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setemail] = useState();
  const [name, setname] = useState();
    const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  // Decode token for user info
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setemail(decoded.email)
        setname(decoded.name)
        
      } catch (error) {

        console.error("Invalid token:", error);
      }
    }else{
      navigate('/')
    }
  }, [token]);

  // Fetch stores from API
  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/getStores", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch stores");
      }
      setStores(json.stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStores();
  }, [token]);

  return (
    <div className="">
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <span className="text-lg font-semibold">Normal User Dashboard</span>
        <div className="flex gap-3">
          
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate ("/");
            }}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <h1 className="text-xl font-bold mb-4">Available Stores</h1>

      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stores.map((store) => (
            <RatingCard
              key={store.id}
              storeId={store.id}
              storeName={store.name}
              address={store.address}
              averageRating={store.averageRating}
              userRating={store.userRating} 
              userId={userId}
              name={name}
              email={email}
              token={token}
              onRatingSuccess={fetchStores} 
            />
          ))}
        </div>
      ) : (
        <p>No stores available.</p>
      )}
    </div>
  );
};

export default NormalUser;
