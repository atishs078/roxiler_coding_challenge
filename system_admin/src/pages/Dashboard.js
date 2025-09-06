import React, { useState, useEffect } from 'react';
import CountUp from '../components/CountUp';
import Table from '../components/Table';
import sweetAlert from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import { RiUserAddFill } from "react-icons/ri";
import { FaStore } from "react-icons/fa";
import { RiListCheck2 } from "react-icons/ri";
import { CgUserList } from "react-icons/cg";
import { BiSolidStoreAlt } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import Modal from '../components/Modal';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  const [numberOFUser, setnumberOFUser] = useState(0);
  const [numberofStore, setnumberofStore] = useState(0);
  const [numberOfRating, setnumberOfRating] = useState(0);
  const [userList, setUserList] = useState([]);
  const [showUserTable, setShowUserTable] = useState(true);
  const [showStoreTable, setStoreTable] = useState(false)
  const [storeList, setStoreList] = useState([])

  // USER MODAL STATE
  const [modalData, setModalData] = useState({
    name:'',
    email:'',
    password:'',
    address:'',
    role:'normalUser'
  }) 
  const [isModalOpen, setIsModalOpen] = useState(false)

  // STORE MODAL STATE
  const [storeModalData, setStoreModalData] = useState({
    name:'',
    email:'',
    address:''
  })
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)

  const handelOpen = () => setIsModalOpen(true)
  const handelClose = () => setIsModalOpen(false)

  const handelStoreOpen = () => setIsStoreModalOpen(true)
  const handelStoreClose = () => setIsStoreModalOpen(false)

  const handelSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/register', {
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify(modalData)
    })
    const jsonResponse = await response.json()
    if(jsonResponse.success){
      sweetAlert.fire({
        text:"User Added Successfully",
        title:"User Add",
        icon:'success',
        confirmButtonText:'Ok',
        confirmButtonColor: '#3085d6'
      }).then((result)=>{
        if(result.isConfirmed){
           setIsModalOpen(false)
        }
      })
    }else{
      alert('Something went wrong')
      setIsModalOpen(false)
    }
  }

  const handelStoreSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/addStore', {
      method:'POST',
      headers:{
        'content-type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body:JSON.stringify(storeModalData)
    })
    const jsonResponse = await response.json()
    if(jsonResponse.success){
      sweetAlert.fire({
        text:"Store Added Successfully",
        title:"Store Add",
        icon:'success',
        confirmButtonText:'Ok',
        confirmButtonColor: '#3085d6'
      }).then((result)=>{
        if(result.isConfirmed){
           setIsStoreModalOpen(false)
        }
      })
    }else{
      alert('Something went wrong')
      setIsStoreModalOpen(false)
    }
  }

  useEffect(() => {
    fetchNumberOfUsers();
    fetchNumberOfStores();
    fetchNumberOFRating();
    handelOnListOfUser()
  }, []);

  const handelOnChange=async (e) => {
    const { name, value } = e.target;
    setModalData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handelStoreChange = async (e) => {
    const { name, value } = e.target;
    setStoreModalData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  const logout = async () => {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You will be logged out",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes Logout',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token')
        navigate('/')
      }
    })
  }

  const fetchNumberOfUsers = async () => {
    const fetch1 = await fetch('http://localhost:5000/api/userCount', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!fetch1.ok) {
      alert("Something went wrong, please try again later");
      return;
    }

    const jsonResponse = await fetch1.json();
    if (jsonResponse.success) {
      setnumberOFUser(jsonResponse.usersCount);
    }
  };

  const fetchNumberOFRating = async () => {
    const fetch1 = await fetch('http://localhost:5000/api/getRatingCount', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!fetch1.ok) {
      alert("Something went wrong, please try again later");
      return;
    }

    const jsonResponse = await fetch1.json();
    if (jsonResponse.success) {
      setnumberOfRating(jsonResponse.ratingCount);
    }
  };

  const fetchNumberOfStores = async () => {
    const fetch1 = await fetch('http://localhost:5000/api/storeCount', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!fetch1.ok) {
      alert("Something went wrong, please try again later");
      return;
    }

    const jsonResponse = await fetch1.json();
    if (jsonResponse.success) {
      setnumberofStore(jsonResponse.getStoreCount);
    }
  };

  const handelOnListOfUser = async () => {
    const response = await fetch('http://localhost:5000/api/listOfUsers', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      alert("Something went wrong, please try again later");
      return;
    }

    const jsonResponse = await response.json();
    if (jsonResponse.success) {
      setUserList(jsonResponse.users);
      setStoreTable(false)
      setShowUserTable(true);
    }
  };

  const fetchStoresList = async () => {
    const response = await fetch('http://localhost:5000/api/getStores', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      alert("Something went wrong")
      return
    }
    const jsonResponse = await response.json()
    if (jsonResponse.success) {
      setStoreTable(true)
      setShowUserTable(false)
      setStoreList(jsonResponse.stores)
    }
  }

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className='flex flex-col justify-start items-start bg-gray-100 w-60 h-screen shadow-lg rounded-r-xl p-6'>
        <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

        <button className='w-full text-left py-2 px-4 mb-2 rounded hover:bg-gray-200 font-semibold text-gray-700'
          onClick={handelOpen}>
          <RiUserAddFill className='inline mr-2' size={20} />
          Add New User
        </button>

        <button className='w-full text-left py-2 px-4 mb-2 rounded hover:bg-gray-200 font-semibold text-gray-700'
          onClick={handelStoreOpen}>
          <FaStore className='inline mr-2' size={20} />
          Add New Store
        </button>

        <button className='w-full text-left py-2 px-4 mb-2 rounded hover:bg-gray-200 font-semibold text-gray-700'
          onClick={fetchStoresList}>
          <RiListCheck2 className='inline mr-2' size={20} />
          List Of Stores
        </button>

        <button
          className='w-full text-left py-2 px-4 mb-2 rounded hover:bg-gray-200 font-semibold text-gray-700'
          onClick={handelOnListOfUser}
        >
          <CgUserList className='inline mr-2' size={20} />
          List Of Users
        </button>

        <button className='w-full text-left py-2 px-4 mb-2 rounded hover:bg-gray-200 font-semibold text-gray-700'
          onClick={logout} >
          <IoLogOut className='inline mr-2' size={20} />
          LogOut
        </button>
      </div>
      
      {/* Main Content */}
      <div className='border border-black shadow-lg rounded-lg ml-2 flex-1 h-screen overflow-y-auto'>
        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6'>
          <div className='relative bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center'>
            <h2 className='text-gray-500 text-lg font-semibold mb-2'>Total Users</h2>
            <CountUp
              from={0}
              to={Number(numberOFUser)}
              separator=","
              duration={1.5}
              className="text-3xl font-bold text-blue-600"
            />
            <div className="absolute bottom-2 right-2 opacity-60">
              <FaUserGroup size={60} color="gray" />
            </div>
          </div>

          <div className="relative bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center">
            <h2 className="text-gray-500 text-lg font-semibold mb-2">Total Stores</h2>
            <CountUp
              from={0}
              to={Number(numberofStore)}
              separator=","
              duration={1.5}
              className="text-3xl font-bold text-green-600"
            />
            <div className="absolute bottom-2 right-2 opacity-60">
              <BiSolidStoreAlt size={60} color="gray" />
            </div>
          </div>

          <div className='relative bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center'>
            <h2 className='text-gray-500 text-lg font-semibold mb-2'>Total Ratings</h2>
            <CountUp
              from={0}
              to={Number(numberOfRating)}
              separator=","
              duration={1.5}
              className="text-3xl font-bold text-yellow-600"
            />
            <div className="absolute bottom-2 right-2 opacity-60">
              <FaStar size={60} color="gray" />
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className='p-6'>
          {showUserTable && (
            <Table
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'address', label: 'Address' },
                { key: 'role', label: 'Role' },
              ]}
              data={userList}
              filterKeys={['name', 'email', 'role','address']}
              emptyMessage="No user available"
            />
          )}
        </div>
        <div className='p-6'>
          {showStoreTable && (
            <Table
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'address', label: 'Address' },
                { key: 'averageRating', label: 'Rating' }
              ]}
              data={storeList}
              filterKeys={['name', 'email', 'averageRating']}
              emptyMessage='No Store Available'
            />
          )}
        </div>
      </div>

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New User"
        onClose={handelClose}
        onSubmit={handelSubmit}
        submitText='Save'
        cancelText='Cancel'>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            name='name'
            onChange={handelOnChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={modalData.name}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name='email'
            onChange={handelOnChange}
            value={modalData.email}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <textarea
            type='text'
            placeholder="Address"
            name='address'
            value={modalData.address}
            onChange={handelOnChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={modalData.password}
            onChange={handelOnChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
      </Modal>

      {/* Store Modal */}
      <Modal
        isOpen={isStoreModalOpen}
        title="Add New Store"
        onClose={handelStoreClose}
        onSubmit={handelStoreSubmit}
        submitText='Save'
        cancelText='Cancel'>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Store Name"
            name='name'
            onChange={handelStoreChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={storeModalData.name}
            required
          />
          <input
            type="email"
            placeholder="Store Email"
            name='email'
            onChange={handelStoreChange}
            value={storeModalData.email}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
          type='password'
          placeholder='Enter Psssword'
          name='password'
          onChange={handelStoreChange}
          value={storeModalData.password}
          className='w-full border border-gray-300 rounded px-3 py-2'
          required
          >
          
          </input>
          <textarea
            type='text'
            placeholder="Store Address"
            name='address'
            value={storeModalData.address}
            onChange={handelStoreChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
