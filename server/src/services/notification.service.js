import { Notification } from "../models/Notification.model.js";
import { sendWhatsAppMessage } from "./whatsapp.service.js";

/**
 * Central dispatcher. Every controller trigger point calls this one
 * function instead of talking to WhatsApp directly — keeps the "log
 * every attempt" logic in one place, and leaves room to plug in email
 * or SMS later without touching the controllers again.
 */
export const sendNotification = async ({
  event,
  channel = "whatsapp",
  project,
  client,
  templateData,
}) => {
  let message = "";

  try {
    if (channel === "whatsapp") {
      const result = await sendWhatsAppMessage({ event, client, templateData });
      message = JSON.stringify(result);
    }

    await Notification.create({
      project: project._id,
      client: client._id,
      event,
      channel,
      message,
      status: "sent",
    });
  } catch (error) {
    console.error(
      `Notification send failed [${event}/${channel}]:`,
      error.message,
    );
    await Notification.create({
      project: project._id,
      client: client._id,
      event,
      channel,
      message,
      status: "failed",
      errorMessage: error.message,
    });
    // Never let a failed notification break the underlying action —
    // e.g. an invoice must still save even if WhatsApp send fails.
  }
};
