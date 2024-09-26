# Merch At Scale (MAS)

## Table of Contents

1. [Introduction](#introduction)
2. [Components](#components)
3. [Terminology](#terminology)
4. [How It Works](#how-it-works)

## Introduction

Merch at Scale (MAS) is a project designed to streamline commerce on adobe.com from authoring to delivering user experience end-to-end. It aims to simplify the process of enabling and managing commerce across different platforms while providing powerful tools for content authors.

MAS is:

-   A set of libraries enabling commerce on various surfaces
-   A collection of tools (OST, MAS Studio) allowing authors to create and publish merchandise content
-   A Platform

## Components

MAS includes the following key components:

1. **WCS (Web Commerce Service)**: Provides APIs returning Commerce data required by Adobe.com. [Learn more about WCS](#wcs)

2. **MAS Studio**: A tool for authors to create and manage merchandise content.

3. **Offer Selector Tool (OST)**: Helps in authoring prices and checkout-links.

4. **Web Components**:

    - Core commerce for basic functionality
    - UI components for user interface elements

5. **mas.js**: A JavaScript library to enable "4" on any page. [mas.js documentation](/libs/features/mas/docs/mas.js.html){.con-button .blue}

## Terminology

### Offer Selector ID

An AOS-generated stable reference for a set of natural keys, allowing retrieval of a specific offer whose offer ID may change over time.

API Specification: https://developers.corp.adobe.com/aos/docs/guide/apis/api.yaml#/paths/offer_selectors/post

### WCS {#wcs}

[WCS](https://developers.corp.adobe.com/wcs/docs/guide/introduction.md) (pronounced "weks") is the Web Commerce Service that provides APIs returning Commerce data required by Adobe.com.

API Specification: https://developers.corp.adobe.com/wcs/docs/api/openapi/wcs/latest.yaml#/schemas/Web-Commerce-Artifacts

## How It Works

MAS integrates its components to provide a seamless commerce experience:

1. Authors use MAS Studio to create and manage merchandise content.
2. The Offer Selector Tool helps in selecting appropriate offers.
3. Web Components and mas.js are used to implement the commerce functionality.
4. WCS provides the necessary commerce data through its APIs.
