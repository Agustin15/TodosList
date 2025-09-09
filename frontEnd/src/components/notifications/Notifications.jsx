import styles from "./Notification.module.css";
import iconNotification from "../../assets/img/notificationTitle.png";
import iconNotificationDisabled from "../../assets/img/notificationDisabled.png";
import iconSubscribed from "../../assets/img/subscribed.png";
import iconListNotifications from "../../assets/img/listNotificationsLogo.png";
import gifLoaderNotifications from "../../assets/img/loader.gif";
import { Title } from "../title/Title";
import Header from "../header/Header";
import { UserDataProvider } from "../../context/UserDataContext";
import { GlassEffect } from "../glassEffect/GlassEffect";
import { ItemsNotifications } from "./itemsNotifications/ItemsNotifications";
import { AlertStateSubscription } from "./alertState/AlertStateSubscription";
import { useSubscription } from "../../context/SubscriptionContext";
import { useNotification } from "../../context/NotificationContext";

export const Notifications = () => {
  const {
    subscribed,
    styleAlert,
    notifyMeAlert,
    loader,
    errorGetSubscriptions
  } = useSubscription();

  const { notifications, loaderNotifications } = useNotification();

  return (
    <div className={styles.rowNotifications}>
      <UserDataProvider>
        <Header />
      </UserDataProvider>
      <div className={styles.columnNotifications}>
        <Title title={"Activity"} icon={iconNotification}></Title>

        <AlertStateSubscription
          subscribed={subscribed}
          styleAlert={styleAlert}
        />
        <div className={styles.header}>
          <div className={styles.containBtnNotification}>
            <div className={styles.columnContainBtnNotification}>
              {loader && <p>loading subscription ...</p>}
              {!loader && !errorGetSubscriptions && (
                <button onClick={notifyMeAlert}>
                  <GlassEffect />
                  <img
                    src={subscribed ? iconSubscribed : iconNotification}
                  ></img>
                  <span>{subscribed ? "subscribed" : "Subscribe push"}</span>
                </button>
              )}
              {!loader && errorGetSubscriptions && (
                <div className={styles.containErrorSubscriptions}>
                  <img src={iconNotificationDisabled}></img>
                  <span>Failed to get user subscription </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.titlePC}>
            <img src={iconNotification}></img>
            <h3>Activity</h3>
          </div>
        </div>

        {loaderNotifications == false ? (
          notifications.length > 0 ? (
            <ItemsNotifications notifications={notifications} />
          ) : (
            <div className={styles.containAlert}>
              <img src={iconListNotifications}></img>
              <h3>Here you will can be see your notifications</h3>
            </div>
          )
        ) : (
          <div className={styles.loadingNotifications}>
            <img src={gifLoaderNotifications}></img>
            <span>Loading notifications</span>
          </div>
        )}
      </div>
    </div>
  );
};
