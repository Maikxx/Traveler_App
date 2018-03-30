# Traveler Dating App

This application is a basic level dating platform for people who love to travel, but who have not found a soulmate yet.

## Description

### Home

On the [homepage](<localhost:8000>) users can see an overview of available travelers, who use the application. This has been done, to get users to sign up and get inspired for filling in their profiles.

Users can sign up for their account on the homepage, as well as sign in here, given they already have an account.
When users sign up, their account is created and partially filled in, with things like their e-mail and name.

### Questionaire

When users have succesfully signed up, they are taken to the *questionaire* page. Here they are asked to fill in their profile (not everything is required, however). They can only *continue using their account* if they finish filling in the required fields.

If they leave the page and sign in, while not having finished the questionaire correctly, then they will be sent back to the questionaire.

### Matches overview

When they finish the questionaire succesfully, they will be taken to their *matches overview* page, where they can find all the people who they have been matched with, based on the information they provided in the questionaire.

<!-- Take a look at this and generate more users -->
Users are currently matched, based on (where more criteria might follow):
* Age (if they fall within the age requirements, which the user has set in the questionaire)
* Gender (if they fall within the gender requirements, which the user has set in the questionaire)

The user can scroll through their matches, looking for people he or she wants to chat with and get things started.

Also, this page will be the default homepage if the user is signed in, instead of the application homepage.

### Chat and match mechanism

Users can allways chat, if they have been matched together, so there is no 'like or no-like'-system. This has been specifically designed, so that even people who might look less good, but still have an interest in someone, are not immediately removed from the other persons list.

### Match profile / chatting

Users can navigate to a matched person's profile, where they will be able to read everything that that person has filled in in either the questionaire or while editing their profile. There is also a chat button on a match their profile page, which you can use to start (or continue) a chat with this person.

When users start chatting, their chat is automattically added to their *chats* page list, even if they have yet to send a message. This has been done, so that even if the user decides that he or she doesn't currently have time to message this other person, the reference to this person will be saved.

Users can also delete this chat, equally as easy by clicking the trashcan next to the chat they want to delete in the *chats* page.

### Menu

From the matches profile page the user can also navigate to their own profile page, by clicking the icon in the top right corner, to bring down a menu and clicking on *my profile* there.
The user can also navigate to an overview of their *chats*, as well as going back to the *matches overview*.

In this menu, the user can also *log* his- or herself *out*, on every page, as long as the user is signed in (except for the index page of the application).

### My profile

On the users own *profile* page they can view their own filled in data, as well as edit their data, by clicking the button at the bottom of the page. If the user is in "edit mode", he or she can also decide to delete their account, by clicking the corresponding button at the bottom of the page.

## Installing

Install the full application by doing the following in the *terminal*:

```bash
git clone git@github.com:Maikxx/traveler-dating-app.git
cd traveler-dating-app
npm install
```

After that you can watch (and build) the css with:

```bash
gulp
```

While in another tab having the server running with:

```bash
npm start-app
```

When those two are running go to `localhost:8000`.

## Development

### Disclaimer

This project makes use of the boilerplate for nodemon, in combination with TypeScript (which handles transforming ts to js on the fly, with the tsconfig.json), that is not owned by me, neither do I take credit for building them. This boilerplate is made by [Lifely](https://lifely.nl/).

### Scripts

* `clear-dist`: Removes (clears out) the dist folder and all it's contents.
* `build-ts`: Runs `clear-dist` and transforms the TypeScript to JavaScript.
* `build`: Runs `build-ts` and transpiles the source code to ES5, which then copies these files, including the required *node-modules* to the dist folder.
* `serve`: Runs nodemon in watch mode, which watches over changes in the dist folder, and then babelify the files, so it is visible well on inferior browsers.
* `start-app`: Runs `build-ts`, initially, and then runs the TS compiler in watch mode while also then running `serve`.

### Packages and technologies

* [Body Parser](https://github.com/expressjs/body-parser)
* [Express](https://expressjs.com/)
* [Express Session](https://github.com/expressjs/session)
* [Gulp](https://gulpjs.com/)
* [MongoDB][mongo]
* [Mongoose][mongoose]
* [Multer](https://github.com/expressjs/multer)
* [NodeJS](https://nodejs.org/en/)
* [Nodemon](https://github.com/remy/nodemon)
* [Sass](https://sass-lang.com/)
* [TypeScript](http://www.typescriptlang.org/)

### Structure

All the routes are put in to the folder called [routes](https://github.com/Maikxx/traveler-dating-app/tree/master/server/routes), where all the routes of the [server](https://github.com/Maikxx/traveler-dating-app/blob/master/server/server.ts) are defined.
Each route handles a different route. My take on a route is that it is working with the help of a GET request.

On the other side of the spectrum, I also have a folder called [controllers](https://github.com/Maikxx/traveler-dating-app/tree/master/server/controllers).
In this folder are all the controllers, of the application. A controller in my eyes is something that takes a POST request and transforms data into something usable, and does something with this data, like storing something in the database.

### Database

Traveler uses a NoSQL database ([MongoDB][mongo]) to store it's data. The preferance of a NoSQL database over the SQL database is purely out of ease of use and familiarity. For communicating with the database Traveler uses [Mongoose][mongoose].

#### Data

Currently there are over 1600 users in the database, all generated by [Mockaroo](https://mockaroo.com) and prepared by [Maikel van Veen][developer], by changing certain data properties, which could not been done with purely using Mockaroo.

##### Transforming the data

The data received by Mockaroo is in JSON-format, which the [transform tool](https://github.com/Maikxx/traveler-dating-app/blob/master/mockData/transformMockData.js) transforms to data types which correspond with the Mongoose types.

This transform tool generates correct bcrypted passwords (from passwords which are generated by Mockaroo, following the correct regular expression) for each user in the received data, which can be used to log the user in on Traveler.
If that succeeds, the user also gets some properties fixed, especially some issues with comma's (,), so that the data is correct for Mongoose (and the database).
When done with all the data, this script writes the formatted result to the MOCK_DATA.json file.

##### Deploying the data

After transforming the data there is one more thing to do, which is deploying the mock data to Mongo, which is done with the [deploy tool](https://github.com/Maikxx/traveler-dating-app/blob/master/mockData/deployMockData.js).

Here the tool creates a mock schema, which resembles the real Mongoose schema, and makes a model out of it.
This model is then used to instantiate (i.e. create) a new profile for that current iteration (user) of the MockData.json file.
When all users are saved to the database, the connection with Mongo is closed again.

## Licence
[Apache](LICENSE) © [Maikel van Veen][developer]

[developer]: https://github.com/Maikxx
[mongo]: https://www.mongodb.com/
[mongoose]: http://mongoosejs.com/