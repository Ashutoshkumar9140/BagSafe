import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import shelterData from "../data/shelterData";
import StudentProfile from "../components/StudentProfile";
import Wallet from "../components/Wallet";
import Chat from "../components/Chat";

function StudentDashboard() {
  const {
    user,
    logout,
    createRequest,
    saveVerificationDocument,
    getVerificationDocument,
    deleteVerificationDocument,
  } = useApp();

  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [students, setStudents] = useState("1");

  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);

  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [requestSent, setRequestSent] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);
  const [requestHomeowner, setRequestHomeowner] = useState(null);

  const [requests, setRequests] = useState([]);

  const [verificationDocument, setVerificationDocument] = useState(null);
  const [documentMessage, setDocumentMessage] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [chatRequest, setChatRequest] = useState(null);

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
    loadRequests();

    const savedDocument = getVerificationDocument();

    if (savedDocument) {
      setVerificationDocument(savedDocument);
    }

    const handleRequestUpdate = () => {
      loadRequests();
    };

    const handleStorageUpdate = (event) => {
      if (event.key === "bagsafeRequests") {
        loadRequests();
      }
    };

    window.addEventListener(
      "bagsafeRequestUpdated",
      handleRequestUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageUpdate
    );

    return () => {
      window.removeEventListener(
        "bagsafeRequestUpdated",
        handleRequestUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );
    };
  }, [user]);

  const loadRequests = () => {
    const savedRequests =
      JSON.parse(localStorage.getItem("bagsafeRequests")) || [];

    const studentRequests = savedRequests.filter(
      (request) => request.studentId === user?.id
    );

    setRequests(studentRequests);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setShelters([]);
    setSelectedShelter(null);
    setMessage("");
    setRequestSent(false);
    setRequestDetails(null);
    setRequestHomeowner(null);
    setRequestMessage("");

    if (!city || !area.trim()) {
      setMessage(
        "Please select a city and enter your exam center or area."
      );
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
      const availability = getShelterAvailability(
        shelter.id,
        shelter.capacity
      );

      const hasCapacity = availability.remainingStudents >= studentCount;
      const hasAvailability = shelter.availability !== "Unavailable";

      return hasCapacity && hasAvailability;
    });

    const matchingOwnerShelters = availableShelters.filter(
      (shelter) =>
        !shelterData.some((demoShelter) => demoShelter.id === shelter.id) &&
        shelter.city?.trim().toLowerCase() === city.trim().toLowerCase()
    );

    const demoShelters = availableShelters.filter((shelter) =>
      shelterData.some((demoShelter) => demoShelter.id === shelter.id)
    );

    const combinedShelters = [
      ...matchingOwnerShelters,
      ...demoShelters,
    ];

    const results = combinedShelters
      .slice(0, 5)
      .map((shelter, index) => ({
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

  const handleSendRequest = () => {
    if (!selectedShelter) {
      return;
    }

    const totalCost =
      selectedShelter.price * Number(students);

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
      verificationDocument: verificationDocument
        ? verificationDocument.fileName
        : null,
    });

    if (newRequest?.success === false) {
      setMessage(newRequest.message);
      return;
    }

    setRequestDetails(newRequest);
    setRequestHomeowner({
      name: selectedShelter.homeownerName || "Demo Homeowner",
      email: selectedShelter.homeownerEmail || "Not available",
      password: selectedShelter.homeownerPassword || "Not available",
    });
    setRequestSent(true);

  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];

    setDocumentMessage("");

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocumentMessage("File size must be less than 5 MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setDocumentMessage("Please upload a JPG, PNG, or PDF file.");
      return;
    }

    const documentData = {
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };

    const savedDocument = saveVerificationDocument(documentData);

    setVerificationDocument(savedDocument);

    setDocumentMessage(
      "Your exam document has been submitted successfully."
    );

    e.target.value = "";
  };

  const handleDeleteDocument = () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to remove your verification document?"
    );

    if (!shouldDelete) {
      return;
    }

    deleteVerificationDocument();

    setVerificationDocument(null);

    setDocumentMessage(
      "Your verification document has been removed."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              BagSafe
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Student Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg dark:bg-blue-950/60">
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
              onClick={logout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Welcome back
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Find a safe place near your exam
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Search for temporary shelters near your exam center and send a
            request to a homeowner.
          </p>
        </section>

        <section className="mb-8">
          <Wallet role="student" />
        </section>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
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

            {verificationDocument ? (
              <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                Document Submitted
              </span>
            ) : (
              <span className="w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300">
                Not Submitted
              </span>
            )}
          </div>

          {documentMessage && (
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {documentMessage}
            </div>
          )}

          {!verificationDocument ? (
            <div className="mt-6">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50 dark:bg-slate-950 dark:border-slate-600 dark:hover:bg-blue-950/50">
                <div className="text-3xl">📄</div>

                <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                  Upload exam document
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  PDF, JPG, or PNG — maximum 5 MB
                </p>

                <span className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                  Choose File
                </span>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center dark:bg-slate-950 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-xl dark:bg-blue-950/60">
                  📄
                </div>

                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {verificationDocument.fileName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Submitted{" "}
                    {new Date(
                      verificationDocument.uploadedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDeleteDocument}
                className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </button>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-400 dark:text-slate-500">
            Demo note: this project stores only the document information in
            local storage. It does not upload the actual file to a server.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Search for a shelter
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your exam destination to find available shelters.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-5 md:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                City
              </label>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900 dark:border-slate-600 dark:focus:ring-blue-900/50"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:focus:ring-blue-900/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Students
              </label>

              <select
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900 dark:border-slate-600 dark:focus:ring-blue-900/50"
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
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Search Shelters
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {message}
            </div>
          )}
        </section>

        {selectedShelter && (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <button
              type="button"
              onClick={handleBackToResults}
              className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to shelters
            </button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
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

                  <span className="h-fit rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                    {getShelterAvailability(selectedShelter.id, selectedShelter.capacity).remainingStudents} spots left
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
                      {getShelterAvailability(selectedShelter.id, selectedShelter.capacity).remainingStudents} spots remaining
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
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
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

              <div className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:bg-slate-950 dark:border-slate-700">
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
                        onChange={(e) =>
                          setRequestMessage(e.target.value)
                        }
                        placeholder="Tell the homeowner about your stay..."
                        rows="4"
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900 dark:border-slate-600 dark:focus:ring-blue-900/50"
                      />
                    </div>

                    {verificationDocument && (
                      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:bg-green-950/40">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                          ✓ Exam document attached
                        </p>

                        <p className="mt-1 truncate text-xs text-green-600">
                          {verificationDocument.fileName}
                        </p>
                      </div>
                    )}

                    {!verificationDocument && (
                      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:bg-yellow-950/40">
                        <p className="text-xs leading-5 text-yellow-700 dark:text-yellow-300">
                          You have not uploaded an exam document yet. You can
                          still send the request.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSendRequest}
                      className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Send Request
                    </button>
                  </>
                ) : (
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700 dark:bg-green-950/60 dark:text-green-300">
                      ✓
                    </div>

                    <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                      Request Sent
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Your request has been successfully sent to the
                      homeowner.
                    </p>

                    <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-950/40">
                      <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-300">
                        Request ID
                      </p>

                      <p className="mt-1 font-bold text-green-900">
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
                        {requestHomeowner?.name || requestDetails?.homeownerName}
                      </p>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Status
                      </p>

                      <p className="mt-1 font-semibold capitalize text-yellow-600">
                        {requestDetails?.status}
                      </p>
                    </div>

                    {requestHomeowner?.email &&
                      requestHomeowner?.password &&
                      requestHomeowner.email !== "Not available" && (
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:bg-blue-950/40">
                          <p className="text-sm font-bold text-blue-900">
                            Demo Homeowner Login
                          </p>

                          <p className="mt-2 text-xs leading-5 text-blue-700 dark:text-blue-300">
                            Use these demo credentials to open the homeowner
                            dashboard and view the request.
                          </p>

                          <div className="mt-4 space-y-2 rounded-lg bg-white p-3 text-sm dark:bg-slate-900">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Email</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {requestHomeowner.email}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Password</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {requestHomeowner.password}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {!selectedShelter && shelters.length > 0 && (
          <section className="mt-8">
            <div className="mb-5">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Available Shelters
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Showing shelters near {area}, {city}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
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

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                      {getShelterAvailability(shelter.id, shelter.capacity).remainingStudents} spots left
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>📍 {shelter.distance} away</p>

                    <p>
                      👥 Capacity: {shelter.capacity} students
                    </p>

                    <p>
                      💰 ₹{shelter.price} per student
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Amenities
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {shelter.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewShelter(shelter)}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Shelter
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              My Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track the requests you have sent to homeowners.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:bg-slate-900 dark:border-slate-600">
              <div className="text-4xl">📋</div>

              <h4 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
                No requests yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your shelter requests will appear here after you send one.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {requests.map((request) => (
                <div
                  key={request.requestId}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
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
                        {new Date(
                          request.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Your Message
                    </p>

                    <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                      {request.message || "No message provided."}
                    </div>
                  </div>

                  {request.verificationDocument && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-950/40">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        ✓ Exam document submitted
                      </p>

                      <p className="mt-1 text-xs text-green-600">
                        {request.verificationDocument}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setChatRequest(request)}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
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

      {showProfile && (
        <StudentProfile
          onClose={() => setShowProfile(false)}
        />
      )}

      {chatRequest && (
        <Chat
          request={chatRequest}
          onClose={() => setChatRequest(null)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;