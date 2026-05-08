# Architecture

OpenPhoto Studio is a static browser application served by GitHub Pages. All image work happens on the user's device.

```mermaid
C4Context
    title System Context
    Person(user, "Creator", "Imports and edits photos")
    System_Ext(githubRepo, "https://github.com/baditaflorin/openphoto-studio", "Source, issues, stars")
    System_Ext(paypal, "https://www.paypal.com/paypalme/florinbadita", "Optional support")
    System_Boundary(pages, "GitHub Pages: https://baditaflorin.github.io/openphoto-studio/") {
      System(app, "OpenPhoto Studio", "Static React/Vite app")
    }
    Rel(user, app, "Uses in browser")
    Rel(app, githubRepo, "Links to repository")
    Rel(app, paypal, "Links to support")
```

```mermaid
C4Container
    title Container View
    Person(user, "Creator")
    System_Boundary(browser, "Browser") {
      Container(shell, "App Shell", "React + TypeScript", "Navigation, editor layout, version metadata")
      Container(editor, "Editor Feature", "React + Canvas", "Tool state, preview, history")
      Container(worker, "Image Worker", "Comlink + Canvas APIs", "Pixel transforms off the main thread")
      ContainerDb(storage, "IndexedDB", "idb-keyval", "Local projects and preferences")
    }
    System_Ext(pages, "GitHub Pages", "Static hosting")
    Rel(user, shell, "Interacts")
    Rel(shell, editor, "Loads")
    Rel(editor, worker, "Runs transforms")
    Rel(editor, storage, "Saves snapshots")
    Rel(pages, shell, "Serves static files")
```

The GitHub Pages boundary is intentionally static. There is no runtime API, server database, or secret-bearing service in v1.
