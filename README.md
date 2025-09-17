<div>
<!-- your widget template -->
  <div class="chart-container">
    <h3>
      Monthly Bar Chart
    </h3>
    <canvas id="monthlyChart_{{c.widget.id}}" width="400" height="200"></canvas>
  </div>
          
</div>
.chart-container{
padding:20px;
background:white;
border-radius:8px
text-aligh:center
}
.chart-container h3{
  margin-bottom :20px;
  color:#333;
}
canvas{
max-width:100%;
  height:auto;
}
api.controller=function($scope) {
  /* widget controller */
  var c = this;
	c.$onInit = function(){
		setTimeout(function(){
							 var ctx = document.getElementById('monthlyChart_'+c.widget.id);
								if (ctx){
									var config ={
										type: 'bar',
  									data: {
											labels:['Jan' , 'Feb' , 'Mar' ,'Apr' , 'May' , 'Jun' , 'Jul' ,'Aug' , 'Sep' , 'Oct' ,'Nov' , 'Dec'],
											datasets:[{
												label:'Monthly Data',
												data:[12,19,35 ,45 ,25 ,80 ,85 ,16 ,39 ,90 ,44 , 55],
												backgroundColor: 'rgba(54, 162, 235, 0.6)',
     										borderColor:'rgb(54, 162, 235 ,1)',
												borderWidth:1
											}]
										},
  									options: {
											reponsive:true,
    								scales: {
      							y: {
        						beginAtZero: true,
											max:90,
											min:0
      									}
    									}
  									}
									};
									c.chart = new Chart(ctx,config);
								}
		},100);
							 
    };
	c.$onDestroy = function(){
		if (c.chart){
			c.chart.destroy();
		}
	};
	}
};
