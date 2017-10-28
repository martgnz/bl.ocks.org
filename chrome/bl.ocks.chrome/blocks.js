var observer = new MutationObserver(redraw);

observer.observe(document.documentElement, { childList: true, subtree: true });

var isGitHub = location.host === "gist.github.com";
var isBlocks = location.host === "bl.ocks.org";

redraw();

function redraw() {
  if (isGitHub) blocksButton();
  if (isBlocks) cloneButton();

  function blocksButton() {
    var container = document.querySelector(".file-navigation-options");
    if (!container) return;

    var parts = location.pathname.substring(1).split("/"),
      user = parts[0],
      id = parts[1],
      sha = parts[2];
    if (!user || user.length > 39 || !/^[a-z0-9](?:-?[a-z0-9])*$/i.test(user))
      return;
    if (!/^([0-9]+|[0-9a-f]{20,})$/.test(id)) id = null;
    if (!/^[0-9a-f]{40}$/.test(sha)) sha = null;

    var anchor = container.querySelector(".bl-ocks-button"),
      href =
        "http://bl.ocks.org/" +
        user +
        (id ? "/" + id + (sha ? "/" + sha : "") : "");

    if (!anchor) {
      var div = document.createElement("div");
      div.className = "file-navigation-option";
      anchor = div.appendChild(document.createElement("a"));
      anchor.className = "btn btn-sm bl-ocks-button";
      var svg = anchor.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      );
      svg.setAttribute("class", "octicon octicon-link-external");
      svg.setAttribute("height", 16);
      svg.setAttribute("width", 12);
      var path = svg.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "path")
      );
      path.setAttribute(
        "d",
        "M11 10h1v3c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h3v1H1v10h10V10zM6 2l2.25 2.25-3.25 3.25 1.5 1.5 3.25-3.25 2.25 2.25V2H6z"
      );
      anchor.appendChild(document.createTextNode(" bl.ocks"));

      // Disconnect to avoid observing our own mutations.
      observer.disconnect();
      container.appendChild(div);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    if (anchor.href !== href) {
      anchor.href = href;
    }
  }

  function cloneButton() {
    var container = document.querySelector(".column:first-child");
    var sibling = document.querySelector(".date");
    if (!container) return;

    var parts = location.pathname.substring(1).split("/"),
      user = parts[0],
      sha = parts[1];

    if (!user || user.length > 39 || !/^[a-z0-9](?:-?[a-z0-9])*$/i.test(user))
      return;

    var anchor = container.querySelector(".bl-ocks-button"),
      href = "git@gist.github.com:" + sha + ".git";

    if (!anchor) {
      var div = document.createElement("div");
      div.className = "file-navigation-option";
      div.style["display"] = "inline-block";
      anchor = div.appendChild(document.createElement("button"));
      anchor.style.background = "none";
      anchor.style.border = "none";
      anchor.style.cursor = "pointer";
      anchor.style.outline = "none";
      anchor.dataset.clipboardText = href;
      anchor.className = "bl-ocks-button";

      var svg = anchor.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      );

      svg.setAttribute("height", 16);
      svg.setAttribute("width", 14);
      svg.setAttribute("fill", "#3182bd");

      var path = svg.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", "path")
      );

      path.setAttribute(
        "d",
        "M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"
      );
      // anchor.appendChild(document.createTextNode(" Clone with SSH"));

      // Disconnect to avoid observing our own mutations.
      observer.disconnect();
      container.insertBefore(div, sibling);

      document
        .querySelector(".bl-ocks-button")
        .addEventListener("mouseleave", clearTooltip);

      document
        .querySelector(".bl-ocks-button")
        .addEventListener("blur", clearTooltip);

      var clipboard = new Clipboard(".bl-ocks-button");

      clipboard.on("success", function(e) {
        showTooltip(e.trigger, "Copied clone URL!");
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    if (anchor.dataset.clipboardText !== href) {
      anchor.dataset.clipboardText = href;
    }
  }
}

function showTooltip(elem, msg) {
  elem.setAttribute(
    "class",
    "bl-ocks-button tooltipped tooltipped-e tooltipped-no-delay"
  );
  elem.setAttribute("aria-label", msg);
}

function clearTooltip(e) {
  e.currentTarget.setAttribute("class", "bl-ocks-button");
  e.currentTarget.removeAttribute("aria-label");
}
