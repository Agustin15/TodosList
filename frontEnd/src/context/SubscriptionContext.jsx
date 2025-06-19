import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import stylesAlert from "../components/notifications/alertState/AlertStateSubscription.module.css";
import { useContext } from "react";
const applicationServerKey = import.meta.env.VITE_APPLICATION_SERVER;
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [styleAlert, setStyleAlert] = useState(stylesAlert.alertHability);
  const [subscribed, setSubscribed] = useState();
  const [msjErrorSubscription, setMsjErrorSubscription] = useState();

  useEffect(() => {
    stateSubscribe();
  }, []);

  const stateSubscribe = async () => {
    try {
      let register = await getRegisterSW();
      let subscription = await register.pushManager.getSubscription();
      setSubscribed(subscription);
    } catch (error) {
      console.log(error);
    }
  };

  const notifyMeAlert = async () => {
    if (!"Notification" in window) {
      alert("This browser not support notifications");
    } else {
      try {
        let permission = await Notification.requestPermission();
        if (permission == "granted") {
          subscriptionPush();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const showAlert = () => {
    setStyleAlert(
      stylesAlert.alertHability + " " + stylesAlert.alertHabilityShow
    );

    setTimeout(() => {
      hideAlert();
    }, 5000);
  };

  const hideAlert = () => {
    setStyleAlert(
      stylesAlert.alertHability + " " + stylesAlert.alertHabilityHide
    );
  };

  const getRegisterSW = async () => {
    try {
      const register = await navigator.serviceWorker.getRegistration(
        "http://localhost:5173/"
      );
      return register;
    } catch (error) {
      console.log(error);
    }
  };

  const subscriptionPush = async () => {
    try {
      let register = await getRegisterSW();
      if (!subscribed) {
        let subscriptionCreated = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });

        let result = await fetchSaveSubscription(
          subscriptionCreated
        );
        if (result) {
          setSubscribed(subscriptionCreated);
          showAlert();
        } else {
          subscriptionCreated.unsubscribe();
          setMsjErrorSubscription("Error to generate subscription");
        }
      } else {
        unsubscribe();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unsubscribe = async () => {
    let deleteSubs = await fetchDeleteSubscriptions();
    if (!deleteSubs) {
      setMsjErrorSubscription("Error to unsubscribe");
    } else {
      let unsubscribe = await subscribed.unsubscribe();
      if (unsubscribe) {
        setMsjErrorSubscription("");
        setSubscribed();
        showAlert();
      }
    }
  };

  const fetchDeleteSubscriptions = async () => {
    let data;
    let param = { endpoint: encodeURIComponent(subscribed.endpoint)};
    try {
      const response = await fetch("/api/subscription/" + JSON.stringify(param), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status == 404) {
          location.href = urlFront + "login";
        }
      } else {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };
  const fetchSaveSubscription = async (subscription) => {
    let data;
    try {
      const response = await fetch("/api/subscription/", {
        method: "POST",
        body: JSON.stringify({
          subscription: subscription
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status == 404) {
          location.href = urlFront + "login";
        }
      } else {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };
  return (
    <SubscriptionContext.Provider
      value={{ styleAlert, notifyMeAlert, subscribed, msjErrorSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
