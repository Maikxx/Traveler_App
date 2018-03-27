# Traveler_App

This application is a basic level dating platform for people who love to travel, but who have not found a soulmate yet.

## Description

On the home page users can see an overview of available travelers, who use the application. This has been done, to get users to sign up and get inspired for filling in their profiles.

Users can sign up for their account on the homepage, as well as sign in here, given they already have an account.
When users sign up, their account is created and partially filled in, with things like their e-mail and name.

When users have succesfully signed up, they are taken to the 'questionaire' page. Here they are asked to fill in their profile (not everything is required, however). They can only *continue using their account* if they finish filling in the required fields.

<!-- Build this -->
If they leave the page and sign in, while not having finished the questionaire correctly, then they will be sent back to the questionaire.

When they finish the questionaire succesfully, they will be taken to their 'matches overview' page, where they can find all the people who they have been matched with, based on the information they provided in the questionaire.

Users are currently matched, based on (where more criteria might follow):
* Age (if they fall within the age requirements, which the user has set in the questionaire)
* Gender (if they fall within the gender requirements, which the user has set in the questionaire)

## Installing

```bash
git clone git@github.com:Maikxx/traveler-dating-app.git
cd traveler-dating-app
```

## Usage

Watch (and build) the css with:

```shell
gulp
```

Start the server using:

```shell
npm start
```

When those two are running go to [localhost:8000](<localhost:8000>).