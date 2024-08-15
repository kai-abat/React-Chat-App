## Tech Stack

Front-End:

- Programming Language: JavaScript with TypeScript
- Javscript Front-End Library: ReactJS
- Build Tool: Vite
- Router: React Router
- CSS Component Library: React Bootstrap
- Global State Manager: Context API

Back-End:

- Programming Language: JavaScript
- Environment: NodeJS
- Framework: ExpressJS
- Database: MongoDB Atlas
- Object Modeling Tool: Mongoose
- Authentication: NodeJs JWT (jsonwebtoken)
- APIs/Library used:
- bcryt: to hash passwords
- validator: to validate user inputs
- cors: allow us to communicate in the frontend
- dotenv: load environment variables

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```
