# PERDRiX — Campus Lost-and-Found App

**Full-Stack Mobile Application · École Polytechnique · Sep–Nov 2024**

PERDRiX is a campus lost-and-found application designed to connect people who find lost items with their owners. Built as a collaborative software engineering project, the application provides an end-to-end workflow from account creation and item posting to ownership verification and direct messaging.

The project combines a mobile client, server-side logic, and a relational database to support the complete lost-and-found process.

> **Collaborative project developed by Titouan Salin and Philibert Pappens.**  
> This repository is a portfolio version maintained by Titouan Salin. The original collaborative development history is available in [Philibert Pappens' repository](https://github.com/PhilibertPap/perdrix).

---

## Overview

PERDRiX was motivated by a recurring problem on the École Polytechnique campus: lost and found items were frequently reported through class messaging groups, limiting their visibility to only part of the student community.

The application provides a centralized platform where users can:

- Create an account and manage their profile
- Publish found-item listings with photos
- Browse available listings
- Contact the person who found an item
- Complete a basic ownership-verification step
- Exchange messages after contact is established
- Manage and delete their own listings

The goal was to build a complete application covering the full user flow rather than an isolated prototype or interface.

---

## Application Workflow

```text
                 ┌─────────────────┐
                 │  Authentication │
                 │ Sign up / Login │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Browse Found   │
                 │      Items      │
                 └────────┬────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │  Post a Found   │       │  Select an Item │
    │ Item + Picture  │       │   of Interest   │
    └─────────────────┘       └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │    Ownership    │
                             │  Verification   │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │    Messaging    │
                             │ Between Users   │
                             └─────────────────┘
```

---

## Core Features

### Authentication & User Accounts

Users can create an account, log into the application, and update their personal information.

The database includes the authentication-related tables required to manage user accounts and associate application data with individual users.

### Found-Item Listings

Users who find an item can create a listing containing relevant information and a photo.

Users can browse the available listings, while authors retain control over their own posts and can delete them when they are no longer relevant.

### Ownership Verification

Before contacting the person who found an item, a user goes through a basic verification step intended to establish that the item actually belongs to them.

This introduces an additional layer between public item discovery and private communication.

### User Messaging

Once contact has been established, users can communicate directly through the application's messaging functionality.

Messages are persisted in the database and associated with both the sending and receiving users.

---

## Software Architecture

PERDRiX follows a client/server architecture with persistent database storage.

```text
┌─────────────────────┐
│    Mobile Client    │
│                     │
│  Accounts           │
│  Item Feed          │
│  Item Management    │
│  Verification       │
│  Messaging          │
└──────────┬──────────┘
           │
           │ Requests / Data
           ▼
┌─────────────────────┐
│       Server        │
│                     │
│  Application Logic  │
│  Data Access        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Database       │
│                     │
│  Users / OAuth      │
│  Posts              │
│  Messages           │
└─────────────────────┘
```

The database stores authentication information alongside application-specific entities such as posts and messages. Messages are linked to user identifiers for both senders and recipients.

---

## Mobile Integration

The application was packaged and installed using **Apache Cordova**, allowing the web-based client to run as a mobile application.

The project includes Cordova plugins for capabilities such as:

- Camera access
- File access
- Keyboard integration
- Splash screen support

A geolocation plugin was also explored during development, although location-based functionality was not integrated into the final version.

---

## Tech Stack

**JavaScript · HTML · CSS · SQL · Apache Cordova · Bootstrap**

The project involved full-stack application development, relational data modeling, mobile integration, authentication, client/server communication, and user-interface design.

---

## Repository Structure

```text
PERDRiX-Lost-and-Found-App/
│
├── client/                         # Mobile/web client application
│
├── serveur/                        # Server-side application
│
├── report/
│   └── PERDRiX_Lost_and_Found_App_Report.pdf
│                                   # Full project report
│
└── README.md                       # Project overview and documentation
```

---

## Project Report

The complete project report describes the motivation, features, client architecture, database design, and mobile implementation:

**[Read the full project report](report/PERDRiX_Lost_and_Found_App_Report.pdf)**

---

## Authors & Attribution

PERDRiX was developed collaboratively by:

- **Titouan Salin**
- **Philibert Pappens**

The project was originally developed in the following repository:

**[Original repository — PhilibertPap/perdrix](https://github.com/PhilibertPap/perdrix)**

This repository is maintained by Titouan Salin as a portfolio version of the collaborative project, with additional documentation and project materials.
