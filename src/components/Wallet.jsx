import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

function Wallet({ role }) {
  const { user, getWallet } = useApp();

  const walletKey = `bagsafeWallet_${user?.id}`;

  const getSavedWallet = () => {
    if (!user?.id) {
      return {
        balance: 0,
        reservedBalance: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        totalWithdrawn: 0,
        transactions: [],
      };
    }

    return getWallet(user.id, role);
  };

  const [wallet, setWallet] = useState(getSavedWallet);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setWallet(getSavedWallet());
  }, [user?.id, role]);

  useEffect(() => {
    const refreshWallet = () => {
      setWallet(getSavedWallet());
    };

    window.addEventListener(
      "bagsafeWalletUpdated",
      refreshWallet
    );

    return () => {
      window.removeEventListener(
        "bagsafeWalletUpdated",
        refreshWallet
      );
    };
  }, [user?.id, role]);

  const saveWallet = (updatedWallet) => {
    localStorage.setItem(
      walletKey,
      JSON.stringify(updatedWallet)
    );

    setWallet(updatedWallet);

    window.dispatchEvent(
      new Event("bagsafeWalletUpdated")
    );
  };

  const addMoney = () => {
    const money = Number(amount);

    if (!money || money <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const transaction = {
      id: Date.now(),
      type: "credit",
      title: "Money Added",
      amount: money,
      date: new Date().toLocaleString(),
    };

    const updatedWallet = {
      ...wallet,
      balance: wallet.balance + money,
      transactions: [
        transaction,
        ...wallet.transactions,
      ],
    };

    saveWallet(updatedWallet);

    setAmount("");
    setMessage("Money added successfully.");
    setShowAddMoney(false);
  };

  const sendMoney = () => {
    const money = Number(amount);

    if (!money || money <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (money > wallet.balance) {
      setMessage("Insufficient wallet balance.");
      return;
    }

    const transaction = {
      id: Date.now(),
      type: "debit",
      title: "Money Sent",
      amount: money,
      date: new Date().toLocaleString(),
    };

    const updatedWallet = {
      ...wallet,
      balance: wallet.balance - money,
      transactions: [
        transaction,
        ...wallet.transactions,
      ],
    };

    saveWallet(updatedWallet);

    setAmount("");
    setMessage("Money sent successfully.");
    setShowSendMoney(false);
  };

  const withdrawMoney = () => {
    const money = Number(amount);

    if (!money || money <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (money > wallet.balance) {
      setMessage("Insufficient wallet balance.");
      return;
    }

    const transaction = {
      id: Date.now(),
      type: "debit",
      title: "Money Withdrawn",
      amount: money,
      date: new Date().toLocaleString(),
    };

    const updatedWallet = {
      ...wallet,
      balance: wallet.balance - money,
      totalWithdrawn:
        wallet.totalWithdrawn + money,
      transactions: [
        transaction,
        ...wallet.transactions,
      ],
    };

    saveWallet(updatedWallet);

    setAmount("");
    setMessage("Withdrawal successful.");
    setShowWithdraw(false);
  };

  const closeModal = () => {
    setAmount("");
    setMessage("");
    setShowAddMoney(false);
    setShowSendMoney(false);
    setShowWithdraw(false);
  };

  const getTransactionStyle = (type) => {
    if (
      type === "credit" ||
      type === "refund"
    ) {
      return {
        icon: "↓",
        background: "bg-green-100",
        text: "text-green-600",
        sign: "+",
      };
    }

    if (
      type === "reserved" ||
      type === "pending"
    ) {
      return {
        icon: "⏳",
        background: "bg-yellow-100",
        text: "text-yellow-600",
        sign: "",
      };
    }

    if (type === "cancelled") {
      return {
        icon: "↩",
        background: "bg-slate-100",
        text: "text-slate-600",
        sign: "",
      };
    }

    return {
      icon: "↑",
      background: "bg-red-100",
      text: "text-red-600",
      sign: "-",
    };
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 dark:bg-slate-900 dark:ring-slate-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {role === "student"
            ? "My Wallet"
            : "Earnings & Wallet"}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Demo wallet for BagSafe transactions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/40">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Available Balance
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-900">
            ₹{wallet.balance.toLocaleString()}
          </p>
        </div>

        {role === "student" && (
          <div className="rounded-2xl bg-yellow-50 p-5 dark:bg-yellow-950/40">
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Reserved for Bookings
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-900">
              ₹{wallet.reservedBalance.toLocaleString()}
            </p>

            {wallet.reservedBalance > 0 && (
              <p className="mt-2 text-xs leading-5 text-yellow-700 dark:text-yellow-300">
                This amount is temporarily reserved for
                pending booking requests.
              </p>
            )}
          </div>
        )}

        {role === "homeowner" && (
          <>
            <div className="rounded-2xl bg-green-50 p-5 dark:bg-green-950/40">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Earnings
              </p>

              <p className="mt-2 text-2xl font-bold text-green-900">
                ₹{wallet.totalEarnings.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5 dark:bg-yellow-950/40">
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Pending Earnings
              </p>

              <p className="mt-2 text-2xl font-bold text-yellow-900">
                ₹{wallet.pendingEarnings.toLocaleString()}
              </p>

              {wallet.pendingEarnings > 0 && (
                <p className="mt-2 text-xs leading-5 text-yellow-700 dark:text-yellow-300">
                  Money from booking requests waiting for
                  your decision.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-sm font-medium text-purple-700">
                Total Withdrawn
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-900">
                ₹{wallet.totalWithdrawn.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {role === "student" && (
          <>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setShowAddMoney(true);
              }}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Money
            </button>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setShowSendMoney(true);
              }}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Send Money
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setMessage("");
            setShowWithdraw(true);
          }}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Withdraw
        </button>
      </div>

      {message && (
        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-950 dark:text-slate-300">
          {message}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Transaction History
        </h3>

        {wallet.transactions.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {wallet.transactions.map((transaction) => {
              const style = getTransactionStyle(
                transaction.type
              );

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${style.background}`}
                    >
                      {style.icon}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {transaction.title}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {transaction.date}
                      </p>

                      {transaction.requestId && (
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          Request: {transaction.requestId}
                        </p>
                      )}
                    </div>
                  </div>

                  <p
                    className={`font-bold ${style.text}`}
                  >
                    {style.sign}₹
                    {Number(
                      transaction.amount
                    ).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(showAddMoney ||
        showSendMoney ||
        showWithdraw) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {showAddMoney && "Add Money"}
                {showSendMoney && "Send Money"}
                {showWithdraw && "Withdraw Money"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="text-2xl text-slate-400 hover:text-slate-700 dark:text-slate-500"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This is a demo transaction. No real money
              will be transferred.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Amount
              </label>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="Enter amount"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:focus:ring-blue-900/50"
              />
            </div>

            {message && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {message}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showAddMoney) {
                    addMoney();
                  }

                  if (showSendMoney) {
                    sendMoney();
                  }

                  if (showWithdraw) {
                    withdrawMoney();
                  }
                }}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;