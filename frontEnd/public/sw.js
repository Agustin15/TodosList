const urlLocalhostFrontend = "http://localhost:5173/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("resources").then((cache) => cache.addAll(["/logo.png"]))
  );
  self.skipWaiting();
});

self.addEventListener("push", (event) => {
  const {
    idTask,
    iconTask,
    descriptionTask,
    datetimeNotification,
    datetimeTask
  } = event.data.json();

  let differenceDate =
    new Date(datetimeTask).getTime() - new Date(datetimeNotification).getTime();

  let minutes = Math.ceil(differenceDate / 60000);
  let title = "Task will expire";

  switch (true) {
    case minutes <= 59:
      title += " in " + minutes + (minutes == 1 ? " minute" : " minutes");
      break;
    case minutes >= 60 && minutes <= 1380:
      let hours = Math.ceil(minutes / 60);
      title += " in " + hours + (minutes == 1 ? " hour" : " hours");
      break;

    case minutes >= 1440:
      let days = Math.ceil(minutes / 1440);
      title += " in " + days + (minutes == 1 ? " day" : " days");
      break;
  }

  const promiseShow = self.registration.showNotification(title, {
    body: `${iconTask} ${descriptionTask}`,
    icon: "/logo.png",
    data: { idTask: idTask }
  });

  event.waitUntil(promiseShow);
});

self.addEventListener("notificationclick", (event) => {
  const idTask = event.notification.data.idTask;

  let url = urlLocalhostFrontend + "tasks?idTask=" + idTask;

  let windowOpen;

  event.target.clients.matchAll({ type: "window" }).then((windowsOpen) => {
    for (const window of windowsOpen) {
      if ("focus" in window) {
        windowOpen = window;
        break;
      }
    }
    if (windowOpen) windowOpen.navigate(url);
    else event.target.clients.openWindow(url);
  });
});
