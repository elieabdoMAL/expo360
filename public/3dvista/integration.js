(function () {
  console.log("[Integration] listener registered");

  window.addEventListener("message", (event) => {
    // only trust messages from the same origin
    if (event.origin !== window.location.origin) return;
    const { type, panoramaId } = event.data ?? {};

    if (type === "goto-panorama" && typeof panoramaId === "string") {
      if (window.tour && typeof window.tour.setMediaByName === "function") {
        console.log("[Integration] goto-panorama →", panoramaId);
        window.tour.setMediaByName(panoramaId);
      } else {
        console.warn("[Integration] tour not ready yet");
      }
    }
  });
})();
