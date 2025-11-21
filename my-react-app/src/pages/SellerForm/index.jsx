import { useState, useRef, useEffect, useCallback } from "react";
import "./sellerForm.scss";
import {
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaUser,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// NOTE: This JSX assumes you have compiled and linked the bikeform.scss file.

const bikeBrands = [
  "Select",
  "Hero",
  "Honda",
  "TVS",
  "Bajaj",
  "Royal Enfield",
  "Yamaha",
  "Suzuki",
  "KTM",
  "Harley-Davidson",
  "BMW Motorrad",
  "Ducati",
  "Kawasaki",
  "Jawa",
  "Triumph",
  "Aprilia",
  "Benelli",
];

// --- Helper Components ---

// Global toast for image success
const UploadToast = ({ showToast }) => {
  const toastClass = showToast ? "upload-toast--visible" : "upload-toast--hidden";
  
  return (
    <div className={`upload-toast ${toastClass}`}>
      <FaCheckCircle className="text-xl" />
      <span>Photo uploaded successfully!</span>
    </div>
  );
};

// Wrapper for all form fields to handle dynamic validation styling
const FormField = ({
  label,
  name,
  children,
  required,
  value,
  isTouched,
  handleBlur,
}) => {
  // Simple check: required fields must have a value other than empty string or "Select"
  const isValid = required ? value !== "" && value !== "Select" : true;
  const isInvalid = isTouched && !isValid && required;

  return (
    <div className="form-field">
      <label className="form-field__label">
        <span>
          {label} {required && <span className="required-star">*</span>}
        </span>
        {isTouched && isValid && (
          <FaCheckCircle className="valid-icon" />
        )}
      </label>
      <div className="transition-all duration-300 ease-in-out">{children}</div>
      {isInvalid && (
        <p className="form-field__error-message">
          This field is required.
        </p>
      )}
    </div>
  );
};

// --- Main Component ---
const BikeForm = () => {
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  const [currentForm, setCurrentForm] = useState({
    brand: "",
    model: "",
    year: "",
    kmDriven: "",
    fuelType: "",
    engineCC: "",
    transmission: "",
    price: "",
    city: "",
    pincode: "",
    name: "",
    phone: "",
    email: "",
    rcAvailable: "",
    insuranceDate: "",
    damages: "",
    profileImage: "",
  });

  // Calculates form completion based on required fields
  const calculateProgress = useCallback(() => {
    const requiredFields = [
      "brand",
      "model",
      "year",
      "kmDriven",
      "fuelType",
      "engineCC",
      "transmission",
      "price",
      "city",
      "pincode",
      "name",
      "phone",
      "email",
    ];
    const completedFields = requiredFields.filter(
      (key) =>
        currentForm[key] &&
        currentForm[key] !== "Select" &&
        currentForm[key] !== ""
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [currentForm]);

  const [progress, setProgress] = useState(0);

  // Update progress whenever the form data changes
  useEffect(() => {
    setProgress(calculateProgress());
  }, [currentForm, calculateProgress]);

  // Input/Change Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSubmitError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  // Image Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentForm((prev) => ({ ...prev, profileImage: reader.result }));
      setShowToast(true);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setShowToast(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1999 }, (_, i) => {
      const year = currentYear - i;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    });
  };

  // Function to get dynamic styling for inputs based on user interaction (Advanced UX)
  const getInputClass = (name, required = true) => {
    const value = currentForm[name];
    const isTouched = touchedFields[name];
    const isValid = required
      ? value && value !== "" && value !== "Select"
      : true;

    let dynamicClasses = ""; // Starts with base-input
    
    if (isTouched) {
      if (isValid) {
        dynamicClasses = "input--valid";
      } else if (required) {
        dynamicClasses = "input--invalid";
      }
    }

    return `base-input ${dynamicClasses}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check on submit
    const requiredFields = [
      "brand",
      "model",
      "year",
      "kmDriven",
      "fuelType",
      "engineCC",
      "transmission",
      "price",
      "city",
      "pincode",
      "name",
      "phone",
      "email",
    ];

    let formIsValid = true;
    const newTouchedFields = {};

    requiredFields.forEach((key) => {
      newTouchedFields[key] = true;
      if (
        !currentForm[key] ||
        currentForm[key] === "" ||
        currentForm[key] === "Select"
      ) {
        formIsValid = false;
      }
    });

    setTouchedFields(newTouchedFields);

    if (!formIsValid) {
      setSubmitError("Please fill out all required fields marked with *.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const updatedData = [...formData, currentForm];
    setFormData(updatedData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const res = await axios.post(
        "http://bikesite.test/api/sellerinfo",
        updatedData
      );

      console.log("Response:", res.data);
      alert("Form submitted successfully! Redirecting...");
      navigate("/Webpage");
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(
        "An error occurred. Please check your network and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bike-form-wrapper">
      <UploadToast showToast={showToast} />

      <form
        className="bike-form animate-fade-in"
        onSubmit={handleSubmit}
      >
        <h1 className="bike-form__header">
          Sell Your Bike 🏍️
        </h1>

        {/* Interactive Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-bar__filler"
            style={{
              width: `${progress}%`,
              minWidth: progress > 5 ? "80px" : "0",
            }}
          >
            {progress}% Complete
          </div>
        </div>

        {/* --- Bike Details Section --- */}
        <section className="form-section form-section--bike">
          <h2 className="form-section__header">
            <FaMotorcycle className="text-3xl" />
            <span>Bike Details</span>
          </h2>

          <div className="form-section__grid">
            {/* Brand (Required) */}
            <FormField
              label="Brand"
              name="brand"
              required
              value={currentForm.brand}
              isTouched={touchedFields.brand}
              handleBlur={handleBlur}
            >
              <select
                name="brand"
                value={currentForm.brand}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("brand")}
              >
                {bikeBrands.map((brand) => (
                  <option
                    key={brand}
                    value={brand}
                    disabled={brand === "Select"}
                  >
                    {brand}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Model (Required) */}
            <FormField
              label="Model"
              name="model"
              required
              value={currentForm.model}
              isTouched={touchedFields.model}
              handleBlur={handleBlur}
            >
              <input
                type="text"
                name="model"
                value={currentForm.model}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("model")}
                placeholder="e.g., Pulsar 150"
              />
            </FormField>

            {/* Year (Required) */}
            <FormField
              label="Year"
              name="year"
              required
              value={currentForm.year}
              isTouched={touchedFields.year}
              handleBlur={handleBlur}
            >
              <select
                name="year"
                value={currentForm.year}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("year")}
              >
                <option value="">Select Year</option>
                {generateYearOptions()}
              </select>
            </FormField>

            {/* KMs Driven (Required) */}
            <FormField
              label="KMs Driven"
              name="kmDriven"
              required
              value={currentForm.kmDriven}
              isTouched={touchedFields.kmDriven}
              handleBlur={handleBlur}
            >
              <input
                type="number"
                name="kmDriven"
                value={currentForm.kmDriven}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("kmDriven")}
                placeholder="Total Kilometers"
                min="0"
              />
            </FormField>

            {/* Fuel Type, Engine CC, Transmission, Price */}
            {["fuelType", "engineCC", "transmission", "price"].map((key) => (
              <FormField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                required
                value={currentForm[key]}
                isTouched={touchedFields[key]}
                handleBlur={handleBlur}
              >
                {key === "fuelType" || key === "transmission" ? (
                  <select
                    name={key}
                    value={currentForm[key]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={getInputClass(key)}
                  >
                    <option value="">Select</option>
                    {key === "fuelType" ? (
                      <>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                      </>
                    ) : (
                      <>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type={key === "price" ? "number" : "text"}
                    name={key}
                    value={currentForm[key]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={getInputClass(key)}
                    placeholder={
                      key === "price" ? "Expected Price (₹)" : "e.g., 150"
                    }
                  />
                )}
              </FormField>
            ))}

            {/* RC Available (Optional) */}
            <FormField
              label="RC Available"
              name="rcAvailable"
              value={currentForm.rcAvailable}
              isTouched={touchedFields.rcAvailable}
              handleBlur={handleBlur}
              required={false}
            >
              <select
                name="rcAvailable"
                value={currentForm.rcAvailable}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("rcAvailable", false)}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormField>

            {/* Insurance Expiry Date (Optional) */}
            <FormField
              label="Insurance Expiry Date"
              name="insuranceDate"
              value={currentForm.insuranceDate}
              isTouched={touchedFields.insuranceDate}
              handleBlur={handleBlur}
              required={false}
            >
              <input
                type="date"
                name="insuranceDate"
                value={currentForm.insuranceDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("insuranceDate", false)}
              />
            </FormField>
          </div>

          {/* Full-width fields */}
          <div className="mt-6 space-y-6">
            {/* Damages (Optional) */}
            <FormField
              label="Damages / Notes (Optional)"
              name="damages"
              value={currentForm.damages}
              isTouched={touchedFields.damages}
              handleBlur={handleBlur}
              required={false}
            >
              <textarea
                name="damages"
                value={currentForm.damages}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="3"
                className={`${getInputClass("damages", false)} input--textarea`}
                placeholder="Mention any dents, scratches, or service history details here..."
              />
            </FormField>

            {/* Photo Upload Area */}
            <div className="photo-upload-area">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Photo (Front/Side View)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div className="photo-upload-area__content">
                <span>
                  {currentForm.profileImage
                    ? "Image selected. Click or drag to change."
                    : "Click here to upload your bike photo"}
                </span>
                <FaChevronRight
                  className={`icon ${
                    currentForm.profileImage ? "icon--selected" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Location Info Section --- */}
        <section className="form-section form-section--location">
          <h2 className="form-section__header">
            <FaMapMarkerAlt className="text-3xl" />
            <span>Location Info</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* City (Required) */}
            <FormField
              label="City"
              name="city"
              required
              value={currentForm.city}
              isTouched={touchedFields.city}
              handleBlur={handleBlur}
            >
              <input
                type="text"
                name="city"
                value={currentForm.city}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("city")}
                placeholder="Your city"
              />
            </FormField>

            {/* Pincode (Required) */}
            <FormField
              label="Pincode"
              name="pincode"
              required
              value={currentForm.pincode}
              isTouched={touchedFields.pincode}
              handleBlur={handleBlur}
            >
              <input
                type="text"
                name="pincode"
                value={currentForm.pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("pincode")}
                placeholder="Area Pincode / Zipcode"
              />
            </FormField>
          </div>
        </section>

        {/* --- Seller Info Section --- */}
        <section className="form-section form-section--seller">
          <h2 className="form-section__header">
            <FaUser className="text-3xl" />
            <span>Seller Info</span>
          </h2>
          <div className="form-section__grid">
            {/* Name (Required) */}
            <FormField
              label="Name"
              name="name"
              required
              value={currentForm.name}
              isTouched={touchedFields.name}
              handleBlur={handleBlur}
            >
              <input
                type="text"
                name="name"
                value={currentForm.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("name")}
                placeholder="Your Full Name"
              />
            </FormField>

            {/* Phone (Required) */}
            <FormField
              label="Phone"
              name="phone"
              required
              value={currentForm.phone}
              isTouched={touchedFields.phone}
              handleBlur={handleBlur}
            >
              <input
                type="tel"
                name="phone"
                value={currentForm.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("phone")}
                placeholder="Contact Number"
              />
            </FormField>

            {/* Email (Required) */}
            <FormField
              label="Email"
              name="email"
              required
              value={currentForm.email}
              isTouched={touchedFields.email}
              handleBlur={handleBlur}
            >
              <input
                type="email"
                name="email"
                value={currentForm.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClass("email")}
                placeholder="Your Email Address"
              />
            </FormField>
          </div>
        </section>

        {/* --- Submission Area --- */}
        {submitError && (
          <div className="submit-error-message">
            ⚠️ **Error:** {submitError}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner" />
                <span>uploading Details...</span>
              </>
            ) : (
              <>Submit Details</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BikeForm;