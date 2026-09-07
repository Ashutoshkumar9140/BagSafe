import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import shelterData from "../data/shelterData";
import StudentProfile from "../components/StudentProfile";
import Wallet from "../components/Wallet";
import Chat from "../components/Chat";

function StudentDashboard() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    createRequest,
    deleteRequest,
    saveVerificationDocuments,
    getVerificationDocuments,
    deleteVerificationDocuments,
  } = useApp();

  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [students, setStudents] = useState("1");

  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);

  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestWarning, setRequestWarning] = useState("");

  const [requestSent, setRequestSent] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);
  const [requestHomeowner, setRequestHomeowner] = useState(null);

  const [requests, setRequests] = useState([]);

  const [verificationDocuments, setVerificationDocuments] = useState([]);
  const [documentMessage, setDocumentMessage] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [chatRequest, setChatRequest] = useState(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [showDocumentConfirm, setShowDocumentConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetRequest, setDeleteTargetRequest] = useState(null);

  const supportedCities = [
    "Delhi",
    "Kanpur",
    "Lucknow",
    "Noida",
    "Prayagraj",
    "Jaipur",
    "Agra",
    "Varanasi",
    "Gurgaon",
    "Ghaziabad",
  ];

  useEffect(() => {
    if (!requestWarning) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [requestWarning]);

  // ................................. keep requests and verification data in sync .................................

  useEffect(() => {
    loadRequests();

    const savedDocuments = getVerificationDocuments();
    setVerificationDocuments(savedDocuments);

    const handleRequestUpdate = () => {
      loadRequests();
    };

    const handleStorageUpdate = (event) => {
      if (event.key === "bagsafeRequests") {
        loadRequests();
      }
    };

    window.addEventListener("bagsafeRequestUpdated", handleRequestUpdate);

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("bagsafeRequestUpdated", handleRequestUpdate);

      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [user]);

  // ................................. calculate remaining shelter capacity .................................

  const getShelterAvailability = (shelterId, capacity) => {
    const savedRequests =
      JSON.parse(localStorage.getItem("bagsafeRequests")) || [];

    const reservedStudents = savedRequests
      .filter(
        (request) =>
          request.shelterId === shelterId && request.status !== "rejected",
      )
      .reduce((total, request) => total + Number(request.students || 0), 0);

    return {
      reservedStudents,
      remainingStudents: Math.max(Number(capacity || 0) - reservedStudents, 0),
    };
  };

  const loadRequests = () => {
    const savedRequests =
      JSON.parse(localStorage.getItem("bagsafeRequests")) || [];

    const studentRequests = savedRequests.filter(
      (request) => request.studentId === user?.id,
    );

    setRequests(studentRequests);
  };

  // ......................... search available shelters for the selected destination .........................

  // ................................. open the custom delete confirmation modal .................................

  const handleDeleteRequest = (request) => {
    if (!request?.requestId) {
      return;
    }

    setDeleteTargetRequest(request);
    setShowDeleteConfirm(true);
  };

  // .................................... delete the selected request after confirmation ....................................

  const confirmDeleteRequest = () => {
    if (!deleteTargetRequest?.requestId) {
      return;
    }

    const result = deleteRequest(deleteTargetRequest.requestId);

    if (!result?.success) {
      setMessage(result?.message || "Unable to delete this request.");
      setShowDeleteConfirm(false);
      setDeleteTargetRequest(null);
      return;
    }

    setMessage("Request deleted successfully.");
    window.setTimeout(() => setMessage(""), 5000);
    setRequestSent(false);
    setRequestDetails(null);
    setRequestHomeowner(null);
    setShowDeleteConfirm(false);
    setDeleteTargetRequest(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setShelters([]);
    setSelectedShelter(null);
    setRequestWarning("");
    setMessage("");
    setRequestSent(false);
    setRequestDetails(null);
    setRequestHomeowner(null);
    setRequestMessage("");

    if (!city || !area.trim()) {
      setMessage("Please select a city and enter your exam center or area.");
      return;
    }

    if (!supportedCities.includes(city)) {
      setMessage("Sorry, we are not serviceable in this location.");
      return;
    }

    const studentCount = Number(students);
    const searchArea = area.trim();

    const savedOwnerShelters =
      JSON.parse(localStorage.getItem("bagsafeOwnerShelters")) || [];

    const allShelters = [...savedOwnerShelters, ...shelterData];

    const availableShelters = allShelters.filter((shelter) => {
      const availability = getShelterAvailability(shelter.id, shelter.capacity);

      const hasCapacity = availability.remainingStudents >= studentCount;
      const hasAvailability = shelter.availability !== "Unavailable";

      return hasCapacity && hasAvailability;
    });

    const matchingOwnerShelters = availableShelters.filter(
      (shelter) =>
        !shelterData.some((demoShelter) => demoShelter.id === shelter.id) &&
        shelter.city?.trim().toLowerCase() === city.trim().toLowerCase(),
    );

    const demoShelters = availableShelters.filter((shelter) =>
      shelterData.some((demoShelter) => demoShelter.id === shelter.id),
    );

    const combinedShelters = [...matchingOwnerShelters, ...demoShelters];

    const results = combinedShelters.slice(0, 5).map((shelter, index) => ({
      ...shelter,
      city: shelter.city || city,
      area: shelter.area || searchArea,
      distance: `${(0.8 + index * 0.6).toFixed(1)} km`,
    }));

    setShelters(results);

    if (results.length === 0) {
      setMessage("No shelters are available for this group size.");
    }
  };

  const handleViewShelter = (shelter) => {
    const duplicateRequest = requests.some(
      (request) =>
        request.studentId === user?.id &&
        String(request.shelterId) === String(shelter.id) &&
        ["pending", "accepted"].includes(request.status),
    );

    if (duplicateRequest) {
      setSelectedShelter(null);
      setRequestWarning("You already created a request for this house. Delete that request first to create a new request.");
      setMessage("");
      return;
    }

    setRequestWarning("");
    setSelectedShelter(shelter);
    setMessage("");
    setRequestSent(false);
    setRequestDetails(null);
    setRequestHomeowner(null);
    setRequestMessage("");
  };

  const handleBackToResults = () => {
    setSelectedShelter(null);
    setRequestSent(false);
    setRequestDetails(null);
    setRequestMessage("");
  };

  // ...................................... send the shelter request ......................................

  const handleSendRequest = () => {
    if (!selectedShelter) {
      return;
    }

    const duplicateRequest = requests.some(
      (request) =>
        request.studentId === user?.id &&
        String(request.shelterId) === String(selectedShelter.id) &&
        ["pending", "accepted"].includes(request.status),
    );

    if (duplicateRequest) {
      setSelectedShelter(null);
      setRequestSent(false);
      setRequestDetails(null);
      setRequestHomeowner(null);
      setRequestWarning("You already created a request for this house. Delete that request first to create a new request.");
      setMessage("");
      return;
    }

    const totalCost = selectedShelter.price * Number(students);

    const newRequest = createRequest({
      homeownerName: selectedShelter.homeownerName,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      homeownerId: selectedShelter.homeownerId,
      shelterId: selectedShelter.id,
      shelterCapacity: selectedShelter.capacity,
      shelterName: selectedShelter.name,
      city: selectedShelter.city,
      area: selectedShelter.area,
      students: Number(students),
      totalCost,
      message: requestMessage.trim(),
      verificationDocuments: verificationDocuments.map((document) => ({
        studentNumber: document.studentNumber,
        fileName: document.fileName,
      })),
      verificationDocument:
        verificationDocuments.length > 0
          ? verificationDocuments
              .map((document) => document.fileName)
              .join(", ")
          : null,
      homeownerEmail: selectedShelter.homeownerEmail,
      shelterAddress: selectedShelter.address,
      shelterPrice: selectedShelter.price,
      shelterAvailability: selectedShelter.availability,
      shelterAmenities: selectedShelter.amenities,
    });

    if (newRequest?.success === false) {
      if (newRequest.message?.toLowerCase().includes("already have an active request")) {
        setSelectedShelter(null);
        setRequestWarning("You already created a request for this house. Delete that request first to create a new request.");
        setMessage("");
      } else if (newRequest.message?.toLowerCase().includes("insufficient wallet balance")) {
        setRequestWarning(newRequest.message);
        setMessage("");
      } else {
        setMessage(newRequest.message);
      }
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("bagsafeUsers")) || [];
    const savedDemoHomeowners =
      JSON.parse(localStorage.getItem("bagsafeDemoHomeowners")) || [];

    const homeowner =
      savedUsers.find((item) => item.id === selectedShelter.homeownerId) ||
      savedDemoHomeowners.find(
        (item) => item.id === selectedShelter.homeownerId,
      );

    const demoHomeownerDefaults = {
      owner1: {
        name: "Rajesh Sharma",
        email: "owner1@bagsafe.demo",
        password: "owner123",
      },
      owner2: {
        name: "Priya Verma",
        email: "owner2@bagsafe.demo",
        password: "owner123",
      },
      owner3: {
        name: "Amit Gupta",
        email: "owner3@bagsafe.demo",
        password: "owner123",
      },
      owner4: {
        name: "Neha Singh",
        email: "owner4@bagsafe.demo",
        password: "owner123",
      },
      owner5: {
        name: "Vikas Kumar",
        email: "owner5@bagsafe.demo",
        password: "owner123",
      },
      owner6: {
        name: "Sunita Sharma",
        email: "owner6@bagsafe.demo",
        password: "owner123",
      },
      owner7: {
        name: "Manoj Yadav",
        email: "owner7@bagsafe.demo",
        password: "owner123",
      },
      owner8: {
        name: "Anjali Mehta",
        email: "owner8@bagsafe.demo",
        password: "owner123",
      },
    };

    const defaultHomeowner = demoHomeownerDefaults[selectedShelter.homeownerId];

    const homeownerEmail =
      homeowner?.email ||
      selectedShelter.homeownerEmail ||
      defaultHomeowner?.email ||
      "Not available";

    const homeownerPassword =
      homeowner?.password ||
      selectedShelter.homeownerPassword ||
      defaultHomeowner?.password ||
      "Not available";

    setRequestDetails(newRequest);
    setRequestHomeowner({
      name:
        homeowner?.name ||
        selectedShelter.homeownerName ||
        defaultHomeowner?.name ||
        "Demo Homeowner",
      email: homeownerEmail,
      password: homeownerPassword,
    });
    setRequestSent(true);
    setShowDemoCredentials(
      homeownerEmail !== "Not available" &&
        homeownerPassword !== "Not available",
    );
  };

  // .............................. validate and save the exam document ..............................

  const handleDocumentUpload = (e, studentNumber) => {
    const file = e.target.files[0];

    setDocumentMessage("");

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocumentMessage("File size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setDocumentMessage("Please upload a JPG, PNG, or PDF file.");
      e.target.value = "";
      return;
    }

    const documentData = {
      studentNumber,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };

    const savedDocuments = saveVerificationDocuments([
      ...verificationDocuments,
      documentData,
    ]);

    setVerificationDocuments(savedDocuments);
    setDocumentMessage(
      `${savedDocuments.length} document${savedDocuments.length > 1 ? "s" : ""} submitted successfully.`,
    );

    e.target.value = "";
  };

  const handleDeleteDocument = (documentIndex) => {
    const updatedDocuments = verificationDocuments.filter(
      (_, index) => index !== documentIndex,
    );

    const savedDocuments = saveVerificationDocuments(updatedDocuments);
    setVerificationDocuments(savedDocuments);
    setDocumentMessage("Verification document removed.");
  };

  const clearAllDocuments = () => {
    deleteVerificationDocuments();
    setVerificationDocuments([]);
    setShowDocumentConfirm(false);
    setDocumentMessage("All verification documents have been removed.");
  };

  // ................................. student dashboard layout and content .................................

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              BagSafe
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Student Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login?role=student", { replace: true });
              }}
              className="bagsafe-home-button rounded-xl px-3 py-2 text-sm font-bold sm:px-4"
            >
              🏠 Home
            </button>

            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition
               hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full
               bg-blue-100 text-lg dark:bg-blue-950/60"
              >
                🎓
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login?role=student", { replace: true });
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium
               text-slate-700 transition hover:bg-slate-100 dark:border-slate-600
                dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Welcome back
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Find a safe place near your exam
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Search for temporary shelters near your exam center and send a
            request to a homeowner.
          </p>
        </section>

        {/* .............................. show the student's wallet .............................. */}

        <section className="bagsafe-section bagsafe-blue-section mb-8 rounded-3xl p-3 sm:p-4">
          <Wallet role="student" />
        </section>

        {/* ................................. exam verification section ................................. */}

        <section className="bagsafe-section bagsafe-green-section mb-8 rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Student Verification
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Upload your exam admit card or exam-related document so the
                homeowner can review your request with more confidence.
              </p>
            </div>

            {verificationDocuments.length > 0 ? (
              <span
                className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold
               text-green-700 dark:bg-green-950/40 dark:text-green-300"
              >
                {verificationDocuments.length} Document
                {verificationDocuments.length > 1 ? "s" : ""} Submitted
              </span>
            ) : (
              <span
                className="w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold
               text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300"
              >
                Not Submitted
              </span>
            )}
          </div>

          {documentMessage && (
            <div
              className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm
             text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"
            >
              {documentMessage}
            </div>
          )}

          <div className="mt-6 max-h-80 overflow-y-auto pr-1">
            <div className="space-y-4">
              {Array.from({ length: Number(students) }, (_, studentIndex) => {
                const studentNumber = studentIndex + 1;
                const studentDocuments = verificationDocuments.filter(
                  (document) =>
                    document.studentNumber === studentNumber ||
                    (!document.studentNumber && studentNumber === 1),
                );

                return (
                  <div
                    key={studentNumber}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4
                     dark:border-emerald-900 dark:bg-emerald-950/20"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          Student {studentNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          Select admit card and identity documents for this
                          student.
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {studentDocuments.length} selected
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {studentDocuments.map((document) => {
                        const documentIndex =
                          verificationDocuments.indexOf(document);

                        return (
                          <div
                            key={
                              document.id ||
                              `${document.fileName}-${documentIndex}`
                            }
                            className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100
                             bg-white px-3 py-3 dark:border-emerald-900 dark:bg-slate-900"
                          >
                            <p className="min-w-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                              ✓ {document.fileName}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteDocument(documentIndex)
                              }
                              className="shrink-0 text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}

                      <label
                        className="flex cursor-pointer items-center justify-center rounded-xl border-2 
                      border-dashed border-emerald-300 bg-white px-4 py-3 text-center text-sm font-bold
                       text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50
                        dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                      >
                        + Select another admit card / identity document
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleDocumentUpload(e, studentNumber)
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400 dark:text-slate-500">
            Demo note: this project stores only the document information in
            local storage. It does not upload the actual file to a server.
          </p>
        </section>

        {/* ......................... shelter search form and results trigger ......................... */}

        <section className="bagsafe-section bagsafe-blue-section rounded-3xl p-4 sm:p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Search for a shelter
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your exam destination to find available shelters.
            </p>
          </div>

          <>
            <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    City
                  </label>

                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900
                  dark:border-slate-600 dark:focus:ring-blue-900/50 dark:focus:border-blue-400"
                  >
                    <option value="">Select city</option>

                    {supportedCities.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Exam Center / Area
                  </label>

                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Noida Sector 62"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:focus:ring-blue-900/50 dark:focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Students
                  </label>

                  <select
                    value={students}
                    onChange={(e) => setStudents(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900
                  dark:border-slate-600 dark:focus:ring-blue-900/50 dark:focus:border-blue-400"
                  >
                    <option value="1">1 Student</option>
                    <option value="2">2 Students</option>
                    <option value="3">3 Students</option>
                    <option value="4">4 Students</option>
                    <option value="5">5 Students</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
                  >
                    Search Shelters
                  </button>
                </div>
              </form>

              {message && (
                <div
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm
             text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                >
                  {message}
                </div>
              )}
          </>
        </section>

        {/* ...................................... selected shelter details ...................................... */}

        {selectedShelter && (
          <section className="bagsafe-section bagsafe-purple-section mt-8 rounded-3xl p-4 sm:p-6">
            <button
              type="button"
              onClick={handleBackToResults}
              className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              ← Back to shelters
            </button>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                      {selectedShelter.name}
                    </h3>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      Near {selectedShelter.area}, {selectedShelter.city}
                    </p>

                    {selectedShelter.homeownerName && (
                      <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Hosted by {selectedShelter.homeownerName}
                      </p>
                    )}
                  </div>

                  <span
                    className="h-fit rounded-full bg-green-50 px-4 py-2 text-sm font-semibold
                   text-green-700 dark:bg-green-950/40 dark:text-green-300"
                  >
                    {
                      getShelterAvailability(
                        selectedShelter.id,
                        selectedShelter.capacity,
                      ).remainingStudents
                    }{" "}
                    spots left
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Distance
                    </p>

                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedShelter.distance}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Capacity
                    </p>

                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedShelter.capacity} students
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {
                        getShelterAvailability(
                          selectedShelter.id,
                          selectedShelter.capacity,
                        ).remainingStudents
                      }{" "}
                      spots remaining
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      ₹{selectedShelter.price} / student
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Amenities
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedShelter.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700
                         dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    About this shelter
                  </h4>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    This is a demo shelter listing on BagSafe. It provides
                    students with a temporary place to rest near their exam
                    destination.
                  </p>
                </div>
              </div>

              <div
                className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4
               dark:bg-slate-950 dark:border-slate-700 sm:p-6"
              >
                {!requestSent ? (
                  <>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Request this shelter
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Send a request to the homeowner for your selected group.
                    </p>

                    <div className="mt-6 rounded-lg bg-white p-4 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Students
                        </span>

                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {students}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Estimated cost
                        </span>

                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          ₹{selectedShelter.price * Number(students)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Message to homeowner
                      </label>

                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Tell the homeowner about your stay..."
                        rows="4"
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 
                        py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2
                         focus:ring-blue-100 dark:bg-slate-900 dark:border-slate-600 dark:focus:ring-blue-900/50 dark:focus:border-blue-400"
                      />
                    </div>

                    {verificationDocuments.length > 0 && (
                      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:bg-green-950/40 dark:border-green-900">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                          ✓ Exam document attached
                        </p>

                        <p className="mt-1 truncate text-xs text-green-600 dark:text-green-400">
                          {verificationDocuments
                            .map((document) => document.fileName)
                            .join(", ")}
                        </p>
                      </div>
                    )}

                    {!verificationDocuments.length && (
                      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:bg-yellow-950/40 dark:border-yellow-900">
                        <p className="text-xs leading-5 text-yellow-700 dark:text-yellow-300">
                          You have not uploaded an exam document yet. You can
                          still send the request.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSendRequest}
                      className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold
                       text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
                    >
                      Send Request
                    </button>
                  </>
                ) : (
                  <div>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full
                     bg-green-100 text-xl text-green-700 dark:bg-green-950/60 dark:text-green-300"
                    >
                      ✓
                    </div>

                    <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                      Request Sent
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Your request has been successfully sent to the homeowner.
                    </p>

                    <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-950/40 dark:border-green-900">
                      <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-300">
                        Request ID
                      </p>

                      <p className="mt-1 font-bold text-green-900 dark:text-green-100">
                        {requestDetails?.requestId}
                      </p>
                    </div>

                    <div className="mt-4 rounded-lg bg-white p-4 dark:bg-slate-900">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Shelter
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {requestDetails?.shelterName}
                      </p>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Homeowner
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {requestHomeowner?.name ||
                          requestDetails?.homeownerName}
                      </p>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Status
                      </p>

                      <p className="mt-1 font-semibold capitalize text-yellow-600 dark:text-yellow-400">
                        {requestDetails?.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ................................. show matching shelter cards ................................. */}

        {!selectedShelter && shelters.length > 0 && (
          <section className="bagsafe-section bagsafe-amber-section mt-8 rounded-3xl p-4 sm:p-6">
            <div className="mb-5">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Available Shelters
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Showing shelters near {area}, {city}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200
                   dark:bg-slate-900 dark:ring-slate-700 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {shelter.name}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Near {shelter.area}, {shelter.city}
                      </p>

                      {shelter.homeownerName && (
                        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                          Hosted by {shelter.homeownerName}
                        </p>
                      )}
                    </div>

                    <span
                      className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold
                     text-green-700 dark:bg-green-950/40 dark:text-green-300"
                    >
                      {
                        getShelterAvailability(shelter.id, shelter.capacity)
                          .remainingStudents
                      }{" "}
                      spots left
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>📍 {shelter.distance} away</p>

                    <p>👥 Capacity: {shelter.capacity} students</p>

                    <p>💰 ₹{shelter.price} per student</p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Amenities
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {shelter.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600
                           dark:bg-slate-800 dark:text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewShelter(shelter)}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition
                     hover:bg-blue-700 dark:hover:bg-blue-500"
                  >
                    View Shelter
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ................................. track previously sent requests ................................. */}

        <section className="bagsafe-section bagsafe-purple-section mt-12 rounded-3xl p-4 sm:p-6">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              My Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track the requests you have sent to homeowners.
            </p>
          </div>

          {requests.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 
            text-center sm:p-10 dark:bg-slate-900 dark:border-slate-600"
            >
              <div className="text-4xl">📋</div>

              <h4 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No requests yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your shelter requests will appear here after you send one.
              </p>
            </div>
          ) : (
            <div className="bagsafe-hidden-scrollbar max-h-[620px] space-y-5 overflow-y-auto pr-1">
              {requests.map((request) => (
                <div
                  key={request.requestId}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          {request.shelterName}
                        </h4>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === "accepted"
                              ? "bg-green-50 text-green-700"
                              : request.status === "rejected"
                                ? "bg-red-50 text-red-700"
                                : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Request ID: {request.requestId}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Location
                      </p>

                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {request.area}, {request.city}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Students
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {request.students}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total Cost
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        ₹{request.totalCost}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Requested
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Your Message
                    </p>

                    <div
                      className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600
                     dark:bg-slate-950 dark:text-slate-300"
                    >
                      {request.message || "No message provided."}
                    </div>
                  </div>

                  {request.verificationDocument && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-950/40 dark:border-green-900">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        ✓ Exam document submitted
                      </p>

                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        {request.verificationDocument}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(request)}
                      className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold
                       text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40
                        dark:text-red-300 dark:hover:bg-red-950/70"
                    >
                      Delete Request
                    </button>

                    <button
                      type="button"
                      onClick={() => setChatRequest(request)}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm 
                      font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"
                    >
                      💬 Chat with Homeowner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {requestWarning && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-warning-title"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-yellow-200 bg-white p-6 shadow-2xl
            dark:border-yellow-900 dark:bg-slate-900 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xl dark:bg-yellow-950/60">
                ⚠️
              </div>

              <div className="min-w-0 flex-1 pr-1">
                <h3
                  id="request-warning-title"
                  className="text-lg font-bold text-slate-900 dark:text-slate-100"
                >
                  Request Warning
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {requestWarning}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRequestWarning("")}
                aria-label="Close request warning"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl font-bold leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ................................ profile and chat overlays ................................ */}

      {showProfile && <StudentProfile onClose={() => setShowProfile(false)} />}

      {chatRequest && (
        <Chat request={chatRequest} onClose={() => setChatRequest(null)} />
      )}

      {showDeleteConfirm && deleteTargetRequest && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-request-title"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl
           dark:border-red-900 dark:bg-slate-900 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                 bg-red-100 text-xl dark:bg-red-950/60"
                >
                  🗑️
                </div>

                <div>
                  <h2
                    id="delete-request-title"
                    className="text-xl font-bold text-slate-900 dark:text-slate-100"
                  >
                    Delete Request?
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetRequest(null);
                }}
                aria-label="Close delete confirmation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 
                text-2xl font-bold leading-none text-slate-500 transition hover:bg-slate-200 hover:text-slate-800
                 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this {deleteTargetRequest.status}{" "}
              request? Pending booking amounts will be refunded to your wallet.
              Accepted and rejected requests will simply be removed.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetRequest(null);
                }}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold
                 text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteRequest}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold
                 text-white transition hover:bg-red-700 dark:hover:bg-red-500"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      {showDemoCredentials &&
        requestHomeowner?.email &&
        requestHomeowner?.password && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-homeowner-title"
          >
            <div
              className="w-full max-w-lg rounded-3xl border border-blue-200
             bg-white p-6 shadow-2xl dark:border-blue-800 dark:bg-slate-900 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                    Request submitted
                  </p>
                  <h2
                    id="demo-homeowner-title"
                    className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100"
                  >
                    Demo Homeowner Credentials
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(false)}
                  aria-label="Close demo credentials"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                   bg-red-50 text-3xl font-bold leading-none text-red-600 transition
                    hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Your request has been sent. Keep these demo homeowner
                credentials to open the homeowner dashboard and review the
                request.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/30">
                <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-all text-lg font-black text-slate-900 dark:text-slate-100">
                    {requestHomeowner.email}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Password
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
                    {requestHomeowner.password}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 
              text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
              >
                Close this box with the red × button when you have finished
                reading the credentials. The page remains blocked until you
                close it.
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default StudentDashboard;
