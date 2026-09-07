import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const demoHomeowners = [
  {
    id: "owner1",
    name: "Rajesh Sharma",
    age: "42",
    sex: "Male",
    nationality: "Indian",
    mobile: "9000000001",
    email: "owner1@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner2",
    name: "Priya Verma",
    age: "38",
    sex: "Female",
    nationality: "Indian",
    mobile: "9000000002",
    email: "owner2@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner3",
    name: "Amit Gupta",
    age: "45",
    sex: "Male",
    nationality: "Indian",
    mobile: "9000000003",
    email: "owner3@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner4",
    name: "Neha Singh",
    age: "36",
    sex: "Female",
    nationality: "Indian",
    mobile: "9000000004",
    email: "owner4@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner5",
    name: "Vikas Kumar",
    age: "40",
    sex: "Male",
    nationality: "Indian",
    mobile: "9000000005",
    email: "owner5@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner6",
    name: "Sunita Sharma",
    age: "43",
    sex: "Female",
    nationality: "Indian",
    mobile: "9000000006",
    email: "owner6@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner7",
    name: "Manoj Yadav",
    age: "41",
    sex: "Male",
    nationality: "Indian",
    mobile: "9000000007",
    email: "owner7@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
  {
    id: "owner8",
    name: "Anjali Mehta",
    age: "37",
    sex: "Female",
    nationality: "Indian",
    mobile: "9000000008",
    email: "owner8@bagsafe.demo",
    password: "owner123",
    role: "homeowner",
  },
];

const readStorage = (key, fallback = []) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("bagsafeUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // ........................ seed the main demo account with realistic dashboard data ........................

  const seedDemoHomeownerData = () => {
    if (localStorage.getItem("bagsafeDemoDataSeeded") === "true") {
      return;
    }

    const demoShelters = [
      {
        id: "demo-owner1-shelter-1",
        homeownerId: "owner1",
        homeownerName: "Rajesh Sharma",
        homeownerEmail: "owner1@bagsafe.demo",
        homeownerPassword: "owner123",
        name: "Green View Home",
        address: "24 Exam Road, Near IIT Delhi",
        city: "New Delhi",
        area: "Hauz Khas",
        capacity: 5,
        price: 350,
        availability: "Day and Night",
        amenities: ["Drinking Water", "Fan", "Charging"],
      },
      {
        id: "demo-owner1-shelter-2",
        homeownerId: "owner1",
        homeownerName: "Rajesh Sharma",
        homeownerEmail: "owner1@bagsafe.demo",
        homeownerPassword: "owner123",
        name: "Green View Study Room",
        address: "26 Exam Road, Near IIT Delhi",
        city: "New Delhi",
        area: "Hauz Khas",
        capacity: 3,
        price: 250,
        availability: "Whole Day",
        amenities: ["Wi-Fi", "Chairs", "Drinking Water"],
      },
    ];

    const demoRequests = [
      {
        id: "demo-request-1",
        requestId: "BS-DEMO-1001",
        status: "pending",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        paymentStatus: "reserved",
        paymentAmount: 700,
        studentId: "demo-student-1",
        studentName: "Aarav Kumar",
        studentEmail: "aarav@example.com",
        homeownerId: "owner1",
        homeownerName: "Rajesh Sharma",
        shelterId: "demo-owner1-shelter-1",
        shelterName: "Green View Home",
        shelterCapacity: 5,
        shelterPrice: 350,
        shelterAvailability: "Day and Night",
        shelterAmenities: ["Drinking Water", "Fan", "Charging"],
        students: 2,
        totalCost: 700,
        area: "Hauz Khas",
        city: "New Delhi",
        message: "I need a safe place near IIT Delhi for my exam day.",
      },
      {
        id: "demo-request-2",
        requestId: "BS-DEMO-1002",
        status: "accepted",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        paymentStatus: "completed",
        paymentAmount: 350,
        studentId: "demo-student-2",
        studentName: "Priya Singh",
        studentEmail: "priya@example.com",
        homeownerId: "owner1",
        homeownerName: "Rajesh Sharma",
        shelterId: "demo-owner1-shelter-1",
        shelterName: "Green View Home",
        shelterCapacity: 5,
        shelterPrice: 350,
        shelterAvailability: "Day and Night",
        shelterAmenities: ["Drinking Water", "Fan", "Charging"],
        students: 1,
        totalCost: 350,
        area: "Hauz Khas",
        city: "New Delhi",
        message: "Thank you. I would like to book one spot.",
      },
      {
        id: "demo-request-3",
        requestId: "BS-DEMO-1003",
        status: "rejected",
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        paymentStatus: "refunded",
        paymentAmount: 250,
        studentId: "demo-student-3",
        studentName: "Rohan Verma",
        studentEmail: "rohan@example.com",
        homeownerId: "owner1",
        homeownerName: "Rajesh Sharma",
        shelterId: "demo-owner1-shelter-2",
        shelterName: "Green View Study Room",
        shelterCapacity: 3,
        shelterPrice: 250,
        shelterAvailability: "Whole Day",
        shelterAmenities: ["Wi-Fi", "Chairs", "Drinking Water"],
        students: 1,
        totalCost: 250,
        area: "Hauz Khas",
        city: "New Delhi",
        message: "I need a room for my afternoon examination.",
      },
    ];

    const demoWallet = {
      balance: 3850,
      reservedBalance: 700,
      totalEarnings: 350,
      pendingEarnings: 700,
      totalWithdrawn: 1200,
      transactions: [
        {
          id: "demo-transaction-1",
          type: "pending",
          title: "Booking Payment Pending",
          amount: 700,
          requestId: "BS-DEMO-1001",
          date: new Date(Date.now() - 86400000).toLocaleString(),
        },
        {
          id: "demo-transaction-2",
          type: "credit",
          title: "Booking Payment Received",
          amount: 350,
          requestId: "BS-DEMO-1002",
          date: new Date(Date.now() - 172800000).toLocaleString(),
        },
        {
          id: "demo-transaction-3",
          type: "cancelled",
          title: "Booking Payment Cancelled",
          amount: 250,
          requestId: "BS-DEMO-1003",
          date: new Date(Date.now() - 259200000).toLocaleString(),
        },
        {
          id: "demo-transaction-4",
          type: "debit",
          title: "Money Withdrawn",
          amount: 1200,
          date: new Date(Date.now() - 345600000).toLocaleString(),
        },
      ],
    };

    const existingShelters = readStorage("bagsafeOwnerShelters", []);
    const existingRequests = readStorage("bagsafeRequests", []);

    writeStorage("bagsafeOwnerShelters", [
      ...existingShelters,
      ...demoShelters.filter(
        (shelter) =>
          !existingShelters.some(
            (item) => String(item.id) === String(shelter.id),
          ),
      ),
    ]);

    writeStorage("bagsafeRequests", [
      ...existingRequests,
      ...demoRequests.filter(
        (request) =>
          !existingRequests.some(
            (item) => item.requestId === request.requestId,
          ),
      ),
    ]);

    writeStorage("bagsafeWallet_owner1", demoWallet);
    localStorage.setItem("bagsafeDemoDataSeeded", "true");
  };

  seedDemoHomeownerData();

  // ........................ load demo homeowners and saved owner changes ........................

  const getDemoHomeowners = () => {
    const deletedIds = readStorage("bagsafeDeletedDemoHomeowners", []);
    const savedDemoHomeowners = readStorage("bagsafeDemoHomeowners", demoHomeowners);
    return savedDemoHomeowners.filter((item) => !deletedIds.includes(item.id));
  };

  // ........................ create a new student or homeowner account ........................

  const signup = (userData) => {
    const users = readStorage("bagsafeUsers", []);
    const email = userData.email.trim().toLowerCase();
    const mobile = userData.mobile.trim();

    const emailExists =
      users.some((item) => item.email.toLowerCase() === email) ||
      getDemoHomeowners().some((item) => item.email.toLowerCase() === email);

    const mobileExists =
      users.some((item) => item.mobile === mobile) ||
      getDemoHomeowners().some((item) => item.mobile === mobile);

    if (emailExists) return "Email is already registered.";
    if (mobileExists) return "Mobile number is already registered.";

    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      name: userData.name.trim(),
      age: String(userData.age),
      mobile,
      email,
      permanentAddress: userData.permanentAddress || "",
    };

    users.push(newUser);
    writeStorage("bagsafeUsers", users);
    writeStorage("bagsafeUser", newUser);
    setUser(newUser);

    return "success";
  };

  // ........................ authenticate users from local storage ........................

  const login = (loginValue, password) => {
    const value = loginValue.trim().toLowerCase();
    const users = readStorage("bagsafeUsers", []);
    const allUsers = [...users, ...getDemoHomeowners()];

    const foundUser = allUsers.find(
      (item) =>
        (item.email.toLowerCase() === value ||
          item.mobile === loginValue.trim()) &&
        item.password === password,
    );

    if (!foundUser) {
      return "Invalid email/mobile number or password.";
    }

    writeStorage("bagsafeUser", foundUser);
    setUser(foundUser);

    return "success";
  };

  const logout = () => {
    localStorage.removeItem("bagsafeUser");
    setUser(null);
  };

  // ........................ keep profile edits in sync with saved users ........................

  const updateProfile = (updatedData) => {
    if (!user) return "User not found.";

    const updatedUser = {
      ...user,
      ...updatedData,
      name: updatedData.name?.trim() || user.name,
      email: updatedData.email?.trim().toLowerCase() || user.email,
      mobile: updatedData.mobile?.trim() || user.mobile,
    };

    const users = readStorage("bagsafeUsers", []);
    const otherUsers = users.filter((item) => item.id !== user.id);
    const demoUsers = getDemoHomeowners().filter((item) => item.id !== user.id);

    const emailExists =
      otherUsers.some(
        (item) => item.email.toLowerCase() === updatedUser.email.toLowerCase(),
      ) ||
      demoUsers.some(
        (item) => item.email.toLowerCase() === updatedUser.email.toLowerCase(),
      );

    const mobileExists =
      otherUsers.some((item) => item.mobile === updatedUser.mobile) ||
      demoUsers.some((item) => item.mobile === updatedUser.mobile);

    if (emailExists) return "This email is already registered.";
    if (mobileExists) return "This mobile number is already registered.";

    if (String(user.id).startsWith("owner")) {
      const savedDemoUsers = readStorage(
        "bagsafeDemoHomeowners",
        demoHomeowners,
      );
      const updatedDemoUsers = savedDemoUsers.map((item) =>
        item.id === user.id ? updatedUser : item,
      );
      writeStorage("bagsafeDemoHomeowners", updatedDemoUsers);
    } else {
      writeStorage(
        "bagsafeUsers",
        users.map((item) => (item.id === user.id ? updatedUser : item)),
      );
    }

    writeStorage("bagsafeUser", updatedUser);
    setUser(updatedUser);

    return "success";
  };

  const deleteAccount = (password) => {
    if (!user) return "User not found.";

    if (user.password !== password) {
      return "Incorrect password.";
    }

    if (String(user.id).startsWith("owner")) {
      const deletedDemoIds = readStorage("bagsafeDeletedDemoHomeowners", []);
      if (!deletedDemoIds.includes(user.id)) {
        deletedDemoIds.push(user.id);
      }
      writeStorage("bagsafeDeletedDemoHomeowners", deletedDemoIds);

      const savedDemoUsers = readStorage(
        "bagsafeDemoHomeowners",
        demoHomeowners,
      );
      writeStorage(
        "bagsafeDemoHomeowners",
        savedDemoUsers.filter((item) => item.id !== user.id),
      );
    } else {
      const users = readStorage("bagsafeUsers", []);
      writeStorage(
        "bagsafeUsers",
        users.filter((item) => item.id !== user.id),
      );
    }

    const requests = readStorage("bagsafeRequests", []);
    writeStorage(
      "bagsafeRequests",
      requests.filter(
        (request) =>
          request.studentId !== user.id && request.homeownerId !== user.id,
      ),
    );

    const shelters = readStorage("bagsafeOwnerShelters", []);
    writeStorage(
      "bagsafeOwnerShelters",
      shelters.filter((shelter) => shelter.homeownerId !== user.id),
    );

    const documents = readStorage("bagsafeVerificationDocuments", []);
    writeStorage(
      "bagsafeVerificationDocuments",
      documents.filter((document) => document.studentId !== user.id),
    );

    localStorage.removeItem(`bagsafeWallet_${user.id}`);
    localStorage.removeItem("bagsafeUser");
    setUser(null);

    window.dispatchEvent(new Event("bagsafeRequestUpdated"));
    window.dispatchEvent(new Event("bagsafeWalletUpdated"));

    return "success";
  };

  // ........................ return the wallet used by the current role ........................

  const getWallet = (userId, role) => {
    const walletKey = `bagsafeWallet_${userId}`;
    const savedWallet = readStorage(walletKey, null);

    if (savedWallet) {
      const wallet = {
        balance: Math.max(0, Number(savedWallet.balance) || 0),
        reservedBalance: Math.max(0, Number(savedWallet.reservedBalance) || 0),
        totalEarnings: Math.max(0, Number(savedWallet.totalEarnings) || 0),
        pendingEarnings: Math.max(0, Number(savedWallet.pendingEarnings) || 0),
        totalWithdrawn: Math.max(0, Number(savedWallet.totalWithdrawn) || 0),
        transactions: Array.isArray(savedWallet.transactions)
          ? savedWallet.transactions
          : [],
      };

      writeStorage(walletKey, wallet);
      return wallet;
    }

    const defaultWallet = {
      balance: role === "student" ? 1000 : 0,
      reservedBalance: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      totalWithdrawn: 0,
      transactions: [],
    };

    writeStorage(walletKey, defaultWallet);
    return defaultWallet;
  };

  const saveWallet = (userId, wallet) => {
    writeStorage(`bagsafeWallet_${userId}`, wallet);
    window.dispatchEvent(new Event("bagsafeWalletUpdated"));
  };

  // ........................ create a booking and reserve its payment ........................

  const createRequest = (requestData) => {
    const requests = readStorage("bagsafeRequests", []);
    const totalCost = Number(requestData.totalCost);
    const requestedStudents = Number(requestData.students);

    if (!Number.isFinite(totalCost) || totalCost <= 0) {
      return { success: false, message: "Invalid booking amount." };
    }

    if (!Number.isInteger(requestedStudents) || requestedStudents < 1) {
      return { success: false, message: "Invalid number of students." };
    }

    const studentWallet = getWallet(requestData.studentId, "student");
    const homeownerWallet = getWallet(requestData.homeownerId, "homeowner");

    const shelterCapacity = Number(requestData.shelterCapacity);
    if (Number.isFinite(shelterCapacity) && shelterCapacity > 0) {
      const activeRequests = requests.filter(
        (request) =>
          request.shelterId === requestData.shelterId &&
          ["pending", "accepted"].includes(request.status),
      );

      const reservedStudents = activeRequests.reduce(
        (total, request) => total + Number(request.students || 0),
        0,
      );

      if (reservedStudents + requestedStudents > shelterCapacity) {
        return {
          success: false,
          message: `Only ${Math.max(
            0,
            shelterCapacity - reservedStudents,
          )} student spot(s) are currently available.`,
        };
      }
    }

    const duplicateRequest = requests.some(
      (request) =>
        request.studentId === requestData.studentId &&
        request.shelterId === requestData.shelterId &&
        ["pending", "accepted"].includes(request.status),
    );

    if (duplicateRequest) {
      return {
        success: false,
        message: "You already have an active request for this shelter.",
      };
    }

    if (studentWallet.balance < totalCost) {
      return {
        success: false,
        message:
          "Insufficient wallet balance. Please add money to your wallet first.",
      };
    }

    const now = Date.now();

    const newRequest = {
      id: now,
      requestId: `BS-${now}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: "reserved",
      paymentAmount: totalCost,
      ...requestData,
    };

    // ................................. keep the requested shelter visible for its homeowner ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

    // A request must always have a matching shelter on the homeowner dashboard, including demo shelters.
    const ownerShelters = readStorage("bagsafeOwnerShelters", []);
    const alreadySaved = ownerShelters.some(
      (shelter) =>
        String(shelter.id) === String(requestData.shelterId) &&
        String(shelter.homeownerId) === String(requestData.homeownerId),
    );

    if (!alreadySaved) {
      ownerShelters.push({
        id: requestData.shelterId,
        homeownerId: requestData.homeownerId,
        homeownerName: requestData.homeownerName || "Demo Homeowner",
        homeownerEmail: requestData.homeownerEmail || "",
        homeownerPassword: requestData.homeownerPassword || "owner123",
        name: requestData.shelterName || "Requested Shelter",
        address: requestData.shelterAddress || "",
        city: requestData.city || "",
        area: requestData.area || "",
        capacity: Number(requestData.shelterCapacity) || 0,
        price: Number(requestData.shelterPrice) || 0,
        availability: requestData.shelterAvailability || "",
        amenities: Array.isArray(requestData.shelterAmenities)
          ? requestData.shelterAmenities
          : [],
      });

      writeStorage("bagsafeOwnerShelters", ownerShelters);
      window.dispatchEvent(new Event("bagsafeShelterUpdated"));
    }

    const studentTransaction = {
      id: now + 1,
      type: "reserved",
      title: "Booking Amount Reserved",
      amount: totalCost,
      requestId: newRequest.requestId,
      date: new Date().toLocaleString(),
    };

    const homeownerTransaction = {
      id: now + 2,
      type: "pending",
      title: "Booking Payment Pending",
      amount: totalCost,
      requestId: newRequest.requestId,
      date: new Date().toLocaleString(),
    };

    saveWallet(requestData.studentId, {
      ...studentWallet,
      balance: studentWallet.balance - totalCost,
      reservedBalance: studentWallet.reservedBalance + totalCost,
      transactions: [studentTransaction, ...studentWallet.transactions],
    });

    saveWallet(requestData.homeownerId, {
      ...homeownerWallet,
      pendingEarnings: homeownerWallet.pendingEarnings + totalCost,
      transactions: [homeownerTransaction, ...homeownerWallet.transactions],
    });

    requests.push(newRequest);
    writeStorage("bagsafeRequests", requests);

    window.dispatchEvent(new Event("bagsafeRequestUpdated"));

    return newRequest;
  };

  // ........................ remove a request and refund pending payments ........................

  const deleteRequest = (requestId) => {
    const requests = readStorage("bagsafeRequests", []);
    const currentRequest = requests.find(
      (request) => request.requestId === requestId,
    );

    if (!currentRequest) {
      return { success: false, message: "Request not found." };
    }

    if (currentRequest.status === "pending") {
      const totalCost = Number(
        currentRequest.paymentAmount ?? currentRequest.totalCost ?? 0,
      );
      const studentWallet = getWallet(currentRequest.studentId, "student");
      const homeownerWallet = getWallet(
        currentRequest.homeownerId,
        "homeowner",
      );
      const now = Date.now();

      if (totalCost > 0) {
        saveWallet(currentRequest.studentId, {
          ...studentWallet,
          balance: studentWallet.balance + totalCost,
          reservedBalance: Math.max(
            0,
            studentWallet.reservedBalance - totalCost,
          ),
          transactions: [
            {
              id: now,
              type: "refund",
              title: "Booking Payment Refunded",
              amount: totalCost,
              requestId,
              date: new Date().toLocaleString(),
            },
            ...studentWallet.transactions,
          ],
        });

        saveWallet(currentRequest.homeownerId, {
          ...homeownerWallet,
          pendingEarnings: Math.max(
            0,
            homeownerWallet.pendingEarnings - totalCost,
          ),
          transactions: [
            {
              id: now + 1,
              type: "cancelled",
              title: "Booking Payment Cancelled",
              amount: totalCost,
              requestId,
              date: new Date().toLocaleString(),
            },
            ...homeownerWallet.transactions,
          ],
        });
      }
    }

    const updatedRequests = requests.filter(
      (request) => request.requestId !== requestId,
    );

    writeStorage("bagsafeRequests", updatedRequests);
    window.dispatchEvent(new Event("bagsafeRequestUpdated"));

    return { success: true, requests: updatedRequests };
  };

  // ........................ update booking status and related wallet values ........................

  const updateRequestStatus = (requestId, status) => {
    const requests = readStorage("bagsafeRequests", []);
    const currentRequest = requests.find(
      (request) => request.requestId === requestId,
    );

    if (!currentRequest || currentRequest.status !== "pending") {
      return requests;
    }

    if (status !== "accepted" && status !== "rejected") {
      return requests;
    }

    const studentWallet = getWallet(currentRequest.studentId, "student");
    const homeownerWallet = getWallet(currentRequest.homeownerId, "homeowner");

    const totalCost = Number(
      currentRequest.paymentAmount ?? currentRequest.totalCost,
    );

    if (!Number.isFinite(totalCost) || totalCost <= 0) {
      return requests;
    }

    const now = Date.now();
    let updatedStudentWallet = studentWallet;
    let updatedHomeownerWallet = homeownerWallet;
    let paymentStatus = currentRequest.paymentStatus;

    if (status === "accepted") {
      updatedStudentWallet = {
        ...studentWallet,
        reservedBalance: Math.max(0, studentWallet.reservedBalance - totalCost),
        transactions: [
          {
            id: now + 1,
            type: "payment",
            title: "Booking Payment Completed",
            amount: totalCost,
            requestId,
            date: new Date().toLocaleString(),
          },
          ...studentWallet.transactions,
        ],
      };

      updatedHomeownerWallet = {
        ...homeownerWallet,
        balance: homeownerWallet.balance + totalCost,
        totalEarnings: homeownerWallet.totalEarnings + totalCost,
        pendingEarnings: Math.max(
          0,
          homeownerWallet.pendingEarnings - totalCost,
        ),
        transactions: [
          {
            id: now + 2,
            type: "credit",
            title: "Booking Payment Received",
            amount: totalCost,
            requestId,
            date: new Date().toLocaleString(),
          },
          ...homeownerWallet.transactions,
        ],
      };

      paymentStatus = "completed";
    }

    if (status === "rejected") {
      updatedStudentWallet = {
        ...studentWallet,
        balance: studentWallet.balance + totalCost,
        reservedBalance: Math.max(0, studentWallet.reservedBalance - totalCost),
        transactions: [
          {
            id: now + 3,
            type: "refund",
            title: "Booking Payment Refunded",
            amount: totalCost,
            requestId,
            date: new Date().toLocaleString(),
          },
          ...studentWallet.transactions,
        ],
      };

      updatedHomeownerWallet = {
        ...homeownerWallet,
        pendingEarnings: Math.max(
          0,
          homeownerWallet.pendingEarnings - totalCost,
        ),
        transactions: [
          {
            id: now + 4,
            type: "cancelled",
            title: "Booking Payment Cancelled",
            amount: totalCost,
            requestId,
            date: new Date().toLocaleString(),
          },
          ...homeownerWallet.transactions,
        ],
      };

      paymentStatus = "refunded";
    }

    saveWallet(currentRequest.studentId, updatedStudentWallet);
    saveWallet(currentRequest.homeownerId, updatedHomeownerWallet);

    const updatedRequests = requests.map((request) =>
      request.requestId === requestId
        ? { ...request, status, paymentStatus }
        : request,
    );

    writeStorage("bagsafeRequests", updatedRequests);
    window.dispatchEvent(new Event("bagsafeRequestUpdated"));

    return updatedRequests;
  };

  // ........................ save a homeowner shelter for future searches ........................

  const addShelter = (shelterData) => {
    const shelters = readStorage("bagsafeOwnerShelters", []);

    const newShelter = {
      id: `shelter-${Date.now()}`,
      ...shelterData,
      name: shelterData.name.trim(),
      address: shelterData.address.trim(),
      city: shelterData.city.trim(),
      area: shelterData.area.trim(),
      capacity: Number(shelterData.capacity),
      price: Number(shelterData.price),
    };

    shelters.push(newShelter);
    writeStorage("bagsafeOwnerShelters", shelters);

    window.dispatchEvent(new Event("bagsafeShelterUpdated"));

    return newShelter;
  };

  const deleteShelter = (shelterId) => {
    const shelters = readStorage("bagsafeOwnerShelters", []);
    const updatedShelters = shelters.filter(
      (shelter) => shelter.id !== shelterId,
    );

    writeStorage("bagsafeOwnerShelters", updatedShelters);
    window.dispatchEvent(new Event("bagsafeShelterUpdated"));

    return updatedShelters;
  };

  // ........................ update an existing homeowner shelter without creating a duplicate shelter ........................

  const updateShelter = (shelterId, shelterData) => {
    const shelters = readStorage("bagsafeOwnerShelters", []);
    const updatedShelters = shelters.map((shelter) =>
      String(shelter.id) === String(shelterId)
        ? {
            ...shelter,
            ...shelterData,
            name: shelterData.name.trim(),
            address: shelterData.address.trim(),
            city: shelterData.city.trim(),
            area: shelterData.area.trim(),
            capacity: Number(shelterData.capacity),
            price: Number(shelterData.price),
          }
        : shelter,
    );

    writeStorage("bagsafeOwnerShelters", updatedShelters);
    window.dispatchEvent(new Event("bagsafeShelterUpdated"));

    return updatedShelters;
  };

  const saveVerificationDocument = (documentData) => {
    const documents = readStorage("bagsafeVerificationDocuments", []);
    const existingDocument = documents.find(
      (document) => document.studentId === user?.id,
    );

    if (existingDocument) {
      const updatedDocuments = documents.map((document) =>
        document.studentId === user.id
          ? { ...document, ...documentData, status: "submitted" }
          : document,
      );

      writeStorage("bagsafeVerificationDocuments", updatedDocuments);

      return updatedDocuments.find(
        (document) => document.studentId === user.id,
      );
    }

    const newDocument = {
      id: Date.now(),
      studentId: user.id,
      status: "submitted",
      ...documentData,
    };

    documents.push(newDocument);
    writeStorage("bagsafeVerificationDocuments", documents);

    return newDocument;
  };

  // ........................ store all verification documents together ........................

  const saveVerificationDocuments = (documentList) => {
    const documents = readStorage("bagsafeVerificationDocuments", []);
    const otherDocuments = documents.filter(
      (document) => document.studentId !== user?.id,
    );

    const studentDocuments = Array.isArray(documentList)
      ? documentList.map((document) => ({
          ...document,
          studentId: user?.id,
        }))
      : [];

    const updatedDocuments = [...otherDocuments, ...studentDocuments];
    writeStorage("bagsafeVerificationDocuments", updatedDocuments);

    return studentDocuments;
  };

  const getVerificationDocuments = () => {
    const documents = readStorage("bagsafeVerificationDocuments", []);

    return documents.filter((document) => document.studentId === user?.id);
  };

  const deleteVerificationDocuments = () => {
    const documents = readStorage("bagsafeVerificationDocuments", []);

    writeStorage(
      "bagsafeVerificationDocuments",
      documents.filter((document) => document.studentId !== user?.id),
    );
  };

  const getVerificationDocument = () => {
    const documents = readStorage("bagsafeVerificationDocuments", []);

    return (
      documents.find((document) => document.studentId === user?.id) || null
    );
  };

  const deleteVerificationDocument = () => {
    const documents = readStorage("bagsafeVerificationDocuments", []);

    writeStorage(
      "bagsafeVerificationDocuments",
      documents.filter((document) => document.studentId !== user?.id),
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        updateProfile,
        deleteAccount,
        createRequest,
        updateRequestStatus,
        deleteRequest,
        addShelter,
        updateShelter,
        deleteShelter,
        saveVerificationDocument,
        getVerificationDocument,
        deleteVerificationDocument,
        saveVerificationDocuments,
        getVerificationDocuments,
        deleteVerificationDocuments,
        getWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export default AppProvider;
