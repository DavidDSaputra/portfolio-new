// Do not keep the preloader visible while images and external assets finish loading.
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        var preloader = document.getElementById("preloader");
        if (preloader) preloader.style.display = "none";
    }, 150);
});

var audio = document.getElementById("audioPlayer"), loader = document.getElementById("preloader"); function settingtoggle() { document.getElementById("setting-container").classList.toggle("settingactivate"), document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"), document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow") } function playpause() { !1 == document.getElementById("switchforsound").checked ? audio.pause() : audio.play() } function visualmode() { document.body.classList.toggle("light-mode"), document.querySelectorAll(".needtobeinvert").forEach(function (e) { e.classList.toggle("invertapplied") }) } window.addEventListener("load", function () { loader.style.display = "none", document.querySelector(".hey").classList.add("popup") }); let emptyArea = document.getElementById("emptyarea"), mobileTogglemenu = document.getElementById("mobiletogglemenu"); function hamburgerMenu() { document.body.classList.toggle("stopscrolling"), document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"), document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"), document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"), document.getElementById("burger-bar3").classList.toggle("hamburger-animation3") } function hidemenubyli() { document.body.classList.toggle("stopscrolling"), document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"), document.getElementById("burger-bar1").classList.remove("hamburger-animation1"), document.getElementById("burger-bar2").classList.remove("hamburger-animation2"), document.getElementById("burger-bar3").classList.remove("hamburger-animation3") } const sections = document.querySelectorAll("section"), navLi = document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"), mobilenavLi = document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li"); window.addEventListener("scroll", () => { let e = ""; sections.forEach(t => { let o = t.offsetTop; t.clientHeight, pageYOffset >= o - 200 && (e = t.getAttribute("id")) }), mobilenavLi.forEach(t => { t.classList.remove("activeThismobiletab"), t.classList.contains(e) && t.classList.add("activeThismobiletab") }), navLi.forEach(t => { t.classList.remove("activeThistab"), t.classList.contains(e) && t.classList.add("activeThistab") }) }), console.log("%c Designed and Developed by David Saputra ", "background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;"); let mybutton = document.getElementById("backtotopbutton"); function scrollFunction() { document.body.scrollTop > 400 || document.documentElement.scrollTop > 400 ? mybutton.style.display = "block" : mybutton.style.display = "none" } function scrolltoTopfunction() { document.body.scrollTop = 0, document.documentElement.scrollTop = 0 } window.onscroll = function () { scrollFunction() }, document.addEventListener("contextmenu", function (e) { "IMG" === e.target.nodeName && e.preventDefault() }, !1);

// Brew Slider Logic
let currentSlide = 0;
const slides = document.querySelectorAll('.brew-slide');
const dots = document.querySelectorAll('.brew-dot');
const totalSlides = slides.length;
let slideInterval;

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        dots[index].classList.remove('active');
    });

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function brewNext() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetInterval();
}

function brewPrev() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetInterval();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetInterval();
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(brewNext, 5000);
}

// Initialize Autoplay
if (slides.length > 0) {
    slideInterval = setInterval(brewNext, 5000);
}

// Navbar scroll effect
const navbarEl = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbarEl.classList.add('scrolled');
    } else {
        navbarEl.classList.remove('scrolled');
    }
});
