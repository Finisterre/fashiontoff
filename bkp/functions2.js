var eng = '';

var COMISION = 2;
var COTIZACION = 1.15;
var ENVIO = 16;
fetch("https://evaluacion.olx-autos.com.ar/matchs/5dc363a9c23be26f85daa252")
    .then(res => res.json())
    .then(function (data) {

        var matchs = data.rpta;
        /* var newData =   {"match": {"esp":"NUEVO", "eng": "NEW"}}

         matchs.push(newData);*/

        var jsonInputs = '';



        $('#addBtn').click(function () {


            var newInput = '<div class="form-row mb-2"><div class="col"><input type="text" class="form-control esp" placeholder="Español"></div>';
            newInput += '<div class="col"><input type="text" class="form-control eng" placeholder="English"></div></div>';

            $('#newOnes').append(newInput);

        })

        $total = matchs.length;

        $.each(matchs, function (key, value) {

            jsonInputs += '<div class="form-row mb-2 jsonInput"><div class="col"><input type="text" class="form-control esp" value="' + value.match.esp + '"></div>';
            jsonInputs += '<div class="col"><input type="text" class="form-control jsonInput eng" value="' + value.match.eng + '"></div></div>';


        });






        $('#newOnes').prepend(jsonInputs);



        $('#saveBtn').click(async function () {


            var rpta = [];

            $(".form-row").each(function (index) {

                if ($(this).find('.esp').val() != undefined) {

                    var match = {
                        "match": {
                            "esp": $(this).find('.esp').val(),
                            "eng": $(this).find('.eng').val()
                        }
                    }
                    rpta.push(match)

                }




            });

            console.log(rpta)

            const response = await fetch("https://evaluacion.olx-autos.com.ar/matchs/5dc363a9c23be26f85daa252", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rpta: rpta
                })
            }).then(function () {

                alert("la lista fue actualizada");
                setTimeout(location.reload.bind(location), 100);

            });









        })

        localStorage.clear();



        $(function () {
            var productSelected;
            var gafas = null;

            console.log('aca')
        
            fetch("https://evaluacion.olx-autos.com.ar/countryrates/?country=us")
            .then(res => res.json())
            .then(function (data) {
            
                COMISION = JSON.parse(data[0].rates.COMISION);
                COTIZACION = JSON.parse(data[0].rates.COTIZACION);
                ENVIO = JSON.parse(data[0].rates.ENVIO);


                    //(COSTO*COTIZACION*COMISION)+(ENVIO*COTIZACION)
                    var from = 1;
                    var to = 5;
                    $('#productList').change(function () {

          

                        productSelected = $(this).children("option:selected").val();

                        console.log(productSelected)
                        if (productSelected != 'null') {

                      
                            $('#uploader').removeClass('d-none');
                            $('#uploader').show();

                            if (productSelected != 'TODOS') {
                                
                                if(productSelected == 'GAFAS'){

                                    
                                    $('#anteojos').removeClass('d-none');
                                    $('#anteojos').show();

                                    $('#anteojos').change(function () {

                                        gafas = $(this).children("option:selected").val();
                                        $('#upload').removeClass('d-none');
                                        $('#upload').show();
                                        $('#all').hide();
                                    })

                                }else{
                                    $('#upload').removeClass('d-none');
                                    $('#upload').show();
                                    $('#all').hide();
    
                                }
                                
                              


                            } else {

                                $('#anteojos').hide();
                                $('#all').removeClass('d-none');
                                $('#all').show();
                                $('#upload').hide();
                            }
                     
                        } else {
                            $('#uploader').hide();
                            $('#upload').hide();
                        }



                    });

                    $('#from').change(function () {

                        from = $(this).children("option:selected").val();
                        $("#alert").hide();
                    })

                    $('#to').change(function () {
                        $("#alert").hide();
                        to = $(this).children("option:selected").val();

                  

                    })

                    $("#upload").click(function () {
                        $("#alert").hide();
                        $("#success").hide();
                        
                        $("#upload").hide();
                        $('#loaderG').removeClass('d-none');
                        $('#loaderG').show();

                        var productsCounter = 1;

                        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

                        if (regex.test($("#fileUpload").val().replace(/\s/g, '').replace('(', '').replace(')', '').toLowerCase())) {
                            if (typeof (FileReader) != "undefined") {
                                var reader = new FileReader();

                                reader.onload = function (e) {
                                    var products = new Array();
                                    var inventario = new Array();
                                    var rows = e.target.result.split("\r\n");

                                    for (var i = 0; i < rows.length; i++) {
                                        var cells = rows[i].split(";");
                                        if (cells.length > 1) {
                                            var qtyItem = parseInt(cells[3]);
                                            var qtyFilter = $('#qtyFilter').val();
                                     

                                            if (!gafas){
                                                var condicion = i >= from && cells[7] == productSelected && i < to;

                                            }else{

                                                var condicion = i >= from && cells[7] == productSelected && cells[9] == gafas && i < to;
                                            }


                                            if (condicion) {

                                                if (cells[22] != '' && cells[6] != '' && cells[4] != '') {

                                                    if (qtyItem <=  qtyFilter) {
                                                        qtyItem = 0;
                                                    }
                                                    productsCounter++;


                                                    if (!gafas){
                                                       
                                                        var productName = translate(cells[7]);
        
                                                    }else{
        
                                                        var productName = translate(cells[9]);
                                                    }

                                                    

                                                    var product = {};
                                                    product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    product['Title'] = productName + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]) + " " + translate(cells[1]);

                                                    if (cells[7] != undefined && cells[7] != null) {
                                                        product['Body (HTML)'] = createHtml(cells[7], cells);
                                                    } else {
                                                        product['Body (HTML)'] = '';
                                                    }


                                                    var productPrice = (parseInt(cells[4]) * COTIZACION * COMISION) + (ENVIO * COTIZACION);

                                                    product['Vendor'] = cells[0];
                                                    product['Type'] = productName;
                                                    product['Tags'] = translate(cells[0]) + "," + productName + "," + translate(cells[16]) + "," + translate(cells[15]) + "," + translate(cells[8]);
                                                    product['Published'] = "TRUE";
                                                    product['Option1 Name'] = '';
                                                    product['Option1 Value'] = '';
                                                    product['Option2 Name'] = '';
                                                    product['Option2 Value'] = '';
                                                    product['Option3 Name'] = '';
                                                    product['Option3 Value'] = '';
                                                    product['Variant SKU'] = cells[6];
                                                    product['Variant Grams '] = '';
                                                    product['Variant Inventory Tracker'] = 'shopify';
                                                    product['Variant Inventory Qty'] = qtyItem;
                                                    product['Variant Inventory Policy'] = 'deny';
                                                    product['Variant Fulfillment Service'] = 'manual';
                                                    product['Variant Price'] = Math.round(productPrice);
                                                    product['Variant Compare At Price'] = cells[5];
                                                    product['Variant Requires Shipping'] = "TRUE";
                                                    product['Variant Taxable'] = "TRUE";
                                                    product['Image Position'] = "TRUE";
                                                    product['Variant Barcode'] = cells[6];
                                                    product['Image Src'] = cells[22];
                                                    product['Image Position'] = 1;
                                                    product['Image Alt Text'] = productName + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]);
                                                    product['Gift Card'] = "FALSE";
                                                    product['SEO Title'] = " SUNGLASSES WATCHES 40% Off Retail Price - Sale ";
                                                    product['SEO Description'] = cells[0] + " " + cells[2] + " SALES BEST PRICE GUARANTEED for MEN WOMEN at FASHION TOF come in all styles. Shop MAN  WOMAN WATCHES SUNGLASSES JEWELRY Free Shipping available!";


                                                    if(cells[0] == 'W0674G5'){

                                                        console.log(product)

                                                    }
                                                 
                                                    products.push(product);



                                                }
                                                if (cells[23] != '' && cells[6] != '' && cells[4] != '') {

                                                    var product = {};
                                                    product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    product['Title'] = ''
                                                    product['Body html'] = '';
                                                    product['Vendor'] = '';
                                                    product['Type'] = '';
                                                    product['Tags'] = '';
                                                    product['Published'] = '';
                                                    product['Option1 Name'] = '';
                                                    product['Option1 Value'] = '';
                                                    product['Option2 Name'] = '';
                                                    product['Option2 Value'] = '';
                                                    product['Option3 Name'] = '';
                                                    product['Option3 Value'] = '';
                                                    product['Variant SKU'] = '';
                                                    product['Variant Grams'] = '';
                                                    product['Variant Inventory Tracker'] = '';
                                                    product['Variant Inventory Qty'] = '';
                                                    product['Variant Inventory Policy'] = '';
                                                    product['Variant Fulfillment Service'] = '';
                                                    product['Variant Price'] = '';
                                                    product['Variant Compare At Price'] = '';
                                                    product['Variant Requires Shipping'] = '';
                                                    product['Variant Taxable'] = '';
                                                    product['Image Position'] = '';
                                                    product['Variant Barcode'] = ''
                                                    product['Image Src'] = cells[23];
                                                    product['Image Position'] = '';
                                                    product['Image Alt Text'] = '';
                                                    product['Gift Card'] = '';
                                                    product['SEO Title'] = '';
                                                    product['SEO Description'] = '';

                                                    products.push(product);


                                                }
                                                if (cells[24] != '' && cells[6] != '' && cells[4] != '') {
                                                    var product = {};
                                                    product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    product['Title'] = ''
                                                    product['Body html'] = '';
                                                    product['Vendor'] = '';
                                                    product['Type'] = '';
                                                    product['Tags'] = '';
                                                    product['Published'] = '';
                                                    product['Option1 Name'] = '';
                                                    product['Option1 Value'] = '';
                                                    product['Option2 Name'] = '';
                                                    product['Option2 Value'] = '';
                                                    product['Option3 Name'] = '';
                                                    product['Option3 Value'] = '';
                                                    product['Variant SKU'] = '';
                                                    product['Variant Grams'] = '';
                                                    product['Variant Inventory Tracker'] = '';
                                                    product['Variant Inventory Qty'] = '';
                                                    product['Variant Inventory Policy'] = '';
                                                    product['Variant Fulfillment Service'] = '';
                                                    product['Variant Price'] = '';
                                                    product['Variant Compare At Price'] = '';
                                                    product['Variant Requires Shipping'] = '';
                                                    product['Variant Taxable'] = '';
                                                    product['Image Position'] = '';
                                                    product['Variant Barcode'] = ''
                                                    product['Image Src'] = cells[24];
                                                    product['Image Position'] = '';
                                                    product['Image Alt Text'] = '';
                                                    product['Gift Card'] = '';
                                                    product['SEO Title'] = '';
                                                    product['SEO Description'] = '';
                                                    products.push(product);

                                                }
                                                if (cells[6] != '' && cells[4] != '') {

                                                    if (qtyItem <=  qtyFilter) {
                                                        qtyItem = 0;
                                                    }
                                                    var productInv = {};
                                                    productInv['Handle'] = cells[2].replace(/\s+/g, '-');



                                                    productInv['Title'] = productName + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]);
                                                    productInv['Option1 Name'] = "Title";
                                                    productInv['Option1 Value'] = "Default Title";
                                                    productInv['Option2 Name'] = '';
                                                    productInv['Option2 Value'] = '';
                                                    productInv['Option3 Name'] = '';
                                                    productInv['Option3 Value'] = '';
                                                    productInv['SKU'] = cells[6];
                                                    productInv['8627 Hufsmith Rd'] = "not stocked";
                                                    productInv['España'] = qtyItem;


                                                    inventario.push(productInv);
                                                }



                                            }

                                        }
                                    }

                                    var options = {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    };
                                    var prnDt = new Date().toLocaleTimeString('en-us', options);


                                    if (products.length == 0) {

                                        $("#alert").html('Seleccione un rango mayor, no hay productos de ' + productSelected + ' en este rango');
                                        $("#alert").show();

                                    } else {
                                        $("#success").html('Se generaron  ' + productsCounter + ' productos');
                                        $("#success").show();


                                        let headerProd = {};
                                        headerProd['Handle'] = 'Handle';
                                        headerProd['Title'] = 'Title'
                                        headerProd['Body (HTML)'] = 'Body (HTML)';
                                        headerProd['Vendor'] = 'Vendor';
                                        headerProd['Type'] = 'Type';
                                        headerProd['Tags'] = 'Tags';
                                        headerProd['Published'] = 'Published';
                                        headerProd['Option1 Name'] = 'Option1 Name';
                                        headerProd['Option1 Value'] = 'Option1 Value';
                                        headerProd['Option2 Name'] = 'Option2 Name';
                                        headerProd['Option2 Value'] = 'Option2 Value';
                                        headerProd['Option3 Name'] = 'Option3 Name';
                                        headerProd['Option3 Value'] = 'Option3 Value';
                                        headerProd['Variant SKU'] = 'Variant SKU';
                                        headerProd['Variant Grams'] = 'Variant Grams';
                                        headerProd['Variant Inventory Tracker'] = 'Variant Inventory Tracker';
                                        headerProd['Variant Inventory Qty'] = 'Variant Inventory Qty';
                                        headerProd['Variant Inventory Policy'] = 'Variant Inventory Policy';
                                        headerProd['Variant Fulfillment Service'] = 'Variant Fulfillment Service';
                                        headerProd['Variant Price'] = 'Variant Price';
                                        headerProd['Variant Compare At Price']= 'Variant Compare At Price';
                                        headerProd['Variant Requires Shipping'] = 'Variant Requires Shipping';
                                        headerProd['Variant Taxable'] = 'Variant Taxable';
                                        headerProd['Image Position'] = 'Image Position';
                                        headerProd['Variant Barcode'] = 'Variant Barcode';
                                        headerProd['Image Src'] = 'Image Src';
                                        headerProd['Image Position'] = 'Image Position';
                                        headerProd['Image Alt Text'] = 'Image Alt Text';
                                        headerProd['Gift Card'] = 'Gift Card';
                                        headerProd['SEO Title'] = 'SEO Title';
                                        headerProd['SEO Description'] = 'SEO Description';

                                        let headerInv = {};


                                        headerInv['Handle'] = 'Handle';
                                        headerInv['Title'] = 'Title';
                                        headerInv['Option1 Name'] = 'Option1 Name';
                                        headerInv['Option1 Value'] = 'Option1 Value';
                                        headerInv['Option2 Name'] = 'Option2 Name';
                                        headerInv['Option2 Value'] = 'Option2 Value';
                                        headerInv['Option3 Name'] = 'Option3 Name';
                                        headerInv['Option3 Value'] = 'Option3 Value';
                                        headerInv['SKU'] = 'SKU';
                                        headerInv['8627 Hufsmith Rd'] = '8627 Hufsmith Rd';
                                        headerInv['España'] = 'España';



                                        exportCSVFile(headerProd, products, translate(productName) + from + '_' + to+'_'+prnDt);
                                        exportCSVFile(headerInv, inventario, "INVENTARIO_" + translate(productName) + from + '_' + to+'_'+prnDt, true);
+
                                        $("#upload").show();
                                        $('#loaderG').hide();


                                    }





                                }
                                reader.readAsText($("#fileUpload")[0].files[0]);
                            } else {
                                alert("This browser does not support HTML5.");
                            }
                        } else {
                            alert("Por favor suba un archivo CSV valido.");
                        }
                    });

                    $("#all").click(function () {

                        $("#all").hide();
                        $('#loaderG').removeClass('d-none');
                        $('#loaderG').show();



                        $("#alert").hide();
                        $("#success").hide();

                        var productsCounter = 1;
                        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
                        console.log($("#fileUpload").val().replace(/\s/g, '').toLowerCase());
                        if (regex.test($("#fileUpload").val().replace(/\s/g, '').replace('(', '').replace(')', '').toLowerCase())) {
                            if (typeof (FileReader) != "undefined") {
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    var products = new Array();
                                    var inventario = new Array();
                                    var rows = e.target.result.split("\r\n");

                                    for (var i = 0; i < rows.length; i++) {

                                        var cells = rows[i].split(";");
                                        if (cells.length > 1) {
                                            var qtyItem = parseInt(cells[3]);
                                            var qtyFilter = $('#qtyFilter').val();

                                            console.log(qtyFilter);
                                            if (i >= from && i < to) {

                                                if (cells[22] != '' && cells[6] != '' && cells[4] != '') {

                                                    if (qtyItem <=  qtyFilter) {
                                                        qtyItem = 0;
                                                    }
                                                    productsCounter++;

                                                    if (cells[7] != 'GAFAS'){
                                                       
                                                        var productName = translate(cells[7]);
        
                                                    }else{
        
                                                        var productName = translate(cells[9]);
                                                    }

                                                    var product = {};
                                                    product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    product['Title'] = productName + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]) + " " + translate(cells[1]);

                                                    if (cells[7] != undefined && cells[7] != null) {
                                                        product['Body (HTML)'] = createHtml(cells[7], cells);
                                                    } else {
                                                        product['Body (HTML)'] = '';
                                                    }


                                                    var productPrice = (parseInt(cells[4]) * COTIZACION * COMISION) + (ENVIO * COTIZACION);

                                                    product['Vendor'] = cells[0];
                                                    product['Type'] = productName;
                                                    product['Tags'] = translate(cells[0]) + "," + productName + "," + translate(cells[16]) + "," + translate(cells[15]) + "," + translate(cells[8]);
                                                    product['Published'] = "TRUE";
                                                    product['Option1 Name'] = '';
                                                    product['Option1 Value'] = '';
                                                    product['Option2 Name'] = '';
                                                    product['Option2 Value'] = '';
                                                    product['Option3 Name'] = '';
                                                    product['Option3 Value'] = '';
                                                    product['Variant SKU'] = cells[6];
                                                    product['Variant Grams '] = '';
                                                    product['Variant Inventory Tracker'] = 'shopify';
                                                    product['Variant Inventory Qty'] = qtyItem;
                                                    product['Variant Inventory Policy'] = 'deny';
                                                    product['Variant Fulfillment Service'] = 'manual';
                                                    product['Variant Price'] = Math.round(productPrice);
                                                    product['Variant Compare At Price'] = cells[5];
                                                    product['Variant Requires Shipping'] = "TRUE";
                                                    product['Variant Taxable'] = "TRUE";
                                                    product['Image Position'] = "TRUE";
                                                    product['Variant Barcode'] = cells[6];
                                                    product['Image Src'] = cells[22];
                                                    product['Image Position'] = 1;
                                                    product['Image Alt Text'] = productName + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]);
                                                    product['Gift Card'] = "FALSE";
                                                    product['SEO Title'] = " SUNGLASSES WATCHES 40% Off Retail Price - Sale ";
                                                    product['SEO Description'] = cells[0] + " " + cells[2] + " SALES BEST PRICE GUARANTEED for MEN WOMEN at FASHION TOF come in all styles. Shop MAN  WOMAN WATCHES SUNGLASSES JEWELRY Free Shipping available!";


                                                    products.push(product);



                                                }
                                                if (cells[23] != '' && cells[6] != '' && cells[4] != '') {

                                                    var product = {};
                                                    product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    product['Title'] = ''
                                                    product['Body html'] = '';
                                                    product['Vendor'] = '';
                                                    product['Type'] = '';
                                                    product['Tags'] = '';
                                                    product['Published'] = '';
                                                    product['Option1 Name'] = '';
                                                    product['Option1 Value'] = '';
                                                    product['Option2 Name'] = '';
                                                    product['Option2 Value'] = '';
                                                    product['Option3 Name'] = '';
                                                    product['Option3 Value'] = '';
                                                    product['Variant SKU'] = '';
                                                    product['Variant Grams'] = '';
                                                    product['Variant Inventory Tracker'] = '';
                                                    product['Variant Inventory Qty'] = '';
                                                    product['Variant Inventory Policy'] = '';
                                                    product['Variant Fulfillment Service'] = '';
                                                    product['Variant Price'] = '';
                                                    product['Variant Compare At Price'] = '';
                                                    product['Variant Requires Shipping'] = '';
                                                    product['Variant Taxable'] = '';
                                                    product['Image Position'] = '';
                                                    product['Variant Barcode'] = ''
                                                    product['Image Src'] = cells[23];
                                                    product['Image Position'] = '';
                                                    product['Image Alt Text'] = '';
                                                    product['Gift Card'] = '';
                                                    product['SEO Title'] = '';
                                                    product['SEO Description'] = '';

                                                    products.push(product);


                                                }
                                                if (cells[24] != '' && cells[6] != '' && cells[4] != '') {
                                                    var product = {};
                                                    product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    product['Title'] = ''
                                                    product['Body html'] = '';
                                                    product['Vendor'] = '';
                                                    product['Type'] = '';
                                                    product['Tags'] = '';
                                                    product['Published'] = '';
                                                    product['Option1 Name'] = '';
                                                    product['Option1 Value'] = '';
                                                    product['Option2 Name'] = '';
                                                    product['Option2 Value'] = '';
                                                    product['Option3 Name'] = '';
                                                    product['Option3 Value'] = '';
                                                    product['Variant SKU'] = '';
                                                    product['Variant Grams'] = '';
                                                    product['Variant Inventory Tracker'] = '';
                                                    product['Variant Inventory Qty'] = '';
                                                    product['Variant Inventory Policy'] = '';
                                                    product['Variant Fulfillment Service'] = '';
                                                    product['Variant Price'] = '';
                                                    product['Variant Compare At Price'] = '';
                                                    product['Variant Requires Shipping'] = '';
                                                    product['Variant Taxable'] = '';
                                                    product['Image Position'] = '';
                                                    product['Variant Barcode'] = ''
                                                    product['Image Src'] = cells[24];
                                                     product['Image Position'] = '';
                                                    product['Image Alt Text'] = '';
                                                    product['Gift Card'] = '';
                                                    product['SEO Title'] = '';
                                                    product['SEO Description'] = '';
                                                    products.push(product);

                                                }
                                                if (cells[6] != '' && cells[4] != '') {

                                                    if (qtyItem <=  qtyFilter) {
                                                        qtyItem = 0;
                                                    }
                                                    var productInv = {};
                                                    productInv['Handle'] = cells[2].replace(/\s+/g, '-');



                                                    productInv['Title'] = productName + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]);
                                                    productInv['Option1 Name'] = "Title";
                                                    productInv['Option1 Value'] = "Default Title";
                                                    productInv['Option2 Name'] = '';
                                                    productInv['Option2 Value'] = '';
                                                    productInv['Option3 Name'] = '';
                                                    productInv['Option3 Value'] = '';
                                                    productInv['SKU'] = cells[6];
                                                    productInv['8627 Hufsmith Rd'] = "not stocked";
                                                    productInv['España'] = qtyItem;


                                                    inventario.push(productInv);
                                                }



                                            }

                                        }
                                    }

                                    var options = {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    };
                                    var prnDt = new Date().toLocaleTimeString('en-us', options);


                                    if (products.length == 0) {

                                        $("#alert").html('Seleccione un rango mayor, no hay productos de ' + productSelected + ' en este rango');
                                        $("#alert").show();

                                    } else {
                                        $("#success").html('Se generaron  ' + productsCounter + ' productos');
                                        $("#success").show();


                                        let headerProd = {};
                                        headerProd['Handle'] = 'Handle';
                                        headerProd['Title'] = 'Title'
                                        headerProd['Body (HTML)'] = 'Body (HTML)';
                                        headerProd['Vendor'] = 'Vendor';
                                        headerProd['Type'] = 'Type';
                                        headerProd['Tags'] = 'Tags';
                                        headerProd['Published'] = 'Published';
                                        headerProd['Option1 Name'] = 'Option1 Name';
                                        headerProd['Option1 Value'] = 'Option1 Value';
                                        headerProd['Option2 Name'] = 'Option2 Name';
                                        headerProd['Option2 Value'] = 'Option2 Value';
                                        headerProd['Option3 Name'] = 'Option3 Name';
                                        headerProd['Option3 Value'] = 'Option3 Value';
                                        headerProd['Variant SKU'] = 'Variant SKU';
                                        headerProd['Variant Grams'] = 'Variant Grams';
                                        headerProd['Variant Inventory Tracker'] = 'Variant Inventory Tracker';
                                        headerProd['Variant Inventory Qty'] = 'Variant Inventory Qty';
                                        headerProd['Variant Inventory Policy'] = 'Variant Inventory Policy';
                                        headerProd['Variant Fulfillment Service'] = 'Variant Fulfillment Service';
                                        headerProd['Variant Price'] = 'Variant Price';
                                        headerProd['Variant Compare At Price'] = 'Variant Compare At Price';
                                        headerProd['Variant Requires Shipping'] = 'Variant Requires Shipping';
                                        headerProd['Variant Taxable'] = 'Variant Taxable';
                                        headerProd['Image Position'] = 'Image Position';
                                        headerProd['Variant Barcode'] = 'Variant Barcode';
                                        headerProd['Image Src'] = 'Image Src';
                                        headerProd['Image Position'] = 'Image Position';
                                        headerProd['Image Alt Text'] = 'Image Alt Text';
                                        headerProd['Gift Card'] = 'Gift Card';
                                        headerProd['SEO Title'] = 'SEO Title';
                                        headerProd['SEO Description'] = 'SEO Description';

                                        let headerInv = {};


                                        headerInv['Handle'] = 'Handle';
                                        headerInv['Title'] = 'Title';
                                        headerInv['Option1 Name'] = 'Option1 Name';
                                        headerInv['Option1 Value'] = 'Option1 Value';
                                        headerInv['Option2 Name'] = 'Option2 Name';
                                        headerInv['Option2 Value'] = 'Option2 Value';
                                        headerInv['Option3 Name'] = 'Option3 Name';
                                        headerInv['Option3 Value'] = 'Option3 Value';
                                        headerInv['SKU'] = 'SKU';
                                        headerInv['8627 Hufsmith Rd'] = '8627 Hufsmith Rd';
                                        headerInv['España'] = 'España';


                                        exportCSVFile(headerProd, products, translate(productSelected) + from + '_' + to+'_'+prnDt);
                                        exportCSVFile(headerInv, inventario, "INVENTARIO_" + translate(productSelected) + from + '_' + to+'_'+prnDt, true);

                                       
                                        $("#all").show();
                                        $('#loaderG').hide();


                                    }





                                }
                                reader.readAsText($("#fileUpload")[0].files[0]);
                            } else {
                                alert("This browser does not support HTML5.");
                            }
                        } else {
                            alert("Por favor suba un archivo CSV valido.");
                        }

                    });
              
                    $('#productInventary').click(function () {

                        $("#translateJsonEdit").hide();
                        $("#newSotck").fadeOut("fast", function () {
                            $("#main").fadeIn("fast", function () {
                                // Animation complete
                            });
                        });



                    });


                    $('#compareFiles').click(function () {



                        $("#main").fadeOut("fast", function () {
                            $("#newSotck").removeClass('d-none');
                            $("#translateJsonEdit").hide();
                            $("#converseBlock").hide();
                            $("#newSotck").fadeIn("fast", function () {
                                // Animation complete
                            });
                        });




                    });

                    $('#translateEdit').click(function () {

                        $("#translateJsonEdit").removeClass('d-none');

                        $("#main").hide();
                        $("#newSotck").hide();
                        $("#converseBlock").hide();

                        $("#translateJsonEdit").fadeIn("fast", function () {
                            // Animation complete
                        });




                    });


                    $('#conversion').click(function () {



                         $("#main").fadeOut("fast", function () {
                            $("#converseBlock").removeClass('d-none');
                            $("#newSotck").hide();
                            $("#translateJsonEdit").hide();
                            $("#converseBlock").fadeIn("fast", function () {

                                fetch("https://evaluacion.olx-autos.com.ar/countryrates/")
                                .then(res => res.json())
                                .then(function (countrys) {
                                
                       
                                    $.each(countrys, function(i, item) {
                                    
                                        
                                        $('#'+item.country).find('.form-row').find('.converseNumber').val(item.rates.COMISION);
                                        $('#'+item.country).find('.form-row').find('.EnvioNumber').val(item.rates.ENVIO);
                                        $('#'+item.country).find('.form-row').find('.cotizacionNumber').val(item.rates.COTIZACION);
                                        $('#'+item.country).find('.recordId').val(item.id);
                
                
                
                    
                                    });

                                $('#converseSaveBtn').click(async function () {

                                  
                                    var pass = $(".country").length;

                                    var i=1;
                                    $( ".country" ).each(async function( index ) {

                                       
                                       
                                        $id =  $(this).find('.recordId').val();
                                       $comision=  $(this).find('.form-row').find('.converseNumber').val();
                                        $envio =$(this).find('.form-row').find('.EnvioNumber').val();
                                        $cotizacion = $(this).find('.form-row').find('.cotizacionNumber').val();

                                        console.log($id +'|'+ $comision +'|'+ $envio +'|'+ $cotizacion); 


                                        var values = {
                                            
                                                "COTIZACION": $cotizacion,
                                                "COMISION": $comision,
                                                "ENVIO": $envio
                                             
                                        }

                                        const response = await fetch("https://evaluacion.olx-autos.com.ar/countryrates/"+$id, {
                                            method: "PUT",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                rates: values
                                            })
                                        }).then(function () {
                                            i++;
                                            if(i == pass){

                                                alert('valores actualizado');
                                                setTimeout(location.reload.bind(location), 100);

                                            }
                                        });
    


                                      });

                                   

                                 

                                })


                            });
                        });




                    });

            


              
                })


        });

    });

        function eliminarDiacriticos(texto) {
            return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toUpperCase();
        }


    


        function translate(word) {
         
            var rpta;

            if(word){
                var text = eliminarDiacriticos(word);

            }else{
                return '';
            }

           
            if(text == 'MARR�N'){

                return 'BROWN';
            }

            for (var i = 0; i < matchs.length; i++) {
                if (matchs[i].match.esp == text) {

                    rpta = matchs[i].match.eng.replace(/,/g, ' ');


                    return rpta;

                } else {

                    if (text) {
                        
                        rpta = text.replace(/,/g, ' ');

                        if (i + 1 == matchs.length) {

                          if(rpta == 'text'){
                             
                                if(rpta == 'MARR�N'){
                                    return 'BROWN';
                                }else{
                                    return '*';
                                }


                          }else{
                            return  rpta;
                          }
                           
                        }

                    } else {

                        return text;
                    }


                }
            }


        }

        var newStockList;

        $("#newStockBtn").click(function () {


            var productsCounter = 1;

            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
            if (regex.test($("#newStockFile").val().replace(/\s/g, '').replace('(', '').replace(')', '').toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var ExistingProducts = new Array();
                        var inventario = new Array();
                        var rows = e.target.result.split("\r\n");

                        newStockList = rows;


                        for (var i = 1; i < rows.length; i++) {
                            var cells = rows[i].split(";");
                            if (cells.length > 1) {
                                if (i >= 1) {
                                    ExistingProducts.push(cells[2]);


                                }

                            }
                        }
                        localStorage.setItem('newStock', JSON.stringify(ExistingProducts));
                        $('#localProducts').removeClass('d-none');


                        //  JSONToCSVConvertor(JSON.stringify(inventario), prnDt, "TRUE", "INVENTARIO_"+translate(productSelected) + from +'_'+to);

                    }
                    reader.readAsText($("#newStockFile")[0].files[0]);
                } else {
                    alert("This browser does not support HTML5.");
                }
            } else {
                alert("Por favor suba un archivo CSV valido.");
            }
        });
        var localStock = new Array();
        $("#compareBtn").click(function () {

            //armar un modal de "cargando";
            fetch("https://evaluacion.olx-autos.com.ar/countryrates/?country="+countryCode)
            .then(res => res.json())
            .then(function (data) {
            
                COMISION = JSON.parse(data[0].rates.COMISION);
                COTIZACION = JSON.parse(data[0].rates.COTIZACION);
                ENVIO = JSON.parse(data[0].rates.ENVIO);

            $('#btn-loader').removeClass('d-none');
            $('#btn-loader').fadeIn('fast', function () {
                $('#compareBtn').fadeOut('fast', function () {

                    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
                    if (regex.test($("#localFile").val().replace(/\s/g, '').replace('(', '').replace(')', '').toLowerCase())) {
                        if (typeof (FileReader) != "undefined") {
                            var reader = new FileReader();
                            reader.onload = function (e) {

                                var inventario = new Array();
                                var rows = e.target.result.split("\r\n");


                                for (var i = 1; i < rows.length; i++) {
                                    var cells = rows[i].split(";");
                                    if (cells.length > 1) {
                                        var qtyItem = parseInt(cells[3]);
                                        var qtyFilter = $('#qtyFilterCompare').val();

                                        if (cells[22] != '' && cells[6] != '' && cells[4] != '' && qtyItem >= qtyFilter) {

                                            localStock.push(cells[2]);
                                        }

                                    }
                                }






                                //  localStorage.setItem('localFile', JSON.stringify(ExistingProducts));
                                var missingProductInventario = new Array();
                                var newProducts = new Array();
                                var newStock = JSON.parse(localStorage.getItem('newStock'));

                                var MisingProducts = new Promise(function (resolve, reject) {

                                    resolve(compare(localStock, newStock));

                                });

                                MisingProducts.then(function (rpta) {



                                  


                                    for (var i = 0; i < rows.length; i++) {
                                        var cells = rows[i].split(";");
                                        if (cells.length > 1) {
                                            for (let index = 0; index < rpta['missingProducts'].length; index++) {
                                                const missProduct = rpta['missingProducts'][index];

                                                if (cells[2] == missProduct) {
                                                    var productInv = {};

                                                    productInv['Handle'] = cells[2].replace(/\s+/g, '-');
                                                    productInv['Title'] = translate(cells[7]) + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]);
                                                    productInv['Option1 Name'] = "Title";
                                                    productInv['Option1 Value'] = "Default Title";
                                                    productInv['Option2 Name'] = '';
                                                    productInv['Option2 Value'] = '';
                                                    productInv['Option3 Name'] = '';
                                                    productInv['Option3 Value'] = '';
                                                    productInv['SKU'] = cells[6];
                                                    productInv['8627 Hufsmith Rd'] = "not stocked";
                                                    productInv['España'] = 0;


                                                    missingProductInventario.push(productInv);
                                                }


                                            }
                                        }



                                    }


                                    rows = newStockList;

                                    for (var i = 0; i < rows.length; i++) {
                                        var cells = rows[i].split(";");
                                        if (cells.length > 1) {
                                            for (let index = 0; index < rpta['newProducts'].length; index++) {
                                                const missProduct = rpta['newProducts'][index];
                                             
                                                if (cells[2] == missProduct) {
                                                    if (cells[22] != '' && cells[6] != '' && cells[4] != '' && qtyItem >= 1) {


                                                 
                                  
                                                        var product = {};
                                                        product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                        product['Title'] = translate(cells[7]) + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]) +" "+  translate(cells[1]);
                                                      
                                                       if(cells[7] != undefined && cells[7] != null){
                                                        product['Body (HTML)'] = createHtml(cells[7], cells);
                                                       }else{
                                                        product['Body (HTML)'] ='';
                                                       }
                                                        
                                                       
                                                       var productPrice = (parseInt(cells[4])*COTIZACION*COMISION)+(ENVIO*COTIZACION);
                                                       
                                                        product['Vendor'] = cells[0];
                                                        product['Type'] = translate(cells[7]);
                                                        product['Tags'] = translate(cells[0]) + "," + translate(cells[7]) + "," + translate(cells[16]) + "," + translate(cells[15]) + "," + translate(cells[8]);
                                                        product['Published'] = "TRUE";
                                                        product['Option1 Name'] ='';
                                                        product['Option1 Value'] ='';
                                                        product['Option2 Name'] ='';
                                                        product['Option2 Value'] ='';
                                                        product['Option3 Name'] ='';
                                                        product['Option3 Value'] ='';
                                                        product['Variant SKU'] = cells[6];
                                                        product['Variant Grams '] ='';
                                                        product['Variant Inventory Tracker'] = 'shopify';
                                                        product['Variant Inventory Qty'] = cells[3];
                                                        product['Variant Inventory Policy'] = 'deny';
                                                        product['Variant Fulfillment Service'] = 'manual';
                                                        product['Variant Price'] =  Math.round(productPrice);
                                                        product['Variant Requires Shipping'] = "TRUE";
                                                        product['Variant Taxable'] = "TRUE";
                                                        product['Image Position'] = "TRUE";
                                                        product['Variant Barcode'] = cells[6];
                                                        product['Image Src'] = cells[22];
                                                        product['Image Position'] = 1;
                                                        product['Image Alt Text'] = translate(cells[7]) + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]);
                                                        product['Gift Card'] = "FALSE";
                                                        product['SEO Title'] = " SUNGLASSES WATCHES 40% Off Retail Price - Sale ";
                                                        product['SEO Description'] = cells[0]+" "+ cells[2]+ " SALES BEST PRICE GUARANTEED for MEN WOMEN at FASHION TOF come in all styles. Shop MAN  WOMAN WATCHES SUNGLASSES JEWELRY Free Shipping available!";
                                  
                                                        newProducts.push(product);
                                  
                                  
                                  
                                                      }
                                                      if (cells[23] != '' && cells[6] != '' && cells[4] != '' && qtyItem >= 10) {
                                  
                                                        var product = {};
                                                        product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                        product['Title'] = ''
                                                        product['Body html'] = '';
                                                        product['Vendor'] = ''
                                                        product['Type'] = '';
                                                        product['Tags'] = '';
                                                        product['Published'] = '';
                                                        product['Option1 Name'] ='';
                                                        product['Option1 Value'] ='';
                                                        product['Option2 Name'] ='';
                                                        product['Option2 Value'] ='';
                                                        product['Option3 Name'] ='';
                                                        product['Option3 Value'] ='';
                                                        product['Variant SKU'] = '';
                                                        product['Variant Grams '] ='';
                                                        product['Variant Inventory Tracker'] = '';
                                                        product['Variant Inventory Qty'] = '';
                                                        product['Variant Inventory Policy'] = '';
                                                        product['Variant Fulfillment Service'] = '';
                                                        product['Variant Price'] = '';
                                                        product['Variant Compare At Price'] = '';
                                                        product['Variant Requires Shipping'] = '';
                                                        product['Variant Taxable'] = '';
                                                        product['Image Position'] = '';
                                                        product['Variant Barcode'] = '';
                                                        product['Image Src'] = cells[23];
                                                        product['Image Position'] = '';
                                                        product['Image Alt Text'] = '';
                                                        product['Gift Card'] ='';
                                                        product['SEO Title'] = '';
                                                        product['SEO Description'] ='';
                                                        product['Google Shopping / Google Product Category'] ='';
                                                        product['Google Shopping / Gender'] ='';
                                                        product['Google Shopping / Age Group'] ='';
                                                        product['Google Shopping / MPN'] ='';
                                                        product['Google Shopping / AdWords Grouping'] ='';
                                                        product['Google Shopping / AdWords Labels'] ='';
                                                        product['Google Shopping / Condition'] ='';
                                                        product['Google Shopping / Custom Product'] ='';
                                                        product['Google Shopping / Custom Label 0'] ='';
                                                        product['Google Shopping / Custom Label 1'] ='';
                                                        product['Google Shopping / Custom Label 2'] ='';
                                                        product['Google Shopping / Custom Label 3'] ='';
                                                        product['Google Shopping / Custom Label 4'] ='';
                                                        product['Variant Image'] ='';
                                                        product['Variant Weight Unit'] ='';
                                                        product['Variant Tax Code'] ='';
                                                        product['Cost per item'] = '';
                                  
                                                        newProducts.push(product);
                                  
                                  
                                                      }
                                                      if (cells[24] != '' && cells[6] != '' && cells[4] != '' && qtyItem >= 10) {
                                                        var product = {};
                                                        product['Handle'] = cells[2].replace(/\s+/g, '-');
                                                        product['Title'] = ''
                                                        product['Body html'] = '';
                                                        product['Vendor'] = ''
                                                        product['Type'] = '';
                                                        product['Tags'] = '';
                                                        product['Published'] = '';
                                                        product['Option1 Name'] ='';
                                                        product['Option1 Value'] ='';
                                                        product['Option2 Name'] ='';
                                                        product['Option2 Value'] ='';
                                                        product['Option3 Name'] ='';
                                                        product['Option3 Value'] ='';
                                                        product['Variant SKU'] = '';
                                                        product['Variant Grams '] ='';
                                                        product['Variant Inventory Tracker'] = '';
                                                        product['Variant Inventory Qty'] = '';
                                                        product['Variant Inventory Policy'] = '';
                                                        product['Variant Fulfillment Service'] = '';
                                                        product['Variant Price'] = '';
                                                        product['Variant Compare At Price'] = '';
                                                        product['Variant Requires Shipping'] = '';
                                                        product['Variant Taxable'] = '';
                                                        product['Image Position'] = '';
                                                        product['Variant Barcode'] = '';
                                                        product['Image Src'] = cells[24];
                                                        product['Image Position'] = '';
                                                        product['Image Alt Text'] = '';
                                                        product['Gift Card'] ='';
                                                        product['SEO Title'] = '';
                                                        product['SEO Description'] ='';
                                                        product['Google Shopping / Google Product Category'] ='';
                                                        product['Google Shopping / Gender'] ='';
                                                        product['Google Shopping / Age Group'] ='';
                                                        product['Google Shopping / MPN'] ='';
                                                        product['Google Shopping / AdWords Grouping'] ='';
                                                        product['Google Shopping / AdWords Labels'] ='';
                                                        product['Google Shopping / Condition'] ='';
                                                        product['Google Shopping / Custom Product'] ='';
                                                        product['Google Shopping / Custom Label 0'] ='';
                                                        product['Google Shopping / Custom Label 1'] ='';
                                                        product['Google Shopping / Custom Label 2'] ='';
                                                        product['Google Shopping / Custom Label 3'] ='';
                                                        product['Google Shopping / Custom Label 4'] ='';
                                                        product['Variant Image'] ='';
                                                        product['Variant Weight Unit'] ='';
                                                        product['Variant Tax Code'] ='';
                                                        product['Cost per item'] = '';
                                                        newProducts.push(product);
                                  
                                                      }
                                                }


                                            }
                                        }



                                    }

                                  
                                    console.log(newProducts);


                                    var options = {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    };
                                    var prnDt = new Date().toLocaleTimeString('en-us', options);

                                    if (missingProductInventario == 0) {

                                        $("#alertCompare").html('No hay registros eliminados');
                                        $("#alertCompare").show();

                                    } else {

                                        let headerInv = {};


                                        headerInv['Handle'] = 'Handle';
                                        headerInv['Title'] = 'Title';
                                        headerInv['Option1 Name'] = 'Option1 Name';
                                        headerInv['Option1 Value'] = 'Option1 Value';
                                        headerInv['Option2 Name'] = 'Option2 Name';
                                        headerInv['Option2 Value'] = 'Option2 Value';
                                        headerInv['Option3 Name'] = 'Option3 Name';
                                        headerInv['Option3 Value'] = 'Option3 Value';
                                        headerInv['SKU'] = 'SKU';
                                        headerInv['8627 Hufsmith Rd'] = '8627 Hufsmith Rd';
                                        headerInv['España'] = 'España';

                                        $("#successCompare").html('Se generaron  ' + missingProductInventario.length + ' productos');
                                        $("#successCompare").show();

                                        exportCSVFile(headerInv, missingProductInventario, 'INVENTARIO_Productos_borrados', true);
                                    }

                                    if(newProducts.length > 0 ){


                                        let headerProd = {};
                                        headerProd['Handle'] = 'Handle';
                                        headerProd['Title'] = 'Title'
                                        headerProd['Body (HTML)'] = 'Body (HTML)';
                                        headerProd['Vendor'] = 'Vendor';
                                        headerProd['Type'] = 'Type';
                                        headerProd['Tags'] = 'Tags';
                                        headerProd['Published'] = 'Published';
                                        headerProd['Option1 Name'] = 'Option1 Name';
                                        headerProd['Option1 Value'] = 'Option1 Value';
                                        headerProd['Option2 Name'] = 'Option2 Name';
                                        headerProd['Option2 Value'] = 'Option2 Value';
                                        headerProd['Option3 Name'] = 'Option3 Name';
                                        headerProd['Option3 Value'] = 'Option3 Value';
                                        headerProd['Variant SKU'] = 'Variant SKU';
                                        headerProd['Variant Grams'] = 'Variant Grams';
                                        headerProd['Variant Inventory Tracker'] = 'Variant Inventory Tracker';
                                        headerProd['Variant Inventory Qty'] = 'Variant Inventory Qty';
                                        headerProd['Variant Inventory Policy'] = 'Variant Inventory Policy';
                                        headerProd['Variant Fulfillment Service'] = 'Variant Fulfillment Service';
                                        headerProd['Variant Price'] = 'Variant Price';
                                        headerProd['Variant Compare At Price'] = 'Variant Compare At Price';
                                        headerProd['Variant Requires Shipping'] = 'Variant Requires Shipping';
                                        headerProd['Variant Taxable'] = 'Variant Taxable';
                                        headerProd['Image Position'] = 'Image Position';
                                        headerProd['Variant Barcode'] = 'Variant Barcode';
                                        headerProd['Image Src'] = 'Image Src';
                                        headerProd['Image Position'] = 'Image Position';
                                        headerProd['Image Alt Text'] = 'Image Alt Text';
                                        headerProd['Gift Card'] = 'Gift Card';
                                        headerProd['SEO Title'] = 'SEO Title';
                                        headerProd['SEO Description'] = 'SEO Description';
    
                                        exportCSVFile(headerProd, newProducts, "newProducts"+'_'+prnDt, false);

                                    }




                                })



                                $('#btn-loader').hide();
                                $('#compareBtn').show();


                                //  JSONToCSVConvertor(JSON.stringify(inventario), prnDt, "TRUE", "INVENTARIO_"+translate(productSelected) + from +'_'+to);

                            }
                            reader.readAsText($("#localFile")[0].files[0]);
                        } else {
                            alert("This browser does not support HTML5.");
                        }
                    } else {
                        alert("Por favor suba un archivo CSV valido.");
                    }


                });
            });

        })

//

        });


        function compare(localStockArr, newStockArr) {

            var rpta = new Array;

            rpta['newProducts'] = new Array;
            for (let index = 0; index < newStockArr.length; index++) {

               if(!rpta.includes(newStockArr[index]) && !localStock.includes(newStockArr[index])){

                        rpta['newProducts'].push(newStockArr[index])

               } 

            }


            for (let index = 0; index < localStockArr.length; index++) {


                for (let i = 0; i < newStockArr.length; i++) {

                    if (newStockArr[i] == localStockArr[index]) {

                        localStockArr.splice(index, 1);

                    }

                }

            }

            rpta['missingProducts'] = localStockArr;

            return rpta;

        }

        function createHtml(productType, cells) {


            switch (productType) {
                case 'RELOJ':
                    var htmlData = {
                        "Brand": translate(cells[0]),
                        "Code": translate(cells[1]),
                        "Movement": translate(cells[9]),
                        "Condition": "New (Brand new, without any signs of wear)",
                        "Scope of delivery": "Original box, original papers",
                        "Gender": translate(cells[8]),
                        "Case material": translate(cells[12]),
                        "Case diameter": translate(cells[21]),
                        "Water resistance": translate(cells[19]),
                        "Bracelet material": translate(cells[14]),
                        "Bracelet color": translate(cells[15]),
                        "Display": translate(cells[11])

                    };
                    break;
                case 'JOYERIA':
                    var htmlData = {
                        "Brand": translate(cells[0]),
                        "Code": translate(cells[1]),
                        "Type": translate(cells[9]),
                        "Condition": "New (Brand new, without any signs of wear)",
                        "Scope of delivery": "Original box, original papers",
                        "Gender": translate(cells[8]),
                        "Color": translate(cells[16]),
                        "Material": translate(cells[14]),
                        "Dimension": translate(cells[21]),


                    };
                    break;
                case 'GAFAS':




                    var datasplit = cells[21].split("x");

                    var legs = '';
                    var bridge = '';
                    var crystal = '';

                    if (datasplit[1]) {


                        legs = datasplit[2];
                        bridge = datasplit[1];
                        crystal = datasplit[0];
                    } else {

                        var datasplit2 = cells[21].split("/");


                        if (datasplit2[1] && datasplit2[2]) {

                            legs = datasplit2[2];
                            bridge = datasplit2[1];
                            crystal = datasplit2[0];

                        } else {
                            var lastItem2 = datasplit2[datasplit2.length - 1];
                            var splitLastItem2 = lastItem2.split("-");
                            legs = splitLastItem2[1];
                            bridge = splitLastItem2[0];
                            crystal = datasplit2[0];

                        }

                    }

                    var datasplit0 = cells[21].split(" ");
                    if (datasplit0[1]) {

                        var lastItem = datasplit0[datasplit0.length - 1];

                        var splitLastItem = lastItem.split("/");
                        legs = splitLastItem[2];
                        bridge = splitLastItem[1];
                        crystal = splitLastItem[0];

                    }

                    var htmlData = {
                        "Brand": translate(cells[0]),
                        "Code": translate(cells[1]),
                        "Type": translate(cells[9]),
                        "Condition": "New (Brand new, without any signs of wear)",
                        "Scope of delivery": "Original box, original papers",
                        "Gender": translate(cells[8]),
                        "Material": translate(cells[14]),
                        "Color": translate(cells[16]),
                        "Solar filter": translate(cells[20]),
                        "Legs": translate(legs),
                        "Bridge": translate(bridge),
                        "Cyrstal": translate(crystal)

                    };
                    break;

                default:

            }

            if(productType == 'GAFAS'){
                var htmlCode = 'If you like to show off the latest in Fashion & Complements and Accessories are vital for your look, don´t miss out on ' + translate(cells[9]) + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]) + ' Show off the best brands of ' + translate(cells[9]);

            }else{
                var htmlCode = 'If you like to show off the latest in Fashion & Complements and Accessories are vital for your look, don´t miss out on ' + translate(cells[7]) + " " + translate(cells[0]) + " " + translate(cells[12]) + " " + translate(cells[16]) + " " + translate(cells[15]) + " " + translate(cells[8]) + ' Show off the best brands of ' + translate(cells[7]);

            }



            if (htmlData != undefined) {
                htmlCode += "<hr><table style='width:100%'>";
                Object.keys(htmlData).forEach(function (item) {

                    htmlCode += '<tr><td>' + item + '</td><td>' + htmlData[item] + '</td></tr>'

                });

                htmlCode += '</table>';
            }


            return htmlCode;

        }

    })

function convertToCSV(objArray, inventory) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
            if (line != "") line += ",";
            if (typeof array[i][index] === "string") {

                if (!inventory) {
                    line += '"' + array[i][index].replace('"', '""') + '"';

                } else {
                    line += array[i][index];
                }
            } else {
                line += array[i][index];
            }
        }

        str += line + "\r\n";
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle, inventory) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject, inventory);

    var exportedFilenmae = fileTitle + ".csv" || "export.csv";

    var blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}