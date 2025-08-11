import { Mongoose } from 'mongoose';

// Extend the Node.js Global interface to include our cached Mongoose connection
declare global {
  // Use 'var' to declare a global variable that persists across module reloads in Node.js
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined; // Make it undefined initially
}

// This empty export statement is crucial. It turns the file into a module,
// which prevents TS from treating it as a global script and interfering with other global declarations.
export {};
