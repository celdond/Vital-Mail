# Vital-Mail

## Set-Up

See the respective files for instructions on how to run the backend and frontend.

The frontend requires the backend to be running in order to operate.

Note that a PostgreSQL database server needs to be properly configured in order for the backend to set-up properly.
See backend for details.

## Overview

Vital Mail is a messaging platform modeled after email systems built using Vite and Express with NodeJS.

## Note

This is an example web application project not tested or meant for production use built originally for a college assignment.

# Features

## Account Creation and Login

Vital Mail requires an account login to utilize its features.

Clicking the "Register an Account" on the login page directs you to the register form.

Accounts require a unique address and a password for creation.

Once logged in, clicking Log Out in the navigation menu will clear your login token.

## Mailbox View

Vital Mail gives you a standard view of all of your mail in each mailbox from the home page.  By 
clicking on another mailbox in the navigation menu, you can switch what mailbox you are viewing.

The mailbox displays mail by date from most recently received to most distant.

## Viewing Messages

While viewing a mailbox, clicking on any entry in the table will open a view of the message's full contents.

## Sending Messages

By clicking compose in the navigation bar, a message can be sent to another user. To send a message, a subject 
and valid recipient must be included.  No content is required for a successful message.

## Moving Messages

Messages are stored in mailboxes, just like an email, and they can be moved between emails as desired. While
viewing a message, you may click the move button at the top of the screen to select a new destination.

Messages outside of the Sent mailbox cannot be insert into the Sent mailbox for any user.

## Custom Mailboxes

New mailboxes can be created in the offcanvas menu to the left of the home screen after signing in.

Clicking on the + icon will allow you to create a new box for storing specific mail.

Clicking on the - icon will allow you to delete any custom boxes you have created.
