# B2B_ADMIN_CONSENT_GUIDE.md

## Microsoft Entra ID Admin Consent for Enterprise Customers

**Purpose:** Guide for IT administrators deploying DigitalEU.me across an enterprise organization.

---

## 1. Overview

When enterprise users from a **Microsoft 365 / Azure AD (Microsoft Entra ID)** tenant connect their email via DigitalEU.me, they may encounter a request for **Admin Consent**.

This guide explains:
- What Admin Consent is.
- Why DigitalEU.me requires it.
- How to grant it safely.
- Security reassurances for IT teams.

---

## 2. What is Admin Consent?

**Scenario:**
- **User (standard)** tries to authorize DigitalEU.me to scan their Outlook mailbox.
- OAuth authorization flow redirects to Microsoft login.
- Microsoft checks: "Does the organization allow this app?"

**Options:**
- **No org policy** → User can authorize themselves (user consent).
- **Org policy exists** → Requires IT admin approval (admin consent).

**Admin Consent** means: An Entra ID administrator pre-approves the application for everyone in the organization. Once approved:
- ✅ Users can authorize without additional steps.
- ✅ Admin has centralized visibility & control.
- ✅ Audit trail of all connections.

---

## 3. Why DigitalEU.me Requires Admin Consent

### Scope Requested: `Mail.ReadBasic`

```
https://graph.microsoft.com/.default
```

This includes:
- **Mail.ReadBasic** — Read mailbox metadata (sender, date, subject preview).
  - ✅ **Can read:** Sender address, subject line, message ID, folder structure.
  - ❌ **Cannot read:** Message body, attachments, calendar events.

### Why Admin Consent Might Be Required:
1. **Org policy:** Entra ID admin has set restrictive app consent policies.
2. **Risk evaluation:** Microsoft flags some apps for admin review (rare).
3. **Scope sensitivity:** Even "read-only" email access is considered sensitive by many orgs.

---

## 4. Security Reassurances for IT Admins

| Concern | DigitalEU.me's Approach |
| --- | --- |
| **What can the app access?** | **Metadata only:** Sender domains, dates, subject. **Never:** Message bodies, attachments, or other folders. |
| **Is it a SaaS with data residency?** | ✅ Yes — Data is **zero-knowledge encrypted** before reaching our servers. You can also choose **EU data residency** (Sweden, GDPR-compliant). |
| **How long is data kept?** | ⏳ Scans are **deleted automatically after 30 days**. No long-term storage. |
| **Can we revoke access instantly?** | ✅ Yes — Entra ID admin can revoke the application consent anytime in the Microsoft Entra admin center. |
| **Is there a user access log?** | ✅ Yes — All authorization events appear in **Entra ID > Sign-ins** and **App registrations > Audit logs**. |
| **Does it comply with GDPR?** | ✅ Yes — EU servers, zero-knowledge encryption, 30-day purge, GDPR Data Processing Agreement available upon request. |
| **Can we audit their code?** | 🔒 Limited — Open-source components available on Codeberg. Core app is proprietary but undergoes third-party security audit (CASA Tier 2). |

---

## 5. Step-by-Step: Grant Admin Consent

### Scenario A: User Gets "Need Admin Approval" Message

When a user clicks "Connect Outlook" in DigitalEU.me:

**Step 1:** Redirected to Microsoft login.

**Step 2:** Sees message:
```
"Need admin approval"
"Your organization requires administrator approval to use this app.
Contact your administrator to request approval."
```

**Action:**
- User contacts IT admin with:
  - App name: **"digitaleu.me"**
  - Scope: **"Mail.ReadBasic"** (read mailbox metadata)
  - Request: "Please grant admin consent."

### Scenario B: IT Admin Grants Consent (Proactive)

**Via Microsoft Entra Admin Center:**

1. **Sign in to:** https://entra.microsoft.com/ (as Global Admin or Cloud Admin)
2. **Navigate to:** Applications → Enterprise applications
3. **Search:** Enter "digitaleu.me"
   - *If not found:* User must authorize once → appears in Enterprise apps → then admin consent can be set.
4. **Click** the app → **Permissions**
5. **Review scopes:** Verify `Mail.ReadBasic` (or `https://graph.microsoft.com/.default`)
6. **Click:** "Grant admin consent for [Organization]"
7. **Confirm:** Approve the prompt.

**Done!** All users in the organization can now authorize without hitting the "Need admin approval" message.

### Scenario C: Revoke Consent (If Needed)

If IT decides to revoke access:

1. **Microsoft Entra Admin Center** → **Enterprise applications** → Find "digitaleu.me"
2. **Permissions** → **Revoke admin consent**
3. **Confirm.** Done — app can no longer access mailboxes.

---

## 6. Enterprise Deployment Checklist

- [ ] **Determine consent model:** User consent vs. admin consent (see §5).
  - **Recommended:** Proactive admin consent (Scenario B) for control.
- [ ] **Scope review:** Confirm `Mail.ReadBasic` is sufficient (metadata-only access).
- [ ] **DPA (Data Processing Agreement):** Request GDPR DPA from DigitalEU.me if required.
  - Email: compliance@digitaleu.me
- [ ] **Pilot group:** Have 5–10 users test before org-wide rollout.
- [ ] **Audit & monitoring:**
  - Enable **Sign-ins** log in Entra ID for visibility.
  - Set up **alerts** if suspicious activity detected.
- [ ] **User comms:** Inform staff that DigitalEU.me is approved and what to expect.
- [ ] **Support:** Provide IT helpdesk with FAQ (see §7).

---

## 7. IT Helpdesk FAQ

### Q: What exactly can DigitalEU.me access?
**A:** Only **sender domain, date, subject line, message ID** from emails. Never the body, attachments, or other folders.

### Q: How long does DigitalEU.me keep the data?
**A:** 30 days maximum. Scans are automatically deleted. No indefinite storage.

### Q: Can we see a list of who authorized DigitalEU.me?
**A:** Yes — **Entra ID > Sign-ins**, filter by app "digitaleu.me." Shows every authorization event with timestamp and user.

### Q: Can we instantly revoke access?
**A:** Yes — **Entra ID > Enterprise applications > digitaleu.me > Permissions > Revoke admin consent.** Revocation is immediate.

### Q: Is it GDPR-compliant?
**A:** Yes — Data is in Sweden (GDPR-adequate), encrypted end-to-end, and auto-deleted after 30 days. Request a DPA from their compliance team if needed.

### Q: Do they comply with SOC 2 or ISO 27001?
**A:** Limited — App is CASA Tier 2 security assessed. Request audit reports if required for your org's vendor management.

### Q: Can we disable it for specific users?
**A:** Yes — Entra ID > Enterprise applications > digitaleu.me > Users and groups > Disable for specific users/groups.

### Q: What if we suspect abuse or suspicious behavior?
**A:** Report to **compliance@digitaleu.me** or your contract owner. DigitalEU.me will investigate and can revoke the app or specific user permissions.

---

## 8. Template: Approval Email to Team

---

**Subject:** DigitalEU.me Email Scanner – Organization-Wide Approval

Hi team,

DigitalEU.me (www.digitaleu.me) has been approved for organizational use to help identify privacy-friendly email and cloud alternatives.

**What it does:**
- Scans your Outlook mailbox to detect which services you use (e.g., Gmail, Spotify, Netflix).
- Recommends EU-based privacy-respecting alternatives.

**What it accesses:**
- **Metadata only:** Sender addresses, dates, subject lines.
- **NOT:** Email bodies, attachments, or other folders.

**How long data is kept:**
- 30 days maximum. Then automatically deleted.

**How to use:**
1. Visit https://scanner.digitaleu.me
2. Click "Connect Outlook"
3. Sign in with your work email (no additional admin approval needed)
4. See your results!

**Questions?**
- Contact IT Helpdesk: it-support@company.com
- Privacy concerns: dataprotection@company.com

---

## 9. Template: Objections & Responses

### Objection: "This is a US company spying on us."

**Response:** DigitalEU.me is based in **[Norway/EU]** with servers in **Sweden** (GDPR-adequate). Data is **end-to-end encrypted** — we cannot read your emails. Fully GDPR-compliant.

### Objection: "We don't need a third-party scanning our emails."

**Response:** DigitalEU.me is **opt-in** — employees who care about privacy can use it voluntarily. It's not mandatory. The organization is **not scanning** emails; **employees** are (by choice).

### Objection: "What if DigitalEU.me gets hacked?"

**Response:** Even if compromised, your email data is **encrypted end-to-end**. Attackers would only see random ciphertext, not readable emails. Additionally, scans are **deleted after 30 days**, so there's minimal risk window.

### Objection: "We have a blanket policy against SaaS without SOC 2."

**Response:** DigitalEU.me undergoes **CASA Tier 2 security assessment** (independent third-party audit). While not SOC 2, it's comparable. Request the audit report from compliance@digitaleu.me.

---

## 10. Advanced: Entra ID Conditional Access & MFA

For high-security organizations:

- **Conditional Access Policy:** Require MFA for any sign-in to DigitalEU.me.
- **Session timeout:** Auto-revoke tokens after 8 hours.
- **IP restrictions:** Allow only corporate VPN IP ranges (optional).

**How to set up:**
1. **Entra ID > Protection > Conditional Access > New policy**
2. **Target app:** Search for "digitaleu.me"
3. **Conditions:** MFA for all, IP restrictions if desired
4. **Action:** Require MFA at sign-in
5. **Enable & save**

---

## 11. Post-Deployment Monitoring

### Metrics to track:
- How many users authorized DigitalEU.me?
- Any unauthorized sign-in attempts?
- Are there any anomalies in mail-reading patterns?

**Entra ID dashboards:**
- **Sign-ins > Filter by app** → See authorization trends.
- **Audit logs > Filter by action** → Track all access events.
- **Risk detections** → Any suspicious activity.

---

## 12. Revocation & Offboarding

When an employee leaves or if the organization wants to disable DigitalEU.me:

1. **Revoke app consent** (organization-wide):
   - **Entra ID > Enterprise applications > digitaleu.me > Permissions > Revoke**
   
2. **Remove individual user access** (if selective):
   - **Users & groups > Remove user**
   
3. **Notify DigitalEU.me:**
   - Email: compliance@digitaleu.me
   - Confirm all user data has been deleted.

---

## 13. Security Contact & Escalation

**For IT Admins:**
- **General questions:** support@digitaleu.me
- **Security concerns:** security@digitaleu.me
- **Compliance & DPA:** compliance@digitaleu.me
- **Urgent incidents:** escalation@digitaleu.me (PGP encrypted, if sensitive)

**Response SLA:**
- Security issues: 24–48 hours
- Compliance questions: 5 business days

---

## 14. References

- [Microsoft Entra ID Admin Consent Documentation](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent)
- [OAuth 2.0 Scopes for Microsoft Graph](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [GDPR Compliance & EU Data Residency](https://gdpr-info.eu/)

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-24  
**Maintained by:** DigitalEU.me Compliance Team
