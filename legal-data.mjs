// Canonical legal text for BeAnywhere — rendered in-app at /privacy and /terms, and
// the source you mirror onto your website later ("the website just follows the app").
//
// FILL IN the five fields in LEGAL_INFO below; they flow into BOTH documents.
// Until you do, the app will literally show "[LEGAL NAME]" etc., so set these
// before you ship to TestFlight.
//
// NOTE: This is a solid, compliance-oriented starting template — not legal advice.
// Have a privacy attorney review the biometric language (Privacy §4) and the
// arbitration clause (Terms §14) before you scale.

export const LEGAL_INFO = {
  name: 'Besties, Inc.',                     // registered entity (matches your approved Besties docs)
  effectiveDate: 'September 10, 2026',         // set to your actual launch/publish date if later
  supportEmail: 'support@beanywhere.app', // your real support address
  state: 'California',                       // your home state
  venue: 'Los Angeles County, California',   // court venue for any non-arbitrated dispute
};


const I = LEGAL_INFO;

export const PRIVACY = [
  { body: [
    `This Privacy Policy explains how ${I.name} (“BeAnywhere,” “we,” “us”) collects, uses, and protects your information when you use the BeAnywhere mobile app (the “App”). BeAnywhere lets you upload photos of yourself and generates stylized, AI-created images of you in different scenes. This Policy explains our practices; it does not replace a separate permission where one is required.`,
    `We built BeAnywhere to do one thing with your photos — make fun images of you — and to hold onto as little as possible for as short a time as possible.`,
  ] },
  { title: '1. The short version', body: [
    `• We collect the selfies you upload, the images we generate for you, a per-device identifier, and your in-app purchase records.`,
    `• We use your photos to generate your images and for related security and provider safety checks. We do not use facial recognition to identify you, we do not build or store a “faceprint,” and we do not opt your photos into AI-model training.`,
    `• Uploaded photos in our Firebase storage are automatically deleted within 30 days after you most recently upload or reuse them. Your generated packs stay until you delete them. Service providers may temporarily process or retain data for safety, abuse prevention, security, or legal obligations as described below.`,
    `• You can delete your photos and generated packs, or delete your account, profile, contact information, and photos, from Settings. Group business statistics and restricted generation and transaction records without photos or contact information may remain for accounting, reconciliation, security, and anti-fraud purposes. Individual usage events are removed during account deletion.`,
    `• We do not sell your personal information.`,
  ] },
  { title: '2. Information we collect', body: [
    `Photos you provide. When you create a pack, you upload a small number of selfies. These are used to generate your images and are stored only as long as described in Section 5.`,
    `Images we generate. The AI photos we create for you (“packs”) are stored so you can view, save, and re-open them.`,
    `Device identifier. When you first open the App, we create an anonymous identifier stored securely on your device. This is how your packs are associated with you and restored when you reopen the App. It is not your name and does not by itself identify you in the real world.`,
    `Sign in with Apple (optional). Signing in is optional and is offered only so your packs can follow you to a new phone. If you choose it, we receive the name and email you authorize Apple to share — which may be Apple’s private relay email if you choose to hide your address. We do not automatically email packs to that address. Pack email is a separate action: you type or confirm a delivery address and tap Send photos for each pack. You can use the App fully without ever signing in.`,
    `Purchase information. When you buy a pack, the purchase is processed by Apple through in-app purchase. We receive a confirmation that a purchase was made; we do not receive or store your credit-card number — Apple handles payment.`,
    `Operational records. We keep the purchase, refund, delivery, generation-cost, and security records needed to operate the service and reconcile the business. Selected women’s or men’s styling describes a product choice, not an inference about your gender.`,
    `Product analytics. We use Google Analytics for Firebase (GA4) and our own event service to understand visits, pack selection, uploads, checkout, photo saves, and return visits. We send an opaque analytics identifier, app-instance identifiers, app/device information, and fixed product/event parameters. Google may derive approximate location from network information. We do not send your photos, image URLs, email, Apple credential, or device-ban identity to GA4. Advertising identifiers and advertising-personalization signals are disabled.`,
    `Crash diagnostics. We use Firebase Crashlytics to receive crash and device/app diagnostic information so we can identify and fix reliability problems. We report handled errors using a fixed context and error category instead of the original sensitive message, and do not attach your account ID, email, photos, or image URLs. Native crash reports include diagnostic installation identifiers and stack information.`,
    `Abuse prevention. To stop automated scripts from blocking uploads, our server converts the request network address into a one-way, server-secret daily bucket. We do not store the raw address in that bucket, and the bucket expires automatically after approximately two days.`,
    `Support communications. If you email us, we receive your message and the support identifier you send so we can find your packs and help you.`,
  ] },
  { title: '3. How we use your information', body: [
    `We use the information above to:`,
    `• generate your AI images and deliver, display, and restore your packs;`,
    `• process your purchases (via Apple) and provide any credits or re-shoots you’re owed;`,
    `• respond to your support requests;`,
    `• understand how the App is used, measure product performance, and improve reliability;`,
    `• keep the App secure, prevent abuse, and fix problems;`,
    `• comply with our legal obligations.`,
    `We do not sell or rent your personal information, and we do not opt your photos or generated images into training, fine-tuning, or improving any AI model.`,
  ] },
  { title: '4. Facial images and biometric information — important', body: [
    `BeAnywhere processes images that contain your face in order to generate stylized pictures of you. We want to be clear about what we do and do not do:`,
    `• We use your photos to generate artistic/stylized images at your request and to support security and provider safety checks for that service.`,
    `• We do not use facial recognition to identify you, and we do not match your face against any database.`,
    `• We do not create, capture, store, or use a face template, faceprint, facial-geometry scan, or other biometric identifier to identify you, and we do not enroll your face in any identification system.`,
    `• We do not sell or license your facial images to others.`,
    `• We do not opt your photos into AI-model training or improvement.`,
    `Written retention and destruction policy. We retain uploaded photos in our Firebase storage only as long as needed to provide the service and automatically delete them within 30 days after you most recently upload or reuse them. Generated packs are retained until you delete them (or delete all of your data). Our service providers may temporarily process or retain data for safety, abuse prevention, security, or legal obligations under their applicable terms and policies. If we ever stop offering the App, we will delete photos and generated images stored in our systems within a commercially reasonable time. This Section 4 is our publicly available written policy governing the retention and permanent destruction of facial information in our systems, as may be required by applicable biometric-privacy laws (including the Illinois Biometric Information Privacy Act).`,
    `Your consent. Before you upload photos, the App asks you to consent to this processing. You can withdraw consent at any time by deleting your data in the App and discontinuing use.`,
  ] },
  { title: '5. How long we keep data', body: [
    `• Uploaded selfies in our Firebase storage: automatically deleted within 30 days after you most recently upload or reuse them. Temporary service-provider processing or retention may occur for safety, abuse prevention, security, or legal obligations under the provider’s applicable terms and policies.`,
    `• Generated packs: kept until you delete them in the App or delete all your data.`,
    `• Packs you ask us to email: Resend processes the message and attachments to deliver them. Deleting photos in the App removes our Firebase copies but cannot recall a delivered email from your inbox or your email provider; you can delete that email directly.`,
    `• Copies outside BeAnywhere: photos you save to your Camera Roll, export through the share sheet, screenshot, send to another person, or receive by email are controlled by you and the recipient services. In-app deletion cannot silently remove or recall those copies.`,
    `• Account, profile, contact information, device credential, uploaded photos, and generated images: deleted when you delete your account. Individual raw usage events and purchase-cohort links are removed during account deletion. Group business results remain. Restricted generation and transaction evidence is kept separately for accounting, reconciliation, security, and anti-fraud purposes.`,
    `• Usage analytics: our raw event and session records are scheduled for expiration after 90 days; expiry cleanup can take additional processing time. GA4 follows the configured property retention and Google’s deletion processing. When you delete your account, we submit deletion requests for the known analytics user and app-instance identifiers and erase matching records in our configured BigQuery export, with a separate follow-up for late exports. This does not promise instantaneous deletion from a service provider’s backups.`,
    `• Crash diagnostics: Google states that Crashlytics keeps crash data and associated installation identifiers for 90 days before beginning removal from live and backup systems. These diagnostic records are not labelled with your BeAnywhere account ID.`,
    `• Business totals and limited financial records: pack-level group totals can remain after account deletion. Individual purchase-cohort links are finalized and removed at account deletion or 180 days after the first paid purchase, allowing processing time for the scheduled cleanup. Previously earned group totals remain; removing detail does not subtract past sales, costs, or repeat purchases. Restricted transaction correction receipts remain separate so later refunds and reversals can be reconciled without rebuilding a deleted usage profile. They contain no photos, contact details, or device-ban identity, and are not used to reconnect a deleted account to a new marketing or usage profile.`,
    `• One-way network abuse-limit buckets: approximately two days.`,
    `• When you choose Delete my photos & packs, we delete your uploaded photos and your generated packs from our systems. User-controlled Camera Roll, shared, screenshotted, and delivered-email copies remain until you delete them where they were saved.`,
  ] },
  { title: '6. Who we share data with (service providers)', body: [
    `We use a small number of trusted service providers that process data on our behalf, only to run the App:`,
    `• Apple — in-app purchases and, if you choose it, Sign in with Apple.`,
    `• RevenueCat — purchase verification and purchase-status handling.`,
    `• Our AI image-generation provider (currently OpenAI) — to perform image generation and related safety and abuse checks. OpenAI states that API data is not used to train its models unless the API customer opts in; we do not opt in. OpenAI may temporarily retain or review content for abuse monitoring, safety, security, or legal obligations under its applicable policies.`,
    `• Google Firebase / Google Cloud — authentication, database, file storage, server functions, GA4 usage analytics, and Crashlytics diagnostics used to run and improve the App.`,
    `• Expo — app updates and, if you enable notifications, push-notification delivery.`,
    `• Resend — delivery of your pack by email if you ask us to email it to you. Resend and your email provider may retain that sent or delivered message under their applicable policies; in-app deletion cannot recall it.`,
    `These providers are bound by their own terms and privacy commitments and are not permitted to use your data for their own unrelated purposes. We may also disclose information if required by law, to enforce our Terms, or to protect rights and safety. We do not sell your personal information.`,
  ] },
  { title: '7. Your rights and choices', body: [
    `• Delete your data anytime: Settings → Delete my photos & packs removes your uploaded photos and generated packs from BeAnywhere. It cannot remove copies saved to Photos, shared, screenshotted, or delivered by email.`,
    `• Delete your account anytime: Settings → Delete account removes your account, profile, contact information, device credential, uploaded photos, and generated images. Group business results and limited restricted generation and transaction evidence without photos or contact information may remain for accounting, reconciliation, security, and anti-fraud purposes. Individual raw usage events and purchase-cohort links are removed.`,
    `• California residents (CCPA/CPRA): You have the right to know what personal information we collect, to access and delete it, to correct it, and to limit the use of sensitive personal information (which can include facial images). We do not sell or share your personal information for cross-context behavioral advertising. To exercise these rights, use the in-app deletion option or email us. We will not discriminate against you for exercising your rights.`,
    `• Other states / regions: If your jurisdiction grants similar rights, you may contact us to exercise them.`,
  ] },
  { title: '8. Children', body: [
    `BeAnywhere is intended for adults 18 and older. It is not directed to children, and we do not knowingly collect personal information from anyone under 18. If you believe a child has used the App, contact us and we will delete the information.`,
  ] },
  { title: '9. Security', body: [
    `We use reasonable technical and organizational measures (including encrypted transport and access controls through our service providers) to protect your information. No system is perfectly secure, but we limit what we collect and how long we keep it specifically to reduce risk.`,
  ] },
  { title: '10. Where data is processed', body: [
    `BeAnywhere is operated from the United States, and your information is processed in the United States. If you use the App from outside the U.S., you understand your information will be processed in the U.S.`,
  ] },
  { title: '11. Changes to this Policy', body: [
    `We may update this Policy from time to time. If we make material changes, we will update the effective date and, where appropriate, notify you in the App. Continued use after changes means you accept the updated Policy.`,
  ] },
  { title: '12. Contact us', body: [
    `Questions or requests about your privacy? Email us at ${I.supportEmail}.`,
  ] },
];

export const TERMS = [
  { body: [
    `These Terms of Service (“Terms”) are a binding agreement between you and ${I.name} (“BeAnywhere,” “we,” “us”) governing your use of the BeAnywhere mobile app (the “App”). Please read Section 15 carefully — it requires most disputes to be resolved by individual arbitration and waives class actions, unless you opt out within 30 days.`,
    `By downloading or using the App, you agree to these Terms. If you don’t agree, don’t use the App.`,
  ] },
  { title: '1. Eligibility', body: [
    `You must be at least 18 years old to use BeAnywhere. By using the App you represent that you are 18 or older.`,
  ] },
  { title: '2. What BeAnywhere does', body: [
    `BeAnywhere lets you upload photos of yourself and uses AI to generate stylized images of you in various scenes (“packs”). You buy packs through Apple’s in-app purchase. We may modify, add, remove, or discontinue packs, features, or the App itself, in whole or in part, at any time and without liability to you.`,
  ] },
  { title: '3. Your photos and your content', body: [
    `• You keep ownership of the photos you upload. You grant BeAnywhere a limited, non-exclusive license to use, process, and store your photos solely to provide the App’s features to you (generating, delivering, and restoring your packs) as described in our Privacy Policy.`,
    `• You own the images we generate for you and may use them for your personal, lawful purposes.`,
    `• You promise that: (a) every uploaded reference photo is of you and only you; (b) you have all rights needed to upload it; and (c) you are at least 18 years old. You may not upload reference photos of any other person, including anyone under 18.`,
  ] },
  { title: '4. Consent to image processing', body: [
    `By uploading photos, you consent to BeAnywhere processing images that contain your face to generate stylized images at your request and to support related security and provider safety checks, as described in our Privacy Policy. BeAnywhere does not use facial recognition to identify you, does not create or store a faceprint or biometric identifier for identification, does not sell facial data, and does not opt your photos into AI-model training. You may withdraw consent by deleting your data in the App and discontinuing use.`,
  ] },
  { title: '5. AI-generated results', body: [
    `The images BeAnywhere produces are AI-generated and will vary. We do not guarantee that any image will be photorealistic, flattering, an accurate likeness, or free of artifacts. AI image generation is inherently unpredictable. You are responsible for how you use the images, and you agree not to use them to deceive, defraud, impersonate, harass, or mislead anyone, or in any unlawful way.`,
  ] },
  { title: '6. Purchases, pricing, and refunds', body: [
    `• Packs are sold as consumable in-app purchases through Apple at the price shown in the App at the time of purchase. Payment is charged to your Apple Account.`,
    `• Because packs are generated on demand, all sales are final except where a refund is required by law or granted by Apple. Refund requests for App Store purchases are handled by Apple under Apple’s policies.`,
    `• If generation doesn’t finish as expected, the App provides eligible retries, replacement pack credits, and support options as described in the App.`,
    `• We may change prices prospectively; changes don’t affect purchases already made.`,
  ] },
  { title: '7. Acceptable use', body: [
    `You agree not to:`,
    `• upload a reference photo of anyone other than yourself, or any photo of a minor;`,
    `• upload or generate illegal, infringing, hateful, harassing, sexually explicit, or non-consensual intimate content, or use the App to create “deepfakes” intended to deceive or harm;`,
    `• use the App or generated images to impersonate, defraud, harass, or mislead, or to misrepresent AI-generated images as unaltered photographs in any deceptive way;`,
    `• reverse engineer, decompile, scrape, overload, or interfere with the App or its servers;`,
    `• resell or commercially exploit the App without our permission.`,
    `We may suspend or terminate access for violations.`,
  ] },
  { title: '8. Intellectual property', body: [
    `The App itself — including its software, design, branding, and the “BeAnywhere” name and logo — is owned by us and protected by law. These Terms don’t give you any rights in the App except the limited right to use it as intended. If you send us feedback, ideas, or suggestions, you grant us a perpetual, irrevocable, royalty-free license to use them without restriction or obligation to you.`,
  ] },
  { title: '9. Third-party services', body: [
    `The App relies on Apple, RevenueCat, our AI image-generation provider (currently OpenAI), Google Firebase/Cloud, Expo, and Resend to function as described in the Privacy Policy. Your use of the App may also be subject to Apple’s terms. We aren’t responsible for third-party services we don’t control.`,
  ] },
  { title: '10. Apple App Store — additional terms', body: [
    `These Terms are between you and ${I.name} only, and not with Apple Inc. (“Apple”). Apple is not responsible for the App or its content. To the extent these Terms apply to your use of the App obtained from the Apple App Store, you and we acknowledge:`,
    `• Your license to use the App is a non-transferable license to use it on any Apple-branded device that you own or control, as permitted by the App Store Terms of Service.`,
    `• We, not Apple, are solely responsible for providing any maintenance and support for the App. Apple has no obligation to furnish any maintenance or support.`,
    `• To the maximum extent permitted by law, Apple has no warranty obligation for the App. If the App fails to conform to any applicable warranty, you may notify Apple, and Apple may refund the purchase price (if any); beyond that, Apple has no other warranty obligation, and any other claims, losses, liabilities, damages, costs, or expenses attributable to a failure to conform to a warranty are our responsibility.`,
    `• We, not Apple, are responsible for addressing any claims by you or any third party relating to the App or your use of it, including product-liability claims, claims that the App fails to conform to any legal or regulatory requirement, and claims arising under consumer-protection, privacy, or similar laws.`,
    `• We, not Apple, are responsible for investigating, defending, settling, and discharging any third-party claim that the App or your use of it infringes that party’s intellectual-property rights.`,
    `• You represent that you are not located in a country subject to a U.S. Government embargo or designated as “terrorist supporting,” and that you are not on any U.S. Government list of prohibited or restricted parties. You will comply with any applicable third-party terms when using the App.`,
    `• Apple and its subsidiaries are third-party beneficiaries of these Terms, and upon your acceptance, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms against you as a third-party beneficiary.`,
  ] },
  { title: '11. Disclaimers', body: [
    `THE APP AND ALL GENERATED IMAGES ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, express or implied, including merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the App will be uninterrupted, error-free, or that results will meet your expectations.`,
  ] },
  { title: '12. Limitation of liability', body: [
    `TO THE MAXIMUM EXTENT PERMITTED BY LAW, BeAnywhere AND ${I.name} WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE APP WILL NOT EXCEED THE GREATER OF (a) THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM, OR (b) US $50. Some jurisdictions don’t allow certain limitations, so some of these may not apply to you.`,
  ] },
  { title: '13. Indemnification', body: [
    `You agree to indemnify and hold harmless BeAnywhere and ${I.name} from claims, damages, and expenses (including reasonable legal fees) arising from your misuse of the App, your content, or your violation of these Terms or others’ rights (including uploading someone else’s photo).`,
  ] },
  { title: '14. Termination', body: [
    `You may stop using the App at any time and delete your data in Settings. We may suspend or terminate your access if you violate these Terms or to protect the App and its users. Sections that by their nature should survive termination (including Sections 8 and 11–13, 15, and 16) will survive.`,
  ] },
  { title: '15. Dispute resolution — arbitration and class-action waiver', body: [
    `Please read this section carefully.`,
    `Informal resolution first. If you have a dispute, email us at ${I.supportEmail} and we’ll try to resolve it informally within 60 days.`,
    `Binding arbitration. If we can’t resolve it informally, you and BeAnywhere agree that any dispute arising out of or relating to the App or these Terms will be resolved by final and binding individual arbitration, administered by a recognized arbitration provider under its consumer rules, rather than in court — except that either party may bring an individual claim in small-claims court.`,
    `Class-action waiver. You and BeAnywhere agree that each may bring claims against the other only in an individual capacity, and not as a plaintiff or class member in any class, collective, or representative action. The arbitrator may not consolidate more than one person’s claims.`,
    `Exceptions. This Section does not apply to claims that may not be subject to pre-dispute arbitration agreements under applicable law (for example, certain claims under the U.S. Ending Forced Arbitration of Sexual Assault and Sexual Harassment Act).`,
    `30-day right to opt out. You can opt out of this arbitration agreement and class-action waiver by emailing ${I.supportEmail} with the subject line “Arbitration Opt-Out,” including your support identifier, within 30 days of first accepting these Terms. If you opt out, disputes will be resolved in the courts identified in Section 16. Opting out won’t affect any other part of these Terms.`,
  ] },
  { title: '16. Governing law and venue', body: [
    `These Terms are governed by the laws of the State of ${I.state}, without regard to its conflict-of-laws rules. To the extent any dispute is not subject to arbitration, it will be brought exclusively in the state or federal courts located in ${I.venue}, and you consent to their jurisdiction.`,
  ] },
  { title: '17. General', body: [
    `These Terms and our Privacy Policy are the entire agreement between you and us regarding the App and supersede any prior agreements. If any provision is found unenforceable, the rest remains in effect, and the unenforceable provision will be limited or modified to the minimum extent necessary. Our failure to enforce a provision is not a waiver. You may not assign these Terms; we may assign them to an affiliate or in connection with a merger, acquisition, or sale of assets. We are not liable for delays or failures caused by events beyond our reasonable control. Section headings are for convenience only.`,
  ] },
  { title: '18. Changes to these Terms', body: [
    `We may update these Terms from time to time. If we make material changes, we’ll update the effective date and, where appropriate, notify you in the App. Continued use after changes means you accept the updated Terms.`,
  ] },
  { title: '19. Contact', body: [
    `Questions about these Terms? Email ${I.supportEmail}.`,
  ] },
];
