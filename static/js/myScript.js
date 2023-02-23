$(document).ready(function () {
	urlLINK = window.location.origin
	var mainURL = String(urlLINK);
	// var mainURL = 'http://127.0.0.1:5000';
    var previewURL = mainURL + '/preview';
    var predictURL = mainURL + '/predict';
	var filterURL = mainURL + '/filter';
	var downloadPredictedCSVURL = mainURL + '/downloadPredictedCSV';
    
    $('#loader').hide();
	$('#loader_predict').hide();
	$('#loader_filter').hide();
	$('#divTablePreview').hide();
	$('#divTablePredict').hide();
	$('#divTableFilter').hide();
	$('#form-box').hide();
	$('#buttonDownloadPredictedCSV').hide();
	$('#displayPredictPlot').html("");
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // $('img').on('click', function () {
    //     var image = $(this).attr('src');
	// 		$('#myModal').on('show.bs.modal', function () {
	// 			$(".img-responsive").attr("src", image);
	// 		});
	// 	});

	// request object to flask API
    function requestObjectFunc(url, method){
        var settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": url,
			  "method": method,
			  "headers": {
				"content-type": "application/json",
				"cache-control": "no-cache"
			  },
			  "processData": false,
			  "error": function (xhr, ajaxOptions, thrownError) {
						if(xhr.status != 200)
							{
								alert('Error in Web service');
                                $('#loader').hide();
							}
						}
			}
        return settings
    }

		
	// browse file action
	$(document).on('click', '#fileBrowse', function(){
		var file = $(this).parent().parent().parent().find('.file');
		file.trigger('click');

		$('#tablePreviewBody').html("");
		$('#tablePreviewHeader').html("");
	});
    
    // on change file action
	$(document).on('change', '.file', function(){
		var fileInput = null;
		var fileName = null;
		fileInput = document.getElementById('fileBrowseInput')
		fileName = fileInput.files[0].name;
		console.log("file browsed: ", fileName)

		 // Allowing file type
		 var allowedExtensions = /(\.csv)$/i;
		 if (!allowedExtensions.exec(fileName)) {
						 alert('Invalid file type!! Accepted file extension - CSV');
						 fileInput.value = '';
						 return false;
					 }
		else{
			$(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
			$('#buttonPreview').attr('disabled', false);

		}
	});
	
	// on click of Preview button
	$(document).on('click', '#buttonPreview', function(){
        $('#loader').show();
		$('#tablePreviewBody').html("");
		$('#tablePreviewHeader').html("");

        var form_data = new FormData($('#upload-file')[0]);
        console.log('Form data : ',form_data)
        $.ajax({
            type: 'POST',
            url: previewURL,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log(data)
                dataSummaryObj = data
                //console.log(data);
                $('#loader').hide();
                previewData(data['dataset'])
            }
        });         
	});
	

	// preview data
	function previewData(objArray)
      {
		console.log("\n ==== Preview Result ==== \n")
		$('#tablePreviewBody').html("");
		$('#tablePreviewHeader').html("");

		   var col_key = Object.keys(objArray[0])
		   var total_rows = Object.keys(objArray).length;
		   console.log("col keys length: ", col_key.length);
		   console.log("col key: ", col_key);
		   console.log("Array length: ", Object.keys(objArray).length);
		   
		   $('#loader').hide();
			
			
		   $('#tablePreviewHeader').append('<th><b>S.N.</b></th>');
		   for(j=0;j<col_key.length;j++)
		   {
			   $('#tablePreviewHeader').append('<th><b>'+col_key[j]+'</b></th>');
		   }
           for(var i=0; i<total_rows; i++)
           {
                    /*$('#tablePreview').append('<tr><td><b>'+parseInt(i+1)+'</b></td><td>'+objArray[i][col_key[0]]+'</td><td>'+objArray[i][col_key[1]]+'</td><td>'+objArray[i][col_key[2]]+'</td><td>'+objArray[i][col_key[3]]+'</td><td>'+objArray[i][col_key[4]]+'</td><td>'+objArray[i][col_key[5]]+'</td><td>'+objArray[i][col_key[6]]+'</td><td>'+objArray[i][col_key[7]]+'</td><td>'+objArray[i][col_key[8]]+'</td><td>'+objArray[i][col_key[9]]+'</td><td>'+objArray[i][col_key[10]]+'</td><td>'+objArray[i][col_key[11]]+'</td><td>'+objArray[i][col_key[12]]+'</td><td>'+objArray[i][col_key[13]]+'</td><td>'+objArray[i][col_key[14]]+'</td><td>'+objArray[i][col_key[15]]+'</td><td>'+objArray[i][col_key[16]]+'</td><td>'+objArray[i][col_key[17]]+'</td><td>'+objArray[i][col_key[18]]+'</td><td>'+objArray[i][col_key[19]]+'</td><td>'+objArray[i][col_key[20]]+'</td></tr>');*/
				   var objArr_row ='';
				   var row_obj = objArray[i];
				   
				   for(j=0;j<col_key.length;j++)
				   {
					//    console.log(objArray[i][col_key[j]]);
					//    console.log(j);
					//    console.log(col_key[j]);
					   
					   var row_val = row_obj[col_key[j]];
					   objArr_row = objArr_row + '<td>'+row_val+'</td>';
				   }
				   $('#tablePreviewBody').append('<tr><td><b>'+parseInt(i+1)+'</td>'+objArr_row+'</tr>');
           }
		    $('#divTablePreview').show();

		$('#tablePreview').excelTableFilter();

      };
    
	// on click of browse button for prediction
    $(document).on('click', '#browsePrediction', function(){
		var file = $(this).parent().parent().parent().find('.filePredict');
		file.trigger('click');

		$('#tablePredictBody').html("");
		$('#tablePredictHeader').html("");

		$('#buttonDownloadPredictedCSV').hide()

		$('#loader_filter').hide();
		$('#divTableFilter').hide();
		$('#tableFilterBody').html("");
		$('#tableFilterHeader').html("");
		$('#form-box').hide();

		$('#displayPredictPlot').html("");
		
	});
	
	// or on change
	$(document).on('change', '.filePredict', function(){
		var fileInput = null;
		var fileName = null;
		fileInput = document.getElementById('fileBrowsePredict')
		fileName = fileInput.files[0].name;
		console.log("file browsed: ", fileName)

		 // Allowing file type
		 var allowedExtensions = /(\.csv)$/i;
		 if (!allowedExtensions.exec(fileName)) {
						 alert('Invalid file type!! Accepted file extension - CSV');
						 fileInput.value = '';
						 return false;
					 }
		else{
			$(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
			$('#buttonPrediction').attr('disabled',false);
		}
	});
	
	// on click of Prediction button
	$(document).on('click', '#buttonPrediction', function(){
        $('#loader_predict').show();
		$('#divTablePredict').show();
		$('#tablePredictBody').html("");
		$('#tablePredictHeader').html("");

		$('#buttonDownloadPredictedCSV').hide()

		$('#loader_filter').hide();
		$('#divTableFilter').hide();
		$('#tableFilterBody').html("");
		$('#tableFilterHeader').html("");
		$('#form-box').hide();

		$('#displayPredictPlot').html("");


        var form_data = new FormData($('#predict-file')[0]);
        console.log('Form data : ',form_data)
		
        $.ajax({
            type: 'POST',
            url: predictURL,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log(data)
                dataSummaryObj = data
                //console.log(data);
                $('#loader_predict').hide();
                predictResult(data['predResult']);
				$('#buttonDownloadPredictedCSV').show();
				$('#form-box').show();
				$('#divTableFilter').show();
            }
        });         
	});
	
	// $(document).on('click', '#showResult', function(){
	// 	$('#myModal').show();
	// });

	// on click of Send button
	$(document).on('click', '#btnSend', function(){
        $('#loader_filter').show();
		$('#divTableFilter').show();
		$('#tableFilterBody').html("");
		$('#tableFilterHeader').html("");

		$('#displayPredictPlot').html("");

        var form_data = new FormData($('#filter-result')[0]);
        console.log('Send button Form data : ',form_data)
		
        $.ajax({
            type: 'POST',
            url: filterURL,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log(data)
                //console.log(data);
                $('#loader_filter').hide();
                filterResult(data['filterDf']);
				showPredictedPlot(data['plot_path']);
            }
        });         
	});

	
	// show the prediction response from API in UI
    function predictResult(data)
	{ 
		console.log(" \n ==== Predict Result ==== \n ")
		$('#tablePredictBody').html("");
		$('#tablePredictHeader').html("");
		
		var col_key = Object.keys(data[0])
		var total_rows = Object.keys(data).length;
		console.log("col key: ", col_key);
		console.log("Array length: ", total_rows);
		
		$('#tablePredictHeader').append('<th><b>S.N.</b></th>');
		   for(j=0;j<col_key.length;j++)
		   {
			   $('#tablePredictHeader').append('<th><b>'+col_key[j]+'</b></th>');
		   }
           for(var i=0; i<total_rows; i++)
           {
                    /*$('#tablePreview').append('<tr><td><b>'+parseInt(i+1)+'</b></td><td>'+objArray[i][col_key[0]]+'</td><td>'+objArray[i][col_key[1]]+'</td><td>'+objArray[i][col_key[2]]+'</td><td>'+objArray[i][col_key[3]]+'</td><td>'+objArray[i][col_key[4]]+'</td><td>'+objArray[i][col_key[5]]+'</td><td>'+objArray[i][col_key[6]]+'</td><td>'+objArray[i][col_key[7]]+'</td><td>'+objArray[i][col_key[8]]+'</td><td>'+objArray[i][col_key[9]]+'</td><td>'+objArray[i][col_key[10]]+'</td><td>'+objArray[i][col_key[11]]+'</td><td>'+objArray[i][col_key[12]]+'</td><td>'+objArray[i][col_key[13]]+'</td><td>'+objArray[i][col_key[14]]+'</td><td>'+objArray[i][col_key[15]]+'</td><td>'+objArray[i][col_key[16]]+'</td><td>'+objArray[i][col_key[17]]+'</td><td>'+objArray[i][col_key[18]]+'</td><td>'+objArray[i][col_key[19]]+'</td><td>'+objArray[i][col_key[20]]+'</td></tr>');*/
				   var objArr_row ='';
				   var row_obj = data[i];
				   
				   for(j=0;j<col_key.length;j++)
				   {
					   var row_val = row_obj[col_key[j]];
					   objArr_row = objArr_row + '<td>'+row_val+'</td>';
				   }
				   $('#tablePredictBody').append('<tr><td><b>'+parseInt(i+1)+'</td>'+objArr_row+'</tr>');
           }
		    $('#divTablePredict').show();
			

		$('#tablePredict').excelTableFilter();
		
		
    }

	function filterResult(data)
	{ 
		console.log(" \n ==== Filter Result ==== \n ")
		$('#tableFilterBody').html("");
		$('#tableFilterHeader').html("");
		
		var col_key = Object.keys(data[0])
		var total_rows = Object.keys(data).length;
		console.log("col key: ", col_key);
		console.log("Array length: ", total_rows);
		
		$('#tableFilterHeader').append('<th><b>S.N.</b></th>');
		   for(j=0;j<col_key.length;j++)
		   {
			   $('#tableFilterHeader').append('<th><b>'+col_key[j]+'</b></th>');
		   }
           for(var i=0; i<total_rows; i++)
           {
                    /*$('#tablePreview').append('<tr><td><b>'+parseInt(i+1)+'</b></td><td>'+objArray[i][col_key[0]]+'</td><td>'+objArray[i][col_key[1]]+'</td><td>'+objArray[i][col_key[2]]+'</td><td>'+objArray[i][col_key[3]]+'</td><td>'+objArray[i][col_key[4]]+'</td><td>'+objArray[i][col_key[5]]+'</td><td>'+objArray[i][col_key[6]]+'</td><td>'+objArray[i][col_key[7]]+'</td><td>'+objArray[i][col_key[8]]+'</td><td>'+objArray[i][col_key[9]]+'</td><td>'+objArray[i][col_key[10]]+'</td><td>'+objArray[i][col_key[11]]+'</td><td>'+objArray[i][col_key[12]]+'</td><td>'+objArray[i][col_key[13]]+'</td><td>'+objArray[i][col_key[14]]+'</td><td>'+objArray[i][col_key[15]]+'</td><td>'+objArray[i][col_key[16]]+'</td><td>'+objArray[i][col_key[17]]+'</td><td>'+objArray[i][col_key[18]]+'</td><td>'+objArray[i][col_key[19]]+'</td><td>'+objArray[i][col_key[20]]+'</td></tr>');*/
				   var objArr_row ='';
				   var row_obj = data[i];
				   
				   for(j=0;j<col_key.length;j++)
				   {
					   var row_val = row_obj[col_key[j]];
					   objArr_row = objArr_row + '<td>'+row_val+'</td>';
				   }
				   $('#tableFilterBody').append('<tr><td><b>'+parseInt(i+1)+'</td>'+objArr_row+'</tr>');
           }
		    $('#divTableFilter').show();
		
		$('#tableFilter').excelTableFilter();

    }

	function showPredictedPlot(plot_path){
		console.log('// plot path: //', plot_path)
		$('#displayPredictPlot').html("");

		var plot_path_name = plot_path.substr(7,);

		d = new Date();
        $('#displayPredictPlot').append('<h3 style="padding-top: 1%;">Forecast - </h3><img src="/'+plot_path_name+'?'+d.getTime()+'" class="img-responsive img-rounded">')

	}

    // convert blob to URL
	function convert_blob_URL(response, type, filename){
		var blob;
		var downloadLink;

		blob = new Blob([response], {type: type});
		downloadLink = document.createElement('a');
		downloadLink.download = filename;
		downloadLink.href= window.URL.createObjectURL(blob);
		console.log("downloadLink.href", downloadLink.href);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}


	// download latest prediction data in csv
    function downloadPredictedCSV(){
        console.log(' ==== Download CSV ===== ')
		settings = requestObjectFunc(downloadPredictedCSVURL, "GET")
		console.log("download settings: ", settings)
        $.ajax(settings).done(function (response) {
            // console.log(response)
			var filename = "predict_result.csv";
			type = "text/csv" 
			convert_blob_URL(response, type, filename)
		})
    }

	//  button to download predicted file
	 $('#buttonDownloadPredictedCSV').click(function(){
        downloadPredictedCSV()
    })

});