import Driver from "driver.js";

export function pageDriver() {
  const driver = new Driver({
    allowClose: false,
    opacity: 0.5,
    onHighlightStarted: (el) => {
      console.log("highlighting %o", el);
    }
  });

  driver.defineSteps([
    {
      element: "#source-homepage",
      popover: {
        title: "Source title",
        description: "This is the homepage for all of <em>Source</em> teachings in the Library. Each of the volumes below contain chapters and some included questions too. And most contain the original audio so you can read along as you listen.<br><br>Click on the image to see the table of contents. The Way of Mastery teachings include&hellip;",
        position: "bottom"
      }
    },
    {
      element: "[data-book='vol']",
      popover: {
        title: "Book Title",
        description: "Book description",
        position: "top"
      }
    }
  ]);

  driver.start();
}

export function pageNavigationDriver() {
  const driver = new Driver({
    allowClose: false,
    opacity: 0.5,
    onReset: () => {
      $("#bookmark-dropdown-menu").dropdown("hide");
    }
  });
  driver.defineSteps([
    {
      element: "#masthead-title",
      popover: {
        title: "Navigation and Features",
        description: "Source is part of the Library of Christ Mind Teachings. On every page you can click here to display the Library's main page to see all available teachings.",
        position: "bottom"
      }
    },
    {
      element: "#page-menu",
      popover: {
        title: "The Menu",
        description: "This is the page menu, it will stick to the top when the page is scrolled (when the tour is over) so it is always available. The menu on other pages is similar but may contain additional features.",
        position: "bottom"
      }
    },
    {
      element: ".bookmark-modal-open",
      popover: {
        title: "List Bookmarks",
        description: "Display a list of bookmarks you have created and optionally filter by topic. You can quickly jump to any bookmark. Learn more about bookmarks in the documentation.",
        position: "bottom"
      }
    },
    {
      element: ".search-modal-open",
      popover: {
        title: "Search Through All Books",
        description: "Find topics of interest by searching through all Source books.",
        position: "bottom"
      }
    },
    {
      element: "#help-menu",
      popover: {
        title: "Get Help and Learn About",
        description: "Learn about the teaching and using the features of the site.",
        position: "bottom"
      }
    },
    {
      element: ".login-menu-option",
      popover: {
        title: "Sign In/Sign Out",
        description: "Create an account and sign in to the site. It's free and allows you to create bookmarks that you can share via Facebook and keep synchronized between devices.",
        position: "left"
      }
    },
    {
      element: "[data-book='wot']",
      popover: {
        title: "Display Table of Contents",
        description: "Click on any image to display and navigate to the volume contents.",
        position: "left"
      }
    }
  ]);

  driver.start();
}

export function transcriptDriver() {
  const driver = new Driver({
    allowClose: false,
    opacity: 0.5
    /*
    onReset: () => {
      $("#bookmark-dropdown-menu").dropdown("hide");
    }
    */
  });

  driver.defineSteps([
    {
      element: "#masthead-title",
      popover: {
        title: "Library of Christ Mind Teachings",
        description: "This page is part of the Teachings of Christ Mind Library. Click this link to navigate to the Library's Home page.",
        position: "bottom"
      }
    },
    {
      element: "#src-title",
      popover: {
        title: "Way of Mastery",
        description: "This page comes from the Way of Mastery. Click this link to navigate to the Home page of the Way of Mastery.",
        position: "bottom"
      }
    },
    {
      element: "#book-title",
      popover: {
        title: "Book Title",
        description: "This identifies the book and chapter of the content on this page.",
        position: "bottom"
      }
    },
    {
      element: "#bookmark-dropdown-menu",
      popover: {
        title: "Bookmarks",
        description: "You can create a bookmark from highlighted text and associate the bookmark with one or more categories. Learn more about bookmarks by reading the documentation.",
        position: "right"
      }
    },
    {
      element: ".search-modal-open",
      popover: {
        title: "Search Through All Books",
        description: "Find topics of interest by searching through all Way of Mastery books.",
        position: "bottom"
      }
    },
    {
      element: ".audio-player-toggle",
      popover: {
        title: "Listen to the Audio",
        description: "Click the speaker icon to display the audio player and listen along as you read.",
        position: "bottom"
      }
    },
    {
      element: ".toggle-paragraph-markers",
      popover: {
        title: "Show/Hide Paragraph Markers",
        description: "Show or hide the markers that preceed each paragraph.",
        position: "bottom"
      }
    },
    {
      element: ".top-of-page",
      popover: {
        title: "Go To Top of Page",
        description: "Quickly jump to the top of the page.",
        position: "bottom"
      }
    },
    {
      element: "#contents-modal-open",
      popover: {
        title: "Table of Contents",
        description: "View the table of contents.",
        position: "bottom"
      }
    },
    {
      element: "#about-dropdown-menu",
      popover: {
        title: "Get Help",
        description: "Learn how to use features of the Library.",
        position: "bottom"
      }
    },
    {
      element: ".login-menu-option",
      popover: {
        title: "Sign In/Sign Out",
        description: "Create an account and sign in or sign out. When you sign in, bookmarks you create will be available on all devices you use to access the library.",
        position: "bottom"
      }
    }
  ]);

  //show bookmark menu
  //$("#bookmark-dropdown-menu").dropdown("show");
  driver.start();
}

