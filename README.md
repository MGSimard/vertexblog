- This is a terrible good idea
- Yes I'm making a blogging platform in the shape of an OS file directory
- Yes I'm tweaking after spending so much time working on VertexDB while learning everything about Nextjs, Backend and all its related technologies
- No I don't care, ooga booga monke

## TASK LIST

- [x] Update to latest Nextjs, react etc canaries
- [x] Deploy to vercel
- [x] Scaffold basic layout
- [x] Desktop layout.tsx
- [x] Documents folder (page or component) as explorer window
- [x] Within, blog folders navigates the explorer window to that blog
- [x] Figure out how to minimize "use client" impact of making file explorer draggable
- [x] Make file explorer draggable on blue header area
- [x] Constrain draggable elements to inner window
- [x] Work on maximize button - maximized window shouldn't be draggable
- [x] Create text file component
- [x] Move signup process to a component within taskbar start menu instead of page
- [x] Set up database (Vercel PostgreSQL w/ Drizzle ORM)
- [x] Complain on Github about months-long multi-project schema drizzle bug that tries to kill your DB with a sequence drop
- [x] Complain on Github about another driizzle bug where .default(false) & .default(sql`FALSE`) don't work on boolean()
- [ ] Wait until Drizzle makes use of their funding and unfucks these major fuckups
- [x] Password hashing with Argon2, NIST guideline requirements
- [x] Sign in, sign out
- [x] Enter password twice prompt, crosscheck on FE & BE
- [x] Ensure you communicate that leading and trailing spaces aren't allowed in password (html pattern="^[^ ].+[^ ]$")
- [x] So validate that part on FE first, then on BE in case they bypass it on purpose
- [x] Finish setting up auth (Lucia)
- [x] Put auth in start menu
- [x] Close start menu when clicking outside of it
- [x] Button icons for close/maximize/not-maximize
- [x] Text file components should render as draggable window
- [x] Fix my piece of shit I key by desoldering page down and putting it in I's place
- [x] Come up with empty folder, filled folder and notepad icons (shortcut and window header icons)
- [x] Initial position & size of file explorer on first render
- [x] Completely disable highlighting outside of notepad text
- [x] Look at mobile not being able to use the native resize control - yeah that doesn't work on mobile shame I might still support dragging on mobile though
- [x] Maybe add local clock in task bar? Could be dope if you use website on f11
- [x] Create zindex context for window focus order on click
- [x] Consider windows in task bar // NO since we opted out of doing minimization
- [x] Check address bar not scaling down past 390px viewport width (I forgot I wanted min-width on windows I'm a clown)
- [x] Use blog title for url slug and address slug (done, use encodeuricomponent and decodeuricomponent, don't really like what it looks like in browser URL bar though)
- [x] Think about supporting window dragging on touch devices
- [x] Create blog + server action
- [x] Create post + server action
- [x] Modify create post server action to only include title, then make new action triggered by SAVING a txt file
- [x] Set up blog & post ordering
- [x] Consolidate control buttons menu style stuff classes w/e with notepad too, also wrap notepad file btn in span and make that relative instead of entire bar
- [x] Move blog and post creation into File button akin to how I have post saving set up
- [x] Back button doesn't have the hover thing fix it clown
- [x] Eliminate race conditions (spamming post submit creates multiple posts) - disable on pending, if user fucks with disabled... I mean enjoy the ratelimit and duplicate post titles - I do allow that. Dupe blog obv not an issue here since I do checks in backend.
- [x] Keep track of state, if notepad file has been dirtied (modified) prompt a confirmation when they try to exit saying that the modifications haven't been saved yet. Onchange re-dirty the state, on save clean the state.
- [x] Enable show password on creation and login (NIST)
- [x] Set up toast for warning, success and confirmation windows
- [x] Fix click gap between icon and text
- [x] Autoroute user to newly created blog
- [x] Icon view style functionality/context (Setting carries over in all folders)
- [x] Put in the actual filepath in the save warning dialog
- [ ] ATTEMPT TO ROLL MY OWN RATELIMIT FROM SCRATCH, GOT ROUGH IDEA OF HOW IT CAN WORK
- [ ] HEAVY IP-based ratelimit on incorrect password attempts
- [ ] Use dialog for failure to load blogs or posts
- [ ] Look into making file creation input infinitely vertically-expanding so user can see what they've entered at all times
- [ ] Use the isDirty prompting thing if user tries to navigate away from page
- [ ] Look into duplicated re-renders on save, exit, onchange etc notepad
- [ ] Look into date locale mismatching between server and user client
- [ ]
- [ ] Create a shortcut for a dxdiag type thing that lists info about the site

- [ ] Delete post/blog + server actions
- [ ] Make sure deletion also uses dialog prompts/confirm/error
- [ ] Set up blog & post search filtering
- [ ] Analytics (Posthog?)
- [ ] Sentry mayhaps?
- [ ] position fixed bottom stuff has been broken on firefox mobile for years, look into it because that breaks taskbar when zoom + drag
- [ ] Some form of pagination for blogs and maybe posts, dragging performance sucks once there are a lot of files in the div
- [ ] Metadata, especially important for blog links
