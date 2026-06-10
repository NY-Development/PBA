import { Expo } from "expo-server-sdk";

export const sendPushNotification = async ({
  to,
  title,
  body,
  data = {},
}) => {
  if (!Expo.isExpoPushToken(to)) {
    throw new Error("Invalid push token");
  }

  const messages = [
    {
      to,
      sound: "default",
      title,
      body,
      data,
    },
  ];

  return await expo.sendPushNotificationsAsync(messages);
};