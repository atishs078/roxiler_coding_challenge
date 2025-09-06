import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === 'systemAdmin') navigate('/dashboard');
      else if (userRole === 'normalUser') navigate('/user');
      else if (userRole === 'storeOwner') navigate('/storeOwner');
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.msg || "An unexpected error occurred.");
        return;
      }

      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        localStorage.setItem('token', jsonResponse.token);
        const decodedToken = jwtDecode(jsonResponse.token);
        const userRole = decodedToken.role;

        if (userRole === 'systemAdmin') navigate('/dashboard');
        else if (userRole === 'normalUser') navigate('/user');
        else if (userRole === 'storeOwner') navigate('/storeOwner');
      } else {
        alert(jsonResponse.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Could not connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=''>
      <div className='flex justify-center items-center gap-4 '>
        <h1 className="text-3xl font-bold text-center">Roxiller Coding Challenge</h1>
      </div>
      <div className='justify-center items-center flex mt-20'>
        <div className='border p-4 rounded-lg border-gray-300 shadow-lg w-96'>
          <div className='flex items-center justify-center '>
            <h6 className='font-bold text-3xl'>Login</h6>
          </div>
          <div className='mt-4'>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <div className='text-lg font-semibold p-2'>
                  <label htmlFor="email">Email</label>
                </div>
                <div className='p-2'>
                  <input
                    id="email"
                    type='email'
                    value={formData.email}
                    className='border rounded-lg border-gray-500 p-2 focus:outline-none w-full'
                    placeholder='Enter Your Email'
                    onChange={handleChange}
                    name='email'
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className='mb-3'>
                <div className='text-lg font-semibold p-2'>
                  <label htmlFor="password">Password</label>
                </div>
                <div className='p-2'>
                  <input
                    id="password"
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='border rounded-lg border-gray-500 p-2 focus:outline-none w-full'
                    placeholder='Enter Your Password'
                    name='password'
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>
              <div className='flex justify-center items-center'>
                <button
                  type='submit'
                  className='border border-gray-500 rounded-lg p-2 w-20 font-semibold bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Login'}
                </button>
              </div>
            </form>
            {/* ✅ Signup Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
