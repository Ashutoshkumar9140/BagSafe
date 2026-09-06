import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function HomeownerProfile({ onClose }) {
  const { user, logout, updateProfile, deleteAccount } = useApp();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || "");
  const [sex, setSex] = useState(user?.sex || "");
  const [nationality, setNationality] = useState(user?.nationality || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [email, setEmail] = useState(user?.email || "");
  const [permanentAddress, setPermanentAddress] = useState(
    user?.permanentAddress || "",
  );

  useEffect(() => {
    setName(user?.name || "");
    setAge(user?.age || "");
    setSex(user?.sex || "");
    setNationality(user?.nationality || "");
    setMobile(user?.mobile || "");
    setEmail(user?.email || "");
    setPermanentAddress(user?.permanentAddress || "");
  }, [user]);

  const ownerShelters =
    JSON.parse(localStorage.getItem("bagsafeOwnerShelters")) || [];

  const myShelters = ownerShelters.filter(
    (shelter) => shelter.homeownerId === user?.id,
  );

  // ........................ save homeowner profile and shelter details ........................

  const handleSave = (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !name.trim() ||
      !age ||
      !sex ||
      !nationality.trim() ||
      !mobile.trim() ||
      !email.trim()
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (Number(age) < 18 || Number(age) > 100) {
      setMessage("Age must be between 18 and 100.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setMessage("Mobile number must contain exactly 10 digits.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("bagsafeUsers")) || [];

    const emailExists = users.some(
      (item) =>
        item.id !== user.id && item.email.toLowerCase() === email.toLowerCase(),
    );

    const mobileExists = users.some(
      (item) => item.id !== user.id && item.mobile === mobile,
    );

    if (emailExists) {
      setMessage("This email is already registered.");
      return;
    }

    if (mobileExists) {
      setMessage("This mobile number is already registered.");
      return;
    }

    const result = updateProfile({
      name: name.trim(),
      age,
      sex,
      nationality: nationality.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      permanentAddress: permanentAddress.trim(),
    });

    if (result !== "success") {
      setMessage(result);
      return;
    }

    setMessage("Profile updated successfully.");
    setEditing(false);
  };

  // ........................ restore the homeowner profile before editing ........................

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setAge(user?.age || "");
    setSex(user?.sex || "");
    setNationality(user?.nationality || "");
    setMobile(user?.mobile || "");
    setEmail(user?.email || "");
    setPermanentAddress(user?.permanentAddress || "");

    setMessage("");
    setEditing(false);
  };

  // ........................ clear the current homeowner session ........................

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");

    if (!shouldLogout) {
      return;
    }

    logout();
  };

  // ........................ permanently remove the homeowner account ........................

  const handleDeleteAccount = (e) => {
    e.preventDefault();

    setDeleteMessage("");

    if (!deletePassword) {
      setDeleteMessage("Please enter your password.");
      return;
    }

    const result = deleteAccount(deletePassword);

    if (result !== "success") {
      setDeleteMessage(result);
      return;
    }

    setDeletePassword("");
    setShowDeleteBox(false);

    navigate("/signup", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
              🏠
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Homeowner Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your homeowner account information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </div>
          )}

          {!editing ? (
            <>
              {/* Personal Information */}
              <section>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Information provided during homeowner registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Age
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.age}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Sex
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.sex}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Nationality
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.nationality}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Mobile Number
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.mobile}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-800">
                      {user?.email}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Permanent Address
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.permanentAddress || "Not added yet"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Shelter Summary */}
              <section className="mt-8 border-t border-slate-200 pt-6">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Shelter Summary
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Overview of the shelters you have added to BagSafe.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-blue-50 p-5">
                    <p className="text-sm text-blue-600">Total Shelters</p>

                    <p className="mt-2 text-3xl font-bold text-blue-800">
                      {myShelters.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-5">
                    <p className="text-sm text-green-600">Total Capacity</p>

                    <p className="mt-2 text-3xl font-bold text-green-800">
                      {myShelters.reduce(
                        (total, shelter) =>
                          total + Number(shelter.capacity || 0),
                        0,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-green-600">Students</p>
                  </div>
                </div>

                {myShelters.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {myShelters.map((shelter) => (
                      <div
                        key={shelter.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {shelter.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {shelter.area}, {shelter.city}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-slate-800">
                            {shelter.capacity} students
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {shelter.availability}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {myShelters.length === 0 && (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                    <div className="text-3xl">🏠</div>

                    <p className="mt-3 font-semibold text-slate-700">
                      No shelters added yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add a shelter from your homeowner dashboard.
                    </p>
                  </div>
                )}
              </section>

              {/* Settings */}
              <section className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    ⚙️
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Account Settings
                    </h3>

                    <p className="text-sm text-slate-500">
                      Manage your account and profile.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setMessage("");
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Logout
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteBox(true);
                      setDeleteMessage("");
                      setDeletePassword("");
                    }}
                    className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold
                     text-red-600 transition hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                </div>
              </section>

              {/* Delete Account */}
              {showDeleteBox && (
                <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
                  <h3 className="font-bold text-red-800">
                    Delete your account?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-red-700">
                    This will permanently remove your homeowner account,
                    shelters, requests, and other account data stored by this
                    demo application.
                  </p>

                  {deleteMessage && (
                    <div className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm text-red-700">
                      {deleteMessage}
                    </div>
                  )}

                  <form onSubmit={handleDeleteAccount} className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-red-800">
                      Enter your current password
                    </label>

                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-red-200 bg-white px-4 py-3 outline-none
                       focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold
                         text-white transition hover:bg-red-700"
                      >
                        Permanently Delete
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteBox(false);
                          setDeletePassword("");
                          setDeleteMessage("");
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold
                         text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </>
          ) : (
            /* Edit Profile */
            <form onSubmit={handleSave}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Edit Homeowner Profile
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal information below.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Age
                  </label>

                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Sex
                  </label>

                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nationality
                  </label>

                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    maxLength="10"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Permanent Address
                  </label>

                  <textarea
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="Enter your permanent address"
                    rows="4"
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeownerProfile;
