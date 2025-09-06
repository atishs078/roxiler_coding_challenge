// src/Storeowner_landing.jsx
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "./Table";

const Storeownerlanding = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [rate, setrate] = useState(0);
  const [userList, setUserList] = useState([])
  const [showStoreTable, setStoreTable] = useState(true)
 
  const navigate = useNavigate();
 useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchNumberOfRating(decoded.id)
        fetchAvgRating(decoded.id)
        fetchUserList(decoded.id)
      } catch (error) {

        console.error("Invalid token:", error);
      }
    }else{
      navigate('/')
    }
  }, [token]);

  // Fetch store info to check if password is updated
  const fetchUserList = async (storeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getUsersWhoRated/${storeId}`,{
        method:'GET',
        headers:{
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if(data.success){
        setUserList(data.rates)
        console.log(data.rates)
      }else{
        alert("Something went wrong")
      }
    } catch (error) {
      alert("Something went wrong")
      
    }
    
  }
  const fetchPasswordUpdate = async (storeEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/getStoreinfo/${storeEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        const isPasswordUpdated = data.store.ispasswordupdated;
        if (isPasswordUpdated === 0) {
          Swal.fire({
            icon: "warning",
            title: "Update Required",
            text: "Please update your password before continuing!",
          });
          setShowModal(true);
        }
      } else {
        console.error("Error fetching store info:", data.msg);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const fetchNumberOfRating = async (storeId) => {
    const response = await fetch(`http://localhost:5000/api/getRatingCountByStore/${storeId}`,{
      method:'GET',
      headers:{
        'content-type':'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    if(data.success){
      setrate(data.getStoreCount)
      console.log(data.getStoreCount)
    }else{
      alert(data.msg)
    }
    
    
  }
  const fetchAvgRating = async (storeId) => {
    const response = await fetch(`http://localhost:5000/api/averageRating/${storeId}`,{
      method:'GET',
      headers:{
        'content-type':'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    if(data.success){
      setAverageRating(data.averageRating)

    }else{
      alert(data.msg)
    }
    
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.email);
        fetchPasswordUpdate(decoded.email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      navigate("/");
    }


    
    
    
    setLoading(false);
  }, [token]);

  // Apply filters + search
  const filteredRatings =
    filter === "all"
      ? ratings
      : ratings.filter((r) => r.rating === parseInt(filter));

  const searchedRatings = filteredRatings.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.date.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle password update form
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/updatepass/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password:oldPassword, changedPassword:newPassword }),
        }
      );

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been updated successfully. Please login again.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          localStorage.removeItem("token");
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.msg || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Password update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to update password. Try again later.",
      });
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <span className="text-lg font-semibold">Store Owner Dashboard</span>
        <div className="flex gap-3">
          
          <button
            onClick={() => {
              localStorage.removeItem("token");
             navigate('/');
            }}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h5 className="text-gray-700 font-medium mb-2 flex items-center justify-center gap-2">
              <i className="bi bi-star-fill text-black"></i>
              Average Rating
            </h5>
            <p className="text-3xl font-bold">{Number(averageRating)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h5 className="text-gray-700 font-medium mb-2 flex items-center justify-center gap-2">
              <i className="bi bi-people-fill text-black"></i>
              Total Ratings
            </h5>
            <p className="text-3xl font-bold">{Number(rate)}</p>
          </div>
        </div>

        {/* Ratings Table */}
        <div className='p-6'>
          {showStoreTable && (
            <Table
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'rating', label: 'Rating' }
              ]}
              data={userList}
              filterKeys={['name', 'email', 'rating']}
              emptyMessage='No Rating Available'
            />
          )}
        </div>
      </div>

      {/* Update Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Update Password</h5>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Storeownerlanding;
