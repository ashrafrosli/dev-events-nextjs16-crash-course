<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new file): Initializes the PostHog client-side SDK using the Next.js 15.3+ `instrumentation-client` convention. Enables automatic error tracking (`capture_exceptions: true`) and session recording. Uses a reverse proxy for improved reliability.
- **`next.config.ts`** (updated): Added reverse proxy rewrites so PostHog ingestion requests route through `/ingest` on your own domain (EU endpoints), reducing interception by ad blockers. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables. These are referenced in code and never hardcoded.
- **`components/ExploreBtn.tsx`** (updated): Added `posthog.capture('explore_events_clicked')` to the existing `onClick` handler.
- **`components/EventCard.tsx`** (updated): Added `'use client'` directive, imported `posthog-js`, and added `posthog.capture('event_card_clicked', {...})` on the Link's `onClick`, capturing event title, slug, location, and date as properties.

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' button on the homepage to scroll to the events list | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to navigate to the event detail page | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://eu.posthog.com/project/138589/dashboard/560815)
- **Insight**: [Explore Events Clicks (Daily)](https://eu.posthog.com/project/138589/insights/dgIgxxDU) — trend of how often users click the Explore Events button
- **Insight**: [Event Card Clicks (Daily)](https://eu.posthog.com/project/138589/insights/v4OpyO38) — trend of total event card click volume
- **Insight**: [Browse to Event Detail Funnel](https://eu.posthog.com/project/138589/insights/PC6KIGm5) — conversion funnel from exploring events to clicking an event card
- **Insight**: [Daily Active Users Viewing Events](https://eu.posthog.com/project/138589/insights/6QYLg5oI) — unique users browsing event cards per day

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
