import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function StudentProfile({ onClose }) {
  const { user, updateProfile, deleteAccount } = useApp();

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

  const verificationDocument =
    JSON.parse(localStorage.getItem("bagsafeVerificationDocuments"))?.find(
      (document) => document.studentId === user?.id,
    ) || null;

  // ........................ save the edited student profile information ........................

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("");

    const result = updateProfile({
      name,
      age: String(age),
      sex,
      nationality,
      mobile,
      email,
      permanentAddress,
    });

    if (result !== "success") {
      setMessage(result);
      return;
    }

    setEditing(false);
    setMessage("Profile updated successfully.");
  };

  // ........................ cancel profile editing and restore saved information ........................

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

  // ........................ permanently remove the student account ........................

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

  // ........................ permanently remove the student account ........................

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-950/60">
              🎓
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Student Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your student account information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-2xl text-slate-400 transition
             hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div
              className="mb-6 rounded-lg border border-blue-200
             bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {message}
            </div>
          )}

          {!editing ? (
            <>
              {/* Personal Information......................................... */}

              <section>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Information provided during student registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Age
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.age}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Sex
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.sex}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Nationality
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.nationality}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Mobile Number
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.mobile}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-800 dark:text-slate-200">
                      {user?.email}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Permanent Address
                    </p>

                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {user?.permanentAddress || "Not added yet"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Verification ...................................................................................................*/}

              <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Exam Verification
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your exam document helps homeowners review your request.
                  </p>
                </div>

                {verificationDocument ? (
                  <div
                    className="flex flex-col justify-between gap-4 rounded-xl border
                   border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center dark:border-green-900 dark:bg-green-950/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-xl dark:bg-green-950/60">
                        📄
                      </div>

                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          {verificationDocument.fileName}
                        </p>

                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                          Submitted{" "}
                          {new Date(
                            verificationDocument.uploadedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span
                      className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700
                     dark:bg-green-950/60 dark:text-green-300"
                    >
                      Submitted
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/40">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚠️</span>

                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                          Exam document not submitted
                        </p>

                        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                          Upload your admit card or exam-related document from
                          your Student Dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Settings............................................................................................................ */}

              <section className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    ⚙️
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
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
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold
                     text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
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
                    className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold
                     text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    Delete Account
                  </button>
                </div>
              </section>

              {/* Delete Account....................................................................................................... */}

              {showDeleteBox && (
                <section
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5
                 dark:border-red-900 dark:bg-red-950/40"
                >
                  <h3 className="font-bold text-red-800 dark:text-red-200">
                    Delete your account?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">
                    This will permanently remove your student account, requests,
                    verification information, and other account data stored by
                    this demo application.
                  </p>

                  {deleteMessage && (
                    <div
                      className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm
                     text-red-700 dark:border-red-900 dark:bg-slate-900 dark:text-red-300"
                    >
                      {deleteMessage}
                    </div>
                  )}

                  <form onSubmit={handleDeleteAccount} className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-red-800 dark:text-red-200">
                      Enter your current password
                    </label>

                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-red-200 bg-white px-4 py-3 outline-none
                       focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-red-900
                        dark:bg-slate-900 dark:focus:border-red-400 dark:focus:ring-red-900/50"
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold
                         text-white transition hover:bg-red-700 dark:hover:bg-red-500"
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
                         text-slate-700 transition hover:bg-slate-50 dark:border-slate-600
                          dark:bg-slate-900 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </>
          ) : (
            /* Edit Profile ...............................................................................................................*/

            <form onSubmit={handleSave}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Edit Student Profile
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Sex
                  </label>

                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:bg-slate-900 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
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
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Permanent Address
                  </label>

                  <textarea
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="Enter your permanent address"
                    rows="4"
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600
                      dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-semibold
                   text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
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

export default StudentProfile;
