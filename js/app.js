// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs

var sp;
var interval;
var topArr = [];
var heightArr = [];
var connectedCall = false;
function makeSpectrum(id, width, height, bands, volume) {

    bands = bands ? bands : 12;
    volume = volume ? volume : 1;
    
    if (bands < 1) bands = 1;
    if (bands > 128) bands = 128;
    
    // init parent element
    
    var parent = document.getElementById(id);
    
    
    if (typeof parent === 'undefined')
        alert('Element ' +id + ' not found!');
    
    parent.style.display = 'block';
    parent.style.width = width + 'px';
    parent.style.height = height + 'px';
    parent.style.position = 'relative';

    var bandValues = [],
        oldBandValues = [],
        bw = (((width)/ bands) |0),
        bandElements = [],
        analyze = true,
        me = this;

    function calcBand(bandNum) {
        var bv = bandValues[bandNum],
            obv = oldBandValues[bandNum];

        if (bv >= obv) obv = bv;
        obv -= 0.1;
        obv *= volume;
        if (obv < 0 ) obv = 0;
       
        oldBandValues[bandNum] = obv;
        return obv;
    }
    
    function getFFT(band) {
        band = band ? band : bandValues;
        
        for(var i = 0; i < bands; i++) {
            band[i] = analyze ? Math.random() : 0;
       }
       
       //"BPM" to affect first bar
        if (analyze) {
            var d = (new Date()).getMilliseconds() % 10;
            //if (bands > 1) band[1] = band[1] * 0.3 + (d / 10) * 0.7;
            // band[0] = band[0] * 0.2 + (d / 10) * 0.8;            
            // band[1] = band[1] * 0.3 + (d / 10) * 0.7;
            // band[2] = band[2] * 0.5 + (d / 10) * 0.5;
            // band[3] = band[3] * 0.65 + (d / 10) * 0.35;
            // band[4] = band[4] * 0.75 + (d / 10) * 0.25;
            // band[5] = band[5] * 0.85 + (d / 10) * 0.15;
            // band[6] = band[6] * 0.95 + (d / 10) * 0.05;

            // band[39] = band[39] * 0.2 + (d / 10) * 0.8;
            // band[38] = band[38] * 0.3 + (d / 10) * 0.7;
            // band[37] = band[37] * 0.5 + (d / 10) * 0.5;
            // band[36] = band[36] * 0.65 + (d / 10) * 0.35;
            // band[35] = band[35] * 0.75 + (d / 10) * 0.25;
            // band[34] = band[34] * 0.85 + (d / 10) * 0.15;
            // band[33] = band[33] * 0.95 + (d / 10) * 0.05;
            
        }
    }    

    function createBands() {
       
        var i, html = '';
        for(i = 0; i < bands; i++) {
            html += '<div id="' + id + '_band' + i + '" ';
            html += 'style="display:block;position:absolute;';
            html += 'left:' + ((i * bw + 1)|0);

         //   html += 'px;top:' + height;
            html += 'px;width:' + (bw - 2);
            //html += 'px;height:0';
            html += 'px;" class="band"></div>';
        }
        parent.innerHTML = html;

        for(i = 0; i < bands; i++) {
            var el = document.getElementById(id + '_band' + i);
            bandElements.push(el);
        }
    }
    this.mute = function(mute) {
        if (arguments.length === 0) return analyze;
        analyze = (typeof mute === 'boolean' && mute === true) ? true : false;
    }
    this.setVolume = function(vol) {
        
        if (arguments.length === 0)
            return volume;
 
        if (vol < 0) vol = 0;
        if (vol > 1) vol = 1;
        volume = vol;
    }
    this.setVolume(volume);
    var counter=0;
    this.createSnapshot = function() {
    
        var h, y, el;
        var t;
        
        getFFT(bandValues);    
        
        for(var i = 0; i < bands; i++) {
            h = calcBand(i);
            el = bandElements[i].style;

       //     t = Math.abs(h-.4)*5;
            
             if ((h-.4)>0) {
              t = (h-.3)*4.5;               
             } else {
              t = 0;
             }
             
             //if (counter>20 && i>8 && i<32 && t<.5) {
             if (counter>20 && t<.5 && connectedCall) {
              t=.5;
             }

             switch(i) {
              case 0:
                t *= .1; break;
              case 1:
                t *= .25; break;
              case 2:
                t *= .4; break;
              case 3:
                t *= .55; break;
              case 4:
                t *= .7; break;
              case 5:
                t *= .85; break;
              case 6:
                t *= .95; break;

              case 39:
                t *= .1; break;
              case 38:
                t *= .25; break;
              case 37:
                t *= .4; break;
              case 36:
                t *= .55; break;
              case 35:
                t *= .7; break;
              case 34:
                t *= .85; break;
              case 33:
                t *= .95; break;
             }

            //console.log(t);
             

            // el['transform'] = 'scale(1,'+(Math.random()*2)+')';
             el['-webkit-transform'] = 'scale(1,'+t+')';
             el['transform'] = 'scale(1,'+t+')';

          //  el.top = ((height - height * h + 0.5)|0) + 'px';
          //  el.height =  ((height * h + 0.5)|0) + 'px';
        }
        counter++;
       // parent.innerHTML = html;
    }

    //init bands
    getFFT(oldBandValues);
    createBands();

    //GO
    interval = setInterval(me.createSnapshot, 200);
    
    return this;
}
//var sp = makeSpectrum('logo', 250, 100, 12, 0);
var vol = 0;

function fadeIn() {
    vol += 0.02;
    sp.setVolume(vol);
    if (vol < 1) setTimeout(fadeIn, 60);
}

function fadeOutSound(timer) {
  
    if (!timer) {
      timer = .02;
    }
    
    vol = setVolume();
    vol -= timer;
    sp.setVolume(vol);
    if (vol > 0) setTimeout(function() {
      fadeOutSound(timer);
    }, 60);
}

//fadeIn();

function mute(e) {
    sp.mute(!sp.mute());
}
//document.getElementById('muter').addEventListener('click', mute, false);
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function combo(num) {
  var list = $('.bubbles ul');
  var score = parseInt(list.attr('data-score'),10);
  score += num;
  list.attr('data-score',score);
}

$(document).foundation();

/**
 *    Turn an element into a virtual spectrum,
 *    Ken Fyrstenberg Nilsen, Public domain.
 *
 *    USAGE:
 *        makeSpectrum(id, width, height)
 *        makeSpectrum(id, width, height, bands)
 *        makeSpectrum(id, width, height, bands, volume)
 *
 *    id      id of the element to be converted into spectrum
 *    width   width in pixels of spectrum
 *    height  height in pixels of spectrum
 *    bands   (optional) number of "bands"
 *    volume  initial volume (0-1)
 *
 *    METHODS:
 *
 *    setVolume()    returns current volume
 *    setVolume(vol) sets new volume (0-1 float)
 *    mute()         returns current mute status
 *    mute(bool)     (de)activate mute.
*/


$(function() {  

  var scoreMap = {
    1: {score:1,time:'2:05 PM',time_ago:'1 hour 15 min ago',name:'Tavia Norheim',company:'Vice President Sales at Virgin America',action:'Demo Scheduled for Friday 2/19 with Carl'},
    2: {score:1,time:'2:05 PM',time_ago:'1 hour 15 min ago',name:'Tavia Norheim',company:'Vice President Sales at Virgin America',action:'Demo Scheduled for Friday 2/19 with Carl'},
    3: {score:1,time:'2:05 PM',time_ago:'1 hour 15 min ago',name:'Tavia Norheim',company:'Vice President Sales at Virgin America',action:'Demo Scheduled for Friday 2/19 with Carl'},
    4: {score:3,time:'4:10 PM',time_ago:'10 min ago',name:'Robin Anderson',company:'Sales Manager at Groupon',action:'Left Voicemail'},
    5: {score:1,time:'2:05 PM',time_ago:'1 hour 15 min ago',name:'Tavia Norheim',company:'Vice President Sales at Virgin America',action:'Demo Scheduled for Friday 2/19 with Carl'},
    6: {score:2,time:'3:45 PM',time_ago:'35 min ago',name:'Susie Cooper',company:'Product Manager at Hautelook',action:'EMAIL IN PROGRESS: “Hello from Optimizely”'},
    7: {score:3,time:'4:10 PM',time_ago:'10 min ago',name:'Robin Anderson',company:'Sales Manager at Groupon',action:'Left Voicemail'},
    8: {score:3,time:'4:10 PM',time_ago:'10 min ago',name:'Robin Anderson',company:'Sales Manager at Groupon',action:'Left Voicemail'},
    9: {score:2,time:'3:45 PM',time_ago:'35 min ago',name:'Susie Cooper',company:'Product Manager at Hautelook',action:'EMAIL IN PROGRESS: “Hello from Optimizely”'},
  };
  var col3height = window.innerHeight - 66;
  $('.col3').css('height',col3height+'px');
  for (var i = 1; i <= 95; i++) {
    var left = (i*10)-10;
    var leftModal = left - 60;
    var highlight = '';
    if (i > 20) {
      var rand = getRandomInt(1,8);
      if (rand === 5) {
        highlight = 'highlight';
      }
    }
    if (i >= 10) {
      left += 7;
    }
    var phone = '<svg id="ce82b8d7-a55c-4fa7-bd23-61dcbe0fa3da" data-name="Artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.54 30.53"><defs><style>.b9ffe7d8-a4a3-46a0-9d3e-9c91329101cf{fill:#e3e5e5;}</style></defs><title>phone2</title><path class="b9ffe7d8-a4a3-46a0-9d3e-9c91329101cf" d="M265.12,1057l-6.71-4a1,1,0,0,0-1.13.18l-2,2a2,2,0,0,1-1.21.51s-2.52,0-7.22-4.66-4.67-7.22-4.67-7.22a2,2,0,0,1,.51-1.22l1.68-1.68a1.1,1.1,0,0,0,.21-1.15l-3.7-7a0.46,0.46,0,0,0-.8-0.14l-4.59,4.58a2.44,2.44,0,0,0-.6,1.21s-0.89,6.69,8.48,16.07,16.07,8.48,16.07,8.48a2.45,2.45,0,0,0,1.21-.6l4.59-4.58A0.49,0.49,0,0,0,265.12,1057Z" transform="translate(-234.88 -1032.53)"/></svg>';
    var person = '<svg id="f82d3071-6b15-4fea-967c-a5174a6ce457" data-name="Artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.55 31.06"><defs><style>.a52d8ac9a-167b-4f03-8b85-bb7d48546437{fill:#e3e5e5;}</style></defs><title>ISDC_Prototype_2016-02-16-PowerBarUpdates</title><path class="a52d8ac9a-167b-4f03-8b85-bb7d48546437" d="M263.48,1108c-2.15-1-5.33-3.41-10-4.26a18.37,18.37,0,0,0,3.06-5.7,10.71,10.71,0,0,0,.45-4.25,20,20,0,0,0-.07-4.33c-1-3.71-3.67-4.73-6.75-4.73s-5.71,1-6.75,4.74a20.06,20.06,0,0,0-.07,4.32,10.76,10.76,0,0,0,.46,4.26,18.62,18.62,0,0,0,3,5.7c-4.68.86-7.84,3.3-10,4.25-4.41,2-4.44,4.12-4.44,4.12v3.66h35.55v-3.65S267.91,1109.93,263.48,1108Z" transform="translate(-232.38 -1084.7)"/></svg>';
    
    $('.oneTrialHeader .bars').append($('<div style="left:'+left+'px;" data-id="'+i+'" class="bar '+highlight+'"></div>'));
    if (scoreMap[i]) {
      $('.hover-container').append($('<div style="left:'+leftModal+'px;" data-id="'+i+'" class="hover-bar"><i class="arw"></i><ul><li>'+phone+'<div><b>'+scoreMap[i].time_ago+'</b><p>'+scoreMap[i].time+'</p></div></li><li>'+person+'<div><b>'+scoreMap[i].name+'</b><p>'+scoreMap[i].company+'</p></div></li></ul><p class="action">'+scoreMap[i].action+'</p></div>'));  
    } else {
      

      if (i === 10) {
        var name = "Jillian Murphy";
        var job = "Sales Manager at Gilt";
        var action = "Downloaded e-Book";
      } else {
        var name = "Vivek Patel";
        var job = "Director Sales at Disney";
        var action = 'Follow-Up to: “Pricing Request for Disney"';
      }
      $('.hover-container').append($('<div style="left:'+leftModal+'px;" data-id="'+i+'" class="hover-bar"><i class="arw"></i><ul><li>'+person+'<div><b>'+name+'</b><p>'+job+'</p></div></li><li class="upcoming">'+phone+'<p>'+action+'</p></li></ul></div>'));
    }
  };
  setTimeout(function() {
    $('.glow-container').addClass('show');
  },1600);

  setTimeout(function() {
    $('.oneHeader, .right-fixed-section').addClass('active'); 
    $('.main-container').addClass('fadein'); 
    setTimeout(function() {
      $('.power-bar').addClass('active'); 
    },300);
  },500);
  
  $('.bar').on('mouseenter', function() {
    var self = $(this);
    var id = self.attr('data-id');
    $('.hover-bar[data-id="'+id+'"]').addClass('on');
  });

  $('.bar').on('mouseleave', function() {
    var self = $(this);
    var id = self.attr('data-id');
    $('.hover-bar[data-id="'+id+'"]').addClass('off');
    setTimeout(function() {
      $('.hover-bar[data-id="'+id+'"]').removeClass('on off');
    },201);
  });

  setTimeout(function() {
    var i = 1;                
    function myLoop () {
      setTimeout(function () { 
        $('.bar[data-id="'+i+'"]').addClass('done').attr('data-score',scoreMap[i].score);
        i++;
        if (i <= 9) { 
           myLoop();
        }
      }, 50);
    }
    myLoop();


  },1000);

  $('.ready-calls button').on('click', function() {
    var self = $(this);
    self.parent().find('button').removeClass('selected');
    self.addClass('selected');

  });

  $(document).on('mouseenter', '.unverified', function() {
    var self = $(this);
    if (!self.hasClass('verified')) {
      self.addClass('verified');
      addPoints(self,1);
    }    
  });

  $('section.email .arw').on('click', function() {
    var self = $(this);
    var template = parseInt($('section.email .picker > p.selected').attr('data-template'),10); 
    var isRight = self.hasClass('rt') ? true : false;
    if (isRight) {
      template++;
      if (template === 5) template = 1;
      $('section.email .picker > p').removeClass('selected');
      $('.textarea-container [data-template]').fadeOut(300);
      setTimeout(function() {
        $('section.email .picker > p[data-template="'+template+'"]').addClass('selected');  
        $('.textarea-container [data-template="'+template+'"]').fadeIn(300);
      },300);
      
    } else {
      template--;
      if (template === 0) template = 4;
      $('section.email .picker > p').removeClass('selected');
      $('.textarea-container [data-template]').fadeOut(300);
      setTimeout(function() {
        $('section.email .picker > p[data-template="'+template+'"]').addClass('selected');  
        $('.textarea-container [data-template="'+template+'"]').fadeIn(300);
      },300);
    }
  });

  $('[data-type="panel"]').on('click', function() {
    var self = $(this);
    var parent = self.parent();
    var currentFocus = parent.attr('data-focus');
    var thisPanel = self.attr('data-panel');
    if (parent.hasClass('empty-lead')) return false;
    if (thisPanel !== currentFocus) {
      if (thisPanel === 'insights') {
        $('.panels').attr('data-focus','insights');
        $('.panels').addClass('layer');
      } else {
        $('.panels').attr('data-focus','context');
        $('.panels').removeClass('layer');
      }
    }
  });

  $('.linked-tabs .match').on('click', function() {

    $('.col1').addClass('loading');
    $('.col1 .loader-container').fadeIn(300);

    setTimeout(function() {
      combo(2);
      $('.col1 .current-job .data').html('<span>Sales Manager</span> at <span>Gilt.com</span><div class="service">09/2014 - Present (2 years)</div>').removeClass('empty').addClass('unverified');
      $('.col1 .previous-job .data').html('<span>Sales Representative</span> at <span>Gilt.com</span> <span class="small">(1 year)</span>').removeClass('empty').addClass('unverified');
      
      $('.col1 .company-name .data').html('<span>Gilt.com</span><div class="">2 Park Ave. New York, NY 10016</div>').removeClass('empty').addClass('unverified');
      $('.col1 .industry .data').html('<span>Internet</span>').removeClass('empty').addClass('unverified');
      $('.col1 .employees .data').html('<span>1,001 - 5,000</span>').removeClass('empty').addClass('unverified');
      $('.col1 .specializing .data').html('<span>Internet, e-commerce, fashion</span>').removeClass('empty').addClass('unverified');
      $('.col1 .company .logo img').attr('src','images/gilt-logo.jpg');
      $('.col1 .linkedin').addClass('show-pic');

      setTimeout(function() {
        $('section.panels').removeClass('empty-lead');
        $('.panels').attr('data-focus','insights');
        setTimeout(function() {
          $('[data-panel="insights"]').removeClass('slow');
          $('.linked-tabs').fadeOut(300);
          $('.activity').addClass('done');
          $('.lead').fadeOut(300);
          $('.fake-timeline').fadeIn(300);
        },800);
      },50);



      setTimeout(function() {
        $('.col1').removeClass('loading');
        $('.col1 .loader-container').fadeOut(300);
      },400);
      
    },1000);


  });


  var timeout = 12000;
  var counter = 1;
  var action = function() {
      // Do stuff here
      $('.main-bg'+counter).removeClass('show');
      counter++;
      if (counter === 4) counter = 1;
      $('.main-bg'+counter).addClass('show');
  
  };
  setInterval(action, timeout);

  function saveNote(title,body) {
    var note = $('<li><span class="timestamp">Just Now</span><h3>'+title+'</h3><div>'+body+'</div></li>');
    $('.saved-notes').hide().prepend(note).fadeIn(300);
  }
  var numNotes = 0;
  var numSubEntries = 2;
  $('.new-note .save').on('click', function() {
    numNotes++;
    numSubEntries++;
    $('.notes-column').addClass('loading');
    $('.notes-column .loader-container').fadeIn(200);
    var title = $('.new-note .note-title').val().trim();
    var body = $('.new-note textarea').val().trim();
    var noteTitle = $('.note-title').val();
    setTimeout(function() {
      $('.notes-column').addClass('done');
      $('.loader-container').fadeOut(300);
      $('.create-new').fadeIn(300);

      $('.entry[data-item="note'+numNotes+'"]').fadeIn(400).find('.what span').text(noteTitle);
      setActivityHeight('note'+numNotes,4,numSubEntries);

      setTimeout(function() {
        $('.notes-column').removeClass('loading done').find('.new-note').hide();
        saveNote(title,body);
      },300);
    },1000);
  });

  $('.create-new').on('click', function() {
    $(this).hide();
    $('.saved-notes').hide();
    $('.new-note').show().find('input,textarea').val('');
  });

  $('.discard').on('click', function() {
    $('.create-new').show();
    $('.saved-notes').show();
    $('.new-note').hide().find('input,textarea').val('');
  });

  $('.action-row .email').on('click', function() {
    $('.action-row').addClass('send-email');
    setTimeout(function() {
   //   $('.action-row').addClass('step2');
    // 
      $('.panels').addClass('empty-lead hide-context').attr('data-focus','context');
      
      setTimeout(function() {
        $('.panels').find('section.context').hide();
        $('.panels section.email').show();
        setTimeout(function() {
            $('[data-panel="context"] > h1').text('Send Email');
            $('.panels').addClass('show-email');
        },50);
      },550);
      
    },300);

  });

  $('.second-box').on('click', function() {
    var self = $(this);
    if (!self.hasClass('ready')) {
      return false;
    }
    $('.second-box').addClass('minimize');
    setTimeout(function() {
      $('.main-container').removeClass('fadein'); 
      $('.second-box .next-up .name').text('Julie Murphy');

      $('.bubbles .completed').fadeOut(400);
      $('.linkedin img').attr('src','images/new-vivek.png');
      setTimeout(function() {
        $('.bubbles ul').attr('data-score','0');
        $('.action-row').removeClass('sent-email step2');
        $('.contact-results,.outcome,.talking-points,.talking-points2,.current-solution,.rate-quality').removeClass('show').hide();
        $('.phone-row').removeClass('expand rate closed').find('.call').show();
        

        $('.info-container .lead-name').text('Vivek Patel');
        $('.info-container .lead-em-cont span').text('vpatel@disney.com');
        $('.info-container .lead-ph-cont span').text('555-425-2356');
        $('.current-job .data').html('<span>Director of Sales</span> at <span>Disney</span><div class="service">02/2012 - Present (4 years)</div>');
        $('.company-name .data span').html('The Walt Disney Company ');
        $('.main-container').addClass('fadein'); 
        setTimeout(function() {
          $('.second-box').removeClass('minimize');
          $('.bubbles .completed').show();
        },800);
      },1800);
    },300);

  });

  $('.lead-quality > li').on('click', function() {
    addPoints($(this),20);  
    combo(2);
    $('.second-box').addClass('ready');
    setTimeout(function() {
      $('.rate-quality').removeClass('show');
      setTimeout(function() {
         $('.rate-quality').hide();
         $('.phone-row').removeClass('expand rate').addClass('closed');
      },950);
    },300);
  });
  $('.send-email-btn').on('click', function() {

    $('[data-panel="context"]').addClass('loading');
    $('[data-panel="context"] .loader-container').fadeIn(300);

    addPoints(self,40);    
    combo(2);
    setTimeout(function() {

      $('.action-row').removeClass('send-email');
      setTimeout(function() {        
        $('[data-panel="context"]').removeClass('loading');
        $('[data-panel="context"] .loader-container').fadeOut(300);

        $('.panels').removeClass('show-email');
        setTimeout(function() {
            $('.panels section.email').hide();
            $('.panels').find('section.context').show();
            setTimeout(function() {
              $('.panels').removeClass('empty-lead hide-context');
            },50);
            $('[data-panel="context"] > h1').text('Context');

            setTimeout(function() {
              $('.fake-timeline').find('[data-item="4"]').fadeOut(400);            
              setTimeout(function() {
                $('.entry[data-item="sent-email"]').fadeIn(400);
              },400);
            },1000);


            $('.second-box').addClass('ready');
        },500);

      },200)
      
    },1000);
  });

  $('.entry[data-item="3"]').on('click',function() {
    var self = $(this);
    var timeline = $('.fake-timeline');
    var last = timeline.attr('data-last');
    var curHeight = $('.fake-timeline').css('height');

    timeline.toggleClass('hide-call');

    setTimeout(function() {
      if (timeline.hasClass('hide-call')) {
        $('.fake-timeline').css('height','330px').attr('data-last',curHeight);      
      } else {
        $('.fake-timeline').css('height',last).attr('data-last','');
      }
    },10);




    $('.sub-entry').each(function() {
      var self = $(this);
      if (self.is(':visible')) {
        self.addClass('collapse').fadeOut(400);
      } else if (self.hasClass('collapse')) {
        self.removeClass('collapse').fadeIn(400);
      }
    });
  });

  $('.linked-tabs .tabs > li').on('click', function() {
    var self = $(this);
    if (self.hasClass('active')) return false;
    var parent = self.parent();
    var type = self.attr('data-type');
    parent.find('> li').removeClass('active');
    self.addClass('active');
    $('.tab-container').attr('data-type',type);
  });

  $('.insights .nav-menu > li').on('click', function() {
    var self = $(this);
    if (self.hasClass('active')) return false;
    var parent = self.parent();
    var id = self.attr('data-id');
    var left = self.position().left;
    var width = self.width();
    var move = left + (width/2);
    move = move + 'px';
    parent.find('> li').removeClass('active');
    self.addClass('active');

    $('.selected-arrow').css({
      'transform': 'translateX('+move+')',
      '-webkit-transform': '-webkit-translateX('+move+')',
    });
    $('.insights .content > div').fadeOut(300);
    setTimeout(function() {
      $('.insights .content > [data-section="'+id+'"]').fadeIn(300);
    },310);
    


    //$('.tab-container').attr('data-type',type);
  });

  $('.insights .nav-menu > li[data-id="local"]').click();



  $('.disconnect').on('click', function() {
    var self = $(this);
    var phoneArea = $('.phone-row');
    $('#oneHeader-active .calls').addClass('show-disconnecting');
    connectedCall = false;
    fadeOutSound(.03);


   // $('.second-box .buttons').fadeOut(800);
    setTimeout(function() {

   //   $('.second-box').removeClass('temp-margin');
      $('#oneHeader-active .calls').addClass('show-disconnected');
      $('#oneHeader-active .recording').removeClass('blinking');
      $('.disconnect').removeClass('show');
      setTimeout(function() {
        if ($('.entry[data-item="3"]').hasClass('showing')) {
          $('.entry[data-item="3"]').click();  
        }
        

        $('.contact-results,.outcome,.talking-points,.talking-points2,.current-solution').removeClass('show').fadeOut(300);

        phoneArea.find('.local').fadeOut(500);
        $('.minimized-next').removeClass('show');

        setTimeout(function() {
          phoneArea.find('.rate-quality').show(0,function() {
            phoneArea.find('.rate-quality').addClass('show');
          });
        },400);        

        setTimeout(function() {
          
          phoneArea.addClass('rate');
          //$('.local-presence').removeClass('hidden');
          $('.second-box').removeClass('minimize');

          $('.action-row').removeClass('send-email step2');

          $('.action-row').addClass('sent-email');
          setTimeout(function() {
            $('.action-row').addClass('step2');
            $('.action-row').find('.phone2').show();
          },600);
        },800);


        $('#oneHeader-active').addClass('fadeout');  
        
        setTimeout(function() {
          $('#oneHeader-active').removeClass('show');

          if (!$('.bars [data-id="99"]').hasClass('down')) {
            var newHtml = '<i class="arw"></i><ul><li><svg id="ce82b8d7-a55c-4fa7-bd23-61dcbe0fa3da" data-name="Artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.54 30.53"><defs><style>.b9ffe7d8-a4a3-46a0-9d3e-9c91329101cf{fill:#e3e5e5;}</style></defs><title>phone2</title><path class="b9ffe7d8-a4a3-46a0-9d3e-9c91329101cf" d="M265.12,1057l-6.71-4a1,1,0,0,0-1.13.18l-2,2a2,2,0,0,1-1.21.51s-2.52,0-7.22-4.66-4.67-7.22-4.67-7.22a2,2,0,0,1,.51-1.22l1.68-1.68a1.1,1.1,0,0,0,.21-1.15l-3.7-7a0.46,0.46,0,0,0-.8-0.14l-4.59,4.58a2.44,2.44,0,0,0-.6,1.21s-0.89,6.69,8.48,16.07,16.07,8.48,16.07,8.48a2.45,2.45,0,0,0,1.21-.6l4.59-4.58A0.49,0.49,0,0,0,265.12,1057Z" transform="translate(-234.88 -1032.53)"/></svg><div><b>2 min ago</b><p>12:15 PM</p></div></li><li><svg id="f82d3071-6b15-4fea-967c-a5174a6ce457" data-name="Artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.55 31.06"><defs><style>.a52d8ac9a-167b-4f03-8b85-bb7d48546437{fill:#e3e5e5;}</style></defs><title>ISDC_Prototype_2016-02-16-PowerBarUpdates</title><path class="a52d8ac9a-167b-4f03-8b85-bb7d48546437" d="M263.48,1108c-2.15-1-5.33-3.41-10-4.26a18.37,18.37,0,0,0,3.06-5.7,10.71,10.71,0,0,0,.45-4.25,20,20,0,0,0-.07-4.33c-1-3.71-3.67-4.73-6.75-4.73s-5.71,1-6.75,4.74a20.06,20.06,0,0,0-.07,4.32,10.76,10.76,0,0,0,.46,4.26,18.62,18.62,0,0,0,3,5.7c-4.68.86-7.84,3.3-10,4.25-4.41,2-4.44,4.12-4.44,4.12v3.66h35.55v-3.65S267.91,1109.93,263.48,1108Z" transform="translate(-232.38 -1084.7)"/></svg><div><b>Jillian Murphy</b><p>Sales Manager at Gilt</p></div></li></ul><p class="action">Sent Email regarding Demo Scheduled</p>';
            $('.bars [data-id="10"]').attr('data-score','1');
            setTimeout(function() {
              $('.glow-container').addClass('extend');
              $('.bar[data-id="10"]').css('left','90px');
              
              setTimeout(function() {                
                $('.bars [data-id="10"]').addClass('done over');
                setTimeout(function() {
                  $('.bars [data-id="10"]').removeClass('over');
                },700);
              },400);
            },700);

            $('.hover-bar[data-id="10"]').html(newHtml);
            $('.second-box').attr('style','');

            setTimeout(function() {
              var newPos = parseInt($('.bars [data-id="28"]').css('left').replace('px',''),10);
              for (var i = 28; i <= 95; i++) {
                var leftPos = parseInt($('.bars [data-id="'+i+'"]').css('left').replace('px',''),10) + 10;            
                $('.bars [data-id="'+i+'"]').css('left',leftPos+'px');
                $('.hover-bar[data-id="'+i+'"]').css('left',leftPos+'px');
              }
              var newHover = '<div style="left:217px;" data-id="99" class="hover-bar"><i class="arw"></i><ul><li><svg id="ce82b8d7-a55c-4fa7-bd23-61dcbe0fa3da" data-name="Artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.54 30.53"><defs><style>.b9ffe7d8-a4a3-46a0-9d3e-9c91329101cf{fill:#e3e5e5;}</style></defs><title>phone2</title><path class="b9ffe7d8-a4a3-46a0-9d3e-9c91329101cf" d="M265.12,1057l-6.71-4a1,1,0,0,0-1.13.18l-2,2a2,2,0,0,1-1.21.51s-2.52,0-7.22-4.66-4.67-7.22-4.67-7.22a2,2,0,0,1,.51-1.22l1.68-1.68a1.1,1.1,0,0,0,.21-1.15l-3.7-7a0.46,0.46,0,0,0-.8-0.14l-4.59,4.58a2.44,2.44,0,0,0-.6,1.21s-0.89,6.69,8.48,16.07,16.07,8.48,16.07,8.48a2.45,2.45,0,0,0,1.21-.6l4.59-4.58A0.49,0.49,0,0,0,265.12,1057Z" transform="translate(-234.88 -1032.53)"/></svg><div><b>Juliet Anderson</b><p>Director Sales at Best Buy</p></div></li><li class="upcoming"><svg id="f82d3071-6b15-4fea-967c-a5174a6ce457" data-name="Artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.55 31.06"><defs><style>.a52d8ac9a-167b-4f03-8b85-bb7d48546437{fill:#e3e5e5;}</style></defs><title>ISDC_Prototype_2016-02-16-PowerBarUpdates</title><path class="a52d8ac9a-167b-4f03-8b85-bb7d48546437" d="M263.48,1108c-2.15-1-5.33-3.41-10-4.26a18.37,18.37,0,0,0,3.06-5.7,10.71,10.71,0,0,0,.45-4.25,20,20,0,0,0-.07-4.33c-1-3.71-3.67-4.73-6.75-4.73s-5.71,1-6.75,4.74a20.06,20.06,0,0,0-.07,4.32,10.76,10.76,0,0,0,.46,4.26,18.62,18.62,0,0,0,3,5.7c-4.68.86-7.84,3.3-10,4.25-4.41,2-4.44,4.12-4.44,4.12v3.66h35.55v-3.65S267.91,1109.93,263.48,1108Z" transform="translate(-232.38 -1084.7)"/></svg><p>Follow-Up to: “Sales Inquiry"</p></li></ul></div>';
              $('.hover-container').append(newHover);
              setTimeout(function() {
                $('.bars [data-id="99"]').addClass('down');
                setTimeout(function() {
                  $('.bars [data-id="99"]').addClass('normal');
                },800);
              },400);
            },2300);
          }
          
          if(interval) {
              clearInterval(interval);
          }
          setTimeout(function() {
            $('#oneHeader-active').removeClass('fadeout').hide();
            $('#oneHeader-active .calls').attr('class','calls');
          },1700); 
        },1600);
      },1400);

    },1200);
    



  });

  $('.flip-container .front').on('click',function() {
    var self = $(this);
    $('.flip-container').removeClass('inside').addClass('hover sales notdone');
    $('.panelSlide').addClass('fade-out');
    $('.oneStageLeft').addClass('show');

    $('.sf-view').show(function() {
      $('.sf-view').addClass('show');
    });

    $('#oneHeader, .right-fixed-section, .power-bar').addClass('salesforce-view');
  });

  $('.flip-container .back').on('click',function() {
    var self = $(this);  
    $('.flip-container').removeClass('hover sales').addClass('notdone inside');
    
    $('.sf-view').removeClass('show');
    $('.oneStageLeft').removeClass('show');
    setTimeout(function() {
      $('.sf-view').hide();
      $('.panelSlide').removeClass('fade-out');
      $('#oneHeader,.right-fixed-section,.power-bar').removeClass('salesforce-view');
    },400);
  });

  $('.flip-container').on('mouseleave', function() {
    $('.flip-container').removeClass('notdone');
  });

  function KeyPress(e) {
    var evtobj = window.event? event : e;

    if (evtobj.keyCode == 192 && evtobj.ctrlKey) {
      if ($('.oneHeader.default').hasClass('salesforce-view')) {
        $('.flip-container').removeClass('hover sales').addClass('inside');        
        $('.sf-view').removeClass('show');
        $('.oneStageLeft').removeClass('show');
        setTimeout(function() {
          $('.sf-view').hide();
          $('.panelSlide').removeClass('fade-out');
          $('#oneHeader,.right-fixed-section,.power-bar').removeClass('salesforce-view');
        },400);
      } else {
        $('.flip-container').removeClass('inside').addClass('hover sales');
        $('.panelSlide').addClass('fade-out');
        $('.oneStageLeft').addClass('show');
        $('.sf-view').show(function() {
          $('.sf-view').addClass('show');
        });

        $('#oneHeader, .right-fixed-section, .power-bar').addClass('salesforce-view');
      }
    };
  }
  document.onkeydown = KeyPress;

  $('.phone-row [data-type="correct"]').on('click', function() {    

    var self = $(this);
    var count = $('#score-counter').text();
    var phoneArea = $('.phone-row');
    addPoints(self,5);    
    combo(1);
    $('.entry[data-item="4"]').fadeIn(400);
    setActivityHeight('show-email',4,0);
    $('.notes-column').css('opacity','1');

    setTimeout(function() {
      $('.entry[data-item="correct"]').fadeIn(400);
      setActivityHeight('correct-contact',4,1);
      
    },1100);

    phoneArea.find('.contact-results').fadeOut(500, function() {
      phoneArea.find('.talking-points').show(0,function() {
        phoneArea.find('.talking-points').addClass('show');
      });
    });
  });

  $('.phone-row [data-type="adobe"]').on('click', function() {    
    var self = $(this);
    var phoneArea = $('.phone-row');
    addPoints(self,5);
    $('.entry[data-item="adobe"]').fadeIn(400);
    setActivityHeight('solution',4,2);
    combo(1)
    phoneArea.find('.current-solution').fadeOut(500, function() {
      phoneArea.find('.talking-points2').show(0,function() {
        phoneArea.find('.talking-points2').addClass('show');
      });
    });
    setTimeout(function() {
   //  $('.nav-menu > [data-id="compare"]').click();
    },1000);    
  });

  $('.phone-row [data-type="currently-ab"]').on('click', function() {    
    var self = $(this);
    var phoneArea = $('.phone-row');
    addPoints(self,5);
    combo(1)

    phoneArea.find('.talking-points').fadeOut(500, function() {
      phoneArea.find('.current-solution').show(0,function() {
        phoneArea.find('.current-solution').addClass('show');
      });
    });
  });

  var currentMousePos = { x: -1, y: -1 };
  $(document).mousemove(function(e) {
      currentMousePos.x = e.pageX;
      currentMousePos.y = e.pageY;
  });


  var pointsId = 1;
  function addPoints(element,pts) {
    setTimeout(function() {
      var top = currentMousePos.y - 50;
      var left = currentMousePos.x - 40;
      var topMove = top - 75;
      var currentScore = parseInt($('#score-counter').text().replace(',',''),10);
      var newScore = currentScore + pts;
      
      var el = $('<div id="points-'+pointsId+'" class="points-added"><span>+'+pts+'</span></div>').css({
        'top': top + 'px',
        'left': left+ 'px'
      });
      pointsId++;
      $('.points-container').append(el);
      setTimeout(function() {
        el.addClass('active').css('top',topMove+'px');
      },100);    
      new CountUp("score-counter", currentScore, newScore, 0, 1.3).start();
      new CountUp("score-counter-active", currentScore, newScore, 0, 1.3).start();
      setTimeout(function() {
        el.remove();
      },2500);
    },10);
  }

  function setActivityHeight(cls,numBig,numSmall) {
    var height = (numBig*90)+(numSmall*36)-31;
    $('.fake-timeline').addClass(cls).css('height',height+'px');
  }

  $('.action-panel .call').on('click', function() {
    combo(1);
    addPoints(self,10);

    var self = $(this);
    var count = $('#score-counter').text();
    var phoneArea = $('.phone-row');
    $('[data-panel="context"').click();

    $('#oneHeader-active').show();
    $('#oneHeader .trial-header .points').addClass('active');
    
    setTimeout(function() {
      setTimeout(function() {

        $('.entry[data-item="3"]').fadeIn(400);

        setActivityHeight('make-call',3,0);

        phoneArea.addClass('expand').find('.call').fadeOut(300);
        $('.local-presence').addClass('hidden');
        $('.second-box').addClass('minimize');
        setTimeout(function() {
          $('.disconnect').addClass('show');
          setTimeout(function() { $('.minimized-next').addClass('show'); },200);
          phoneArea.find('.outcome').show(0,function() {
            phoneArea.find('.outcome').addClass('show');
          });
          phoneArea.find('.local').fadeIn(500);


          setTimeout(function() {
            // call connected after 4 seconds
            phoneArea.find('.outcome').fadeOut(500, function() {
              phoneArea.find('.contact-results').show(0,function() {
                phoneArea.find('.contact-results').addClass('show');
              });
            });
          },4000);
        },800); 
      },400);   
         
     // $('.action-panel').addClass('on-call');      
      
     //  setTimeout(function() {
     //    $('.action-panel').addClass('divider-off');

     //    setTimeout(function() {
     //      $('.action-panel').find('.action-row').fadeOut(500);
     //      $('.second-box').addClass('move-out'); 
          
     //      setTimeout(function() {
     //        $('.action-panel').addClass('no-border');
     //        $('.second-box').addClass('temp-on');
     //        $('.second-box').addClass('temp-margin');
            
     //        setTimeout(function() {
     //          $('.action-panel').addClass('call-questions');
     //          $('.col2').addClass('show-notes');
     //          $('.second-box .buttons').fadeIn(500);
     //        },500);
     //      },500);
     //    },500);        
     //  },300);

      setTimeout(function() {
        $('#oneHeader-active').addClass('show');
        setTimeout(function() {
          $('#oneHeader-active .calls').addClass('fade-dial');

          connectedCall = true;
          sp = makeSpectrum('soundbar', 200, 39, 40, 0);
          fadeIn();
          setTimeout(function() {
            $('#oneHeader-active .recording').addClass('blinking');
          },1000);

          setTimeout(function() {
            $('#oneHeader-active .calls').addClass('show-call');              
              

            

          },320);
        },4000);
      },1700);


    },100);
    
  });

});