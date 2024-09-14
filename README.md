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
- [ ] Initial position & size of file explorer on first render
- [ ] Consider windows in task bar
- [ ] Create text file component
- [ ] Text file components should render as draggable window (Important choice here, either render them as dynamic routes in the blog, or render them without routes as a modal - I think I prefer dynamic route for ease of access through URL)
- [ ] Move signup process to a component within taskbar start menu instead of page
- [ ] If not signed in show signin/signup in start menu
- [ ] If signed in show current user/signout in start menu
- [ ]
- [x] Set up database (Vercel PostgreSQL w/ Drizzle ORM)
- [x] Complain on Github about months-long multi-project schema drizzle bug that tries to kill your DB with a sequence drop
- [x] Complain on Github about another driizzle bug where .default(false) & .default(sql`FALSE`) don't work on boolean()
- [ ] Wait until Drizzle makes use of their funding and unfucks this major fuckups
- [x] Password hashing with Argon2, NIST guideline requirements
- [ ] Sign in, sign out
- [ ] Enable show password on creation and login (NIST)
- [ ] Enter password twice prompt, crosscheck on FE & BE
- [ ] Ensure you communicate that leading and trailing spaces aren't allowed in password
- [ ] So validate that part on FE first, then on BE in case they bypass it on purpose
- [ ] Finish setting up auth (Lucia)
- [ ] HEAVY IP-based ratelimit on incorrect password attempts
- [ ] Set up toast for warning, success and confirmation windows
- [ ]
- [ ]
- [ ]
- [ ] Think about supporting window dragging on touch devices
- [ ] Create a shortcut for a dxdiag type thing that lists info about the site
- [ ] Ratelimit
- [ ] Create blog + server action
- [ ] Create post + server action
- [ ] Submit/Modify/Delete post + server actions
- [ ] Analytics
