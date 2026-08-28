# PrinterMNG

**PrinterMNG** is a full-stack web application for managing a printer rental business.

It allows users to manage their **clients, printers, contracts, and monthly printer readings**, with contract-based pricing and usage calculations.

## Demo

**[Live Demo](https://printer-mng.vercel.app/)**

> **Demo disclaimer:** This is a portfolio project deployed using free-tier
> infrastructure. Resource limits are intentionally enforced, and demo data
> may be deleted without notice. Please do not enter real or sensitive
> information.

## How it works

A typical workflow looks like:

**Client → Contract (Printer) → Monthly Readings**

A contract defines how a printer is billed, including copy prices, minimum charges, and usage thresholds.

Monthly readings record the printer's copy counters. When you add a new reading, the backend compares the counters from this new reading with the last reading found to calculate the copies used in this period, then multiplies the copies used with the value of an individual copy specified in the contract.

The backend only allows to modify/delete the last reading to prevent inconsistencies between readings history.
It also prevents deletion of printers or clients that have linked data.

## Features

* Authentication and authorization
* Client management
* Printer management
* Contract management
* Monthly printer readings and usage calculations
* Contract-based pricing
* Rate limiting and account resource limits
* Custom error handling in frontend
* Spanish & English languages

## Limits
Since this project is a demo and I'm making use of free tier infrastructure, I have implemented some limits for the application:

* Global request rate limits for auth endpoints (20 requests / minute)
* 20 new user accounts per day
* 10 printers per user account
* 10 clients per account
* 5 contracts per client
* 50 readings per contract

## Tech Stack

**Frontend**

Next.js, React, TypeScript, Tailwind CSS

**Backend**

C#, ASP.NET Core, Entity Framework Core, ASP.NET Core Identity, JWT, PostgreSQL

**Deployment**

Vercel, Render, Neon

## Why I Built It

I wanted to build a complete application around a real business process project.

The project covers database design, business logic, authentication, authorization, API development, frontend development, error handling, security considerations and limits, and deployment.
