# Code School of Guam website

## Isolated development and runtime ownership

Use a dedicated branch and worktree for each independently writable task. Preserve the canonical checkout and unrelated files. Follow the shared Shimizu PR workflow and local development lifecycle. No application server, database, container, simulator, or browser tab is intentionally persistent.

- Install: `npm ci` with Node.js 24 (minimum 22.12).
- Development: `PORT=3000 npm run dev`.
- Production preview after build: `PORT=3000 npm start`.
- Both start scripts bind 127.0.0.1 and reject occupied ports. Choose a distinct PORT for concurrent work. Never stop the existing owner.
- Claim the exact process root and task-created browser tab in the hook-provided lifecycle session. Stop the claimed root with SIGTERM, verify its child server stopped, and release that exact resource. Do not perform session-wide cleanup while another agent owns active resources.
- No Docker or mobile simulator is needed. Leave borrowed and protected services unchanged.

## Required validation

Run `npm run check`: ESLint, TypeScript, current-knowledge identity/publication tests, mocked interest-form tests, production build, generated-route/link/asset tests, and dependency audit. Check changed journeys in a real browser at phone and desktop widths, including navigation, resize/scroll recovery, visible keyboard focus, reduced motion, and controlled form success/failure. Do not submit synthetic leads to production or invoke paid chatbot/embedding providers without an explicitly bounded plan.

GitHub Quality runs the complete gate on pull requests and main. Verify the current PR head, checks, and CodeRabbit review before merging. Main pushes deploy through Netlify.

## Public content contracts

December 2026 Python is an adult-only invited pilot capped at five learners. Public enrollment is closed; other focused courses are in development. The March 2026 full bootcamp is closed, its $7,500 tuition and original schedule are historical, and enrolled learners use individual completion/restart arrangements. Future full bootcamp dates, tuition, and schedule are unannounced. Interest lists do not reserve seats.

Keep all three Netlify form names, fields, consent, honeypots, and discovery HTML synchronized. Preserve routes and the chatbot's reviewed-source allowlist. Any knowledge source edit requires a new immutable version/hash and matching current fallback; external publication is separate and must not silently call paid providers. A missing manifest safely uses the reviewed fallback.

Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+. Check the complete UI after CSS/toolchain changes.
