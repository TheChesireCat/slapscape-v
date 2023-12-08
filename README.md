# Ibrahim Abbas and Ankit's CS5200 Project

This application is a tool for cataloguing and sharing urban sticker art. Users can create, view, edit, and delete their profiles. They can make posts associated with a location, a title, multiple tags (tags can be created if they do not exist), a description, and multiple images (each with an editable caption). The User associated with a post can delete the post. Individual Images can be deleted from a post. Users can like, and comment on other User’s posts. Likes and saves can be deleted. Comments can be edited or deleted. The platform additionally supports searching posts by text, distance, tags, and popularity. 

## Installing and Ensuring Dependencies

+ Install NodeJS - https://nodejs.org/en. Use `node -v` to check version, this should return v20+
+ Navigate to the project directory `slapscape` with the `package.json` file. This file contains the dependencies for the project.
+ Run `npm install` in this directory to install all the dependencies. This will create a `node_modules` folder in the project directory.
+ The correct `nextjs` and `mysql2` versions will be installed according to the specifications in the `package.json` file.
+ Other libraries such as `leaflet`, `react-leaflet`, `mui` will also be installed.

## Running the Project

+ Ensure that your MySQL server is  running
+ Import the dump from the zip file attached to the submission. The file is called `Projectibrahimramakrishnandump.sql`, A backup non-dump schema without data is also provided in `schema.sql`.
+ This should create a database named `slapscape` with the correct tables and data.
+ Navigate to the project directory `slapscape` with the `package.json` file. There should be a file called `.env.local` in this directory. It contains the environment variables for the project. **Ensure that the values are correct for your MySQL server**. Additional variables are used to secure the session cookie, and to set the AWS S3 bucket name and credentials.

+ Once the dependencies are installed, run `npm run dev` to start the project. This will start the server on `localhost:3000`. Open this in your browser to view the project.

+ **Note** : Running in dev mode means routes are compiled when requested. Upon first load the application **will take time** to load resource heavy pages such as the map view. However, on subsequent visits this will be faster as the routes will be cached.

+ **Note** : To add posts the application uses the browser's navigation api to request latitude and longitude. Please make sure to **"Allow Location Access"** when prompted by the browser. This is required to fetch current location.

+ **Note** : For faster experience, you can run `npm run build && npm run start` to build the project and then run it. This will compile all the routes and pages and will be faster on first load. However, this will take time to build the project.

## Project Structure

+ The application source is located in the `/src` directory in the project and contains `middleware.js` and `/app` directory. 
+ The `/app` directory contains all the pages and components for the application. 
+ The `/app/api` directory contains internal routes for the application. 
+ The `/app/lib` directory contains the database connection and utility functions. A file of note is `actions.js`, this contains all the queries used in the application. These are mostly remote procedure calls to the database.
+ The `/app/components` directory contains all the components used in the application.
+ The `/app/home` directory contains the home page and its subpages which are the main pages of the application.

```
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── markers
│   │   │   │   └── route.js
│   │   │   ├── tagCreate
│   │   │   │   └── route.js
│   │   │   └── tagList
│   │   │       └── route.js
│   │   ├── components
│   │   │   ├── AddComment.js
│   │   │   ├── AddLike.js
│   │   │   ├── Charts.js
│   │   │   ├── DeleteImage.js
│   │   │   ├── DeletePost.js
│   │   │   ├── EditDescription.js
│   │   │   ├── EditTitle.js
│   │   │   ├── LikedPosts.js
│   │   │   ├── Login.js
│   │   │   ├── Map.js
│   │   │   ├── MapBasic.js
│   │   │   ├── ModalTest.js
│   │   │   ├── NewPost.js
│   │   │   ├── PaginationTags.js
│   │   │   ├── PieChart.js
│   │   │   ├── QueryPosts.js
│   │   │   ├── Register.js
│   │   │   ├── Sidebar.js
│   │   │   ├── TagPosts.js
│   │   │   ├── TemporaryDrawer.js
│   │   │   ├── Test.js
│   │   │   ├── User.js
│   │   │   ├── UserPosts.js
│   │   │   ├── ViewPost.js
│   │   │   └── ui
│   │   │       ├── button.js
│   │   │       └── card.jsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── home
│   │   │   ├── liked
│   │   │   │   └── page.js
│   │   │   ├── newpost
│   │   │   │   └── page.js
│   │   │   ├── page.js
│   │   │   ├── post
│   │   │   │   └── [id]
│   │   │   │       ├── edit
│   │   │   │       │   └── page.js
│   │   │   │       └── page.js
│   │   │   ├── search
│   │   │   │   └── page.js
│   │   │   ├── tag
│   │   │   │   └── [id]
│   │   │   │       └── page.js
│   │   │   ├── user
│   │   │   │   ├── [username]
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   └── visualizations
│   │   │       └── page.js
│   │   ├── layout.js
│   │   ├── lib
│   │   │   ├── actions.js
│   │   │   ├── auth.js
│   │   │   ├── db.js
│   │   │   └── utils.js
│   │   ├── login
│   │   │   └── page.js
│   │   ├── logout
│   │   │   └── route.js
│   │   ├── page.js
│   │   └── register
│   │       └── page.js
│   └── middleware.js
```

## Instructions to use the application
 
The app will open to the login/register splash screen.
 
## Splash screen
 
Select the login if you already have credentials or register button if you need to create a new account.
 
### Register
 
The register screen will allow you to enter a username and password. Once you click the register button, the app will attempt to register the user. If the user is successfully registered, the app will present the [login screen](#login). If the user is not successfully registered, the app will display an error message.
 
### Login
 
The login screen will allow you to enter a username and password. Once you click the login button, the app will attempt to login the user. If the user is successfully logged in, the app will present the [main screen](#main-screen). If the user is not successfully logged in, the app will display an error message.
 
## Main screen
 
The main screen will display a map with all the posts in the database. The posts will be displayed as markers on the map.
 
- On Clicking any of the markers, you will be presented with a new page with the post details.
- By dragging the purple marker around, and clicking on the camera icon in the top center of the screen,
you will be taken to create post screen.
    - On the create post screen, you will be able to:
        - Enter a title and description for the post
        - Add images to the post
        - Add tags to the post
        - Submit the post
- By using the search bar in the top center of the screen, you will be able to search for posts containing the search term in the title.
- On any post, you will be able to:
    - View the images belonging to the post
    - View the comments on the post
    - View the number of likes on the post
    - Like the post
    - Comment on the post
    - Edit the post (if you are the owner of the post)
        - The edit screen will allow you to edit the title and description of the post
        - Delete images from the post
        - Delete the post
- On the sidebar menu on the left, you will be able to:
    - View your profile
        - On the profile page, you will be able to view your posts
        - You will be able to edit your profile
            On the edit profile page:
            - You will be able to edit your username and password
            - You will be able to add/change your profile picture
            - You will be able to delete your account
    - View liked posts
    - Navigate to the visualization screen
        - Visualization screen will display the following:
            - A pie chart of the number of posts per tag
            - Total number of posts
            - Total number of users
            - Total number of Images
    - Logout