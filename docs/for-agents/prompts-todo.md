Clean up Orphaned Templates in the Database: Build a database maintenance utility (or an admin action button) to identify and prune page templates in template_services, template_applications, and template_industries that are no longer referenced by any items in their respective navigation hierarchies.
Implement Auto-linking for Newly Created Templates: Update the "New Template" creation flow in

ServicesTemplatesEditor.tsx
,

ApplicationsTemplatesEditor.tsx
, and

IndustriesTemplatesEditor.tsx
to offer an option to automatically append the new template to the mega menu Primary Navigation structure, saving the admin the manual step of linking it in the Site Builder.
Optimise Top-Selling Products Database Fetching: Optimize the product hydration flow in the mega menu parser in

Header.tsx
to use single consolidated queries (or a Supabase View) for fetching both featured and top-selling product details, improving the initial page loading times.

Refactor Mega-Menu Code: Clean up or optimize how the dynamic hierarchy configuration is fetched and cached in the application if page load times are high.

---

---

Link Picker Cache Invalidation: Add a trigger to invalidate the templates cache inside LinkTargetPicker.tsx when a page template is saved, eliminating the need to refresh the browser to select it in the site builder.

Transition Animations: Integrate a smooth transition fade-in effect when categories load and resolve from the skeleton states.

Clean Up Implicit Any Lints: Refactor the remaining implicit any parameter type mismatches in page files (e.g. ApplicationCategoryPage.tsx and ServicePage.tsx) to resolve all TypeScript build warnings.

---

Implement Footer Newsletter with Brevo: The newsletter subscription form in `Footer.tsx` (`handleSubscribe`) is currently a complete stub — it only clears the email field and does nothing. When implementing:
1. Add the subscriber's email to a Brevo **Contact List** via the Brevo Contacts API (`POST /v3/contacts`) so it feeds into Brevo's marketing campaign audience.
2. Optionally send a "Thank you for subscribing" transactional confirmation email to the subscriber using the existing `sendBrevoEmail()` utility in `src/lib/brevo.ts`.
3. Add a `sendNewsletterEmailFn` TanStack Start server function in `brevo.ts` (similar to `sendQuoteEmailFn`) to keep the API key server-side only.
4. Add a loading state (`isSubmitting`) to the subscribe button to prevent double-submits.
5. Show `toast.success` / `toast.error` feedback after the submission.

