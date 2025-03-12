# Full-Stack E-Commerce Website

A **full-stack e-commerce website** built with **Next.js** (React), **TypeScript**, **Express.js**, **Prisma with PostgreSQL**, and **MongoDB**. The application allows users to sign in, search for products, add products to the cart, proceed to payment, confirm the order, and place the order.

## Features

- **User Authentication**: Users can sign up and sign in to the application.
- **Product Search**: Users can search for products by name or category.
- **Cart Management**: Users can add products to the cart, view their cart, and proceed to checkout.
- **Order Placement**: Users can confirm their order and complete the payment process.
- **Order Tracking**: Orders are saved and managed in PostgreSQL using Prisma.

## Tech Stack

- **Frontend**: 
  - **Next.js**: Framework for building the React-based frontend.
  - **TypeScript**: TypeScript for static typing in the frontend.
  
- **Backend**: 
  - **Express.js**: Node.js framework for building the backend REST API.
  - **Prisma**: ORM for working with PostgreSQL (used for saving orders).
  
- **Databases**: 
  - **MongoDB**: NoSQL database for storing product data, user profiles, etc.
  - **PostgreSQL**: Relational database for storing and managing order data.

## Prerequisites

- Node.js (version 14 or later)
- npm or yarn (Node package manager)
- PostgreSQL (for Prisma) and MongoDB (for the application data)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/dhokiyamansi/fullstack-ecommerce.git
