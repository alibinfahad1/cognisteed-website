/* ==========================================================================
   CogniSteed — site configuration (edit this file, no build step needed)
   --------------------------------------------------------------------------
   FORM_ENDPOINT
     Leave empty ("") until a real receiver exists. While empty, the form NEVER
     pretends to submit: after validation it clearly tells the visitor that
     online submission is not active and offers to send the request through
     their own email app (mailto:) or copy it.

     To activate online submission, set a URL that accepts a POST, e.g.
       • Formspree:     "https://formspree.io/f/xxxxxxx"
       • Basin / Getform / your own API endpoint
     The form posts multipart/form-data (including the optional file) with
     header "Accept: application/json". Success is shown ONLY when the server
     answers with an HTTP 2xx status. If the server returns JSON containing
     "id" or "reference", it is shown to the visitor as the request number.

   FORM_SEND_FILE
     Set to false if your endpoint does not accept file uploads.
   ========================================================================== */
window.CS_CONFIG = {
  FORM_ENDPOINT: "",
  FORM_SEND_FILE: true,
  CONTACT_EMAIL: "info@cognisteed.com",
  MAX_FILE_MB: 10
};
