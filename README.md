# About this repo
This repo contains exercises/projects for [this Udemy Course by Maximilian Schwarzmüller](https://www.udemy.com/course/nextjs-react-the-complete-guide/). Each project/exercise is on a separate branch along with related notes.
# Notes

## Introduction

- NextJS - A FullStack React Framework for Production
- Solves common problems and makes building React apps easier

## Key Features

- Server-side Rendering
    - Render the HTML on the server side itself
    - React renders on the client so the actual rendering (hydration) happens ion the client so the HTML source is mostly empty
    - User interactions are still handled by React but the initial load contains the full source that was rendered on the server
- File-based Routing
    - There is not even a router in React. We need a third-party library and then, create files that replicate these routes for readability
    - Router provides “routing” functionality across pages
    - Next uses the filesystem as the routes instead of in code
- Fullstack capabilities
    - Easily add backend (server-side) code to your Next/React apps
    - Storing data, getting data, authentication, etc can be added to your React project

## Creating a NextJS Project

[https://nextjs.org](https://nextjs.org)

- We will use `pnpm`:
    
    ```bash
    ╰─ pnpm create next-app@latest
    .../Library/pnpm/store/v3/tmp/dlx-84459  |   +1 +
    Packages are hard linked from the content-addressable store to the virtual store.
      Content-addressable store is at: /Users/rajil/Library/pnpm/store/v3
      Virtual store is at:             ../../Library/pnpm/store/v3/tmp/dlx-84459/node_modules/.pnpm
    .../Library/pnpm/store/v3/tmp/dlx-84459  | Progress: resolved 1, reused 0, downloaded 1, added 1, done
    ✔ What is your project named? … nextjs-course
    ✔ Would you like to use TypeScript with this project? … No / Yes
    ✔ Would you like to use ESLint with this project? … No / Yes
    ✔ Would you like to use Tailwind CSS with this project? … No / Yes
    ✔ Would you like to use `src/` directory with this project? … No / Yes
    ✔ Use App Router (recommended)? … No / Yes
    ✔ Would you like to customize the default import alias? … No / Yes
    Creating a new Next.js app in /Users/rajil/courses/nextjs/nextjs-course.
    
    Using pnpm.
    
    Initializing project with template: default
    ```
    
- For the subsequent settings we will use:
    - Typescript ✅
    - ESLint ✅
    - Tailwind CSS ❌
    - `src` directory ❌
    - `app` router ❌ (does not have all the required features as of this writing)
    - default import alias ❌

## The App Router Dilemma

- The App router is an alternative to the pages router that NextJS uses
- The App router is stable but its `Server Actions` component is still in Alpha and not recommended for production
- This component allows form manipulation which we will need.
- So, we’ll be sticking with the pages router

## Directory Structure

- The initial project contains the following main directories:
    - `pages`
        - Contains our routes (pages)
    - `public`
        - Does not contain an `index.html` file because we can choose when a page should be pre-rendered
    - `styles`
        - Contains styling
- Run:
    
    `pnpm dev`
    

#### About the Course

- Basics and Foundation
    - File-based routing
    - Page pre-rendering and data fetching
    - Combining Standard React and NextJS
    - API Routes and Fullstack capabilities
    - Theory/Small Demo and Examples
- Advanced Concepts (for Production)
    - Optimization Opportunities
    - Looking behind the scenes and theory
    - Deployment and Configuration
    - Authentication
    - More Realistic (Bigger) Example Projects
- Summaries and Refreshers
    - ReactJS Refresher (not covered in subsequent notes, a separate repo already exists)
    - NextJS Summary (covered in the separate repo on react)
    - Challenges & Exercises
