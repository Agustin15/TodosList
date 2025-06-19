import styles from "./Notification.module.css";
import iconNotification from "../../assets/img/notificationTitle.png";
import iconWarningInput from "../../assets/img/warningInput.png";
import iconSubscribed from "../../assets/img/subscribed.png";
import { Title } from "../title/Title";
import Header from "../header/Header";
import { AlertStateSubscription } from "./alertState/AlertStateSubscription";
import { useSubscription } from "../../context/SubscriptionContext";

export const Notifications = () => {
  const { subscribed, styleAlert, notifyMeAlert, msjErrorSubscription } =
    useSubscription();
  return (
    <div className={styles.rowNotifications}>
      <Header />
      <div className={styles.columnNotifications}>
        <Title title={"Activity"} icon={iconNotification}></Title>
        <AlertStateSubscription
          subscribed={subscribed}
          styleAlert={styleAlert}
        />
        <div className={styles.header}>
          <div className={styles.containBtnNotification}>
            <div className={styles.columnContainBtnNotification}>
              <button onClick={notifyMeAlert}>
                <img src={subscribed ? iconSubscribed : iconNotification}></img>
                <span>{subscribed ? "subscribed" : "Subscribe push"}</span>
              </button>
              {msjErrorSubscription && (
                <div className={styles.containErrorSubscription}>
                  <img src={iconWarningInput}></img>
                  <p>{msjErrorSubscription}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.titlePC}>
            <img src={iconNotification}></img>
            <h3>Activity</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
