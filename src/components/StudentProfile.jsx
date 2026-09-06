import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function HomeownerProfile({ onClose }) {
  const {
    user,
    updateProfile,
    deleteAccount,
  } = useApp();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const deleteBoxRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || "");
  const [sex, setSex] = useState(user?.sex || "");
  const [nationality, setNationality] = useState(
    user?.nationality || ""
  );
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [email, setEmail] = useState(user?.email || "");
  const [permanentAddress, setPermanentAddress] = useState(
    user?.permanentAddress || ""
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
      setMessage(
        "Mobile number must contain exactly 10 digits."
      );
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    const users =
      JSON.parse(
        localStorage.getItem("bagsafeUsers")
      ) || [];

    const emailExists = users.some(
      (item) =>
        item.id !== user.id &&
        item.email.toLowerCase() ===
          email.toLowerCase()
    );

    const mobileExists = users.some(
      (item) =>
        item.id !== user.id &&
        item.mobile === mobile
    );

    if (emailExists) {
      setMessage("This email is already registered.");
      return;
    }

    if (mobileExists) {
      setMessage(
        "This mobile number is already registered."
      );
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

  const closeDeleteBox = () => {
    setShowDeleteBox(false);
    setDeletePassword("");
    setDeleteMessage("");
  };

  useEffect(() => {
    if (!showDeleteBox) {
      return;
    }

    if (deleteBoxRef.current) {
      deleteBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const handleOutsideClick = (event) => {
      if (
        !event.target.closest("[data-delete-box]") &&
        !event.target.closest("[data-delete-trigger]")
      ) {
        closeDeleteBox();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDeleteBox]);

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

    navigate("/login?role=homeowner", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
              🏠
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Homeowner Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your homeowner account information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-3xl font-semibold leading-none text-red-500 dark:bg-red-950/40 dark:text-red-400 transition hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50 dark:hover:text-red-300"
          >
            ×
          </button>
        </div>

        <div
          className="p-6"
        >
          {message && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
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

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Information provided during homeowner registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Age
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.age}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Sex
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.sex}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Nationality
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.nationality}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Mobile Number
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.mobile}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-800 dark:text-slate-200">
                      {user?.email}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800 sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                      Permanent Address
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.permanentAddress ||
                        "Not added yet"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Settings */}
              <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    ⚙️
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Account Settings
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
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
                    onClick={() => {
                      setShowDeleteBox(true);
                      setDeleteMessage("");
                      setDeletePassword("");
                    }}
                    data-delete-trigger
                    className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 dark:border-red-900 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    Delete Account
                  </button>
                </div>
              </section>

              {/* Delete Account */}
              {showDeleteBox && (
                <section
                  ref={deleteBoxRef}
                  data-delete-box
                  onClick={(event) => event.stopPropagation()}
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30"
                >
                  <h3 className="font-bold text-red-800 dark:text-red-200">
                    Delete your account?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">
                    This will permanently remove your homeowner account,
                    shelters, requests, and other account data stored by this
                    demo application.
                  </p>

                  {deleteMessage && (
                    <div className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-slate-900 dark:text-red-300">
                      {deleteMessage}
                    </div>
                  )}

                  <form
                    onSubmit={handleDeleteAccount}
                    className="mt-5"
                  >
                    <label className="mb-2 block text-sm font-medium text-red-800 dark:text-red-200">
                      Enter your current password
                    </label>

                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) =>
                        setDeletePassword(e.target.value)
                      }
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-red-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 dark:border-red-900 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Permanently Delete
                      </button>

                      <button
                        type="button"
                        onClick={closeDeleteBox}
                        className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
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

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update your personal information below.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition text-slate-900 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Age
                  </label>

                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition text-slate-900 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Sex
                  </label>

                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition text-slate-900 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nationality
                  </label>

                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) =>
                      setNationality(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition text-slate-900 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    maxLength="10"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition text-slate-900 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition text-slate-900 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Permanent Address
                  </label>

                  <textarea
                    value={permanentAddress}
                    onChange={(e) =>
                      setPermanentAddress(e.target.value)
                    }
                    placeholder="Enter your permanent address"
                    rows="4"
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
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
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
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