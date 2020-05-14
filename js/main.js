jQuery(document).ready(function($) {

	var socketConnection = io.connect(
    "https://spacesapis-socket.zang.io/chat",
    {query: 'tokenType=jwt&token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkX3NpZyI6IlJZWXU1T24zN2lSVERHak10cjVSb3c1U0F4OGlzNkJqTWtfZHVrUVk2UnMiLCJwcm9kdWN0X3R5cGUiOiJhY2NvdW50cyIsImxhc3R1cGRhdGV0aW1lIjoiMjAyMC0wMi0xOVQxNTo0Mjo1NS4yODYiLCJpc3MiOiJ6YW5nLmlvIiwicHVibGlja2V5aWQiOiJhZ3h6Zm05dVpYTnVZVEl3TVRSeUdnc1NEVWRLZDNSUWRXSnNhV05MWlhrWWdJRFE2cm5rbHdzTSIsImV4cCI6MTU5MTIwMzkwOCwidXNlcl9pZCI6ImFneHpmbTl1WlhOdVlUSXdNVFJ5RVFzU0JGVnpaWElZZ0lEZ25iaU5nUW9NIiwidmVyIjoiMi4wIn0.TucQxNCTCZpBEnpfVAd7BW7m4GZ5UMu1ATTqboVdHofpr6a5xyFPdoiCWP8B1oNz238Q7CllK8KHa75FI9FbYOPNrEq8ADJXZuDj4pVSkEkcrZ4KUaVi_M98loeMgpUKWK9m7u0JYxmZWkCgyf8EIA7g6uHuOQOQx46XZmaxpDyVWYTTJoEm6QyP06Y07Udh34c53Fb_mbhDHZOgv5YqInykDtPt_g2cNYVmGig_zVgvq8MsIAABqNL6oqomV2D4Cf7IG3BtYwPXwX8ZvPKx641vR66fY_a2biyB5BnBO4Nc1gHJKOcfFaCixUHCTtOyQNuIhgi_ngCQtS4Sk74xNw',
     transports: ['websocket']}
	 );

	 $('#btnSendMessageTest').click(function(){
		 var txt = $("#txtMessage").val();
		 var message = {
		     content: {
		         bodyText: txt
		     },
		     sender: {
		         _id: '5ced39e0bcacd1e2f6533037',
		         type: 'user'
		     },
		     category: 'chat',
		     topicId: '5e4ef63f61ee292fd31cc894'
		 };
		 socketConnection.emit('SEND_MESSAGE', message);
		 $("#txtMessage").val("");
	 })

	$('#btnCallTest').click(function() {
		var payload = {
			category: "tracksstatus",
			topicId: "5e868050592e6468d7609850",
			content: {
				mediaSession: {
					audio: false,
					connected: true,
					//phone: false,
					isCollabOnly: false,
					screenshare: false,
					selfMuted: true,
					video: false
				},
				sessionId: "fc260e73-c4a5-4352-a1d6-5131d3506b96",
				streamId:"{88c92c8e-8a38-4997-b88a-1b92e06ac865}"
			},
			data:[],
			sender: {
				_id: '5ba3c9b399f3924d41839a66',
				type: 'user'
			}
		};
		socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', payload);
	});
	$('#btnEndCallTest').click(function() {
		var payload = {
			category: "video.end",
			topicId: "5e868050592e6468d7609850",
			sender: {
				_id: "5ba3c9b399f3924d41839a66",
				type: "user"
			}
		};
		
		socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', payload);
	});
	socketConnection.on('connect', function() {
		console.log("Socket connection success!");
		
		//nos subscribimos al canal
		var spaceToSubscribe = {
			channel: {
				_id: '5e868050592e6468d7609850',
				type: 'topic'
			}
		};			
		socketConnection.emit('SUBSCRIBE_CHANNEL', spaceToSubscribe);
	});
	socketConnection.on('connect_error', function(error) {
		console.log('Socket connection error: ' + error);
	});
	socketConnection.on('error', function(error) {
		console.log('Socket error: ' + error);
	});
	socketConnection.on('disconnect', function() {
		console.log('Socket disconnected.');
	});
	
	socketConnection.on('SEND_MESSAGE_FAILED', function(error)  {
		console.log('Send message failed: ');
		console.log(error);
	});
	//escuchamos el envio de mensajes al canal
	socketConnection.on('MESSAGE_SENT', function(message) {
		console.log('Message Received');
		console.log(message);
		if(message.category == 'chat')
			$("#messages").append($('<li class="mark">').text(message.sender.displayname+": "+message.content.bodyText));
	});
	socketConnection.on('MEDIA_SESSION_RESPONSE', function(payload) {
		console.log('MEDIA_SESSION_RESPONSE: ');
		console.log(payload);
	});
	socketConnection.on('PRESENCE_EVENT_RESPONSE', function(payload) {
		console.log('PRESENCE_EVENT_RESPONSE: ');
		console.log(payload);
	});
	socketConnection.on('CHANNEL_SUBSCRIBED', function(payload) {
		console.log('CHANNEL_SUBSCRIBED: ');
		console.log(payload);
		//Una vez subscritos notificamos que estmos conectados
		var payload = {
			category: 'app.event.presence.party.online',
			topicId: '5e868050592e6468d7609850',
			content: {
				desktop: false,
				idle: false,
				mediaSession: {
					audio: false,
					connected: false,
					//phone: false,
					screenshare: false,
					selfMuted: true,
					video: false
				},
				offline: false,
				role: 'admin'
			}
		};
		socketConnection.emit('SEND_PRESENCE_EVENT', payload);
	});
	socketConnection.on('CHANNEL_UNSUBSCRIBED', function(payload) {
		console.log('CHANNEL_UNSUBSCRIBED: ');
		console.log(payload);
	});
	socketConnection.on('SUBSCRIBE_CHANNEL_FAILED', function(payload) {
		console.log('SUBSCRIBE_CHANNEL_FAILED: ');
		console.log(payload);
	});

	'use strict';

        $(window).load(function() { // makes sure the whole site is loaded
            $(".seq-preloader").fadeOut(); // will first fade out the loading animation
            $(".sequence").delay(500).fadeOut("slow"); // will fade out the white DIV that covers the website.
        })

        $(function() {

        function showSlide(n) {
            // n is relative position from current slide

            // unbind event listener to prevent retriggering
            $body.unbind("mousewheel");

            // increment slide number by n and keep within boundaries
            currSlide = Math.min(Math.max(0, currSlide + n), $slide.length-1);

            var displacment = window.innerWidth*currSlide;
            // translate slides div across to appropriate slide
            $slides.css('transform', 'translateX(-' + displacment + 'px)');
            // delay before rebinding event to prevent retriggering
            setTimeout(bind, 700);

            // change active class on link
            $('nav a.active').removeClass('active');
            $($('a')[currSlide]).addClass('active');

        }

        function bind() {
             $body.bind('false', mouseEvent);
          }

        function mouseEvent(e, delta) {
            // On down scroll, show next slide otherwise show prev slide
            showSlide(delta >= 0 ? -1 : 1);
            e.preventDefault();
        }

        $('nav a, .main-btn a').click(function(e) {
            // When link clicked, find slide it points to
            var newslide = parseInt($(this).attr('href')[1]);
            // find how far it is from current slide
            var diff = newslide - currSlide - 1;
            showSlide(diff); // show that slide
            e.preventDefault();
        });

        $(window).resize(function(){
          // Keep current slide to left of window on resize
          var displacment = window.innerWidth*currSlide;
          $slides.css('transform', 'translateX(-'+displacment+'px)');
        });

        // cache
        var $body = $('body');
        var currSlide = 0;
        var $slides = $('.slides');
        var $slide = $('.slide');

        // give active class to first link
        $($('nav a')[0]).addClass('active');

        // add event listener for mousescroll
        $body.bind('false', mouseEvent);
    })


        $('#form-submit .date').datepicker({
        });


        $(window).on("scroll", function() {
            if($(window).scrollTop() > 100) {
                $(".header").addClass("active");
            } else {
                //remove the background property so it comes transparent again (defined in your css)
               $(".header").removeClass("active");
            }
        });




});
