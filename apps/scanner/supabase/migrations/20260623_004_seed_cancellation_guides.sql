-- Populate cancellation_guides table with sample guides
insert into cancellation_guides (id, service_id, title, slug, description, seo_meta_description, canonical_url, how_to_cancel_steps, hero_image_url, og_image_url, featured_eu_alternative) values
('netflix-cancel', 'netflix', 'How to Cancel Netflix', 'netflix', 'Step-by-step guide to cancelling your Netflix subscription and switching to a European streaming service.', 'Cancel Netflix in 2024: Complete guide with screenshots. Switch to Telia Play or other EU alternatives today.', 'https://scanner.digitaleu.me/cancel/netflix',
  '[
    {"step": 1, "title": "Sign into Your Account", "description": "Go to netflix.com and sign in with your credentials."},
    {"step": 2, "title": "Navigate to Account Settings", "description": "Click your profile icon in the top right and select \"Account\" from the dropdown menu."},
    {"step": 3, "title": "Go to Membership", "description": "In Account Settings, find the \"Membership & billing\" section on the left sidebar."},
    {"step": 4, "title": "Cancel Membership", "description": "Click \"Cancel your membership\" and confirm the cancellation. Your access will end at the end of your billing cycle."}
  ]',
  'https://images.unsplash.com/photo-1522869635100-ce306e474fbe?w=1200&h=630&fit=crop',
  'https://images.unsplash.com/photo-1522869635100-ce306e474fbe?w=1200&h=630&fit=crop',
  'Telia Play'),

('spotify-cancel', 'spotify', 'How to Cancel Spotify', 'spotify', 'Stop your Spotify subscription: A complete guide with alternatives for European music streaming.', 'Cancel Spotify Premium: Easy step-by-step guide. Discover Deezer, Tidal, and other EU-based music services.',  'https://scanner.digitaleu.me/cancel/spotify',
  '[
    {"step": 1, "title": "Go to Account Overview", "description": "Visit spotify.com/account and log in with your credentials."},
    {"step": 2, "title": "Access Your Plan", "description": "Scroll down to find the \"Premium\" subscription section."},
    {"step": 3, "title": "Click \"Cancel Plan\"", "description": "Select the \"Cancel Plan\" link and choose your cancellation reason."},
    {"step": 4, "title": "Confirm Cancellation", "description": "Follow the prompts to finalize your cancellation. You'll have access until your billing period ends."}
  ]',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=630&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=630&fit=crop',
  'Deezer'),

('google-cancel', 'google', 'How to Delete Your Google Account', 'google', 'Comprehensive guide to deleting your Google account and migrating to European email alternatives.', 'Delete Google Account 2024: Complete guide. Switch to ProtonMail, Tutanota, or Posteo for European email.', 'https://scanner.digitaleu.me/cancel/google',
  '[
    {"step": 1, "title": "Go to Google Account", "description": "Visit myaccount.google.com and sign in."},
    {"step": 2, "title": "Select \"Data & Privacy\"", "description": "In the left menu, click \"Data & Privacy\"."},
    {"step": 3, "title": "Download Your Data (Optional)", "description": "Before deleting, you may want to export your data. Click \"Delete your Google Account\" to proceed."},
    {"step": 4, "title": "Confirm Deletion", "description": "Follow the prompts and verify your identity. Your account will be deleted after 30 days."}
  ]',
  'https://images.unsplash.com/photo-1614680376573-df3960713406?w=1200&h=630&fit=crop',
  'https://images.unsplash.com/photo-1614680376573-df3960713406?w=1200&h=630&fit=crop',
  'ProtonMail'),

('microsoft-cancel', 'microsoft', 'How to Close Your Microsoft Account', 'microsoft', 'Delete your Outlook/Microsoft account and move to privacy-first European email providers.', 'Close Microsoft/Outlook Account: Step-by-step guide. Switch to Tutanota, Posteo, or other EU email services.', 'https://scanner.digitaleu.me/cancel/microsoft',
  '[
    {"step": 1, "title": "Visit Account Settings", "description": "Go to account.microsoft.com and sign in."},
    {"step": 2, "title": "Find Privacy & Security", "description": "Navigate to \"Account\" settings in the sidebar."},
    {"step": 3, "title": "Delete Your Account", "description": "Scroll to find \"Delete your account\". Click the option."},
    {"step": 4, "title": "Confirm Identity and Delete", "description": "Verify your identity by entering a security code, then confirm the deletion."}
  ]',
  'https://images.unsplash.com/photo-1633356122544-f134324ef6e2?w=1200&h=630&fit=crop',
  'https://images.unsplash.com/photo-1633356122544-f134324ef6e2?w=1200&h=630&fit=crop',
  'Tutanota'),

('dropbox-cancel', 'dropbox', 'How to Cancel Dropbox', 'dropbox', 'End your Dropbox subscription and switch to secure European cloud storage alternatives.', 'Cancel Dropbox Plus/Pro: Easy guide. Migrate to Infomaniak, NextCloud, or other EU cloud storage.', 'https://scanner.digitaleu.me/cancel/dropbox',
  '[
    {"step": 1, "title": "Go to Account Settings", "description": "Visit dropbox.com and log in to your account."},
    {"step": 2, "title": "Select Billing", "description": "Click your profile icon and choose \"Settings\" → \"Billing\"."},
    {"step": 3, "title": "Cancel Subscription", "description": "Find your active subscription plan and click \"Cancel subscription\"."},
    {"step": 4, "title": "Confirm Cancellation", "description": "Choose your cancellation reason and confirm. Access continues until your billing date."}
  ]',
  'https://images.unsplash.com/photo-1544716278-ca5e3af00db0?w=1200&h=630&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3af00db0?w=1200&h=630&fit=crop',
  'Infomaniak'),

('openai-cancel', 'openai', 'How to Cancel ChatGPT Plus', 'openai', 'Stop your ChatGPT Plus subscription and explore alternative AI tools based in Europe.', 'Cancel ChatGPT Plus: Complete guide. Discover European AI alternatives like Mistral, Aleph Alpha.', 'https://scanner.digitaleu.me/cancel/openai',
  '[
    {"step": 1, "title": "Sign Into ChatGPT", "description": "Go to chat.openai.com and log in."},
    {"step": 2, "title": "Open Settings", "description": "Click on your profile icon in the bottom left corner."},
    {"step": 3, "title": "Go to Billing", "description": "Select \"Billing overview\" or \"Manage my subscription\"."},
    {"step": 4, "title": "Cancel Subscription", "description": "Click \"Cancel plan\" and confirm. You'll retain access until your billing period ends."}
  ]',
  'https://images.unsplash.com/photo-1677442d019cecf8257f3e3a55d48c4d?w=1200&h=630&fit=crop',
  'https://images.unsplash.com/photo-1677442d019cecf8257f3e3a55d48c4d?w=1200&h=630&fit=crop',
  'Mistral AI');
