/**
* mp.js v0.0.1 by @an_eric
* Copyright 2013 Eric Rose
* http://www.apache.org/licenses/LICENSE-2.0
*/     
     var nycm = new Date("Sept. 28, 2014");

      $(document).ready(function() {

      $.getJSON( "data/5518.json", function( data ) 
      {  
          var tempDate = new Date(nycm.getTime());
          var today = new Date();

          $.each(data.weeks, function(weekIndex, week){
            $.each(week.days, function(key, day){
              tempDate = new Date(nycm.getTime());
              tempDate.setDate(nycm.getDate() - ((parseInt(week.weekNumber) * 7)- (1+parseInt(key))));

              $('#trainingWeek').append('<tr class="' + week.weekNumber +'">'+ 
                '<td><b>'+ day.day +
                '</b></td><td>'+ (1 + tempDate.getMonth()) + "/" + tempDate.getDate() + "/" + tempDate.getFullYear() + 
                '</td><td>' +day.description +
                '</td><td>'+ day.distance +
                '</td></tr>');
            });
          });
          var rows = $('table#trainingWeek tr');
          var seventeen = rows.filter('.17').show();
          rows.not( seventeen ).hide();
          $( "td:contains('"+ (1 + today.getMonth()) + "/" + today.getDate() + "/" + today.getFullYear() +"')").parent().addClass("success");
      });



      buildLists('#minutesList', 0, 60, '<ul class="dropdown-menu" id="minutes">', 1);
      buildLists('#hoursList', 2, 6, '<ul class="dropdown-menu minutes" id="hours">', 1);
      buildLists('#weekNav', 18, 0, '<ul class="nav navbar-nav">', -1);

      function buildLists(id, start, end, openTag, direction){
        var html = openTag;
        for(var i=start; (direction) * i < end; i+=direction){
          html+= '<li><a href="#"' + i+ '">' + i +'</a></li>';
        }
        html+='</ul>';
        $(id).append(html);
      }

      $('.dropdown-menu li').click(function(e){
        e.preventDefault();
        var selected = $(this).text();
        $(this).parents('.input-group').find('.goalTime').val(selected);
      });
      $('.navbar-nav li').click(function(e){
        $(this).parents('.navbar-nav').find('.active').removeClass('active');
        $(this).addClass('active');
      });
      $("#generate").click(function() {
        $.post( ".", $("#targetsForm").serialize(),
                function(data) {
                  $("#signupSuccess").show();
                }
              )
              .error(function(xhr) {
                switch(xhr.status) {
                  case 409:
                    $("#signupDuplicate").show();
                    break;
                  default:
                    $("#signupError").show();
                }
              })
              .always(function() {
                $("#targetsModal").modal('hide');
              });
      })
    })
    $(function() {
      $( "#datepicker" ).datepicker();
    });