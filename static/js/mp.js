/**
* mp.js v0.0.1 by @an_eric
* Copyright 2013 Eric Rose
* http://www.apache.org/licenses/LICENSE-2.0
*/
     var nycm = new Date("Sept. 28, 2014");

      $(document).ready(function() {

      var maxPage = 18;

      $.getJSON( "data/5518.json", function( data )
      {
          var tempDate = new Date(nycm.getTime());
          var today = new Date();
          maxPage = data.weeks.length;

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
          var todayRow = $( "td:contains('"+ (1 + today.getMonth()) + "/" + today.getDate() + "/" + today.getFullYear() +"')");
          $(todayRow).parent().addClass("success");
          changePage($(todayRow).parent().attr("class").split(" ")[0]);
          /*FIXME: goto today*/
      });


      buildLists('#weekNav', maxPage, 0, '<ul class="nav navbar-nav">', -1);
      buildLists('#minutesList', 0, 60, '<ul class="dropdown-menu" id="minutes">', 1);
      buildLists('#hoursList', 2, 6, '<ul class="dropdown-menu minutes" id="hours">', 1);

      function buildLists(id, start, end, openTag, direction){
        var html = openTag;
        for(var i=start; (direction) * i < end; i+=direction){
          html+= '<li><a href="#" id="'+ id.slice(1) +i+'">' + i +'</a></li>';
        }
        html+='</ul>';
        $(id).append(html);
      }

      function changePage(pageNumber){
        if(parseInt(pageNumber) == 1){
          $('.next').addClass('disabled');
        } else {
          $('.next').removeClass('disabled');
        }
        var targetPage = $('.navbar-nav li').filter(function(){return $(this).text()==pageNumber;});
        $(targetPage).parents('.navbar-nav').find('.active').removeClass('active');
        $(targetPage).addClass('active');
        var rows = $('table#trainingWeek tr');
        var trainingPage = rows.filter('.'+ pageNumber).show();
        rows.not( trainingPage ).hide();
      }

      $('.dropdown-menu li').click(function(e){
        e.preventDefault();
        var selected = $(this).text();
        $(this).parents('.input-group').find('.goalTime').val(selected);
      });
      $('.navbar-nav li').click(function(e){
        changePage($(this).text());
      });
      $('.next').click(function(e){
        changePage(parseInt($('.navbar-nav').find('.active').text())-1);
      });
      $('.previous').click(function(e){
        changePage(parseInt($('.navbar-nav').find('.active').text())+1);
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
      });
    });
    $(function() {
      $( "#datepicker" ).datepicker();
    });