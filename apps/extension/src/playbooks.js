/**
 * Playbook registry — per-site guided action flows for V1.
 *
 * Each site entry defines:
 *   - change-email steps
 *   - delete-account steps (with required 4-step safety gate)
 *
 * Selectors are best-effort. When they fail, `fallbackInstruction` is shown
 * to guide the user manually. The playbook runtime NEVER auto-submits
 * destructive steps.
 */
export const PLAYBOOK_REGISTRY = [
    {
        serviceId: "netflix",
        serviceName: "Netflix",
        loginUrl: "https://www.netflix.com/login",
        guides: {
            "change-email": [
                { id: "n-1", title: "Go to account settings", actionType: "navigate", selector: undefined, fallbackInstruction: "Open netflix.com/YourAccount in your browser." },
                { id: "n-2", title: "Click 'Change email'", actionType: "click", selector: "a[href*='ChangeEmail']", fallbackInstruction: "Find and click 'Change email' next to your current email address." },
                { id: "n-3", title: "Enter your new email", actionType: "fill", selector: "input[name='newEmail'], input[type='email']", fallbackInstruction: "Type your new email address in the field shown." },
                { id: "n-4", title: "Confirm and save", actionType: "instruction", fallbackInstruction: "Click 'Save changes' and check your new inbox for a confirmation email from Netflix." },
            ],
            "delete-account": [
                { id: "nd-1", title: "Go to account settings", actionType: "navigate", fallbackInstruction: "Open netflix.com/YourAccount in your browser." },
                { id: "nd-2", title: "Scroll to 'Cancel Membership'", actionType: "instruction", fallbackInstruction: "Scroll down and click 'Cancel Membership'." },
                { id: "nd-3", title: "Follow cancellation steps", actionType: "instruction", fallbackInstruction: "Complete all steps shown by Netflix to fully cancel your account. Note: Netflix may retain your data for 10 months after cancellation." },
                { id: "nd-4", title: "Confirm deletion complete", actionType: "confirm", fallbackInstruction: "You have completed account deletion. Your data will be purged per Netflix's retention policy." },
            ],
        },
    },
    {
        serviceId: "spotify",
        serviceName: "Spotify",
        loginUrl: "https://accounts.spotify.com/login",
        guides: {
            "change-email": [
                { id: "sp-1", title: "Go to Spotify account page", actionType: "navigate", fallbackInstruction: "Open www.spotify.com/account/profile/ in your browser." },
                { id: "sp-2", title: "Click 'Edit profile'", actionType: "click", selector: "button[data-encore-id='buttonTertiary']", fallbackInstruction: "Click the 'Edit profile' button on the page." },
                { id: "sp-3", title: "Update your email address", actionType: "fill", selector: "input#email, input[type='email']", fallbackInstruction: "Replace your email in the Email field." },
                { id: "sp-4", title: "Save changes", actionType: "instruction", fallbackInstruction: "Click 'Save profile'. Spotify will send a confirmation to your new email." },
            ],
            "delete-account": [
                { id: "spd-1", title: "Contact Spotify Support", actionType: "navigate", fallbackInstruction: "Spotify requires you to request deletion via their support page: support.spotify.com. Search 'close account'." },
                { id: "spd-2", title: "Download your data first", actionType: "instruction", fallbackInstruction: "Recommended: before deleting, go to Account → Privacy settings → Request your data." },
                { id: "spd-3", title: "Submit deletion request", actionType: "instruction", fallbackInstruction: "Fill in the deletion form on Spotify's support page. Spotify will process it within 30 days." },
                { id: "spd-4", title: "Confirm request sent", actionType: "confirm", fallbackInstruction: "Your deletion request has been submitted. Check your email for confirmation from Spotify." },
            ],
        },
    },
    {
        serviceId: "facebook",
        serviceName: "Facebook",
        loginUrl: "https://www.facebook.com/login",
        guides: {
            "change-email": [
                { id: "fb-1", title: "Open Facebook settings", actionType: "navigate", fallbackInstruction: "Go to facebook.com/settings?tab=account." },
                { id: "fb-2", title: "Click 'Email' contact info", actionType: "click", selector: "a[href*='email']", fallbackInstruction: "Find and click the email row under 'Contact info'." },
                { id: "fb-3", title: "Add new email address", actionType: "instruction", fallbackInstruction: "Click '+ Add another email' and enter your new address." },
                { id: "fb-4", title: "Verify and set as primary", actionType: "instruction", fallbackInstruction: "Confirm via the verification email, then set your new address as primary." },
            ],
            "delete-account": [
                { id: "fbd-1", title: "Download your data first", actionType: "navigate", fallbackInstruction: "Go to facebook.com/dyi to request and download your full data archive before deleting." },
                { id: "fbd-2", title: "Go to account deletion page", actionType: "navigate", fallbackInstruction: "Go to facebook.com/help/delete_account. Click 'Continue to account deletion'." },
                { id: "fbd-3", title: "Request deletion", actionType: "instruction", fallbackInstruction: "Click 'Delete account' and enter your password when prompted." },
                { id: "fbd-4", title: "Confirm — 30 day grace period", actionType: "confirm", fallbackInstruction: "Facebook keeps your account recoverable for 30 days. Avoid logging in during this period to ensure permanent deletion." },
            ],
        },
    },
    {
        serviceId: "instagram",
        serviceName: "Instagram",
        loginUrl: "https://www.instagram.com/accounts/login/",
        guides: {
            "change-email": [
                { id: "ig-1", title: "Open Edit Profile", actionType: "navigate", fallbackInstruction: "Go to instagram.com/accounts/edit/ in your browser." },
                { id: "ig-2", title: "Update email field", actionType: "fill", selector: "input#email_field, input[name='email']", fallbackInstruction: "Click the Email field and enter your new address." },
                { id: "ig-3", title: "Save changes", actionType: "instruction", fallbackInstruction: "Click 'Submit' and confirm via verification email from Instagram." },
                { id: "ig-4", title: "Verification complete", actionType: "confirm", fallbackInstruction: "Click the link in your new email inbox to verify the change." },
            ],
            "delete-account": [
                { id: "igd-1", title: "Go to deletion page", actionType: "navigate", fallbackInstruction: "Instagram deletion requires visiting instagram.com/accounts/remove/request/permanent/ — this must be done from a mobile browser or the website directly." },
                { id: "igd-2", title: "Select reason and enter password", actionType: "instruction", fallbackInstruction: "Select a reason from the dropdown, then enter your password to confirm." },
                { id: "igd-3", title: "Submit deletion request", actionType: "instruction", fallbackInstruction: "Click 'Delete account'. Your account will be permanently deleted after 30 days." },
                { id: "igd-4", title: "Confirm request sent", actionType: "confirm", fallbackInstruction: "Your account deletion is pending. Do not log back in for 30 days or it will be cancelled." },
            ],
        },
    },
    {
        serviceId: "linkedin",
        serviceName: "LinkedIn",
        loginUrl: "https://www.linkedin.com/login",
        guides: {
            "change-email": [
                { id: "li-1", title: "Open email settings", actionType: "navigate", fallbackInstruction: "Go to linkedin.com/psettings/email in your browser." },
                { id: "li-2", title: "Add a new email", actionType: "click", selector: "button[data-control-name='add_email']", fallbackInstruction: "Click 'Add email address' and enter your new address." },
                { id: "li-3", title: "Verify new email", actionType: "instruction", fallbackInstruction: "Check your new inbox for a LinkedIn verification email and click the link." },
                { id: "li-4", title: "Set as primary", actionType: "instruction", fallbackInstruction: "Return to LinkedIn email settings and click 'Make primary' next to your new address." },
            ],
            "delete-account": [
                { id: "lid-1", title: "Download your data", actionType: "navigate", fallbackInstruction: "Go to linkedin.com/mypreferences/d/download-my-data and request a data archive." },
                { id: "lid-2", title: "Open account closure page", actionType: "navigate", fallbackInstruction: "Go to linkedin.com/mypreferences/d/close-account." },
                { id: "lid-3", title: "Select reason and confirm", actionType: "instruction", fallbackInstruction: "Choose a reason for closing your account and click 'Next'. Then enter your password and click 'Close account'." },
                { id: "lid-4", title: "Confirm account closed", actionType: "confirm", fallbackInstruction: "Your LinkedIn account is now closed. Data is deleted after approximately 30 days." },
            ],
        },
    },
    {
        serviceId: "twitter",
        serviceName: "X / Twitter",
        loginUrl: "https://x.com/login",
        guides: {
            "change-email": [
                { id: "tw-1", title: "Open email settings", actionType: "navigate", fallbackInstruction: "Go to x.com/settings/email in your browser." },
                { id: "tw-2", title: "Update email address", actionType: "fill", selector: "input[name='email'], input[type='email']", fallbackInstruction: "Enter your new email address in the input field." },
                { id: "tw-3", title: "Verify via SMS or app", actionType: "instruction", fallbackInstruction: "X may require identity verification. Complete the steps shown." },
                { id: "tw-4", title: "Check verification email", actionType: "confirm", fallbackInstruction: "Confirm via the link sent to your new email address." },
            ],
            "delete-account": [
                { id: "twd-1", title: "Download your archive first", actionType: "navigate", fallbackInstruction: "Go to x.com/settings/download_your_data and request your data archive." },
                { id: "twd-2", title: "Go to deactivation page", actionType: "navigate", fallbackInstruction: "Go to x.com/settings/accounts/confirm_deactivation." },
                { id: "twd-3", title: "Deactivate account", actionType: "instruction", fallbackInstruction: "Click 'Deactivate' and confirm with your password. X keeps your account in a 30-day deactivation period." },
                { id: "twd-4", title: "Confirm: do not log in for 30 days", actionType: "confirm", fallbackInstruction: "Account permanently deleted after 30 days without login. Logging in will reactivate it." },
            ],
        },
    },
    {
        serviceId: "dropbox",
        serviceName: "Dropbox",
        loginUrl: "https://www.dropbox.com/login",
        guides: {
            "change-email": [
                { id: "db-1", title: "Go to account settings", actionType: "navigate", fallbackInstruction: "Go to dropbox.com/account/general in your browser." },
                { id: "db-2", title: "Click email address", actionType: "click", selector: "button[data-testid='email-change']", fallbackInstruction: "Click on your email address listed under your profile photo." },
                { id: "db-3", title: "Enter new email and confirm", actionType: "fill", selector: "input[name='new_email'], input[type='email']", fallbackInstruction: "Fill in your new email address and confirm it in the second field." },
                { id: "db-4", title: "Verify new email", actionType: "confirm", fallbackInstruction: "Click the verification link in your new inbox to complete the change." },
            ],
            "delete-account": [
                { id: "dbd-1", title: "Export your files first", actionType: "instruction", fallbackInstruction: "Download your Dropbox files locally before deleting your account." },
                { id: "dbd-2", title: "Go to account deletion", actionType: "navigate", fallbackInstruction: "Go to dropbox.com/account/delete_account and sign in." },
                { id: "dbd-3", title: "Confirm deletion", actionType: "instruction", fallbackInstruction: "Read the warnings and click 'Delete account'. Enter your password when prompted." },
                { id: "dbd-4", title: "Deletion confirmed", actionType: "confirm", fallbackInstruction: "Your Dropbox account is deleted. Files and data will be permanently removed within 30 days." },
            ],
        },
    },
    {
        serviceId: "lastpass",
        serviceName: "LastPass",
        loginUrl: "https://lastpass.com",
        guides: {
            "change-email": [
                { id: "lp-1", title: "Log in to LastPass", actionType: "navigate", fallbackInstruction: "Open lastpass.com and log in." },
                { id: "lp-2", title: "Go to Account Settings", actionType: "instruction", fallbackInstruction: "Click your profile icon → Account Settings → Email Address." },
                { id: "lp-3", title: "Update email", actionType: "instruction", fallbackInstruction: "Enter your new email and master password to confirm the change." },
                { id: "lp-4", title: "Verify and re-login", actionType: "confirm", fallbackInstruction: "Check your new inbox for verification, then log back in with your new email." },
            ],
            "delete-account": [
                { id: "lpd-1", title: "Export your vault first", actionType: "instruction", fallbackInstruction: "Go to Account Settings → Advanced → Export → LastPass CSV file. Save this securely." },
                { id: "lpd-2", title: "Go to account deletion", actionType: "navigate", fallbackInstruction: "Go to lastpass.com/support and search 'delete account' or contact support." },
                { id: "lpd-3", title: "Submit deletion request", actionType: "instruction", fallbackInstruction: "Follow LastPass instructions to permanently delete your account." },
                { id: "lpd-4", title: "Deletion confirmed", actionType: "confirm", fallbackInstruction: "Your LastPass account has been scheduled for deletion. Delete the exported CSV file from your computer securely." },
            ],
        },
    },
    {
        serviceId: "reddit",
        serviceName: "Reddit",
        loginUrl: "https://www.reddit.com/login",
        guides: {
            "change-email": [
                { id: "rd-1", title: "Go to account settings", actionType: "navigate", fallbackInstruction: "Go to reddit.com/settings/account in your browser." },
                { id: "rd-2", title: "Update email", actionType: "fill", selector: "input[name='email'], input[type='email']", fallbackInstruction: "Find the email field and enter your new address." },
                { id: "rd-3", title: "Save and verify", actionType: "instruction", fallbackInstruction: "Click 'Save' and check your new inbox for a Reddit verification email." },
                { id: "rd-4", title: "Verification complete", actionType: "confirm", fallbackInstruction: "Click the confirmation link in your new inbox to finalize." },
            ],
            "delete-account": [
                { id: "rdd-1", title: "Go to account deletion", actionType: "navigate", fallbackInstruction: "Go to reddit.com/settings/account and scroll to the bottom." },
                { id: "rdd-2", title: "Click 'Delete account'", actionType: "instruction", fallbackInstruction: "Find and click 'Delete account' at the bottom of the page." },
                { id: "rdd-3", title: "Enter username and confirm", actionType: "instruction", fallbackInstruction: "Type your username to confirm, then click the final 'Delete account' button." },
                { id: "rdd-4", title: "Deletion confirmed", actionType: "confirm", fallbackInstruction: "Reddit account deletion is immediate. Your posts remain but are anonymized." },
            ],
        },
    },
    {
        serviceId: "discord",
        serviceName: "Discord",
        loginUrl: "https://discord.com/login",
        guides: {
            "change-email": [
                { id: "dc-1", title: "Open User Settings", actionType: "navigate", fallbackInstruction: "Click the cog icon next to your username at the bottom of Discord." },
                { id: "dc-2", title: "Click 'Edit' next to email", actionType: "instruction", fallbackInstruction: "In the My Account tab, click 'Edit' next to your email address." },
                { id: "dc-3", title: "Enter new email and password", actionType: "instruction", fallbackInstruction: "Enter your new email address and current password to authorize the change." },
                { id: "dc-4", title: "Verify new email", actionType: "confirm", fallbackInstruction: "Check your new inbox for a verification email from Discord and click the link." },
            ],
            "delete-account": [
                { id: "dcd-1", title: "Open User Settings", actionType: "navigate", fallbackInstruction: "Click the cog icon next to your username." },
                { id: "dcd-2", title: "Go to 'My Account'", actionType: "instruction", fallbackInstruction: "Scroll down to find 'Delete Account' in the danger zone section." },
                { id: "dcd-3", title: "Confirm deletion with password", actionType: "instruction", fallbackInstruction: "Click 'Delete Account' and enter your password and 2FA code if enabled." },
                { id: "dcd-4", title: "Deletion queued", actionType: "confirm", fallbackInstruction: "Discord queues your account for deletion. If you log in within 14 days, it will be cancelled." },
            ],
        },
    },
];
export function getPlaybook(serviceId) {
    return PLAYBOOK_REGISTRY.find((p) => p.serviceId === serviceId);
}
