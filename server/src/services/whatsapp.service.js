import { env } from "../config/env.js";
import { whatsappTemplates } from "./whatsappTemplates.js";
import { formatPhoneForWhatsApp } from "../utils/formatPhone.js";

const graphUrl = () =>
  `https://graph.facebook.com/v19.0/${env.whatsapp.phoneNumberId}/messages`;

export const sendWhatsAppMessage = async ({ event, client, templateData }) => {
  const template = whatsappTemplates[event];
  if (!template) {
    throw new Error(`No WhatsApp template mapped for event: ${event}`);
  }

  const { templateName, languageCode, buildComponents } = template;

  const payload = {
    messaging_product: "whatsapp",
    to: formatPhoneForWhatsApp(client.phone),
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: buildComponents(templateData),
    },
  };

  const response = await fetch(graphUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.whatsapp.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "WhatsApp send failed");
  }

  return data;
};
