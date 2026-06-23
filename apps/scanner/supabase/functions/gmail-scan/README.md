# Gmail Scanner Edge Function

This Supabase Edge Function handles the core Gmail scanning logic:

1. **Receives** a mailbox connection ID from the client
2. **Fetches** the encrypted OAuth token from Supabase
3. **Calls Gmail API** with metadata scope only (sender, subject, date)
4. **Extracts** sender domains from message headers
5. **Matches** senders against the services catalog
6. **Returns** detected services to the client

## Security notes

- **No message bodies** — requests only `metadata` headers (From, Subject, Date)
- **Token isolation** — tokens are encrypted at rest in `mailbox_connections` table
- **Read-only scope** — Gmail OAuth scope is metadata-only, no write access
- **Per-user isolation** — RLS policies ensure users can only access their own data
- **Rate limiting** — samples last 500 senders to avoid API quota issues

## Deployment

Deploy to Supabase:

```bash
supabase functions deploy gmail-scan --project-ref fuiebtpezpoxvkuuhaqy
```

Or via Supabase CLI in the dashboard.

## Catalog matching

The function matches sender domains against patterns in `services_catalog` table.
Example patterns:

- `netflix.com` → Netflix
- `spotify.com` → Spotify
- `gmail.com`, `google.com` → Google
- `openai.com` → OpenAI / ChatGPT

## Error handling

- Missing/revoked tokens → 403 Forbidden
- Gmail API errors → stored in `scans.error_message`, scan marked as `failed`
- No messages found → returns empty list with 0 services detected

## TODO

- [ ] Implement proper token encryption/decryption (AES-256-GCM)
- [ ] Add support for Outlook/Microsoft Graph API
- [ ] Improve domain pattern matching (handle subdomains, aliases)
- [ ] Add refresh token rotation
- [ ] Implement exponential backoff for API calls
