(function scoresEdit() {
    //===================================================== module globals:
    var $pill;
    var $grandpaImg;
    var $roller;
    var $slide;
    var rollerMinX;
    var rollerMaxX;
    var touchInitX;
    var touchInitY;
    var pillInitX;
    var pillInitY;

    //===================================================== onDOMcreated:
    document.addEventListener("DOMContentLoaded", function domLoadedEventListener() {
        $pill = $('.pill');
        $grandpaImg = $('.grandpa__img');
        $roller = $('.patient__roller');
        rollerMinX = -20;
        rollerMaxX = 717;
        $slide = $('.slide__count');
        pillInitX = $pill.offset().left;
        pillInitY = $pill.offset().top;
        enableEventListeners();

    });

    //===================================================== primary events:
    function enableEventListeners() {

        //=========== touch start:
        document.addEventListener('touchstart', function (event) {
            touchInitX = event.touches[0].clientX;
            touchInitY = event.touches[0].clientY;
        });

        //=========== touch end:
        document.addEventListener('touchend', function () {
            pillInitX = $pill.offset().left;
            pillInitY = $pill.offset().top;
            eatPill();
        });

        //=========== touch move:
        document.addEventListener('touchmove', function (event) {
            var target = event.target;
            var $target = $(target);
            var curX = event.changedTouches[0].clientX;
            var curY = event.changedTouches[0].clientY;
            if (target.hasAttribute('data-pill')) {
                if ($target.attr('data-locked') !== "true") {
                    movePill(curX, curY);
                }
            }
            if (target.hasAttribute('data-roller')) {
                if ($target.attr('data-locked') !== "true") {
                    moveRoller(curX);
                }
            }
            event.preventDefault();
        });

        //=========== clicks:
        document.addEventListener('click', function clickEventListener(event) {
            var target = event.target;
            var $target = $(target);
            if (target.hasAttribute('data-period')) {
                if ($target.attr('data-locked') !== "true") {
                    pressPeriodButton($target);
                }
            }
            if (target.hasAttribute('data-slide')) {
                changeSlide();
            }
        });
    }

    //=========== move pill:
    function movePill(curX, curY) {
        var X = pillInitX + curX - touchInitX;
        var Y = pillInitY + curY - touchInitY;
        if (X < -5) {
            X = -5;
        }
        if (X > 950){
            X = 950;
        }
        if (Y < 80){
            Y = 80;
        }
        if (Y > 612) {
            Y = 612;
        }
        $pill.css({
            // kludge with a taste of curry
            // ToDo: find out where this -20px comes from
            // (bug in chrome ipad simulation? css?)
            top: Y + 20 + "px",
            left: X + "px"
        });
    }

    //=========== eat pill:
    function eatPill() {
        if (pillInitX > 430 && pillInitX < 570 && pillInitY > 110 && pillInitY < 330) {
            $pill.hide();
            $grandpaImg.attr("src", "src/happy.png");
            $grandpaImg.css({
                left: "195px",
                height: "390px",
                top: "45px"
            });
        }
    }

    //=========== move roller:
    function moveRoller(curX) {
        var X = curX - 145;
        if (X < 255) {
            X = -20 + Math.ceil((X - 15) / 30) * 30;
        } else {
            X = X - 15;
            X = 255 + Math.ceil((X - 270) / 42) * 42;
        }
        if (X < rollerMinX) {
            X = rollerMinX;
        } else if (X > rollerMaxX) {
            X = rollerMaxX;
        }
        $roller.css("left", X + "px");
    }

    //=========== press period buttons:
    function pressPeriodButton($button) {
        $.each($('[data-period=active]'), function dataPeriodSwitch(i, element) {
            var $element = $(element);
            var src = $element.attr('data-src');
            var srcPushed = $element.attr('src');
            $element.attr({
                "src": src,
                "data-src": srcPushed,
                "data-period": ""
            });
        });
        var src = $button.attr('src');
        var srcPushed = $button.attr('data-src');
        $button.attr({
            "src": srcPushed,
            "data-src": src,
            "data-period": "active"
        });
    }

    //=========== change slide:
    function changeSlide() {
        var slideOldText = $slide.html();
        var slideNewText = $slide.attr('data-text');
        var slideNum = $slide.attr('data-slide') == 1 ? 2 : 1;
        $slide.attr({
            "data-text": slideOldText,
            "data-slide": slideNum
        });
        $slide.html(slideNewText);
        $.each($('[data-locked]'), function dataLockSwitch(i, element) {
            var $element = $(element);
            var state = $element.attr('data-locked');
            $element.attr('data-locked', state == "false" ? "true" : "false");
        })
    }

})(); // end;