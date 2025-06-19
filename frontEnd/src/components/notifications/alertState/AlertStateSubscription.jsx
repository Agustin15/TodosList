import styles from "./AlertStateSubscription.module.css";
import iconNotification from "../../../assets/img/notificationTitle.png";
import iconNotificationDisabled from "../../../assets/img/notificationDisabled.png";

export const AlertStateSubscription = ({ subscribed, styleAlert }) => {
  return (
    <div className={styles.containAlertHability}>
      <div className={styleAlert}>
        <img
          src={subscribed ? iconNotification : iconNotificationDisabled}
        ></img>
        <p>
          {subscribed
            ? "Subscription succesfully!"
            : "Unsubscription succesfully!"}
        </p>
      </div>
    </div>
  );
};
