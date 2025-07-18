This allows you to generate a user interface that SRPG Studio developers can use to easily generate custom parameters for use in their projects.

# Requirements
* You'll need to install **Node.js** and **Node Package Manager (npm)**
* Everything else should get installed during set up.

# Instructions
* Download this folder ("Custom Parameter UI Generator")
* In your terminal, navigate to this folder and type `npm install`
* Navigate to `src/app/components/schema.tsx`
* Modify the schema as you see fit. Look at what's already placed there to get an idea of how to make number fields, arrays, etc.
* Once you're done, go back to your terminal. Type `npm run build`
* A new folder called `$user-interface` should appear by the end.
* Open that folder, then open `index.html` in your browser to confirm the web app is working.
* You can then drag the `$user-interface` folder into your plugin's folder.