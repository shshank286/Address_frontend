import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { FaChevronRight } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaTransgender,
  FaBriefcase,
  FaGlobe,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";

import { logout } from "../Context/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/authService";
import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
} from "../services/profileServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateUserProfile } from "../Context/authSlice";
import { ToastContainer } from "react-toastify";

const Profile = () => {
  const { user_profile, profilePicture, email, name, phonenumber, gender } =
    useSelector((state) => state.auth);

  const [recentquiz, setQuizData] = useState([]);
  const [quizScore, setQuizScore] = useState([]);
  // State to hold form fields
  const [fields, setFields] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    occupation: "",
    address: "",
    country: "",
    state: "",
    district: "",
    profile_picture: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [showScore, setShowScore] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  //GET PROFILE API
  const getProfile = async () => {
    try {
      setLoading(true);
      const { profile } = await AuthService.getProfile();

      // Set the response data to the fields state
      setFields({
        firstname: profile.user.firstname || "",
        lastname: profile.user.lastname || "",
        name: profile.user.firstname + " " + profile.user.lastname || "",
        email: profile.user.email || "",
        mobile: profile.user.phonenumber || "",
        gender: profile.user.gender || "",
        dob: profile.dateOfBirth || "",
        occupation: profile.Occupation || "",
        address: profile.Address || "",
        country: profile.country || "",
        state: profile.state || "",
        district: profile.district || "",
        profile_picture: profile.profile_picture || null,
      });
    } catch (error) {
      console.error("Error loading profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const [editingField, setEditingField] = useState(null);

  const handleBlur = (field, value) => {
    setFields({ ...fields, [field]: value || fields[field] });
    setEditingField(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // UPDATE API call
  const updateApi = async () => {
    try {
      setLoading(true);
      const fromNews = location.state?.from === "news";

      const formData = new FormData();
      formData.append("Occupation", fields.occupation);

      formData.append("Address", fields.address);
      formData.append("country", fields.country);
      formData.append("state", fields.state);
      formData.append("district", fields.district);
      formData.append("firstname", fields.name.split(" ")[0] || "");
      formData.append("lastname", fields.name.split(" ")[1] || "");
      formData.append("gender", fields.gender);
      formData.append("dateOfBirth", fields.dob);
      formData.append("phonenumber", fields.mobile);

      if (file) {
        formData.append("profile_picture", file);
      }

      // API call to update the profile
      const response = await AuthService.updateProfile(formData);

      if (response && response.status === 200) {
        let uprofile = response.data.profile_picture;

        dispatch(
          UpdateUserProfile({
            profile_picture: uprofile,
          })
        );
        getProfile();
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to news details page if the user came from there
        if (fromNews) {
          const newsId = location.state.newsId;

          setTimeout(() => {
            navigate(`/detailspage/${newsId}`);
          }, 1500);
        }
      } else {
        toast.error("Failed to update profile. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchStates = async () => {
        try {
          const data = await getStatesByCountry(selectedCountry);
          setStates(data);
          setCities([]); // Reset cities when country changes
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
      fetchStates();
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const data = await getCitiesByState(selectedState);
          setCities(data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    }
  }, [selectedState]);

  //RECENT QUIZ API

  const getRecentQuiz = async () => {
    try {
      const response = await AuthService.recentQuizUser();
      setQuizData(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const userId = localStorage.getItem("userId");

  const userQuizScore = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getUserSCore(userId);
      setQuizScore(response?.total_score);

      setLoading(false);
    } catch (error) {
      setQuizScore(0);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data when the component mounts
  useEffect(() => {
    getProfile();
    getRecentQuiz();
    userQuizScore();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <div className="md:mt-[-4rem] mt-[-4rem] ">
          <hr className="h-[1.5px] bg-gray-500 mt-[-2rem] " />
          <hr className="h-[1.5px] bg-gray-500 mt-1 " />
          <div className="bg-gray-100 min-h-screen flex justify-center md:justify-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mt-10">
              <div className="relative ">
                <div className=" h-48 bg-[#E6E5E1] flex justify-center items-center ">
                  <img src={logo} alt="" className=" w-[30rem]" />
                </div>
                <div className="absolute top-[6.5rem] left-1/2 md:left-[15%] transform -translate-x-1/2 flex items-center space-x-4">
                  <div className="w-28 h-28 bg-yellow-400 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {fields.profile_picture ? (
                          <>
                            <img
                              src={fields.profile_picture}
                              alt="User Avatar"
                              className="w-full h-full object-cover"
                            />
                          </>
                        ) : (
                          <>
                            <p className=" text-black rounded-full flex uppercase items-center justify-center text-5xl font-bold font-poppins">
                              {(fields.firstname || "").substring(0, 1)}
                            </p>
                          </>
                        )}
                      </>
                    )}

                    {/* Upload button */}
                    <label
                      htmlFor="upload-photo"
                      className="absolute bottom-0 right-0 bg-white  text-xs p-1 rounded-full cursor-pointer"
                    >
                      <FaCamera className="text-xl hover:text-lg" />
                    </label>
                    <input
                      id="upload-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="py-5 mt-5 flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0 px-4 md:px-8">
                <h3 className="font-poppins font-medium capitalize text-2xl text-black">
                  {fields.firstname + " " + fields.lastname}
                </h3>
                <div className="flex justify-end gap-2 md:flex-row md:gap-4 md:w-[15rem] w-full">
                  <button
                    className="text-sm px-5 py-1 bg-black/90 text-white rounded-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                  <button
                    onClick={() => setShowScore(!showScore)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                  >
                    Quiz Score
                  </button>
                </div>
              </div>

              <hr className="h-[2px] bg-gray-600 ml-7 mr-7" />
              <div className="mt-0 p-6">
                <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                  <div className="flex-[7] bg-white rounded-lg p-4 md:p-6 font-inter text-xs">
                    <h2 className="text-lg font-semibold text-black mb-5 font-poppins">
                      About
                    </h2>
                    <div className="space-y-4">
                      {[
                        {
                          icon: <FaUser />,
                          label: "Name",
                          field: "name",
                          type: "text",
                        },
                        {
                          icon: <FaCalendarAlt />,
                          label: "DOB",
                          field: "dob",
                          type: "date",
                        },
                        {
                          icon: <FaEnvelope />,
                          label: "Email",
                          field: "email",
                          type: "text",
                          readOnly: true,
                        },
                        {
                          icon: <FaPhone />,
                          label: "Mobile",
                          field: "mobile",
                          type: "text",
                        },
                        {
                          icon: <FaTransgender />,
                          label: "Gender",
                          field: "gender",
                          type: "dropdown",
                          options: [
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ],
                        },
                        {
                          icon: <FaBriefcase />,
                          label: "Occupation",
                          field: "occupation",
                          type: "dropdown",
                          options: [
                            {
                              value: "Government / Public Sector",
                              label: "Government / Public Sector",
                            },
                            {
                              value: "Private Sector / Corporate",
                              label: "Private Sector / Corporate",
                            },
                            {
                              value:
                                "Self-Employed / Freelancers / Entrepreneurs",
                              label:
                                "Self-Employed / Freelancers / Entrepreneurs",
                            },
                            {
                              value: "Agriculture / Labor / Skilled Trades",
                              label: "Agriculture / Labor / Skilled Trades",
                            },
                            {
                              value: "Education / Healthcare / Services",
                              label: "Education / Healthcare / Services",
                            },
                          ],
                        },

                        {
                          icon: <FaHome />,
                          label: "Address",
                          field: "address",
                          type: "text",
                        },
                        {
                          icon: <FaGlobe />,
                          label: "Country",
                          field: "country",
                          type: "dropdown",
                          value: selectedCountry, // Set the selected value (ID)
                          options:
                            countries?.map((country) => ({
                              value: country.id, // Send ID
                              label: country.name, // Display Name
                            })) || [],
                          onChange: (e) => {
                            const selectedCountryId = Number(e.target.value); // Convert to number (if IDs are numbers)
                            const selectedCountryName = countries.find(
                              (country) => country.id === selectedCountryId // Find the selected country
                            )?.name;

                            setSelectedCountry(selectedCountryId); // Save ID
                            setFields((prev) => ({
                              ...prev,
                              country: selectedCountryName, // Save Name
                            }));
                          },
                        },
                        {
                          icon: <FaMapMarkerAlt />,
                          label: "State",
                          field: "state",
                          type: "dropdown",
                          options:
                            states?.map((state) => ({
                              value: state.id, // Send ID
                              label: state.name, // Display Name
                            })) || [],
                          value: selectedState, // Ensure the correct value is displayed
                          onChange: (e) => {
                            const selectedStateId = Number(e.target.value); // Convert to number (if IDs are numbers)
                            const selectedStateName = states.find(
                              (state) => state.id === selectedStateId // Direct comparison
                            )?.name;

                            setSelectedState(selectedStateId); // Save ID
                            setFields((prev) => ({
                              ...prev,
                              state: selectedStateName, // Save Name
                            }));
                          },
                        },
                        {
                          icon: <FaCity />,
                          label: "District",
                          field: "district",
                          type: "dropdown",
                          options:
                            cities?.map((city) => ({
                              value: city.id, // Send ID
                              label: city.name, // Display Name
                            })) || [],
                          onChange: (e) => {
                            const selectedCityId = Number(e.target.value); // Convert to number (if IDs are numbers)
                            const selectedCityName = cities.find(
                              (city) => city.id === selectedCityId // Direct comparison
                            )?.name;

                            setFields((prev) => ({
                              ...prev,
                              district: selectedCityName, // Save Name
                            }));
                          },
                        },
                      ].map(
                        ({
                          icon,
                          label,
                          field,
                          type,
                          options,
                          readOnly,
                          onChange,
                        }) => (
                          <div key={field}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                              <div className="flex items-center space-x-2">
                                {icon}
                                {readOnly ? (
                                  <p className="text-gray-800">
                                    {fields[field]}
                                  </p>
                                ) : editingField === field ? (
                                  type === "dropdown" ? (
                                    <select
                                      className="outline-none border p-1 rounded-lg w-full sm:w-auto"
                                      value={fields[field] || ""}
                                      onChange={(e) => {
                                        setFields((prev) => ({
                                          ...prev,
                                          [field]: e.target.value,
                                        }));
                                        if (onChange) onChange(e);
                                      }}
                                    >
                                      <option value="" disabled>
                                        Select an option
                                      </option>
                                      {options.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      className="outline-none border border-gray-400 p-1 rounded-[5px] w-full sm:w-auto"
                                      type={type}
                                      defaultValue={fields[field]}
                                      autoFocus
                                      onBlur={(e) =>
                                        handleBlur(field, e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleBlur(field, e.target.value);
                                        }
                                      }}
                                    />
                                  )
                                ) : (
                                  <p className="text-gray-800">
                                    {fields[field]}
                                  </p>
                                )}
                              </div>
                              {!readOnly && (
                                <span
                                  className="text-gray-400 hover:underline cursor-pointer"
                                  onClick={() => setEditingField(field)}
                                >
                                  <FaChevronRight />
                                </span>
                              )}
                            </div>
                            <hr className="mt-3 bg-gray-300" />
                          </div>
                        )
                      )}

                      <button
                        onClick={updateApi}
                        className="text-sm px-7 py-1 bg-black/90 text-white rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Profile;
