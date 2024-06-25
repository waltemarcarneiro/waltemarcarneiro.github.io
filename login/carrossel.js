document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("introShown")) {
        showCarrossel();
    }

    function showCarrossel() {
        var carrossel = document.getElementById("introCarrossel");
        var slides = carrossel.getElementsByClassName("carrossel-slide");
        var currentSlide = 0;

        slides[currentSlide].classList.add("active");

        carrossel.style.display = "flex";

        var nextButtons = carrossel.getElementsByClassName("next-slide");
        Array.from(nextButtons).forEach(function(button) {
            button.addEventListener("click", function() {
                stopMedia(slides[currentSlide]);
                slides[currentSlide].classList.remove("active");
                currentSlide++;
                if (currentSlide < slides.length) {
                    slides[currentSlide].classList.add("active");
                } else {
                    carrossel.style.display = "none";
                    localStorage.setItem("introShown", "true");
                }
            });
        });

        var prevButtons = carrossel.getElementsByClassName("prev-slide");
        Array.from(prevButtons).forEach(function(button) {
            button.addEventListener("click", function() {
                if (currentSlide > 0) {
                    stopMedia(slides[currentSlide]);
                    slides[currentSlide].classList.remove("active");
                    currentSlide--;
                    slides[currentSlide].classList.add("active");
                }
            });
        });

        var finishButton = carrossel.getElementsByClassName("finish-intro")[0];
        finishButton.addEventListener("click", function() {
            stopMedia(slides[currentSlide]);
            carrossel.style.display = "none";
            localStorage.setItem("introShown", "true");
            window.location.href = "../home.html";
        });
    }

    function stopMedia(slide) {
        // Stop all HTML5 videos
        var videos = slide.getElementsByTagName("video");
        Array.from(videos).forEach(function(video) {
            video.pause();
            video.currentTime = 0; // Reset video to start
        });

        // Stop all iframes (e.g., YouTube embeds)
        var iframes = slide.getElementsByTagName("iframe");
        Array.from(iframes).forEach(function(iframe) {
            var iframeSrc = iframe.src;
            iframe.src = iframeSrc; // Reload the iframe to stop the video
        });
    }
});
