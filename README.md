# FrontEnd for Project Y

## What is Project Y?

- Y is a social network that is based on X, which allows people to join by creating accounts. Each user should provide a username, a display name, an email, and a password to create an account. The email address should not link to any account in the system.

- After joining Y, users can update their profile info like Avatar, Header, Location and a short description about themselves.

- Users can write posts that contain text content, which includes hashtags, and image. Users can like, unlike, repost, undo repost or bookmark a post or a reply.

- Users can follow each other. After following someone, a user can view posts of that user in Following tab.

- Users can view other users' profile.

- Users can chat with each other and receive notifications when they have replies to one of their posts, get mentioned in a post or reply, get followed by other users, or when other users repost one of their posts or replies.

## Tech Stack

### NextJS, app router version

- The reason I use NextJS is because it is a React framework with multiple handy utilities such as Typescript, routing based on folder structure (without relying on React Router), NextAuth for quick validation, server actions, React server components, etc. Trying out NextJS is a great experience to keep updated of recent technologies.

### Material UI

- Built-in components for easy use. In this app, I use inline styling with Material UI components for convenience.

### Tailwind CSS

- A great CSS framework for styling. It comes together with NextJs when I created the app. The only downside is I have to look up the syntax for the classses name to make it work. I only use it as a study purpose.

### Socket.io

- To handle real-time update of messages between users.

### React-Mentions

- This library provides quick functionality for mentioning a user.

### Other libraries: Lodash, React Dropzone, React Hook Form, Yup, etc.

## Production Link

- Check out the app here: <https://danielnguyen-y-fe.vercel.app/>

- **Note**: The backend of the app is deployed with a free account. It will go to sleep after being inactive for a while. It will re-activate within at least 1 - 3 minutes after an attempt to call an API. (You will get error 504 during that time)
