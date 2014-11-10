/**
* mp.js v0.0.1 by @an_eric
* Copyright 2014 Eric Rose
* http://www.apache.org/licenses/LICENSE-2.0
*/

var dow = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

$(document).ready(function() {

      var racerObj = {};
      buildRacerObj();
      if(racerObj['raceDate']){
        buildPlan();
      }


      function buildRacerObj(){
        if($.cookie('mpForm')){
          var racerInfo = $.cookie('mpForm').split('&');
          $.each(racerInfo, function(key,value){
           keyValue = value.split('=');
            if(keyValue[0] =='raceDate'){
              racerObj[keyValue[0]] = new Date(keyValue[1].replace(/\%2F/g, '/'));
            } else {
              racerObj[keyValue[0]] = keyValue[1];
            }
          });
        } else {
          modalInit();
          $('#targetsModal').modal('show');
        }
      }

      function buildPlan(){
        $.ajax({
        url: "data/5518.json",
        async: false,
        dataType: 'json',
        success: function( data )
        {
          var tempDate = new Date(racerObj['raceDate'].getTime());

          $.each(data.weeks, function(weekIndex, week){
            $('#weekTitle').append('<div id="title'+week.weekNumber+'"><h1 id="mesocycle'+week.weekNumber+'">Mesocycle '+week.phase+':</h1> ' +
              '<h2 id="description'+week.weekNumber+'">'+week.description+'</h2></div>');
            $('#trainingWeek').append('<tr class="' + week.weekNumber +'">"' + "<th>Day</th><th>Date</th><th>Description</th><th>Mileage</th><th>Actual</th></tr>")

            $.each(week.days, function(key, day){
              tempDate = new Date(racerObj['raceDate'].getTime());

              //weeks and days are zero indexed
              tempDate.setDate(racerObj['raceDate'].getDate() - (((parseInt(week.weekNumber) + 1) * 7) - (1 + parseInt(key))));

              //What to do about two-a-days?
              $('#trainingWeek').append('<tr class="' + week.weekNumber +'">'+
                '<td><b>'+ dow[tempDate.getDay()] +
                '</b></td><td>'+ (1 + tempDate.getMonth()) + "/" + tempDate.getDate() + "/" + tempDate.getFullYear() +
                '</td><td>' +day.description +
                '</td><td>'+ day.distance +
                '</td><td class="col-md-1"><input type="text" class="form-control" id="'+tempDate.toISOString().substring(0,10)+'"></td></tr>');
              });
            });

           initPage(data.weeks.length);
         }
        });
      }

      function initPage(totalWeeks){
        var today = new Date();
        var todayRow = $( "td:contains('"+ (1 + today.getMonth()) + "/" + today.getDate() + "/" + today.getFullYear() +"')");
        $(todayRow).parent().addClass("success");
        buildLists('#weekNav', totalWeeks -1, 1, '<ul class="nav navbar-nav">', -1);
        //what if training hasn't started yet???
        changePage($(todayRow).parent().attr("class").split(" ")[0]);
        $('#trainingWeek tr input').change(function(){
          //post form id, form val, and user id to persistence layer
          //$.post( "ajax/test.html", function( data ) {
          //  $( ".result" ).html( data );
          //});
          //alert($(this).val());
          //alert(this.id);
          //submit form, but need to put the whole thing in a form
        });
      }

      function modalInit(){
        buildLists('#minutesList', 0, 60, '<ul class="dropdown-menu" id="minutes">', 1);
        buildLists('#hoursList', 2, 6, '<ul class="dropdown-menu minutes" id="hours">', 1);
        $("#racePlanList li a").click(function(){
          $("#racePlanButton").text(this.text);
        });
      }

      function buildLists(id, start, end, openTag, direction){
        var html = openTag;
        for(var i=start; (direction) * i < end; i+=direction){
          html+= '<li><a href="#" id="'+ id.slice(1) +i+'">' + i +'</a></li>';
        }
        html+='</ul>';
        $(id).append(html);
      }

      function changePage(pageNumber){
        var intPage = parseInt(pageNumber);
        if (intPage===0) {
          $('.next').hide();
          } else {
          $('.next').show();
        }
        (intPage==parseInt($('.navbar-nav li').eq(0).text())) ? $('.previous').hide() : $('.previous').show();

        var targetPage = $('.navbar-nav li').filter(function(){return $(this).text()==pageNumber;});
        $(targetPage).parents('.navbar-nav').find('.active').removeClass('active');
        $(targetPage).addClass('active');
        var rows = $('table#trainingWeek tr');
        var titles = $('#weekTitle div');

        var trainingTitle = $('#weekTitle div[id="title'+pageNumber+'"]').show();
        var trainingPage = rows.filter('.'+ pageNumber).show();

        titles.not( trainingTitle ).hide();
        rows.not( trainingPage ).hide();
      }

      $('.dropdown-menu li').click(function(e){
        e.preventDefault();
        var selected = $(this).text();
        $(this).parents('.input-group').find('.goalTime').val(selected);
      });
      $('.navbar-nav li').click(function(e){
        e.preventDefault();
        changePage($(this).text());
      });
      $('.next').click(function(e){
        e.preventDefault();
        changePage(parseInt($('.navbar-nav').find('.active').text())-1);
      });
      $('.previous').click(function(e){
        e.preventDefault();
        changePage(parseInt($('.navbar-nav').find('.active').text())+1);
      });
      $("#generate").click(function() {
        $.cookie('mpForm', $("#targetsForm").serialize(), { expires: 365, path: '/' });
        $('#targetsModal').modal('hide');
        buildRacerObj();
        buildPlan();
      /*
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
              });*/
      });
    });
    $(function() {
      $( "#datepicker" ).datepicker();
    });
$(document).keyup(function(e){
    if(e.keyCode === 27)
      $('#targetsModal').modal('toggle');
});
