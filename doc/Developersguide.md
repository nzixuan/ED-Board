
## User requirements

### User stories

1. As a staff, I can find the doctor or nurse of a certain assignment on shift for today. 

2. As a staff, I can find out what the assignment and shift of a certain doctor or nurse is. 

3. As a staff, I can be certain that the information is accurate and updated to any changes that have been made.

4. As a rosterer, I can update today's roster and have it be updated to the other display boards.

5. As a rosterer, I can create new rosters for future dates to be displayed on the boards.

6. As a rosterer, I can add and delete assignments to be shown on each of the boards.

7. As an super-admin, I can create and control the users and admins to ensure the control of important features.

8. As an user, I can view and audit log of who has made changes to the roster.

### Non functional requirements

1. Limited or no changes to exisiting scheduling workflow
2. Ease of adoption and use

# Developers Guide

## Design and Architecture

### Architectural Diagram

![alt text](./image/Architectural%20Diagram.png)

### Database Schema 

![alt text](./image/ED%20Board%20DB%20Schema.png)

## Guide for adding config

To add new boards, new staff type or adding super-admin. One would need to manually add the necessary change to the config document. 

1. Use MongoDB compass 
    - Connect to database and make changes from there
    - If database is on a seperate server, it is possible to use mongodump and mongorestore to migrate the database

2. Use API calls on an API Client 

## Guide for making frontend changes 

When trying to change font size, paddings, colours, etc. Note that some of the properties are defined in the respective .css files while some properties are defined inline. Some properties need to be overwritten with `!important` when added to the .css file. 

## Improvements

### General

1. Parsing of straddle timings in "[]" of straddle doctors such that it can be displayed in front their name.

2. Recording changes made when rosters are edited to be archived or shown in the audit trail. 

### Frontend
1. Bug on roster view when a roster have two duplicate rows. Selecting one row will visually show both rows being selected despite only one of them actually being selected.
![Bug1](./image/Bug%20Dupe.jpg)

2. Font size slider on board display so number of rows shown can be adjusted.

 

