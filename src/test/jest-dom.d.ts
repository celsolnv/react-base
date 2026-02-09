import "@testing-library/jest-dom";

declare global {
  namespace jest {
    type Matchers<R> = Testing.Matchers<R>;
  }
}

// This is just to make TypeScript happy and avoid the error
// about not finding the type definition file for 'testing-library__jest-dom'
declare module "@testing-library/jest-dom" {}
