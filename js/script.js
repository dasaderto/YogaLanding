window.addEventListener('DOMContentLoaded', function(){

    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a){
        for(let i = a; i < tabContent.length; i++){
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    hideTabContent(1);

    function showTabContent(b){
        if(tabContent[b].classList.contains('hide')){
            tabContent[b].classList.add('show');
            tabContent[b].classList.remove('hide');
        }
    }

    info.addEventListener('click',function(e){
        let target = e.target;
        if(target && target.classList.contains('info-header-tab')){
            for(let i = 0; i < tab.length; i++){
                if(target == tab[i]){
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // Timer

    let deadline = '2019-04-15';

    function getTimeRemaining(endtime){
        let t = Date.parse(endtime)-Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor(t/(1000*3600));

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime){
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds');
            
        let updateClock = () =>{
            let t = getTimeRemaining(endtime);
            (t.hours < 10) ? hours.textContent = "0" + t.hours : hours.textContent = t.hours;
            (t.minutes < 10) ? minutes.textContent = "0" + t.minutes : minutes.textContent = t.minutes;
            (t.seconds < 10) ? seconds.textContent = "0" + t.seconds : seconds.textContent = t.seconds;

            if (t.total<=0) {
                clearInterval(itv);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        };

        let itv = setInterval(updateClock, 1000);
    }
    setClock("timer", deadline);

    // modal window

    let more = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let close = document.querySelector('.popup-close');

    more.addEventListener('click', function(){
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click',function(){
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    // Forms

    let message = {
        loading : "Загрузка...",
        success : "Спасибо за заявку, скоро мы с вами свяжемся",
        failure : "Что-то пошло не так..."
    };
    let contactFormMessage = {
        loading : "Загрузка...",
        success : "Вскоре, наш агент свяжется с вами",
        failure : "Что-то пошло не так..."
    };

    let detailForm = document.querySelector('.main-form');
    let detailFormInputs = detailForm.getElementsByTagName('input');
    let statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    detailForm.addEventListener('submit', function(e){
        e.preventDefault();
        detailForm.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        let formData = new FormData(detailForm);

        request.send(formData);

        request.addEventListener('readystatechange', function(){
            let promise = new Promise((resolve, reject) => {
                if(request.readyState < 4){
                    statusMessage.innerHTML = message.loading;
                }else if(request.readyState == 4 && request.status == 200){
                    resolve(message.success);
                }else{
                    reject(message.failure);
                }
            });

            promise.then(
                result => {
                    statusMessage.innerHTML = result;
                },
                error => {
                    statusMessage.innerHTML = error;
                }
            );
        });

        for(let i=0; i < detailFormInputs.length; i++){
            detailFormInputs[i].value = "";
        }
    });

    let contactForm = document.querySelector('#form');
    let contactFormInputs = contactForm.getElementsByTagName('input');
    let contactStatusMessage = document.createElement('div');

    contactStatusMessage.classList.add('status');

    contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        contactForm.appendChild(contactStatusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        let formData = new FormData(contactForm);

        request.send(formData);

        request.addEventListener('readystatechange', function(){
            if(request.readyState < 4){
                contactStatusMessage.innerHTML = contactFormMessage.loading;
            }else if(request.readyState == 4 && request.status == 200){
                contactStatusMessage.innerHTML = contactFormMessage.success;
            }else{
                contactStatusMessage.innerHTML = contactFormMessage.failure;
            }
        });

        for(let i=0; i < contactFormInputs.length; i++){
            contactFormInputs[i].value = "";
        }
    });

    // Slider 

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dot = dotsWrap.querySelectorAll('.dot');
    
    function showSlides(n){

        if (n > slides.length){
            slideIndex = 1;
        }else if (n < 1){
            slideIndex = slides.length;
        }

        slides.forEach((item)=> item.style.display= 'none');
        dot.forEach((item) => item.classList.remove('dot-active'));
        slides[slideIndex - 1].style.display = 'block';
        dot[slideIndex - 1].classList.add('dot-active');
    }
    showSlides(slideIndex);

    function plusSlides(n){
        showSlides(slideIndex+=n);
    }
    function currentSlide(n){
        showSlides(slideIndex=n);
    }

    prev.addEventListener('click', ()=>{
        plusSlides(-1);
    });

    next.addEventListener('click', ()=>{
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', (e)=>{
        for(let i=1; i < dot.length+1; i++){
            if(e.target.classList.contains('dot') && e.target == dot[i-1]){
                currentSlide(i);
            }
        }
    });

    let slidesTimer = setInterval(()=>{
        plusSlides(1);
    },3333);
});