import styles from "./Notification.module.css";
import iconNotification from "../../assets/img/notificationTitle.png";
import iconSubscribed from "../../assets/img/subscribed.png";
import iconListNotifications from "../../assets/img/listNotificationsLogo.png";
import gifLoaderNotifications from "../../assets/img/loader.gif";
import { Title } from "../title/Title";
import Header from "../header/Header";
import { MenuProvider } from "../../context/MenuContext";
import { UserDataProvider } from "../../context/userDataContext";
import { GlassEffect } from "../glassEffect/GlassEffect";
import { ItemsNotifications } from "./itemsNotifications/itemsNotifications";
import { AlertStateSubscription } from "./alertState/AlertStateSubscription";
import { useSubscription } from "../../context/SubscriptionContext";
import { useNotification } from "../../context/NotificationContext";

export const Notifications = () => {
  const { subscribed, styleAlert, notifyMeAlert, loader } = useSubscription();

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
              {!loader && (
                <button onClick={notifyMeAlert}>
                  <GlassEffect />
                  <img
                    src={subscribed ? iconSubscribed : iconNotification}
                  ></img>
                  <span>{subscribed ? "subscribed" : "Subscribe push"}</span>
                </button>
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
