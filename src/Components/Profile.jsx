import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { FaChevronRight } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaTransgender,
  FaBriefcase
} from "react-icons/fa";

import { logout } from "../Context/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/authService";
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
    profile_picture: null
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [showScore, setShowScore] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);



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
        profile_picture: profile.profile_picture || null
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


        dispatch(UpdateUserProfile({
          profile_picture: uprofile
        }));
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

  //RECENT QUIZ API

  const getRecentQuiz = async () => {
    try {
      const response = await AuthService.recentQuizUser();
      setQuizData(response);

    } catch (error) {
      console.error("Error:", error);

    }
  }


  const userId = localStorage.getItem('userId');

  const userQuizScore = async () => {

    setLoading(true);
    try {
      const response = await AuthService.getUserSCore(userId);
      setQuizScore(response?.total_score);

      setLoading(false)
    } catch (error) {
      setQuizScore(0);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

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
                    className="px-4 py-2 bg-gray-300 text-black rounded-md">
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
                      {/* Fields */}
                      {[
                        {
                          icon: <FaUser />,
                          label: "Name",
                          field: "name",
                          type: "text"
                        },
                        {
                          icon: <FaCalendarAlt />,
                          label: "DOB",
                          field: "dob",
                          type: "date"
                        },
                        {
                          icon: <FaEnvelope />,
                          label: "Email",
                          field: "email",
                          type: "text",
                          readOnly: true
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
                          options: ["Male", "Female", "Other"]
                        },
                        {
                          icon: <FaBriefcase />,
                          label: "Occupation",
                          field: "occupation",
                          type: "dropdown",
                          options: ["Government / Public Sector", "Private Sector / Corporate", "Self-Employed / Freelancers / Entrepreneurs", "Agriculture / Labor / Skilled Trades", "Education / Healthcare / Services"],
                        },
                        {
                          icon: <FaHome />,
                          label: "Address",
                          field: "address",
                          type: "text"
                        }
                      ].map(
                        ({ icon, label, field, type, options, readOnly }) => (
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
                                      value={fields[field]}
                                      onChange={(e) =>
                                        setFields((prev) => ({ ...prev, [field]: e.target.value }))
                                      }
                                    >
                                      <option value="" disabled>
                                        Select an option
                                      </option>
                                      {options.map((option, index) => (
                                        <option key={index} value={option}>
                                          {option}
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
                                  className="text-gray-400 hover:underline"
                                  onClick={() => setEditingField(field)}
                                  style={{ cursor: "pointer" }}
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


                  <div className="flex-[3] bg-white shadow rounded-lg p-4 md:p-6">

                    {showScore && (
                      <div className="mt-[-1.5rem] mb-2 bg-gray-100 py-4 p-7 rounded-md shadow-inner flex items-center justify-center">
                        <h2 className="text-xl font-semibold text-gray-800  font-poppins">
                          Total Score : <span className="text-pink-600">{quizScore || 0}</span>
                        </h2>


                      </div>
                    )}

                    <h2 className="text-lg font-semibold text-gray-700 mb-5 font-poppins">
                      Recent MCQ's
                    </h2>
                    <ul className="space-y-4 font-inter">

                      {recentquiz.length > 0 ? (
                        recentquiz.map((recentQ) => (
                          <div key={recentQ.id} className="flex items-center gap-2">
                            <div className="w-8 h-8  bg-black/90 rounded-full flex justify-center items-center text-white font-bold">
                              <GoArrowRight color="white" />
                            </div>
                            <div>

                              <p className="text-black text-[14px]">{recentQ?.title}</p>
                            </div>
                          </div>
                        ))

                      ) : (
                        <p className="text-gray-500">No quiz data found</p>
                      )}
                    </ul>
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

