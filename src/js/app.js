//= ../../node_modules/jquery/dist/jquery.min.js
//= ../../node_modules/owl.carousel2/dist/owl.carousel.min.js
//= ../../node_modules/izimodal/js/iziModal.min.js


$(function(){
    var win = $(window);
    var mainContainer = $('body');
    var headerPanel = $('.header');
    var openMenuClass = 'open-menu';
    var btn = headerPanel.find('.mobile-menu-btn');

	init();

    function init() {
        initCarousel();
        btnClickListener();
        initModals();
        animatiionPhase();
        submitForm();
    }

    function submitForm() {
        $('.subscribe-news-form').submit(function (e) {
            e.preventDefault();
            const form = e.target;
            var result = { };
            $.each($(form).serializeArray(), function() {
                    result[this.name] = this.value;
            });
            $.ajax({
                url: "https://api2.autopilothq.com/v1/contact",
                type: "POST",
                headers: { "autopilotapikey": "" },
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify( { contact: result } ),
                success: function (data) {
                    $("#yolo-thanks").find('.form-holder').css('display', 'block');
                    $("#email-sub").find('.message').text("Thank you!");
                    $("#email-sub").find('.subscribe-news-form').css('display', 'none');
                    setTimeout(function(){
                          $("#email-sub").css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0}, 800);
                    }, 1000);
                },
                error: function (err) {
                    console.log("Error", err);
                }
            });
        });
    }

    function initCarousel() {
        $(".partners-carousel").owlCarousel({
            loop: true,
            nav: false,
            dots: false,
            margin: 70,
            responsive: {
                0: {
                    items: 1,
                    dots: true,
                    margin: 35
                },
                576: {
                    items: 3,
                    dots: true,
                    loop: false
                },
                980: {
                    items: 5,
                    loop: false
                }
            }
        });

        $(".posts-carousel").owlCarousel({
            center: true,
            loop: true,
            nav: false,
            dots: false,
            margin: 30,
            responsive: {
                0: {
                    items: 1,
                    dots: true
                },
                767: {
                    items: 3
                },
                980: {
                    items: 4
                }
            }
        });
    }

    $('.link-menu').on('click', function(e) {

        var scroll_el = $(this).attr('href');
        $('.link-menu').removeClass('active');
        $(this).addClass('active');

        if ($(scroll_el).length != 0 && (win.width() > 768)) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 900);
            $(this).addClass('active');
        }

        mainContainer.removeClass('open-menu');
    });

    function btnClickListener() {
        if (btn.length) {
            btn.on('click', function () {
                mainContainer.toggleClass(openMenuClass);
            });
        }
    }

    function initModals() {
        $("#privacy, #ownership, #monetization, #team-1, #team-2, #team-3, #team-4, #team-5, #team-6, #subscribe").iziModal({
            onClosed: function(modal,event) {
                document.getElementById(modal.id).getElementsByTagName('form')[0].reset();
                $('#' + modal.id).find('.form-holder').css('display', '');
                $('#' + modal.id).find('.thanks').css('display', '');
            }
        });

        $("#video").iziModal({
            history: false,
            // iframe : true,
            fullscreen: true,
            headerColor: '#000000',
            group: 'group1',
            loop: true
        });
    }

    function animatiionPhase() {
        animatiionPhaseProccess();

        win.scroll(function(){
            animatiionPhaseProccess();
        })
    }

    function animatiionPhaseProccess() {
        const   phase = $('.block-phase-wrapper'),
            phasePosition =  phase.offset().top,
            phaseHeight = phase.outerHeight(),
            innerHeightWindow = window.innerHeight,
            digitPosition = 0,
            mobile = detectmob();
        if(win.scrollTop()>= phasePosition - innerHeightWindow/3 && win.scrollTop()<= phasePosition + innerHeightWindow){
            phase.addClass('animated');
        }

        if (!mobile && phase.hasClass('animated') && !(win.scrollTop()>= phasePosition - innerHeightWindow - phaseHeight - digitPosition && win.scrollTop()<= phasePosition + innerHeightWindow + phaseHeight)) {
            phase.removeClass('animated');
            $('.block-phase-inner').css('transition-delay', 0).css('transition-delay', '');
        }
    }

    function detectmob() {
        if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }
        else {
            return false;
        }
    }

    var videos  = $(".video");
 
        videos.on("click", function(){
            var elm = $(this),
                conts   = elm.contents(),
                le      = conts.length,
                ifr     = null;
 
            for(var i = 0; i<le; i++){
              if(conts[i].nodeType == 8) ifr = conts[i].textContent;
            }
 
            elm.addClass("player").html(ifr);
            elm.off("click");
        });


});
