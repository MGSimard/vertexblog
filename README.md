## THIS APP IS IN ACTIVE DEVELOPMENT

<br/>
<div align="center">

<h3 align="center">VertexBlog</h3>
<p align="center">
Full Cycle Next.js App
<br/>
<br/>
<a href="https://vertexblog.vercel.app/">View Live Project</a>
</p>
</div>

## About The Project

![Screenshot](https://i.imgur.com/jjlaSb3.png)

VertexBlog is a blogging platform based on the Windows 95 user interface. It runs as a file explorer directory where blogs are set up as folders within /Documents, and posts are text files within their respective blogs.

### Features

- System Info
- Blog Creation & Deletion
- Post Creation, Modification & Deletion
- Virtualized list scrolling (from scratch)
- Ratelimiting (User & IP-based, from scratch)
- Auth

<details>
<summary><h2>Application Flow: Authentication</h2></summary>
<p>Generic sign up, sign in & sign out process faciliated by Lucia auth.</p>

1. Users can sign up, in & out from within the start menu.
2. Authentication goes through Lucia auth, which stores entries in our PostgreSQL database.
3. Passwords are hashed with Argon2.
4. Blogs & Text file mutation is auth-protected.

</details>

<details>
<summary><h2>Application Flow: Blog Actions</h2></summary>
<p>Users may create their own blogs (folders) within /Documents.</p>

<h3>Blog Creation</h3>

1. In /Documents, pressing file > new blog opens a file creation prompt.
2. After entering a blog title, the user may submit this "file" creation.
3. Upon submission, it will be added to the database if it passes the following checks:
   - User is authorized.
   - User is not rate limited.
   - Input passes validation.
   - User does not have an existing blog & blog name isn't taken.
4. revalidatePath().

<h3>Blog Deletion</h3>

1. From within the blog itself: File > Delete Blog.
2. Confirmation prompt will appear with the options "Delete", "Cancel" and "X".
3. Cancel & X close the prompt. Delete checks the following:
   - User is authorized.
   - User is not rate limited.
   - Input passes validation.
   - Softdelete blog if exists & correct author (Softdelete to prevent blog name hijack after deletion for impersonation).
   - Hard delete posts - not transactional as post deletion bugging shouldn't prevent blog deletion no matter what.
4. revalidatePath()

</details>

<details>
<summary><h2>Application Flow: Post Actions</h2></summary>
<p>Users may create posts from within their own blog folders.</p>

<h3>Post Creation</h3>

1. In blog, pressing file > new post opens a file creation prompt.
2. After entering a post title, the user may submit this "file" creation.
3. Upon submission, it will be added to the database if it passes the following checks:
   - User is authorized.
   - User is not rate limited.
   - Input passes validation.
   - Blog exists & correct author.
   - Set blog to active (for filled folder icon).
4. revalidatePath().

<h3>Post Saving</h3>

1. Users can type within post text files.
2. isDirty state is tracked for exit warnings and save prompting.
3. File > Save will save the file if the following checks pass:
   - User is authorized.
   - User is not rate limited.
   - Input passes validation.
   - Verify existence & ownership.
   - Updates post content.
4. revalidatePath().

<h3>Post Deletion</h3>

1. In post > File > Delete.
2. Confirmation prompt will appear with the options "Delete", "Cancel" and "X".
3. Cancel & X close the prompt. Delete checks the following:
   - User is authorized.
   - User is not rate limited.
   - Input passes validation.
   - Verify existence & ownership.
   - Delete post, if no more posts set blog to inactive (empty folder icon).
4. revalidatePath().

</details>

<details>
<summary><h2>Application Flow: Windows</h2></summary>

1. Windows can be dragged by their header areas.
2. Windows can be resized & maximized.
3. Windows can be closed.
4. A context provider retains a z-index value - when a window is clicked the value is incremented and given to the target window. This allows accurate layer history to focus specific windows when interacted with.

</details>

<details>
<summary><h2>Application Flow: File rendering (Virtualized Lists)</h2></summary>

1. Files are rendered as flex lists within draggable windows.
2. Files can be filtered by search.
3. Files can be sorted by name, earliest creation date & last updated.
4. File display can be changed between large icons, small icons & single-column list.
5. Files are displayed as a virtualized list written from scratch, which allows the "rendering" of thousands of files at once without impacting scroll or window dragging performance.
6. We do this by calculating the intended height occupation if all files were rendered depending on their current view mode (large, small, list). Then we detect which chunk of files should be rendered in the window depending on the current scroll position, and position that chunk in the correct position.

</details>

### Built With

- [Based on T3 Stack](https://create.t3.gg/)
- [Next.js 15](https://nextjs.org/)
- [React 19.0.0-rc-69d4b800-20241021](https://react.dev/)
- [TypeScript 5.6.3](https://www.typescriptlang.org/)
- [Drizzle (PostgreSQL)](https://orm.drizzle.team/)
- [Lucia (Auth)](https://lucia-auth.com/)
- [Argon2 (Hashing)](https://www.npmjs.com/package/@node-rs/argon2)
- [Sentry (Error Management)](https://sentry.io/)
- [Zod 3.23.8 (Validation)](https://zod.dev/)
- [heroicons (Basic Icons)](https://heroicons.com/)
- [Vercel Hosting](https://vercel.com/)

## Usage

- Go to https://vertexblog.vercel.app/

## Contact

MGSimard - g.marcgs@gmail.com  
[@MGSimard on X](https://x.com/MGSimard)

For more info, view my portfolio at [mgsimard.github.io](https://mgsimard.github.io). Resume attached.

<details>
<summary><h2>TASK LIST<h2></summary>

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
- [x] ATTEMPT TO ROLL MY OWN RATELIMIT FROM SCRATCH, GOT ROUGH IDEA OF HOW IT CAN WORK
- [x] Consider separate ratelimiting for action types (Signup/Signin, Data fetching, Data mutation (Blog/Post))
- [x] Upgrade to new stable Next 15, migrate .eslintrc.cjs to flat config eslint.config.mjs etc etc.
- [x] Reduce filesize of "/favicons/android-chrome-512x512.png"
- [x] Some form of pagination for blogs and maybe posts, dragging performance sucks once there are a lot of files in the div - (Settled on virtualization from scratch)
- [x] Implement virtualized list scrolling from scratch
- [x] Now that we have virtualization, need to fix file creation if scroll isn't at the top already
- [x] Suspense the page loads, allow shortcut render popin
- [x] Use the isDirty prompting thing if user tries to navigate away from page
- [x] Look into date locale mismatching between server and user client
- [x] Create a shortcut for a dxdiag type thing that lists info about the site
- [x] Post deletion
- [x] Works, now make action tighter and use transactions
- [x] Now run the delete button onto a confirmation lol
- [x] DISABLE ALL EVENTS OUTSIDE OF CONFIRMATION & ERROR POPUPS. CURRENTLY YOU CAN SPAM ENTER TO MAKE NEW POPUPS (no effect, would just be cleaner to prevent it)
- [x] Blog deletion
- [x] Make sure deletion also uses dialog prompts/confirm/error
- [x] Set up blog & post search filtering
- [x] Now make it look good and responsive
- [x] Make decent 404 page
- [x] Metadata, especially important for blog links
- [x] Sentry mayhaps?
- [x] Style new list setup for multi-errors in dialog window
- [x] IP-based ratelimit for guest users
- [x] Now clean up repeated code for getClientIdentifier, then add ratelimit to fetch actions
- [ ] Save warning doesn't work on ahref click and browser back
- [ ] Look into duplicated re-renders on save, exit, onchange etc notepad
- [ ] Consider focus trap in dialog (right now can exit it, then re-entering site focuses first dom node and can't re-enter dialog with tab because background event disabled on purpose)
- [ ] position fixed bottom stuff has been broken on firefox mobile for years, look into it because that breaks taskbar when zoom + drag
- [ ] Make ograph images for diff platforms

</details>
