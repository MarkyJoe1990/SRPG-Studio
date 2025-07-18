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
* Here comes the annoying part. Open `$user-interface` and open the `index.html` in your editor.
* You'll see inside the `head` node that there's a bunch of `link` and `script` nodes. Change their href and src values to have a "." at the start, right after the `"`.
* Now BEFORE YOU SAVE AND EXIT, scroll all the way to the bottom of the file! There's one more `script` node. Change its src value to have a "." at the start, right after the `"`.
* ... Yeah. Apparently, you can't easily compile this stuff to just use relative paths, so you have to do it manually.
* Anyway. Open `index.html` in your browser to confirm the web app is working.
* You can then drag the `$user-interface` folder into your plugin's folder.