/* ==========================================================================
   CogniSteed — site configuration (edit this file, no build step needed)
   --------------------------------------------------------------------------
   FORM_ENDPOINT  (Formspree, intended recipient: info@cognisteed.com)
     Leave empty ("") until the Formspree form exists and its email is
     verified. While empty, the form NEVER pretends to submit: after validation
     it clearly tells the visitor that online submission is not active and
     offers to send the request through their own email app or copy it.

     Setup:
       1. Create a form at https://formspree.io with the recipient
          info@cognisteed.com and confirm the verification email sent there.
       2. Paste its endpoint below, e.g. "https://formspree.io/f/abcdwxyz".
       3. In Formspree → Settings, restrict submissions to the site domain.
     The page's Content-Security-Policy already allows https://formspree.io.
     Using another provider requires adding its origin to `connect-src` and
     `form-action` in the CSP <meta> tag in index.html.

     Success is shown ONLY for an HTTP 2xx response from the endpoint.

   FORM_SEND_FILE
     false (default): the optional RFP/scope file is NOT uploaded; after a
     successful submission the visitor is told so and offered an email link
     to send the file. Formspree's free plan does not accept file uploads.
     Set to true only if your endpoint/plan accepts multipart file uploads.
   ========================================================================== */
window.CS_CONFIG = {
  FORM_ENDPOINT: "",
  FORM_SEND_FILE: false,
  CONTACT_EMAIL: "info@cognisteed.com",
  MAX_FILE_MB: 10
};
