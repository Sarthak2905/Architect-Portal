/**
 * Maps each internal event to a WhatsApp template.
 * IMPORTANT: templateName must exactly match a template you've created
 * and gotten APPROVED in Meta Business Manager (WhatsApp Manager ->
 * Message Templates). "hello_world" is the only one that works with
 * zero setup — use connectivity_test to confirm your credentials first.
 *
 * Once you create your real templates, update templateName below to
 * match what Meta approved, and adjust the parameter count/order to
 * match the {{1}}, {{2}}... placeholders in that template's text.
 */
export const whatsappTemplates = {
  connectivity_test: {
    templateName: "hello_world",
    languageCode: "en_US",
    buildComponents: () => [],
  },

  new_invoice: {
    templateName: "new_invoice_notification", // <-- create & get this approved
    languageCode: "en",
    buildComponents: ({ clientName, projectTitle, amount }) => [
      {
        type: "body",
        parameters: [
          { type: "text", text: clientName },
          { type: "text", text: projectTitle },
          { type: "text", text: `Rs. ${amount.toLocaleString("en-IN")}` },
        ],
      },
    ],
  },

  payment_reminder: {
    templateName: "payment_reminder_notification",
    languageCode: "en_US", // <-- match whatever Meta actually shows
    buildComponents: ({ clientName, projectTitle, balanceDue }) => [
      {
        type: "body",
        parameters: [
          { type: "text", text: clientName },
          { type: "text", text: projectTitle },
          { type: "text", text: `Rs. ${balanceDue.toLocaleString("en-IN")}` },
        ],
      },
    ],
  },

  new_document: {
    templateName: "new_document_notification",
    languageCode: "en",
    buildComponents: ({
      clientName,
      projectTitle,
      documentType,
      documentTitle,
    }) => [
      {
        type: "body",
        parameters: [
          { type: "text", text: clientName },
          { type: "text", text: documentType },
          { type: "text", text: projectTitle },
          { type: "text", text: documentTitle },
        ],
      },
    ],
  },

  work_update: {
    templateName: "work_update_notification",
    languageCode: "en",
    buildComponents: ({ clientName, projectTitle, updateTitle }) => [
      {
        type: "body",
        parameters: [
          { type: "text", text: clientName },
          { type: "text", text: projectTitle },
          { type: "text", text: updateTitle },
        ],
      },
    ],
  },

  status_change: {
    templateName: "status_change_notification",
    languageCode: "en",
    buildComponents: ({ clientName, projectTitle, status }) => [
      {
        type: "body",
        parameters: [
          { type: "text", text: clientName },
          { type: "text", text: projectTitle },
          { type: "text", text: status },
        ],
      },
    ],
  },

  project_completion: {
    templateName: "project_completion_notification",
    languageCode: "en",
    buildComponents: ({ clientName, projectTitle }) => [
      {
        type: "body",
        parameters: [
          { type: "text", text: clientName },
          { type: "text", text: projectTitle },
        ],
      },
    ],
  },
};
