var ctx = document.getElementById("myChart").getContext('2d');
function plot(result)
{
    data = {
        datasets: [{
            data: [result['positive'],result['negative'], result['neutral']],
            backgroundColor:['rgba(75, 192, 192, 1)','rgba(255, 99, 132, 1)','rgba(255, 206, 86, 1)']
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Positive Tweets',
            'Negative Tweets',
            'Neutral Tweets'
        ]
    };
    var myChart = new Chart(ctx,{
        type: 'doughnut',
        data: data
    });
}
function submit() {
    var search = document.getElementById('search').value;
    console.log(search);
    var data = {'search': search};
    console.log(data);
    var a = `<div id="loader" class="preloader-wrapper big active" style="margin-left:45%;">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div><div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div></div><p class="active" style="margin-left:45%;">Loading...</p>`;
    $("#result").html(a);
    var animationName='animated slideInUp';
    var animationEnd='animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd';
    $('#result').addClass(animationName).one(animationEnd,function(){
        $(this).removeClass(animationName);
    });
    $("#myChart").css("display","none");
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (result) {
            console.log(result); // result is an object which is created from the returned JSON
            var x = `<h3 style"margin-bottom:10px;"><b>Result</b></h3><hr/>Total Tweets: ${result['negative']+result['positive']+result['neutral']}<br/>Negative Tweets:${result['negative']}<br/>Positive Tweets:${result['positive']}<br/>Neutral Tweets:${result['neutral']}<br/>`;
            $("#loader").removeClass("active");
            $("#result").html(x);
            $('#result').addClass('animated zoomInDown').one(animationEnd,function(){
                $(this).removeClass('animated zoomInDown');
            });
            $("#myChart").css("display","block");
            $("#chartDepiction").addClass('animated fadeIn').one(animationEnd,function(){
                $(this).removeClass('animated fadeIn');
            });
            plot(result);
        }
    });
}